/**
 * NostrLogin.js - Lightweight Nostr login replacement
 * Replaces nostr-login CDN module with an instant, local-first login dialog.
 * Supports NIP-07 extension login and nsec (secret key) login.
 * Maintains full compatibility with existing nlAuth/nlLaunch/nlLogout event API
 * and __nostrlogin_accounts localStorage format.
 */
(function () {
    'use strict';

    // ─── Utility: SHA-256 hash ───────────────────────────────────────
    async function sha256Hex(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ─── Utility: bytes to hex ───────────────────────────────────────
    function bytesToHex(bytes) {
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ─── Utility: hex to bytes ───────────────────────────────────────
    function hexToBytes(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes;
    }

    // ─── State ───────────────────────────────────────────────────────
    let _privkeyHex = null; // only set for nsec login
    let _pubkeyHex = null;
    let _loginMethod = null; // 'extension' | 'nsec'
    let _dialogEl = null;

    // ─── nostr-tools availability check ──────────────────────────────
    function nt() {
        return window.NostrTools;
    }

    // ─── Core: set window.nostr for nsec-based login ─────────────────
    function setWindowNostrFromNsec(privkeyHex, pubkeyHex) {
        window.nostr = {
            async getPublicKey() {
                return pubkeyHex;
            },
            async signEvent(event) {
                const tools = nt();
                if (!tools) throw new Error('nostr-tools not loaded');
                // Build unsigned event
                const unsigned = {
                    kind: event.kind,
                    created_at: event.created_at || Math.floor(Date.now() / 1000),
                    tags: event.tags || [],
                    content: event.content || '',
                    pubkey: pubkeyHex,
                };
                // Use nostr-tools finalizeEvent if available (v2), else fall back
                if (tools.finalizeEvent) {
                    const privBytes = hexToBytes(privkeyHex);
                    const signed = tools.finalizeEvent(unsigned, privBytes);
                    return signed;
                }
                // Fallback: compute id + sign manually with schnorr
                const serialized = JSON.stringify([
                    0,
                    unsigned.pubkey,
                    unsigned.created_at,
                    unsigned.kind,
                    unsigned.tags,
                    unsigned.content,
                ]);
                const id = await sha256Hex(serialized);
                unsigned.id = id;
                // Use noble-secp256k1 if available through nostr-tools
                if (tools.getSignature) {
                    unsigned.sig = tools.getSignature(id, privkeyHex);
                } else if (tools.schnorr && tools.schnorr.sign) {
                    const sigBytes = await tools.schnorr.sign(id, privkeyHex);
                    unsigned.sig = bytesToHex(sigBytes);
                } else {
                    throw new Error('Cannot sign event: no signing function available in nostr-tools');
                }
                return unsigned;
            },
            // NIP-04 stubs (not commonly needed for HiveTalk flow)
            async nip04_encrypt(pubkey, plaintext) {
                throw new Error('NIP-04 encrypt not supported with nsec login');
            },
            async nip04_decrypt(pubkey, ciphertext) {
                throw new Error('NIP-04 decrypt not supported with nsec login');
            },
        };
    }

    // ─── Core: store account in __nostrlogin_accounts ────────────────
    function storeAccount(pubkey, name, picture) {
        const accounts = [{ pubkey, name: name || undefined, picture: picture || undefined }];
        window.localStorage.setItem('__nostrlogin_accounts', JSON.stringify(accounts));
    }

    // ─── Core: get current account from localStorage ──────────────
    function getCurrentAccount() {
        try {
            const accts = JSON.parse(window.localStorage.getItem('__nostrlogin_accounts') || '[]');
            if (accts.length > 0 && accts[0].pubkey) return accts[0];
        } catch (e) { /* ignore */ }
        return null;
    }

    // ─── Core: clear account ─────────────────────────────────────
    function clearAccount() {
        _privkeyHex = null;
        _pubkeyHex = null;
        _loginMethod = null;
        window.localStorage.removeItem('__nostrlogin_accounts');
        // Clear peer_* keys so Room.js doesn't restore stale session
        ['peer_name', 'peer_pubkey', 'peer_npub', 'peer_url', 'peer_lnaddress', 'peer_uuid'].forEach(k => {
            window.localStorage.removeItem(k);
        });
        // Don't wipe window.nostr if it was an extension (it belongs to the extension)
    }

    // ─── Core: fire nlAuth event ─────────────────────────────────────
    function fireNlAuth(type) {
        document.dispatchEvent(new CustomEvent('nlAuth', { detail: { type } }));
    }

    // ─── Core: fetch profile from relays after login ─────────────────
    // Query relays for kind:0 metadata so name+picture are available
    // immediately in __nostrlogin_accounts for Room.js to read.
    const _allProfileRelays = [
        'wss://relay.primal.net',
        'wss://relay.damus.io',
        'wss://nos.lol',
        'wss://purplepag.es',
    ];

    // Temporarily dropped relays: { url: timestamp_when_dropped }
    const _droppedRelays = {};
    const _RELAY_DROP_DURATION_MS = 60000; // 60 seconds

    function getActiveRelays() {
        const now = Date.now();
        const active = _allProfileRelays.filter(url => {
            const droppedAt = _droppedRelays[url];
            if (!droppedAt) return true;
            // Re-enable relay after drop duration expires
            if (now - droppedAt > _RELAY_DROP_DURATION_MS) {
                delete _droppedRelays[url];
                console.log('[NostrLogin] Re-enabling relay:', url);
                return true;
            }
            return false;
        });
        // Fallback: if all relays are dropped, use them all anyway
        return active.length > 0 ? active : _allProfileRelays;
    }

    function dropRelay(url) {
        _droppedRelays[url] = Date.now();
        console.log('[NostrLogin] Temporarily dropping relay (timeout):', url);
    }

    function fetchProfileFromRelays(pubkey) {
        const activeRelays = getActiveRelays();
        console.log('[NostrLogin] Querying relays for profile:', activeRelays);
        let resolved = false;
        const subId = 'nl-profile-' + Math.random().toString(36).slice(2, 8);
        const sockets = [];

        activeRelays.forEach(url => {
            try {
                const ws = new WebSocket(url);
                sockets.push({ ws, url });

                ws.onopen = () => {
                    // Send NIP-01 REQ for kind:0 (profile metadata)
                    const req = JSON.stringify(['REQ', subId, { kinds: [0], authors: [pubkey], limit: 1 }]);
                    ws.send(req);
                };

                ws.onmessage = (msg) => {
                    if (resolved) { ws.close(); return; }
                    try {
                        const data = JSON.parse(msg.data);
                        // NIP-01: ["EVENT", subId, event]
                        if (data[0] === 'EVENT' && data[2] && data[2].kind === 0 && data[2].pubkey === pubkey) {
                            resolved = true;
                            const content = JSON.parse(data[2].content);
                            const name = content.name || content.display_name;
                            const picture = content.picture || content.image;
                            if (name || picture) {
                                storeAccount(pubkey, name, picture);
                                console.log('[NostrLogin] Profile fetched from relay:', url, name, picture);
                                if (name) window.localStorage.peer_name = name;
                                if (picture) window.localStorage.peer_url = picture;
                                updateFloatingButton();
                            }
                            // Close all sockets
                            sockets.forEach(s => { try { s.ws.close(); } catch (e) { /* ignore */ } });
                        }
                    } catch (e) { /* ignore parse errors */ }
                };

                ws.onerror = () => { /* ignore */ };
            } catch (e) {
                console.log('[NostrLogin] Failed to connect to relay:', url, e);
            }
        });

        // Timeout after 6 seconds — drop relays that didn't respond
        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                console.log('[NostrLogin] Profile fetch timed out');
                // Drop all relays that are still connecting or open (didn't deliver)
                sockets.forEach(s => {
                    if (s.ws.readyState === WebSocket.CONNECTING || s.ws.readyState === WebSocket.OPEN) {
                        dropRelay(s.url);
                    }
                    try { s.ws.close(); } catch (e) { /* ignore */ }
                });
            }
        }, 6000);
    }

    // ─── Core: extension login ───────────────────────────────────────
    async function loginWithExtension() {
        if (!window.nostr) {
            throw new Error('No Nostr extension found. Please install a NIP-07 extension (e.g. nos2x, Alby).');
        }
        const pubkey = await window.nostr.getPublicKey();
        if (!pubkey) throw new Error('Extension returned no public key.');
        _pubkeyHex = pubkey;
        _loginMethod = 'extension';
        storeAccount(pubkey);
        fireNlAuth('login');
        // Fetch profile in background so name+picture are ready for Room.js
        fetchProfileFromRelays(pubkey);
        return pubkey;
    }

    // ─── Core: nsec login ────────────────────────────────────────────
    function loginWithNsec(nsec) {
        const tools = nt();
        if (!tools) throw new Error('nostr-tools not loaded');
        // Decode nsec
        const decoded = tools.nip19.decode(nsec);
        if (decoded.type !== 'nsec') throw new Error('Invalid nsec key');
        const privkeyBytes = decoded.data;
        const privkeyHex = bytesToHex(privkeyBytes);
        const pubkeyHex = tools.getPublicKey(privkeyBytes);
        _privkeyHex = privkeyHex;
        _pubkeyHex = pubkeyHex;
        _loginMethod = 'nsec';
        // Set window.nostr so existing code works seamlessly
        setWindowNostrFromNsec(privkeyHex, pubkeyHex);
        storeAccount(pubkeyHex);
        fireNlAuth('login');
        // Fetch profile in background so name+picture are ready for Room.js
        fetchProfileFromRelays(pubkeyHex);
        return pubkeyHex;
    }

    // ─── UI: create the login dialog ─────────────────────────────
    function createDialog() {
        if (_dialogEl) return _dialogEl;

        const overlay = document.createElement('div');
        overlay.id = 'nl-dialog-overlay';
        overlay.innerHTML = `
            <div id="nl-dialog">
                <div id="nl-dialog-header">
                    <span id="nl-dialog-title">Login with Nostr</span>
                    <button id="nl-dialog-close">&times;</button>
                </div>
                <!-- Logged-in view -->
                <div id="nl-logged-in" style="display:none;">
                    <div class="nl-profile">
                        <img id="nl-profile-avatar" class="nl-avatar" src="" alt="" />
                        <div class="nl-profile-info">
                            <div id="nl-profile-name" class="nl-profile-name"></div>
                            <div id="nl-profile-npub" class="nl-profile-npub"></div>
                        </div>
                    </div>
                    <button id="nl-logout-btn" class="nl-btn nl-btn-danger">Logout</button>
                </div>
                <!-- Login view -->
                <div id="nl-dialog-body">
                    <button id="nl-ext-btn" class="nl-btn nl-btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Login with Extension
                    </button>
                    <div id="nl-ext-missing" style="display:none;" class="nl-hint">
                        No Nostr extension detected. Install <a href="https://github.com/niceforu/niceforu-extension" target="_blank" rel="noopener">nos2x</a> or <a href="https://getalby.com" target="_blank" rel="noopener">Alby</a>.
                    </div>
                    <div class="nl-divider"><span>or</span></div>
                    <div id="nl-nsec-section">
                        <label for="nl-nsec-input" class="nl-label">Secret key (nsec)</label>
                        <input id="nl-nsec-input" type="password" placeholder="nsec1..." autocomplete="off" class="nl-input" />
                        <div id="nl-nsec-error" class="nl-error" style="display:none;"></div>
                        <button id="nl-nsec-btn" class="nl-btn nl-btn-secondary">Login with Key</button>
                    </div>
                    <div id="nl-status" class="nl-status" style="display:none;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        _dialogEl = overlay;

        // Inject styles
        if (!document.getElementById('nl-styles')) {
            const style = document.createElement('style');
            style.id = 'nl-styles';
            style.textContent = `
                #nl-dialog-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    z-index: 999999;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px);
                    align-items: center;
                    justify-content: center;
                }
                #nl-dialog-overlay.nl-open {
                    display: flex;
                }
                #nl-dialog {
                    background: #1a1a2e;
                    color: #e0e0e0;
                    border-radius: 16px;
                    width: 380px;
                    max-width: 92vw;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                    overflow: hidden;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    animation: nl-slide-in 0.2s ease-out;
                }
                @keyframes nl-slide-in {
                    from { opacity: 0; transform: translateY(-20px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                #nl-dialog-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 18px 20px 12px;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                }
                #nl-dialog-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #fff;
                }
                #nl-dialog-close {
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0 4px;
                    line-height: 1;
                    transition: color 0.15s;
                }
                #nl-dialog-close:hover { color: #fff; }
                #nl-dialog-body {
                    padding: 20px;
                }
                .nl-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    width: 100%;
                    padding: 12px 16px;
                    border: none;
                    border-radius: 10px;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.15s;
                }
                .nl-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .nl-btn-primary {
                    background: #6951FA;
                    color: #fff;
                }
                .nl-btn-primary:hover:not(:disabled) {
                    background: #7c68fb;
                    transform: translateY(-1px);
                }
                .nl-btn-secondary {
                    background: rgba(255,255,255,0.1);
                    color: #e0e0e0;
                    margin-top: 10px;
                }
                .nl-btn-secondary:hover:not(:disabled) {
                    background: rgba(255,255,255,0.18);
                }
                .nl-divider {
                    display: flex;
                    align-items: center;
                    margin: 18px 0;
                    color: #666;
                    font-size: 13px;
                }
                .nl-divider::before, .nl-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.1);
                }
                .nl-divider span {
                    padding: 0 12px;
                }
                .nl-label {
                    display: block;
                    font-size: 13px;
                    color: #aaa;
                    margin-bottom: 6px;
                }
                .nl-input {
                    width: 100%;
                    padding: 10px 14px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 8px;
                    color: #e0e0e0;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.15s;
                    box-sizing: border-box;
                }
                .nl-input:focus {
                    border-color: #6951FA;
                }
                .nl-input::placeholder {
                    color: #555;
                }
                .nl-error {
                    color: #ef4444;
                    font-size: 13px;
                    margin-top: 6px;
                }
                .nl-hint {
                    font-size: 13px;
                    color: #888;
                    margin-top: 8px;
                    text-align: center;
                }
                .nl-hint a {
                    color: #6951FA;
                    text-decoration: none;
                }
                .nl-hint a:hover {
                    text-decoration: underline;
                }
                .nl-status {
                    text-align: center;
                    font-size: 14px;
                    color: #6951FA;
                    margin-top: 12px;
                }
                #nl-logged-in {
                    padding: 20px;
                }
                .nl-profile {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 16px;
                    background: rgba(255,255,255,0.04);
                    border-radius: 12px;
                    margin-bottom: 16px;
                }
                .nl-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                    background: #333;
                    flex-shrink: 0;
                }
                .nl-profile-info {
                    overflow: hidden;
                }
                .nl-profile-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #fff;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .nl-profile-npub {
                    font-size: 12px;
                    color: #888;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-top: 2px;
                }
                .nl-btn-danger {
                    background: #dc2626;
                    color: #fff;
                }
                .nl-btn-danger:hover:not(:disabled) {
                    background: #ef4444;
                }
            `;
            document.head.appendChild(style);
        }

        // Wire up events
        overlay.querySelector('#nl-dialog-close').addEventListener('click', closeDialog);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeDialog();
        });

        overlay.querySelector('#nl-ext-btn').addEventListener('click', async () => {
            const btn = overlay.querySelector('#nl-ext-btn');
            const status = overlay.querySelector('#nl-status');
            btn.disabled = true;
            btn.textContent = 'Connecting...';
            status.style.display = 'none';
            try {
                await loginWithExtension();
                closeDialog();
            } catch (err) {
                status.textContent = err.message;
                status.style.display = 'block';
            } finally {
                btn.disabled = false;
                btn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Login with Extension
                `;
            }
        });

        overlay.querySelector('#nl-nsec-btn').addEventListener('click', () => {
            const input = overlay.querySelector('#nl-nsec-input');
            const errEl = overlay.querySelector('#nl-nsec-error');
            const nsec = input.value.trim();
            errEl.style.display = 'none';

            if (!nsec) {
                errEl.textContent = 'Please enter your secret key.';
                errEl.style.display = 'block';
                return;
            }
            if (!/^nsec1[a-zA-Z0-9]{58}$/.test(nsec)) {
                errEl.textContent = 'Invalid nsec format. Must start with nsec1 and be 63 characters.';
                errEl.style.display = 'block';
                return;
            }
            try {
                loginWithNsec(nsec);
                input.value = '';
                closeDialog();
            } catch (err) {
                errEl.textContent = err.message || 'Login failed. Check your key.';
                errEl.style.display = 'block';
            }
        });

        // Enter key on nsec input
        overlay.querySelector('#nl-nsec-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                overlay.querySelector('#nl-nsec-btn').click();
            }
        });

        // Logout button
        overlay.querySelector('#nl-logout-btn').addEventListener('click', () => {
            clearAccount();
            fireNlAuth('logout');
            updateFloatingButton();
            closeDialog();
            // Reload page to reset state
            window.location.reload();
        });

        return overlay;
    }

    // ─── UI: open / close ────────────────────────────────────────
    function openDialog() {
        const dialog = createDialog();
        const account = getCurrentAccount();
        const loggedInView = dialog.querySelector('#nl-logged-in');
        const loginView = dialog.querySelector('#nl-dialog-body');
        const titleEl = dialog.querySelector('#nl-dialog-title');

        if (account) {
            // Show logged-in view
            titleEl.textContent = 'Nostr Account';
            loggedInView.style.display = 'block';
            loginView.style.display = 'none';

            const avatarEl = dialog.querySelector('#nl-profile-avatar');
            const nameEl = dialog.querySelector('#nl-profile-name');
            const npubEl = dialog.querySelector('#nl-profile-npub');

            const displayName = account.name || window.localStorage.peer_name || account.pubkey.slice(0, 10) + '...';
            const avatarUrl = account.picture || window.localStorage.peer_url || '';

            nameEl.textContent = displayName;
            if (avatarUrl) {
                avatarEl.src = avatarUrl;
                avatarEl.style.display = 'block';
            } else {
                avatarEl.style.display = 'none';
            }

            // Show npub
            try {
                const tools = nt();
                if (tools && tools.nip19) {
                    const npub = tools.nip19.npubEncode(account.pubkey);
                    npubEl.textContent = npub.slice(0, 12) + '...' + npub.slice(-6);
                } else {
                    npubEl.textContent = account.pubkey.slice(0, 12) + '...';
                }
            } catch (e) {
                npubEl.textContent = account.pubkey.slice(0, 12) + '...';
            }
        } else {
            // Show login view
            titleEl.textContent = 'Login with Nostr';
            loggedInView.style.display = 'none';
            loginView.style.display = 'block';

            // Reset state
            const errEl = dialog.querySelector('#nl-nsec-error');
            const status = dialog.querySelector('#nl-status');
            const input = dialog.querySelector('#nl-nsec-input');
            const missingHint = dialog.querySelector('#nl-ext-missing');
            const extBtn = dialog.querySelector('#nl-ext-btn');

            if (errEl) errEl.style.display = 'none';
            if (status) status.style.display = 'none';
            if (input) input.value = '';

            // Check for native NIP-07 extension (not our nsec shim)
            const hasNativeExtension = window.nostr && _loginMethod !== 'nsec';
            extBtn.style.display = 'flex';
            missingHint.style.display = hasNativeExtension ? 'none' : 'block';
        }

        dialog.classList.add('nl-open');
    }

    function closeDialog() {
        if (_dialogEl) {
            _dialogEl.classList.remove('nl-open');
        }
    }

    // ─── Event listeners for compatibility with nostr-login API ──────
    // nlLaunch: open the login dialog (used by Room.js nostrButton click)
    document.addEventListener('nlLaunch', (e) => {
        openDialog();
    });

    // nlLogout: clear account state
    document.addEventListener('nlLogout', () => {
        clearAccount();
        fireNlAuth('logout');
        updateFloatingButton();
    });

    // Update floating button when login state changes
    document.addEventListener('nlAuth', () => {
        // Delay slightly to let localStorage settle
        setTimeout(updateFloatingButton, 300);
    });

    // Periodically check if profile was updated (e.g. by getNostrProfile in Room.js)
    setInterval(() => {
        const btn = document.getElementById('nl-floating-btn');
        if (!btn) return;
        const account = getCurrentAccount();
        if (account && account.name && !btn.title.includes(account.name)) {
            updateFloatingButton();
        }
    }, 3000);

    // ─── Auto-restore: if user was previously logged in via nsec, we
    //     can't restore the signer (no privkey stored for security).
    //     Extension logins auto-restore via the extension itself.
    //     We just ensure __nostrlogin_accounts is consistent. ─────────

    // ─── Auto-fetch profile on page load if account is missing name/picture ─
    // This covers pages like /active that load NostrLogin.js but not Room.js.
    (function autoFetchProfileIfNeeded() {
        const account = getCurrentAccount();
        if (account && account.pubkey && (!account.name || !account.picture)) {
            console.log('[NostrLogin] Account missing name/picture, fetching from relays...');
            fetchProfileFromRelays(account.pubkey);
        }
    })();

    // ─── Floating Nostr "N" button (for pages without data-no-banner) ─
    function shouldShowBanner() {
        const scripts = document.querySelectorAll('script[src*="NostrLogin"]');
        for (const s of scripts) {
            if (s.getAttribute('data-no-banner') === 'true') return false;
        }
        return true;
    }

    const NOSTR_SVG_ICON = `<svg width="28" height="28" viewBox="0 0 224 224" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="224" height="224" rx="64" fill="#6951FA"/>
        <path d="M160.98 105.06c-1.878-14.78-10.658-24.049-22.964-25.786-3.834-.542-11.42-.776-11.42-.776s-14.068-1.116-24.546-.598c-18.186.9-27.26 6.926-27.26 6.926s-12.346 7.646-13.552 28.794c-.15 2.64-.264 5.525-.318 8.652-.282 16.158.326 30.592 2.076 35.24 3.484 9.246 16.866 12.19 16.866 12.19s-.266 5.936.078 9.632c.446 4.794 3.152 5.46 3.152 5.46s1.434 1.25 5.034-1.812l7.67-7.228s11.296.34 18.882-.672c8.646-1.154 12.726-4.09 12.726-4.09s13.462-8.34 14.656-29.49c.152-2.688.254-5.624.29-8.802.124-10.736-.472-21.334-1.37-27.64zm-13.406 34.88c-.616 11.02-6.734 17.446-6.734 17.446s-2.608 2.158-8.89 3.236c-5.5.944-14.382.428-14.382.428l-10.822 10.406-2.07-10.828s-8.854-1.708-11.518-8.788c-1.228-3.262-1.784-13.874-1.578-26.068.04-2.378.112-4.614.218-6.686.83-16.266 7.994-19.748 7.994-19.748s5.558-4.392 20.75-5.148c7.594-.378 17.982.328 17.982.328s8.204.382 10.694 1.486c6.974 3.088 8.674 12.86 8.674 12.86 1.06 8.38 1.2 16.39.682 31.076z" fill="white"/>
        <ellipse cx="118" cy="124" rx="8" ry="10" fill="white"/>
        <ellipse cx="148" cy="124" rx="8" ry="10" fill="white"/>
    </svg>`;

    function createFloatingButton() {
        if (!shouldShowBanner()) return;

        const btn = document.createElement('button');
        btn.id = 'nl-floating-btn';
        btn.title = 'Login with Nostr';
        btn.innerHTML = NOSTR_SVG_ICON;
        document.body.appendChild(btn);

        // Inject floating button styles
        const style = document.createElement('style');
        style.id = 'nl-floating-styles';
        style.textContent = `
            #nl-floating-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 999998;
                width: 52px;
                height: 52px;
                border-radius: 50%;
                border: none;
                background: #6951FA;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 16px rgba(105,81,250,0.4);
                transition: transform 0.2s, box-shadow 0.2s;
                padding: 0;
                overflow: hidden;
            }
            #nl-floating-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 24px rgba(105,81,250,0.6);
            }
            #nl-floating-btn:active {
                transform: scale(1.05);
            }
            #nl-floating-btn svg {
                border-radius: 12px;
            }
            #nl-floating-btn img.nl-fab-avatar {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
            }
            #nl-floating-btn .nl-fab-dot {
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 14px;
                height: 14px;
                background: #22c55e;
                border-radius: 50%;
                border: 2px solid #1a1a2e;
            }
        `;
        document.head.appendChild(style);

        btn.addEventListener('click', () => {
            openDialog();
        });

        // Check if already logged in on load
        updateFloatingButton();
    }

    function updateFloatingButton() {
        const btn = document.getElementById('nl-floating-btn');
        if (!btn) return;

        const account = getCurrentAccount();
        if (account) {
            const avatarUrl = account.picture || window.localStorage.peer_url || '';
            const displayName = account.name || window.localStorage.peer_name || 'Nostr Account';
            btn.title = displayName;

            if (avatarUrl) {
                btn.innerHTML = `<img class="nl-fab-avatar" src="${avatarUrl}" alt="${displayName}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" /><span style="display:none">${NOSTR_SVG_ICON}</span><span class="nl-fab-dot"></span>`;
            } else {
                btn.innerHTML = NOSTR_SVG_ICON + '<span class="nl-fab-dot"></span>';
            }
        } else {
            btn.title = 'Login with Nostr';
            btn.innerHTML = NOSTR_SVG_ICON;
        }
    }

    // Create floating button when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingButton);
    } else {
        createFloatingButton();
    }

    // ─── Public API (optional, for pages that want programmatic access)
    window.NostrLoginLocal = {
        open: openDialog,
        close: closeDialog,
        loginWithExtension,
        loginWithNsec,
        logout: clearAccount,
    };

    console.log('[NostrLogin] Lightweight Nostr login loaded (no nsec.app dependency)');
})();
