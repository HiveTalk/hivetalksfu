/**
 * NostrSignupView.js - Sign-up wizard view for NostrLogin
 * Provides a 2-step wizard: generate keypair → backup → optional profile setup.
 * Depends on NostrLogin.js being loaded first (uses window.NostrLoginLocal internals
 * via the window.NostrSignupView registration pattern).
 */
(function () {
    'use strict';

    // ── HTML template ────────────────────────────────────────────────
    // Compact footer link shown at the bottom of the login dialog
    const SIGNUP_CARD_HTML = `
        <div class="nl-signup-footer">
            <span class="nl-signup-footer-text">New to Nostr?</span>
            <button id="nl-signup-card" class="nl-signup-link">Create a new account</button>
        </div>
    `;

    const SIGNUP_HTML = SIGNUP_CARD_HTML + `

    ` + `
        <!-- Step 1: Generate & backup key -->
        <div id="nl-signup-step1" style="display:none;">
            <div class="nl-view-body">
                <div class="nl-wizard-steps">
                    <div class="nl-wizard-step nl-step-active"><span>1</span></div>
                    <div class="nl-wizard-line"></div>
                    <div class="nl-wizard-step nl-step-inactive"><span>2</span></div>
                </div>
                <h2 class="nl-view-title">Create Your Nostr Account</h2>
                <p class="nl-view-subtitle">Generate your unique private key. This is your digital identity — keep it safe.</p>
                <div class="nl-warning-box">
                    <div class="nl-warning-inner">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px;">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <div>
                            <div class="nl-warning-title">Critical: Save Your Private Key</div>
                            <div class="nl-warning-text">Your private key IS your account. There is no password recovery. If you lose it, you lose your account forever. Please save it in a secure location.</div>
                        </div>
                    </div>
                </div>
                <label class="nl-field-label" style="margin-top:16px;display:block;">Your Private Key (nsec)</label>
                <div class="nl-key-row">
                    <input id="nl-signup-nsec" class="nl-input nl-key-input" type="text" readonly autocomplete="off" />
                    <button id="nl-signup-regen" class="nl-copy-btn" title="Generate new key">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="23 4 23 10 17 10"/>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                        </svg>
                    </button>
                </div>
                <div class="nl-btn-row" style="margin-top:12px;">
                    <button id="nl-signup-download" class="nl-btn nl-btn-blue nl-btn-half">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download Backup
                    </button>
                    <button id="nl-signup-copy-key" class="nl-btn nl-btn-ghost nl-btn-half">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy to Clipboard
                    </button>
                </div>
                <label class="nl-checkbox-row">
                    <input id="nl-signup-confirm" type="checkbox" />
                    <span>I have safely backed up my private key</span>
                </label>
                <div class="nl-btn-row" style="margin-top:16px;">
                    <button id="nl-signup-back1" class="nl-btn nl-btn-ghost nl-btn-half">Back</button>
                    <button id="nl-signup-continue" class="nl-btn nl-btn-green nl-btn-half" disabled>Continue</button>
                </div>
            </div>
        </div>

        <!-- Step 2: Optional profile setup -->
        <div id="nl-signup-step2" style="display:none;">
            <div class="nl-view-body">
                <div class="nl-wizard-steps">
                    <div class="nl-wizard-step nl-step-done"><span>&#10003;</span></div>
                    <div class="nl-wizard-line nl-line-done"></div>
                    <div class="nl-wizard-step nl-step-active"><span>2</span></div>
                </div>
                <h2 class="nl-view-title">Set Up Your Profile</h2>
                <p class="nl-view-subtitle">Add your name and picture so others can recognize you. You can update this later.</p>
                <div class="nl-field">
                    <label class="nl-field-label">Display Name</label>
                    <input id="nl-signup-name" class="nl-input" type="text" placeholder="Your name" autocomplete="off" />
                </div>
                <div class="nl-field">
                    <label class="nl-field-label">Profile Picture URL</label>
                    <input id="nl-signup-picture" class="nl-input" type="url" placeholder="https://..." autocomplete="off" />
                </div>
                <div id="nl-signup-error" class="nl-error" style="display:none;margin-bottom:10px;"></div>
                <div class="nl-btn-row" style="margin-top:16px;">
                    <button id="nl-signup-back2" class="nl-btn nl-btn-ghost nl-btn-half">Back</button>
                    <button id="nl-signup-finish" class="nl-btn nl-btn-green nl-btn-half">Finish Setup</button>
                </div>
                <button id="nl-signup-skip" class="nl-btn nl-btn-ghost" style="margin-top:8px;">Skip for now</button>
            </div>
        </div>
    `;

    const SIGNUP_STEPS_HTML = SIGNUP_HTML.replace(SIGNUP_CARD_HTML, '');

    // ── CSS ──────────────────────────────────────────────────────────
    const SIGNUP_CSS = `
        .nl-card-green { border-color: #16a34a; }
        .nl-card-green:hover { border-color: #22c55e; }
        .nl-icon-green { background: rgba(22,163,74,0.2); color: #4ade80; }
        .nl-btn-green { background: #16a34a; color: #fff; }
        .nl-btn-green:hover:not(:disabled) { background: #22c55e; }
        .nl-view-body { padding: 0 24px 24px; }
        .nl-view-title { font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 6px; }
        .nl-view-subtitle { font-size: 14px; color: #9ca3af; margin: 0 0 16px; }
        .nl-wizard-steps {
            display: flex;
            align-items: center;
            gap: 0;
            margin-bottom: 20px;
        }
        .nl-wizard-step {
            width: 32px; height: 32px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 14px; font-weight: 700;
            flex-shrink: 0;
        }
        .nl-step-active { background: #2563eb; color: #fff; }
        .nl-step-inactive { background: rgba(255,255,255,0.1); color: #9ca3af; }
        .nl-step-done { background: #16a34a; color: #fff; }
        .nl-wizard-line {
            flex: 1;
            height: 2px;
            background: rgba(255,255,255,0.12);
            margin: 0 8px;
        }
        .nl-line-done { background: #16a34a; }
        .nl-warning-box {
            background: rgba(245,158,11,0.1);
            border: 1px solid rgba(245,158,11,0.3);
            border-radius: 10px;
            padding: 14px;
        }
        .nl-warning-inner { display: flex; align-items: flex-start; gap: 10px; }
        .nl-warning-title { font-weight: 700; color: #f59e0b; margin-bottom: 4px; font-size: 14px; }
        .nl-warning-text { font-size: 13px; color: #fbbf24; line-height: 1.5; }
        .nl-key-row {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .nl-key-input {
            flex: 1;
            font-size: 13px;
            font-family: monospace;
            color: #a78bfa;
            letter-spacing: 0.02em;
        }
        .nl-checkbox-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 14px;
            cursor: pointer;
            font-size: 14px;
            color: #d1d5db;
        }
        .nl-checkbox-row input[type="checkbox"] {
            width: 16px; height: 16px;
            accent-color: #16a34a;
            cursor: pointer;
            flex-shrink: 0;
        }
        .nl-field { margin-bottom: 14px; }
        .nl-field-label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #d1d5db;
            margin-bottom: 6px;
        }
        .nl-signup-footer {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-top: 16px;
            padding-top: 14px;
            border-top: 1px solid rgba(255,255,255,0.08);
        }
        .nl-signup-footer-text {
            font-size: 13px;
            color: #6b7280;
        }
        .nl-signup-link {
            background: none;
            border: none;
            padding: 0;
            font-size: 13px;
            font-weight: 600;
            color: #4ade80;
            cursor: pointer;
            text-decoration: underline;
            text-underline-offset: 2px;
        }
        .nl-signup-link:hover { color: #86efac; }
    `;

    // ── Register with NostrLogin ─────────────────────────────────────
    window.NostrSignupView = {
        getHTML() { return SIGNUP_HTML; },
        getCardHTML() { return SIGNUP_CARD_HTML; },
        getStepsHTML() { return SIGNUP_STEPS_HTML; },
        getCSS() { return SIGNUP_CSS; },

        /**
         * Wire up all sign-up view event handlers.
         * @param {HTMLElement} overlay - The dialog overlay element
         * @param {object} api - { loginWithLocalKey, publishProfile, closeDialog, showLoginBody }
         */
        wire(overlay, api) {
            const tools = () => window.NostrTools;

            // ── State ────────────────────────────────────────────────
            let _currentPrivBytes = null;

            // ── Helpers ──────────────────────────────────────────────
            function generateKey() {
                const t = tools();
                if (!t) return null;
                const privBytes = crypto.getRandomValues(new Uint8Array(32));
                const nsec = t.nip19 ? t.nip19.nsecEncode(privBytes) : Array.from(privBytes).map(b => b.toString(16).padStart(2, '0')).join('');
                return { privBytes, nsec };
            }

            function showStep1() {
                overlay.querySelector('#nl-dialog-body').style.display = 'none';
                overlay.querySelector('#nl-signup-step1').style.display = 'block';
                overlay.querySelector('#nl-signup-step2').style.display = 'none';
                overlay.querySelector('#nl-dialog-title').textContent = 'Create Account';

                // Generate a fresh key
                const key = generateKey();
                if (!key) {
                    console.error('[NostrSignup] nostr-tools not loaded');
                    return;
                }
                _currentPrivBytes = key.privBytes;
                overlay.querySelector('#nl-signup-nsec').value = key.nsec;
                overlay.querySelector('#nl-signup-confirm').checked = false;
                overlay.querySelector('#nl-signup-continue').disabled = true;
            }

            function showStep2() {
                overlay.querySelector('#nl-signup-step1').style.display = 'none';
                overlay.querySelector('#nl-signup-step2').style.display = 'block';
                overlay.querySelector('#nl-signup-error').style.display = 'none';
                overlay.querySelector('#nl-signup-name').value = '';
                overlay.querySelector('#nl-signup-picture').value = '';
            }

            function backToLogin() {
                overlay.querySelector('#nl-signup-step1').style.display = 'none';
                overlay.querySelector('#nl-signup-step2').style.display = 'none';
                overlay.querySelector('#nl-dialog-body').style.display = 'block';
                overlay.querySelector('#nl-dialog-title').textContent = 'Connect to Nostr';
                _currentPrivBytes = null;
            }

            // ── Sign-up link click → Step 1 ──────────────────────────
            overlay.querySelector('#nl-signup-card').addEventListener('click', () => {
                showStep1();
            });

            // ── Regenerate key ───────────────────────────────────────
            overlay.querySelector('#nl-signup-regen').addEventListener('click', (e) => {
                e.stopPropagation();
                const key = generateKey();
                if (!key) return;
                _currentPrivBytes = key.privBytes;
                overlay.querySelector('#nl-signup-nsec').value = key.nsec;
                overlay.querySelector('#nl-signup-confirm').checked = false;
                overlay.querySelector('#nl-signup-continue').disabled = true;
            });

            // ── Download backup ──────────────────────────────────────
            overlay.querySelector('#nl-signup-download').addEventListener('click', (e) => {
                e.stopPropagation();
                const nsec = overlay.querySelector('#nl-signup-nsec').value;
                if (!nsec) return;
                const content = `NOSTR PRIVATE KEY BACKUP\n========================\nPrivate Key (nsec): ${nsec}\n\nWARNING: Keep this file safe and private. Anyone with this key has full control of your Nostr account.\nGenerated: ${new Date().toISOString()}\n`;
                const blob = new Blob([content], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'nostr-private-key-backup.txt';
                a.click();
                URL.revokeObjectURL(a.href);
            });

            // ── Copy key to clipboard ────────────────────────────────
            overlay.querySelector('#nl-signup-copy-key').addEventListener('click', (e) => {
                e.stopPropagation();
                const nsec = overlay.querySelector('#nl-signup-nsec').value;
                if (nsec) navigator.clipboard.writeText(nsec).catch(() => {});
            });

            // ── Confirm checkbox → enable Continue ───────────────────
            overlay.querySelector('#nl-signup-confirm').addEventListener('change', (e) => {
                overlay.querySelector('#nl-signup-continue').disabled = !e.target.checked;
            });

            // ── Back from step 1 ─────────────────────────────────────
            overlay.querySelector('#nl-signup-back1').addEventListener('click', (e) => {
                e.stopPropagation();
                backToLogin();
            });

            // ── Continue to step 2 ───────────────────────────────────
            overlay.querySelector('#nl-signup-continue').addEventListener('click', (e) => {
                e.stopPropagation();
                showStep2();
            });

            // ── Back from step 2 ─────────────────────────────────────
            overlay.querySelector('#nl-signup-back2').addEventListener('click', (e) => {
                e.stopPropagation();
                overlay.querySelector('#nl-signup-step2').style.display = 'none';
                overlay.querySelector('#nl-signup-step1').style.display = 'block';
            });

            // ── Skip profile setup → just log in ────────────────────
            overlay.querySelector('#nl-signup-skip').addEventListener('click', async (e) => {
                e.stopPropagation();
                if (!_currentPrivBytes) return;
                try {
                    api.loginWithLocalKey(_currentPrivBytes);
                    api.closeDialog();
                } catch (err) {
                    console.error('[NostrSignup] Login failed:', err);
                }
            });

            // ── Finish setup → log in + publish profile ──────────────
            overlay.querySelector('#nl-signup-finish').addEventListener('click', async (e) => {
                e.stopPropagation();
                if (!_currentPrivBytes) return;

                const errEl = overlay.querySelector('#nl-signup-error');
                const btn = overlay.querySelector('#nl-signup-finish');
                const name = overlay.querySelector('#nl-signup-name').value.trim();
                const picture = overlay.querySelector('#nl-signup-picture').value.trim();

                errEl.style.display = 'none';
                btn.disabled = true;
                btn.textContent = 'Setting up...';

                try {
                    // Log in first (sets window.nostr shim)
                    api.loginWithLocalKey(_currentPrivBytes);

                    // Publish profile if name or picture provided
                    if (name || picture) {
                        const profileData = {};
                        if (name) { profileData.name = name; profileData.display_name = name; }
                        if (picture) profileData.picture = picture;
                        try {
                            await api.publishProfile(profileData);
                        } catch (pubErr) {
                            console.warn('[NostrSignup] Profile publish failed (non-fatal):', pubErr);
                        }
                    }

                    api.closeDialog();
                } catch (err) {
                    errEl.textContent = err.message || 'Setup failed. Please try again.';
                    errEl.style.display = 'block';
                    btn.disabled = false;
                    btn.textContent = 'Finish Setup';
                }
            });

            // ── Expose reset for external use (e.g. dialog close) ───
            return {
                reset() {
                    backToLogin();
                }
            };
        }
    };

    console.log('[NostrSignupView] Loaded');
})();
