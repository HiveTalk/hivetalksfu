/**
 * NostrWalletView.js - Wallet settings view for NostrLogin
 * Uses the <bc-button> web component from @getalby/bitcoin-connect,
 * which is already loaded by the page via ESM import.
 * Depends on NostrLogin.js being loaded first.
 */
(function () {
    'use strict';

    // ── HTML template ────────────────────────────────────────────────
    // The <bc-button> web component is registered by the ESM import in the
    // page's <head> (https://esm.sh/@getalby/bitcoin-connect@latest).
    const WALLET_HTML = `
        <div id="nl-wallet-view" style="display:none;">
            <div class="nl-view-body">
                <div class="nl-view-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2"/>
                        <line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                    <span class="nl-view-title">Wallet Settings</span>
                </div>
                <p class="nl-view-subtitle">Connect your Bitcoin Lightning wallet to enable payments.</p>

                <div class="nl-bc-slot">
                    <bc-button></bc-button>
                </div>

                <p class="nl-hint" style="margin:14px 0 16px;">
                    Connect using Alby, Mutiny, or any NWC-compatible wallet.
                </p>

                <div id="nl-wallet-connected" style="display:none;" class="nl-wallet-connected-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>Wallet connected</span>
                </div>

                <button id="nl-wallet-back" class="nl-btn nl-btn-ghost" style="margin-top:4px;">Back</button>
            </div>
        </div>
    `;

    // ── CSS ──────────────────────────────────────────────────────────
    const WALLET_CSS = `
        .nl-bc-slot {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 0 6px;
        }
        .nl-bc-slot bc-button {
            --bc-color-brand: #3b82f6;
            --bc-color-brand-dark: #2563eb;
        }
        .nl-wallet-connected-box {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(34,197,94,0.1);
            border: 1px solid rgba(34,197,94,0.3);
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 14px;
            color: #22c55e;
            margin-bottom: 8px;
        }
    `;

    // ── Register ─────────────────────────────────────────────────────
    window.NostrWalletView = {
        getHTML() { return WALLET_HTML; },
        getCSS() { return WALLET_CSS; },

        /**
         * Wire up wallet view event handlers.
         * @param {HTMLElement} overlay - The dialog overlay element
         * @param {object} api - { closeDialog }
         */
        wire(overlay, api) {
            const view = overlay.querySelector('#nl-wallet-view');
            const connectedEl = overlay.querySelector('#nl-wallet-connected');

            // Lower our overlay z-index so the BC modal (which appends to body)
            // can appear on top. Restore once BC modal is gone.
            const OVERLAY_Z = '999999';
            const BEHIND_Z  = '1';

            function yieldToBC() {
                overlay.style.zIndex = BEHIND_Z;
            }
            function reclaimZ() {
                overlay.style.zIndex = OVERLAY_Z;
            }

            // MutationObserver: watch for BC modal element appearing/disappearing in body
            const _bcObserver = new MutationObserver(() => {
                // BC appends a custom element (bc-modal or similar) to document.body
                const bcModal = document.body.querySelector('bc-modal, bc-connector-modal, [data-bc-modal]');
                if (!bcModal) {
                    reclaimZ();
                }
            });
            _bcObserver.observe(document.body, { childList: true, subtree: false });

            // Also handle via BC events for immediate response
            window.addEventListener('bc:connected', () => {
                reclaimZ();
                if (connectedEl) connectedEl.style.display = 'flex';
            });
            window.addEventListener('bc:disconnected', () => {
                reclaimZ();
                if (connectedEl) connectedEl.style.display = 'none';
            });

            // Intercept clicks on the bc-button wrapper — works for both direct
            // clicks and shadow DOM bubbled clicks since click bubbles to host element
            const bcBtn = overlay.querySelector('bc-button');
            if (bcBtn) {
                bcBtn.addEventListener('click', () => {
                    yieldToBC();
                }, true); // capture phase to fire before BC's own handler
            }

            function show() {
                overlay.querySelector('#nl-logged-in').style.display = 'none';
                view.style.display = 'block';
                overlay.querySelector('#nl-dialog-title').textContent = 'Wallet Settings';
                reclaimZ();
            }

            function hide() {
                view.style.display = 'none';
                overlay.querySelector('#nl-logged-in').style.display = 'block';
                overlay.querySelector('#nl-dialog-title').textContent = 'Nostr Account';
                reclaimZ();
            }

            overlay.querySelector('#nl-wallet-back').addEventListener('click', (e) => {
                e.stopPropagation();
                hide();
            });

            return { show, hide };
        }
    };

    console.log('[NostrWalletView] Loaded');
})();
