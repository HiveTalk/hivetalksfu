/**
 * NostrLogin.js - Lightweight Nostr login replacement
 * Replaces nostr-login CDN module with an instant, local-first login dialog.
 * Supports NIP-07 extension login and NIP-46 remote signer (QR + bunker URL).
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
    let _pubkeyHex = null;
    let _loginMethod = null; // 'extension' | 'nip46' | 'local'
    let _dialogEl = null;
    let _nip46Ws = null;           // active NIP-46 WebSocket
    let _nip46Privkey = null;      // ephemeral privkey for NIP-46 session
    let _nip46Pubkey = null;       // ephemeral pubkey for NIP-46 session
    let _nip46Timeout = null;      // timeout handle for QR waiting
    let _nip46RemotePubkey = null; // remote signer pubkey (learned from first event)
    let _localPrivkeyBytes = null; // local keypair privkey bytes (sign-up flow)
    let _profileViewCtrl = null;   // profile view controller (set by createDialog)

    // ─── nostr-tools availability check ──────────────────────────────
    function nt() {
        return window.NostrTools;
    }

    // ─── Core: set window.nostr for NIP-46 remote signer ────────────
    function setWindowNostrFromNip46(remotePubkey, sendNip46Request) {
        window.nostr = {
            async getPublicKey() {
                // Ask the remote signer for the user pubkey (may differ from signer pubkey)
                return sendNip46Request('get_public_key', []);
            },
            async signEvent(event) {
                // NIP-46: sign_event params must be [event] (object), not [JSON.stringify(event)]
                return sendNip46Request('sign_event', [event]);
            },
            async nip04_encrypt(pubkey, plaintext) {
                return sendNip46Request('nip04_encrypt', [pubkey, plaintext]);
            },
            async nip04_decrypt(pubkey, ciphertext) {
                return sendNip46Request('nip04_decrypt', [pubkey, ciphertext]);
            },
        };
    }

    // ─── Core: store account in __nostrlogin_accounts ──────────────────
    function storeAccount(pubkey, name, picture) {
        // Preserve existing name/picture if not explicitly supplied
        const existing = getCurrentAccount();
        const resolvedName    = name    || (existing?.pubkey === pubkey ? existing.name    : undefined);
        const resolvedPicture = picture || (existing?.pubkey === pubkey ? existing.picture : undefined);
        const accounts = [{ pubkey, name: resolvedName || undefined, picture: resolvedPicture || undefined }];
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
        _pubkeyHex = null;
        _loginMethod = null;
        if (_nip46Ws) { try { _nip46Ws.close(); } catch (e) { /* ignore */ } _nip46Ws = null; }
        _nip46Privkey = null;
        _nip46Pubkey = null;
        _nip46RemotePubkey = null;
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
        'wss://purplepag.es',  // low-priority fallback, unstable
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

        const isPurplepages = (url) => url.includes('purplepag.es');

        activeRelays.forEach(url => {
            try {
                const ws = new WebSocket(url);
                sockets.push({ ws, url });

                // purplepag.es gets a short 3s per-relay timeout; primaries get 8s
                const relayTimeout = setTimeout(() => {
                    if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
                        if (isPurplepages(url)) dropRelay(url);
                        try { ws.close(); } catch (e) { /* ignore */ }
                    }
                }, isPurplepages(url) ? 3000 : 8000);

                ws.onopen = () => {
                    // Send NIP-01 REQ for kind:0 (profile metadata)
                    const req = JSON.stringify(['REQ', subId, { kinds: [0], authors: [pubkey], limit: 1 }]);
                    ws.send(req);
                };

                ws.onmessage = (msg) => {
                    if (resolved) { clearTimeout(relayTimeout); ws.close(); return; }
                    try {
                        const data = JSON.parse(msg.data);
                        // NIP-01: ["EVENT", subId, event]
                        if (data[0] === 'EVENT' && data[2] && data[2].kind === 0 && data[2].pubkey === pubkey) {
                            resolved = true;
                            clearTimeout(relayTimeout);
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

                ws.onerror = () => { clearTimeout(relayTimeout); };
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

    // ─── Core: local keypair login (sign-up flow) ────────────────────
    function loginWithLocalKey(privBytes) {
        const tools = nt();
        if (!tools) throw new Error('nostr-tools not loaded');
        const pubHex = tools.getPublicKey(privBytes);
        _localPrivkeyBytes = privBytes;
        _pubkeyHex = pubHex;
        _loginMethod = 'local';
        // Set window.nostr shim for local signing
        window.nostr = {
            async getPublicKey() { return pubHex; },
            async signEvent(event) {
                const t = nt();
                if (!t || !t.finalizeEvent) throw new Error('nostr-tools not available');
                return t.finalizeEvent({ ...event }, _localPrivkeyBytes);
            },
            async nip04_encrypt(pk, plaintext) {
                const t = nt();
                if (!t || !t.nip04) throw new Error('NIP-04 encryption not available');
                return t.nip04.encrypt(bytesToHex(_localPrivkeyBytes), pk, plaintext);
            },
            async nip04_decrypt(pk, ciphertext) {
                const t = nt();
                if (!t || !t.nip04) throw new Error('NIP-04 decryption not available');
                return t.nip04.decrypt(bytesToHex(_localPrivkeyBytes), pk, ciphertext);
            },
        };
        storeAccount(pubHex);
        fireNlAuth('login');
        return pubHex;
    }

    // ─── Core: publish kind:0 profile metadata to relays ─────────────
    async function publishProfile(profileData) {
        if (!window.nostr) throw new Error('Not logged in');
        const auditPubkey = _pubkeyHex ? _pubkeyHex.slice(0, 8) + '…' : 'unknown';
        const auditTs = new Date().toISOString();
        console.log(`[NostrLogin] publishProfile start pubkey=${auditPubkey} ts=${auditTs} fields=${Object.keys(profileData).join(',')}`);
        const event = {
            kind: 0,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: JSON.stringify(profileData),
        };
        const signed = await window.nostr.signEvent(event);
        // Publish to all profile relays
        const activeRelays = getActiveRelays();
        let published = 0;
        const relayResults = [];
        const isPurplepages = (url) => url.includes('purplepag.es');
        await Promise.allSettled(activeRelays.map(url => new Promise((resolve) => {
            try {
                const ws = new WebSocket(url);
                // purplepag.es gets a short 3s timeout; primaries get 8s
                const t = setTimeout(() => { try { ws.close(); } catch (e) { /* ignore */ } relayResults.push({ url, ok: false, reason: 'timeout' }); resolve(); }, isPurplepages(url) ? 3000 : 8000);
                ws.onopen = () => { ws.send(JSON.stringify(['EVENT', signed])); };
                ws.onmessage = (msg) => {
                    try {
                        const data = JSON.parse(msg.data);
                        if (data[0] === 'OK') { published++; relayResults.push({ url, ok: true }); clearTimeout(t); ws.close(); resolve(); }
                        else if (data[0] === 'NOTICE') { relayResults.push({ url, ok: false, reason: data[1] }); clearTimeout(t); ws.close(); resolve(); }
                    } catch (e) { /* ignore */ }
                };
                ws.onerror = () => { relayResults.push({ url, ok: false, reason: 'connection error' }); clearTimeout(t); resolve(); };
            } catch (e) { relayResults.push({ url, ok: false, reason: e.message }); resolve(); }
        })));
        if (published === 0) {
            const failures = relayResults.map(r => `${r.url}: ${r.reason || 'unknown'}`).join('; ');
            console.warn(`[NostrLogin] publishProfile FAILED pubkey=${auditPubkey} ts=${auditTs} failures=${failures}`);
            throw new Error(`Could not publish to any relay. Details: ${failures}`);
        }
        const successRelays = relayResults.filter(r => r.ok).map(r => r.url);
        console.log(`[NostrLogin] publishProfile OK pubkey=${auditPubkey} ts=${auditTs} published=${published} relays=${successRelays.join(',')}`);
        // Update local account cache — preserve existing name/picture if not in profileData
        const account = getCurrentAccount();
        if (account) {
            const newName    = profileData.name    || account.name    || window.localStorage.peer_name;
            const newPicture = profileData.picture || account.picture || window.localStorage.peer_url;
            storeAccount(account.pubkey, newName, newPicture);
            if (newName)    window.localStorage.peer_name = newName;
            if (newPicture) window.localStorage.peer_url  = newPicture;
            updateFloatingButton();
        }
        return published;
    }

    // ─── Core: NIP-46 login via bunker URL ──────────────────────────
    async function loginWithBunkerUrl(bunkerUrl) {
        const tools = nt();
        if (!tools) throw new Error('nostr-tools not loaded');

        // Parse bunker://pubkey?relay=...
        let url;
        try {
            url = new URL(bunkerUrl.replace(/^bunker:\/\//, 'https://'));
        } catch (e) {
            throw new Error('Invalid bunker URL format');
        }
        const remotePubkey = url.hostname || url.pathname.replace(/^\/\//, '').split('?')[0];
        const relay = url.searchParams.get('relay');
        const secret = url.searchParams.get('secret');

        if (!remotePubkey || remotePubkey.length < 60) throw new Error('Invalid pubkey in bunker URL');
        if (!relay) throw new Error('No relay specified in bunker URL');
        if (!/^wss?:\/\//.test(relay)) throw new Error('Relay must be a wss:// or ws:// URL');

        return new Promise((resolve, reject) => {
            // Generate ephemeral keypair
            const privBytes = crypto.getRandomValues(new Uint8Array(32));
            const privHex = bytesToHex(privBytes);
            const pubHex = tools.getPublicKey(privBytes);
            _nip46Privkey = privHex;
            _nip46Pubkey = pubHex;

            const ws = new WebSocket(relay);
            _nip46Ws = ws;
            let settled = false;

            const pendingRequests = {};

            // NIP-44 encrypt helper for bunker flow — spec requires NIP-44; fall back to NIP-04
            // nostr-tools 2.x nip44 API: getConversationKey(privBytes, pubBytes) -> key
            //                            encrypt(plaintext, conversationKey) -> ciphertext
            //                            decrypt(ciphertext, conversationKey) -> plaintext
            function bunkerEncrypt(plaintext) {
                if (tools.nip44 && tools.nip44.encrypt && tools.nip44.getConversationKey) {
                    const convKey = tools.nip44.getConversationKey(privBytes, hexToBytes(remotePubkey));
                    return Promise.resolve(tools.nip44.encrypt(plaintext, convKey));
                }
                if (!tools.nip04) throw new Error('No NIP-44 or NIP-04 encryption available');
                return Promise.resolve(tools.nip04.encrypt(privHex, remotePubkey, plaintext));
            }

            // NIP-44 decrypt helper for bunker flow
            function bunkerDecrypt(senderPubkey, ciphertext) {
                if (tools.nip44 && tools.nip44.decrypt && tools.nip44.getConversationKey) {
                    try {
                        const convKey = tools.nip44.getConversationKey(privBytes, hexToBytes(senderPubkey));
                        return tools.nip44.decrypt(ciphertext, convKey);
                    } catch (e) { /* fall through to nip04 */ }
                }
                return tools.nip04.decrypt(privHex, senderPubkey, ciphertext);
            }

            function sendNip46Request(method, params) {
                return new Promise((res, rej) => {
                    const id = Math.random().toString(36).slice(2, 10);
                    pendingRequests[id] = { resolve: res, reject: rej };
                    const payload = JSON.stringify({ id, method, params });
                    Promise.resolve(bunkerEncrypt(payload)).then(enc => {
                        const event = {
                            kind: 24133,
                            created_at: Math.floor(Date.now() / 1000),
                            tags: [['p', remotePubkey]],
                            content: enc,
                            pubkey: pubHex,
                        };
                        if (tools.finalizeEvent) {
                            const signed = tools.finalizeEvent(event, privBytes);
                            ws.send(JSON.stringify(['EVENT', signed]));
                        }
                    });
                });
            }

            ws.onopen = () => {
                // Subscribe to responses
                const subId = 'nip46-' + Math.random().toString(36).slice(2, 8);
                // No limit — we need to receive all future responses (sign_event, etc.)
                ws.send(JSON.stringify(['REQ', subId, { kinds: [24133], '#p': [pubHex] }]));

                // NIP-46 connect: params are [clientPubkey, secret?, permissions?]
                // The client sends its OWN pubkey, not the remote signer's pubkey
                const connectParams = secret ? [pubHex, secret] : [pubHex];
                sendNip46Request('connect', connectParams).then(() => {
                    // After connect, ask the signer for the actual user pubkey.
                    // In multi-account signers the user pubkey may differ from the
                    // signer daemon pubkey embedded in the bunker:// URL.
                    return sendNip46Request('get_public_key', []);
                }).then(userPubkey => {
                    if (settled) return;
                    settled = true;
                    const resolvedPubkey = userPubkey || remotePubkey;
                    _pubkeyHex = resolvedPubkey;
                    _loginMethod = 'nip46';
                    setWindowNostrFromNip46(resolvedPubkey, sendNip46Request);
                    storeAccount(resolvedPubkey);
                    fireNlAuth('login');
                    fetchProfileFromRelays(resolvedPubkey);
                    resolve(resolvedPubkey);
                }).catch(err => {
                    if (settled) return;
                    settled = true;
                    ws.close();
                    reject(err);
                });
            };

            ws.onmessage = (msg) => {
                try {
                    const data = JSON.parse(msg.data);
                    if (data[0] === 'EVENT' && data[2] && data[2].kind === 24133) {
                        const event = data[2];
                        let content = event.content;
                        try {
                            content = bunkerDecrypt(event.pubkey, content);
                        } catch (e) { /* ignore decrypt errors */ }
                        try {
                            const parsed = JSON.parse(content);
                            const pending = pendingRequests[parsed.id];
                            if (pending) {
                                delete pendingRequests[parsed.id];
                                if (parsed.error) {
                                    pending.reject(new Error(parsed.error));
                                } else {
                                    pending.resolve(parsed.result);
                                }
                            }
                        } catch (e) { /* ignore */ }
                    }
                } catch (e) { /* ignore */ }
            };

            ws.onerror = () => {
                if (!settled) {
                    settled = true;
                    reject(new Error('WebSocket error connecting to relay'));
                }
            };

            ws.onclose = () => {
                if (!settled) {
                    settled = true;
                    reject(new Error('Connection to relay closed'));
                }
            };

            // Timeout after 30s
            setTimeout(() => {
                if (!settled) {
                    settled = true;
                    ws.close();
                    reject(new Error('Connection timed out'));
                }
            }, 30000);
        });
    }

    // ─── Core: NIP-46 QR connect flow ───────────────────────────────
    // Returns { uri, waitForConnect } where waitForConnect is a Promise
    async function startNip46QrSession(relayUrl) {
        const tools = nt();
        if (!tools) throw new Error('nostr-tools not loaded');

        // Match mutable's relay list for broad signer compatibility.
        // relay.nsec.app is added as a NIP-46 dedicated relay that accepts browser WSS.
        // Note: relay.primal.net blocks browser WebSocket connections but is included so
        // Primal and other signers that prefer it can still publish there.
        const defaultRelays = [
            'wss://relay.nsec.app',
            'wss://relay.damus.io',
            'wss://relay.primal.net',
            'wss://nos.lol',
        ];
        const allRelays = relayUrl ? [relayUrl] : defaultRelays;

        // Generate ephemeral keypair
        const privBytes = crypto.getRandomValues(new Uint8Array(32));
        const privHex = bytesToHex(privBytes);
        const pubHex = tools.getPublicKey(privBytes);
        _nip46Privkey = privHex;
        _nip46Pubkey = pubHex;

        // Generate a random secret — required by NIP-46 spec to prevent connection spoofing.
        // The remote signer MUST return this exact value as the `result` of its connect response.
        const sessionSecret = bytesToHex(crypto.getRandomValues(new Uint8Array(8)));

        // NIP-46 spec: name, url, image are flat query params, NOT a JSON metadata blob.
        // Multiple relay= params — one per relay, matching how mutable formats the URI.
        const appName = 'HiveTalk';
        // Use the real production URL when running on localhost (for display in signers like Primal)
        const appUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? 'https://vanilla.hivetalk.org'
            : window.location.origin;
        const relayParams = allRelays.map(r => `relay=${encodeURIComponent(r)}`).join('&');
        const uri = `nostrconnect://${pubHex}` +
            `?${relayParams}` +
            `&secret=${encodeURIComponent(sessionSecret)}` +
            `&name=${encodeURIComponent(appName)}` +
            `&url=${encodeURIComponent(appUrl)}`;

        // NIP-44 encrypt helper — spec requires NIP-44; fall back to NIP-04 for older signers
        // nostr-tools 2.x nip44 API: getConversationKey(privBytes, pubBytes) -> key
        //                            encrypt(plaintext, conversationKey) -> ciphertext
        //                            decrypt(ciphertext, conversationKey) -> plaintext
        function nip46Encrypt(recipientPubkey, plaintext) {
            if (tools.nip44 && tools.nip44.encrypt && tools.nip44.getConversationKey) {
                const convKey = tools.nip44.getConversationKey(privBytes, hexToBytes(recipientPubkey));
                return Promise.resolve(tools.nip44.encrypt(plaintext, convKey));
            }
            return Promise.resolve(tools.nip04.encrypt(privHex, recipientPubkey, plaintext));
        }

        // NIP-44 decrypt helper
        function nip46Decrypt(senderPubkey, ciphertext) {
            if (tools.nip44 && tools.nip44.decrypt && tools.nip44.getConversationKey) {
                try {
                    const convKey = tools.nip44.getConversationKey(privBytes, hexToBytes(senderPubkey));
                    return tools.nip44.decrypt(ciphertext, convKey);
                } catch (e) { /* fall through to nip04 */ }
            }
            return tools.nip04.decrypt(privHex, senderPubkey, ciphertext);
        }

        const waitForConnect = new Promise((resolve, reject) => {
            let settled = false;
            const pendingRequests = {};
            const openSockets = [];
            let connectedCount = 0;
            let errorCount = 0;

            function sendNip46Request(method, params, targetPubkey) {
                return new Promise((res, rej) => {
                    const id = Math.random().toString(36).slice(2, 10);
                    pendingRequests[id] = { resolve: res, reject: rej };
                    const payload = JSON.stringify({ id, method, params });
                    const encryptTarget = targetPubkey || _nip46Pubkey;
                    Promise.resolve(nip46Encrypt(encryptTarget, payload)).then(enc => {
                        const event = {
                            kind: 24133,
                            created_at: Math.floor(Date.now() / 1000),
                            tags: [['p', encryptTarget]],
                            content: enc,
                            pubkey: pubHex,
                        };
                        if (tools.finalizeEvent) {
                            const signed = tools.finalizeEvent(event, privBytes);
                            // Broadcast to all open sockets
                            openSockets.forEach(s => { try { if (s.readyState === 1) s.send(JSON.stringify(['EVENT', signed])); } catch (e) { /* ignore */ } });
                        }
                    }).catch(() => {});
                });
            }

            // In the nostrconnect:// flow the signer sends a RESPONSE (not a request):
            //   { id: <connectId>, result: <sessionSecret>, error: '' }
            // We register a pending entry keyed on connectId so handleMessage resolves it.
            const connectId = Math.random().toString(36).slice(2, 10);
            let connectResolve, connectReject;
            const connectPromise = new Promise((res, rej) => { connectResolve = res; connectReject = rej; });
            pendingRequests[connectId] = { resolve: connectResolve, reject: connectReject };

            function handleMessage(data, wsInstance) {
                try {
                    const parsed_outer = JSON.parse(data);
                    if (parsed_outer[0] === 'EVENT' && parsed_outer[2] && parsed_outer[2].kind === 24133) {
                        const event = parsed_outer[2];
                        const senderPubkey = event.pubkey;
                        let content = event.content;
                        try {
                            content = nip46Decrypt(senderPubkey, content);
                        } catch (e) { return; } // can't decrypt — not for us
                        console.log('[NostrLogin] NIP-46 message from', senderPubkey.slice(0,8), ':', content.slice(0, 120));
                        try {
                            const parsed = JSON.parse(content);
                            // nostrconnect:// flow: signer sends a response whose result is our sessionSecret.
                            // It may arrive with id=connectId (if signer echoes our id) OR as a fresh
                            // response we identify by result === sessionSecret.
                            const isConnectResponse =
                                parsed.result === sessionSecret ||
                                (parsed.id === connectId && parsed.result !== undefined);
                            if (isConnectResponse && !settled) {
                                settled = true;
                                const remotePubkey = senderPubkey;
                                _nip46RemotePubkey = remotePubkey;
                                delete pendingRequests[connectId];
                                // Ask the signer for the actual user pubkey
                                sendNip46Request('get_public_key', [], remotePubkey).then(userPubkey => {
                                    const resolvedPubkey = userPubkey || remotePubkey;
                                    _pubkeyHex = resolvedPubkey;
                                    _loginMethod = 'nip46';
                                    setWindowNostrFromNip46(resolvedPubkey, (method, params) => sendNip46Request(method, params, remotePubkey));
                                    storeAccount(resolvedPubkey);
                                    fireNlAuth('login');
                                    fetchProfileFromRelays(resolvedPubkey);
                                    resolve(resolvedPubkey);
                                }).catch(() => {
                                    // Fallback: use signer pubkey if get_public_key fails
                                    _pubkeyHex = remotePubkey;
                                    _loginMethod = 'nip46';
                                    setWindowNostrFromNip46(remotePubkey, (method, params) => sendNip46Request(method, params, remotePubkey));
                                    storeAccount(remotePubkey);
                                    fireNlAuth('login');
                                    fetchProfileFromRelays(remotePubkey);
                                    resolve(remotePubkey);
                                });
                                return;
                            }
                            // Response to a pending request (get_public_key, sign_event, etc.)
                            const pending = pendingRequests[parsed.id];
                            if (pending) {
                                delete pendingRequests[parsed.id];
                                if (parsed.error) pending.reject(new Error(parsed.error));
                                else pending.resolve(parsed.result);
                            }
                        } catch (e) { /* ignore */ }
                    }
                } catch (e) { /* ignore */ }
            }

            console.log('[NostrLogin] NIP-46 QR session started, pubkey:', pubHex.slice(0,8), 'secret:', sessionSecret);
            console.log('[NostrLogin] Connecting to relays:', allRelays);
            allRelays.forEach(relayWss => {
                try {
                    const ws = new WebSocket(relayWss);
                    openSockets.push(ws);
                    ws.onopen = () => {
                        connectedCount++;
                        console.log('[NostrLogin] Relay connected:', relayWss, '(', connectedCount, '/', allRelays.length, ')');
                        const subId = 'nip46-qr-' + Math.random().toString(36).slice(2, 8);
                        ws.send(JSON.stringify(['REQ', subId, { kinds: [24133], '#p': [pubHex] }]));
                        console.log('[NostrLogin] Subscribed on', relayWss, 'subId:', subId);
                    };
                    ws.onmessage = (msg) => {
                        console.log('[NostrLogin] Raw message from', relayWss, ':', msg.data.slice(0, 80));
                        handleMessage(msg.data, ws);
                    };
                    ws.onerror = (e) => {
                        errorCount++;
                        console.warn('[NostrLogin] NIP-46 relay error:', relayWss, e);
                        if (!settled && errorCount === allRelays.length) {
                            settled = true;
                            reject(new Error(`Could not connect to any relay (tried: ${allRelays.join(', ')}). Check browser console for details.`));
                        }
                    };
                    ws.onclose = (e) => {
                        console.warn('[NostrLogin] NIP-46 relay closed:', relayWss, e?.code, e?.reason);
                        if (!settled && connectedCount === 0 && errorCount === allRelays.length) {
                            settled = true;
                            reject(new Error('All relay connections closed'));
                        }
                    };
                } catch (e) {
                    errorCount++;
                    console.error('[NostrLogin] Failed to open WebSocket to', relayWss, e);
                }
            });

            // Store first socket as primary for cleanup
            _nip46Ws = openSockets[0] || null;

            // Timeout after 3 minutes
            _nip46Timeout = setTimeout(() => {
                if (!settled) {
                    settled = true;
                    openSockets.forEach(s => { try { s.close(); } catch (e) { /* ignore */ } });
                    reject(new Error('QR session timed out'));
                }
            }, 180000);
        });

        return { uri, waitForConnect };
    }

    // ─── UI: QR code renderer (uses qrcodejs div API) ────────────────
    function renderQrToCanvas(container, text) {
        // Clear any previous render
        container.innerHTML = '';
        if (window.QRCode) {
            new window.QRCode(container, { text, width: 240, height: 240, colorDark: '#000', colorLight: '#fff', correctLevel: window.QRCode.CorrectLevel.M });
            return;
        }
        // No QRCode library available — show the raw URI as a copyable fallback
        // (avoid sending the nostrconnect:// URI to any third-party service)
        const fallback = document.createElement('div');
        fallback.style.cssText = 'font-size:11px;word-break:break-all;background:#1e293b;color:#94a3b8;padding:10px;border-radius:8px;';
        fallback.textContent = text;
        container.appendChild(fallback);
    }

    // ─── UI: create the login dialog ─────────────────────────────
    function createDialog() {
        if (_dialogEl) return _dialogEl;

        const overlay = document.createElement('div');
        overlay.id = 'nl-dialog-overlay';
        // Inject HTML from sub-view modules (if loaded)
        const signupCardHtml  = window.NostrSignupView  ? window.NostrSignupView.getCardHTML()  : '';
        const signupStepsHtml = window.NostrSignupView  ? window.NostrSignupView.getStepsHTML() : '';
        const profileHtml     = window.NostrProfileView ? window.NostrProfileView.getHTML()     : '';
        const walletHtml      = window.NostrWalletView  ? window.NostrWalletView.getHTML()      : '';

        overlay.innerHTML = `
            <div id="nl-dialog">
                <div id="nl-dialog-header">
                    <span id="nl-dialog-title">Connect to Nostr</span>
                    <button id="nl-dialog-close" aria-label="Close">&times;</button>
                </div>

                <!-- Logged-in menu view -->
                <div id="nl-logged-in" style="display:none;">
                    <div class="nl-profile">
                        <img id="nl-profile-avatar" class="nl-avatar" src="" alt="" style="display:none;" />
                        <div class="nl-profile-info">
                            <div id="nl-profile-name" class="nl-profile-name"></div>
                            <div id="nl-profile-npub" class="nl-profile-npub"></div>
                        </div>
                    </div>
                    <div class="nl-menu">
                        <button id="nl-profile-btn" class="nl-menu-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            Profile
                        </button>
                        <button id="nl-wallet-btn" class="nl-menu-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                            Wallet Settings
                        </button>
                        <button id="nl-logout-btn" class="nl-menu-item nl-menu-danger">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            Log out
                        </button>
                    </div>
                </div>

                <!-- Profile settings view (from NostrProfileView.js) -->
                ${profileHtml}

                <!-- Wallet settings view (from NostrWalletView.js) -->
                ${walletHtml}

                <!-- Sign-up wizard steps (from NostrSignupView.js) -->
                ${signupStepsHtml}

                <!-- Login / sign-up body -->
                <div id="nl-dialog-body">
                    <p class="nl-subtitle">Choose how you want to connect your Nostr profile</p>

                    <!-- NIP-07 Extension card -->
                    <div id="nl-ext-card" class="nl-method-card nl-card-purple">
                        <div class="nl-card-header">
                            <span class="nl-card-icon nl-icon-purple"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg></span>
                            <div><div class="nl-card-title">Browser Extension (NIP-07)</div><div class="nl-card-desc">Connect using Alby, nos2x, or another NIP-07 extension</div></div>
                        </div>
                        <div id="nl-ext-error" class="nl-error" style="display:none;margin-top:10px;"></div>
                    </div>

                    <!-- NIP-46 Remote Signer card -->
                    <div id="nl-nip46-card" class="nl-method-card nl-card-blue">
                        <div class="nl-card-header" id="nl-nip46-header">
                            <span class="nl-card-icon nl-icon-blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><line x1="11" y1="12" x2="20" y2="3"/><line x1="17" y1="5" x2="19" y2="7"/></svg></span>
                            <div><div class="nl-card-title">Remote Signer (NIP-46)</div><div class="nl-card-desc">Connect using Amber, Primal, or another remote signer</div></div>
                        </div>
                        <div id="nl-nip46-options" style="display:none;margin-top:12px;">
                            <div id="nl-qr-option" class="nl-sub-option">
                                <span class="nl-sub-icon nl-icon-blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/></svg></span>
                                <div><div class="nl-sub-title">Scan QR Code</div><div class="nl-sub-desc">For Primal mobile and other apps</div></div>
                            </div>
                            <!-- Paste Bunker URL hidden until bunker flow is fully tested
                            <div id="nl-bunker-option" class="nl-sub-option">
                                <span class="nl-sub-icon nl-icon-blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><line x1="11" y1="12" x2="20" y2="3"/><line x1="17" y1="5" x2="19" y2="7"/></svg></span>
                                <div><div class="nl-sub-title">Paste Bunker URL</div><div class="nl-sub-desc">For Amber and other signers</div></div>
                            </div>
                            -->
                            <button id="nl-nip46-cancel" class="nl-btn nl-btn-ghost" style="margin-top:8px;">Cancel</button>
                        </div>
                        <div id="nl-qr-view" style="display:none;margin-top:12px;">
                            <div class="nl-card-header" style="margin-bottom:12px;">
                                <span class="nl-sub-icon nl-icon-blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/></svg></span>
                                <div class="nl-card-title">Scan with Primal or another app</div>
                            </div>
                            <div class="nl-qr-container"><div id="nl-qr-canvas" style="display:flex;justify-content:center;"></div></div>
                            <div class="nl-uri-row">
                                <input id="nl-qr-uri" class="nl-input nl-uri-input" readonly value="" />
                                <button id="nl-qr-copy" class="nl-copy-btn" title="Copy"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                            </div>
                            <div class="nl-waiting"><span class="nl-spinner"></span>Waiting for connection...</div>
                            <div id="nl-qr-error" class="nl-error" style="display:none;margin-top:8px;text-align:center;"></div>
                            <button id="nl-qr-cancel" class="nl-btn nl-btn-ghost" style="margin-top:10px;">Cancel</button>
                        </div>
                        <div id="nl-bunker-view" style="display:none;margin-top:12px;">
                            <input id="nl-bunker-input" class="nl-input" type="text" placeholder="bunker://..." autocomplete="off" />
                            <div id="nl-bunker-error" class="nl-error" style="display:none;margin-top:6px;"></div>
                            <div class="nl-btn-row" style="margin-top:10px;">
                                <button id="nl-bunker-back" class="nl-btn nl-btn-ghost nl-btn-half">Back</button>
                                <button id="nl-bunker-connect" class="nl-btn nl-btn-blue nl-btn-half">Connect</button>
                            </div>
                            <div class="nl-hint" style="margin-top:8px;">Paste a bunker:// URL from Amber or another remote signer</div>
                        </div>
                    </div>

                    <!-- Sign-up footer link (from NostrSignupView.js) -->
                    ${signupCardHtml}
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
                    background: rgba(0,0,0,0.65);
                    backdrop-filter: blur(4px);
                    align-items: center;
                    justify-content: center;
                }
                #nl-dialog-overlay.nl-open { display: flex; }
                #nl-dialog {
                    background: #16213e;
                    color: #e0e0e0;
                    border-radius: 16px;
                    width: 420px;
                    max-width: 94vw;
                    max-height: 92vh;
                    overflow-y: auto;
                    box-shadow: 0 24px 64px rgba(0,0,0,0.6);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    animation: nl-slide-in 0.2s ease-out;
                }
                @keyframes nl-slide-in {
                    from { opacity: 0; transform: translateY(-18px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                #nl-dialog-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px 24px 0;
                }
                #nl-dialog-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: #fff;
                }
                #nl-dialog-close {
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 26px;
                    cursor: pointer;
                    padding: 0 2px;
                    line-height: 1;
                    transition: color 0.15s;
                }
                #nl-dialog-close:hover { color: #fff; }
                .nl-subtitle {
                    font-size: 15px;
                    color: #9ca3af;
                    margin: 10px 0 20px;
                }
                #nl-dialog-body { padding: 16px 24px 24px; }
                #nl-logged-in { padding: 20px 24px 24px; }
                .nl-method-card {
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 12px;
                    cursor: pointer;
                    transition: background 0.15s, border-color 0.15s;
                    border: 1.5px solid transparent;
                    background: rgba(255,255,255,0.04);
                }
                .nl-method-card:hover { background: rgba(255,255,255,0.07); }
                .nl-card-purple { border-color: #7c3aed; }
                .nl-card-purple:hover { border-color: #8b5cf6; }
                .nl-card-blue { border-color: #2563eb; }
                .nl-card-blue:hover { border-color: #3b82f6; }
                .nl-card-header {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }
                .nl-card-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    flex-shrink: 0;
                }
                .nl-icon-purple {
                    background: rgba(124,58,237,0.2);
                    color: #a78bfa;
                }
                .nl-icon-blue {
                    background: rgba(37,99,235,0.2);
                    color: #60a5fa;
                }
                .nl-card-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 3px;
                }
                .nl-card-desc {
                    font-size: 13px;
                    color: #9ca3af;
                }
                .nl-sub-option {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 14px;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.03);
                    cursor: pointer;
                    margin-bottom: 8px;
                    transition: background 0.15s, border-color 0.15s;
                }
                .nl-sub-option:hover {
                    background: rgba(255,255,255,0.07);
                    border-color: rgba(96,165,250,0.4);
                }
                .nl-sub-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    flex-shrink: 0;
                }
                .nl-sub-title {
                    font-size: 15px;
                    font-weight: 600;
                    color: #e5e7eb;
                }
                .nl-sub-desc {
                    font-size: 12px;
                    color: #9ca3af;
                    margin-top: 2px;
                }
                .nl-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 12px 16px;
                    border: none;
                    border-radius: 10px;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.15s;
                    box-sizing: border-box;
                }
                .nl-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .nl-btn-ghost {
                    background: rgba(255,255,255,0.08);
                    color: #e0e0e0;
                    border: 1px solid rgba(255,255,255,0.12);
                }
                .nl-btn-ghost:hover:not(:disabled) { background: rgba(255,255,255,0.14); }
                .nl-btn-blue {
                    background: #2563eb;
                    color: #fff;
                }
                .nl-btn-blue:hover:not(:disabled) { background: #3b82f6; }
                .nl-btn-danger { background: #dc2626; color: #fff; }
                .nl-btn-danger:hover:not(:disabled) { background: #ef4444; }
                .nl-btn-row {
                    display: flex;
                    gap: 10px;
                }
                .nl-btn-half { width: 50%; }
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
                .nl-input:focus { border-color: #2563eb; }
                .nl-input::placeholder { color: #555; }
                .nl-error {
                    color: #ef4444;
                    font-size: 13px;
                }
                .nl-hint {
                    font-size: 13px;
                    color: #6b7280;
                    text-align: center;
                }
                .nl-qr-container {
                    display: flex;
                    justify-content: center;
                    margin: 8px 0 12px;
                }
                .nl-qr-container > div {
                    background: #fff;
                    border-radius: 10px;
                    padding: 12px;
                    line-height: 0;
                }
                .nl-uri-row {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .nl-uri-input {
                    flex: 1;
                    font-size: 12px;
                    color: #9ca3af;
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(255,255,255,0.1);
                    padding: 8px 10px;
                }
                .nl-copy-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    flex-shrink: 0;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 8px;
                    color: #9ca3af;
                    cursor: pointer;
                    transition: background 0.15s, color 0.15s;
                }
                .nl-copy-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
                .nl-waiting {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 13px;
                    color: #9ca3af;
                    margin-bottom: 10px;
                }
                .nl-spinner {
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    border: 2px solid rgba(255,255,255,0.2);
                    border-top-color: #60a5fa;
                    border-radius: 50%;
                    animation: nl-spin 0.8s linear infinite;
                    flex-shrink: 0;
                }
                @keyframes nl-spin { to { transform: rotate(360deg); } }
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
                .nl-profile-info { overflow: hidden; }
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
                .nl-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .nl-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 12px 14px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 10px;
                    color: #e0e0e0;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    text-align: left;
                    transition: background 0.15s, border-color 0.15s;
                }
                .nl-menu-item:hover {
                    background: rgba(255,255,255,0.09);
                    border-color: rgba(255,255,255,0.16);
                }
                .nl-menu-item svg { flex-shrink: 0; color: #9ca3af; }
                .nl-menu-danger { color: #f87171; }
                .nl-menu-danger svg { color: #f87171; }
                .nl-menu-danger:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); }
            `;
            document.head.appendChild(style);

            // Inject sub-view CSS from loaded modules
            const subStyles = [
                window.NostrProfileView && window.NostrProfileView.getCSS(),
                window.NostrWalletView  && window.NostrWalletView.getCSS(),
                window.NostrSignupView  && window.NostrSignupView.getCSS(),
            ].filter(Boolean).join('\n');
            if (subStyles) {
                const subStyle = document.createElement('style');
                subStyle.id = 'nl-subview-styles';
                subStyle.textContent = subStyles;
                document.head.appendChild(subStyle);
            }
        }

        // ── Helper: reset NIP-46 card to collapsed state ──────────────
        function resetNip46Card() {
            overlay.querySelector('#nl-nip46-options').style.display = 'none';
            overlay.querySelector('#nl-qr-view').style.display = 'none';
            overlay.querySelector('#nl-bunker-view').style.display = 'none';
            overlay.querySelector('#nl-bunker-input').value = '';
            overlay.querySelector('#nl-bunker-error').style.display = 'none';
            overlay.querySelector('#nl-qr-error').style.display = 'none';
            // Cancel any active NIP-46 session
            if (_nip46Timeout) { clearTimeout(_nip46Timeout); _nip46Timeout = null; }
            if (_nip46Ws) { try { _nip46Ws.close(); } catch (e) { /* ignore */ } _nip46Ws = null; }
        }

        // Wire up events
        overlay.querySelector('#nl-dialog-close').addEventListener('click', () => {
            resetNip46Card();
            closeDialog();
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) { resetNip46Card(); closeDialog(); }
        });

        // ── NIP-07 card click ──────────────────────────────────────────
        overlay.querySelector('#nl-ext-card').addEventListener('click', async () => {
            const errEl = overlay.querySelector('#nl-ext-error');
            errEl.style.display = 'none';
            try {
                await loginWithExtension();
                closeDialog();
            } catch (err) {
                errEl.textContent = err.message;
                errEl.style.display = 'block';
            }
        });

        // ── NIP-46 card header click → expand sub-options ─────────────
        overlay.querySelector('#nl-nip46-header').addEventListener('click', (e) => {
            e.stopPropagation();
            const opts = overlay.querySelector('#nl-nip46-options');
            const qrView = overlay.querySelector('#nl-qr-view');
            const bunkerView = overlay.querySelector('#nl-bunker-view');
            // Only expand if no sub-view is open
            if (qrView.style.display === 'none' && bunkerView.style.display === 'none') {
                opts.style.display = opts.style.display === 'none' ? 'block' : 'none';
            }
        });

        // ── Cancel from sub-options ────────────────────────────────────
        overlay.querySelector('#nl-nip46-cancel').addEventListener('click', (e) => {
            e.stopPropagation();
            resetNip46Card();
        });

        // ── Scan QR Code option ────────────────────────────────────────
        overlay.querySelector('#nl-qr-option').addEventListener('click', async (e) => {
            e.stopPropagation();
            const opts = overlay.querySelector('#nl-nip46-options');
            const qrView = overlay.querySelector('#nl-qr-view');
            const errEl = overlay.querySelector('#nl-qr-error');
            opts.style.display = 'none';
            qrView.style.display = 'block';
            errEl.style.display = 'none';

            try {
                const { uri, waitForConnect } = await startNip46QrSession();
                const canvas = overlay.querySelector('#nl-qr-canvas');
                const uriInput = overlay.querySelector('#nl-qr-uri');
                uriInput.value = uri;
                renderQrToCanvas(canvas, uri);

                waitForConnect.then(() => {
                    resetNip46Card();
                    closeDialog();
                }).catch(err => {
                    errEl.textContent = err.message || 'Connection failed';
                    errEl.style.display = 'block';
                });
            } catch (err) {
                errEl.textContent = err.message || 'Failed to start QR session';
                errEl.style.display = 'block';
            }
        });

        // ── Copy URI button ────────────────────────────────────────────
        overlay.querySelector('#nl-qr-copy').addEventListener('click', (e) => {
            e.stopPropagation();
            const uri = overlay.querySelector('#nl-qr-uri').value;
            if (uri) navigator.clipboard.writeText(uri).catch(() => {});
        });

        // ── Cancel QR view ─────────────────────────────────────────────
        overlay.querySelector('#nl-qr-cancel').addEventListener('click', (e) => {
            e.stopPropagation();
            resetNip46Card();
        });

        // ── Paste Bunker URL option (hidden until tested — see HTML comment) ──────
        const bunkerOptionEl = overlay.querySelector('#nl-bunker-option');
        if (bunkerOptionEl) bunkerOptionEl.addEventListener('click', (e) => {
            e.stopPropagation();
            overlay.querySelector('#nl-nip46-options').style.display = 'none';
            overlay.querySelector('#nl-bunker-view').style.display = 'block';
            overlay.querySelector('#nl-bunker-input').focus();
        });

        // ── Back from bunker view ──────────────────────────────────────
        const bunkerBackEl = overlay.querySelector('#nl-bunker-back');
        if (bunkerBackEl) bunkerBackEl.addEventListener('click', (e) => {
            e.stopPropagation();
            overlay.querySelector('#nl-bunker-view').style.display = 'none';
            overlay.querySelector('#nl-bunker-error').style.display = 'none';
            overlay.querySelector('#nl-nip46-options').style.display = 'block';
        });

        // ── Connect bunker URL ─────────────────────────────────────────
        const bunkerConnectEl = overlay.querySelector('#nl-bunker-connect');
        if (bunkerConnectEl) bunkerConnectEl.addEventListener('click', async (e) => {
            e.stopPropagation();
            const input = overlay.querySelector('#nl-bunker-input');
            const errEl = overlay.querySelector('#nl-bunker-error');
            const btn = overlay.querySelector('#nl-bunker-connect');
            const url = input.value.trim();
            errEl.style.display = 'none';

            if (!url) {
                errEl.textContent = 'Please paste a bunker:// URL.';
                errEl.style.display = 'block';
                return;
            }
            if (!url.startsWith('bunker://')) {
                errEl.textContent = 'URL must start with bunker://';
                errEl.style.display = 'block';
                return;
            }

            btn.disabled = true;
            btn.textContent = 'Connecting...';
            try {
                await loginWithBunkerUrl(url);
                resetNip46Card();
                closeDialog();
            } catch (err) {
                errEl.textContent = err.message || 'Connection failed';
                errEl.style.display = 'block';
            } finally {
                btn.disabled = false;
                btn.textContent = 'Connect';
            }
        });

        // Enter key on bunker input
        const bunkerInputEl = overlay.querySelector('#nl-bunker-input');
        if (bunkerInputEl) bunkerInputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') overlay.querySelector('#nl-bunker-connect').click();
        });

        // ── Logged-in menu: Logout ─────────────────────────────────────
        overlay.querySelector('#nl-logout-btn').addEventListener('click', () => {
            const acct = getCurrentAccount();
            if (acct?.pubkey) window.localStorage.removeItem(`nl_profile_cache_${acct.pubkey}`);
            window.localStorage.removeItem('nl_profile_cache');
            clearAccount();
            fireNlAuth('logout');
            updateFloatingButton();
            closeDialog();
            window.location.reload();
        });

        // ── Sub-view API passed to view modules ────────────────────────
        const subViewApi = {
            loginWithLocalKey,
            publishProfile,
            getCurrentAccount,
            closeDialog,
        };

        // ── Wire Profile view (NostrProfileView.js) ────────────────────
        if (window.NostrProfileView && overlay.querySelector('#nl-profile-view')) {
            _profileViewCtrl = window.NostrProfileView.wire(overlay, subViewApi);
        }

        // ── Wire Wallet view (NostrWalletView.js) ──────────────────────
        let _walletViewCtrl = null;
        if (window.NostrWalletView && overlay.querySelector('#nl-wallet-view')) {
            _walletViewCtrl = window.NostrWalletView.wire(overlay, subViewApi);
        }

        // ── Wire Signup view (NostrSignupView.js) ──────────────────────
        if (window.NostrSignupView && overlay.querySelector('#nl-signup-card')) {
            window.NostrSignupView.wire(overlay, subViewApi);
        }

        // ── Logged-in menu: Profile button ─────────────────────────────
        const profileMenuBtn = overlay.querySelector('#nl-profile-btn');
        if (profileMenuBtn) {
            profileMenuBtn.addEventListener('click', () => {
                if (_profileViewCtrl) {
                    _profileViewCtrl.show();
                }
            });
        }

        // ── Logged-in menu: Wallet button ──────────────────────────────
        const walletMenuBtn = overlay.querySelector('#nl-wallet-btn');
        if (walletMenuBtn) {
            walletMenuBtn.addEventListener('click', () => {
                if (_walletViewCtrl) {
                    _walletViewCtrl.show();
                }
            });
        }

        return overlay;
    }

    // ─── UI: open / close ────────────────────────────────────────
    function openDialog() {
        const dialog = createDialog();
        const account = getCurrentAccount();
        const loggedInView = dialog.querySelector('#nl-logged-in');
        const loginView = dialog.querySelector('#nl-dialog-body');
        const titleEl = dialog.querySelector('#nl-dialog-title');

        // Always hide sub-views on open so we start from a clean state
        ['#nl-profile-view', '#nl-wallet-view', '#nl-signup-step1', '#nl-signup-step2'].forEach(sel => {
            const el = dialog.querySelector(sel);
            if (el) el.style.display = 'none';
        });

        if (account) {
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
            titleEl.textContent = 'Connect to Nostr';
            loggedInView.style.display = 'none';
            loginView.style.display = 'block';

            // Reset error states
            const extErr = dialog.querySelector('#nl-ext-error');
            if (extErr) extErr.style.display = 'none';
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
        // If detail is 'edit-profile', navigate directly to profile settings view
        if (e.detail === 'edit-profile' && _profileViewCtrl) {
            _profileViewCtrl.show();
        }
    });

    // nlLogout: clear account state
    document.addEventListener('nlLogout', () => {
        const acct = getCurrentAccount();
        if (acct?.pubkey) window.localStorage.removeItem(`nl_profile_cache_${acct.pubkey}`);
        window.localStorage.removeItem('nl_profile_cache');
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

    // ─── Auto-restore: extension logins auto-restore via the extension.
    //     NIP-46 sessions are not persisted (ephemeral keypair per session).
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

    const NOSTR_SVG_ICON = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="28" rx="8" fill="#6951FA"/>
        <text x="14" y="21" font-family="Arial Black, Arial, sans-serif" font-size="18" font-weight="900" fill="white" text-anchor="middle">N</text>
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
        loginWithBunkerUrl,
        loginWithLocalKey,
        publishProfile,
        getCurrentAccount,
        logout: clearAccount,
    };

    console.log('[NostrLogin] Lightweight Nostr login loaded (NIP-07 + NIP-46 support)');
})();
