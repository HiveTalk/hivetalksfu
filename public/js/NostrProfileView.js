/**
 * NostrProfileView.js - Profile settings view for NostrLogin
 * Provides a form to edit and publish kind:0 Nostr profile metadata.
 * Depends on NostrLogin.js being loaded first.
 */
(function () {
    'use strict';

    // ── HTML template ────────────────────────────────────────────────
    const PROFILE_HTML = `
        <div id="nl-profile-view" style="display:none;">
            <div class="nl-view-body">
                <p class="nl-view-subtitle">Update your public Nostr metadata.</p>

                <div class="nl-field">
                    <label class="nl-field-label">Name</label>
                    <input id="nl-pf-name" class="nl-input" type="text" placeholder="Your display name" autocomplete="off" />
                    <span class="nl-field-hint">This is your display name visible to others.</span>
                </div>

                <div class="nl-field">
                    <label class="nl-field-label">Bio</label>
                    <textarea id="nl-pf-bio" class="nl-input nl-textarea" placeholder="A short description about yourself..." rows="3"></textarea>
                    <span class="nl-field-hint">A short description about yourself.</span>
                </div>

                <div class="nl-field-row">
                    <div class="nl-field nl-field-half">
                        <label class="nl-field-label">Profile Picture URL</label>
                        <input id="nl-pf-picture" class="nl-input" type="url" placeholder="https://..." autocomplete="off" />
                        <span class="nl-field-hint">URL to your profile picture.</span>
                    </div>
                    <div class="nl-field nl-field-half">
                        <label class="nl-field-label">Banner Image URL</label>
                        <input id="nl-pf-banner" class="nl-input" type="url" placeholder="https://..." autocomplete="off" />
                        <span class="nl-field-hint">URL to a wide banner image.</span>
                    </div>
                </div>

                <div class="nl-field-row">
                    <div class="nl-field nl-field-half">
                        <label class="nl-field-label">Website</label>
                        <input id="nl-pf-website" class="nl-input" type="url" placeholder="https://..." autocomplete="off" />
                        <span class="nl-field-hint">Your personal website or social link.</span>
                    </div>
                    <div class="nl-field nl-field-half">
                        <label class="nl-field-label">NIP-05 Identifier</label>
                        <input id="nl-pf-nip05" class="nl-input" type="text" placeholder="you@domain.com" autocomplete="off" />
                        <span class="nl-field-hint">Your verified Nostr identifier.</span>
                    </div>
                </div>

                <div id="nl-pf-error" class="nl-error" style="display:none;margin-bottom:10px;"></div>
                <div id="nl-pf-success" class="nl-success-msg" style="display:none;">Profile saved successfully!</div>

                <div class="nl-btn-row">
                    <button id="nl-pf-back" class="nl-btn nl-btn-ghost nl-btn-half">Back</button>
                    <button id="nl-pf-save" class="nl-btn nl-btn-blue nl-btn-half">Save Profile</button>
                </div>
            </div>
        </div>
    `;

    // ── CSS ──────────────────────────────────────────────────────────
    const PROFILE_CSS = `
        .nl-view-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 6px;
        }
        .nl-view-body { padding: 0 24px 24px; }
        .nl-view-title { font-size: 18px; font-weight: 700; color: #fff; }
        .nl-view-subtitle { font-size: 13px; color: #9ca3af; margin: 0 0 20px; }
        .nl-field { margin-bottom: 14px; }
        .nl-field-label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #d1d5db;
            margin-bottom: 6px;
        }
        .nl-field-hint {
            display: block;
            font-size: 12px;
            color: #6b7280;
            margin-top: 4px;
        }
        .nl-field-row {
            display: flex;
            gap: 12px;
        }
        .nl-field-half { flex: 1; min-width: 0; }
        .nl-textarea {
            resize: vertical;
            min-height: 72px;
            font-family: inherit;
        }
        .nl-success-msg {
            color: #22c55e;
            font-size: 13px;
            margin-bottom: 10px;
        }
    `;

    // ── Register ─────────────────────────────────────────────────────
    window.NostrProfileView = {
        getHTML() { return PROFILE_HTML; },
        getCSS() { return PROFILE_CSS; },

        /**
         * Wire up profile view event handlers.
         * @param {HTMLElement} overlay - The dialog overlay element
         * @param {object} api - { publishProfile, getCurrentAccount, closeDialog, showLoggedIn }
         */
        wire(overlay, api) {
            const view = overlay.querySelector('#nl-profile-view');

            // ── Show profile view, pre-fill current data ─────────────
            function show() {
                // Hide all other views
                overlay.querySelector('#nl-logged-in').style.display = 'none';
                view.style.display = 'block';
                overlay.querySelector('#nl-dialog-title').textContent = 'Profile Settings';

                // Pre-fill from cached profile data, falling back to account info
                let cached = {};
                try { cached = JSON.parse(window.localStorage.getItem('nl_profile_cache') || '{}'); } catch (e) {}
                const account = api.getCurrentAccount();
                overlay.querySelector('#nl-pf-name').value    = cached.name    || account?.name    || window.localStorage.peer_name || '';
                overlay.querySelector('#nl-pf-picture').value = cached.picture || account?.picture || window.localStorage.peer_url  || '';
                overlay.querySelector('#nl-pf-bio').value     = cached.about   || '';
                overlay.querySelector('#nl-pf-banner').value  = cached.banner  || '';
                overlay.querySelector('#nl-pf-website').value = cached.website || '';
                overlay.querySelector('#nl-pf-nip05').value   = cached.nip05   || '';
                overlay.querySelector('#nl-pf-error').style.display = 'none';
                overlay.querySelector('#nl-pf-success').style.display = 'none';
            }

            function hide() {
                view.style.display = 'none';
                overlay.querySelector('#nl-logged-in').style.display = 'block';
                overlay.querySelector('#nl-dialog-title').textContent = 'Nostr Account';
            }

            // ── Back button ──────────────────────────────────────────
            overlay.querySelector('#nl-pf-back').addEventListener('click', (e) => {
                e.stopPropagation();
                hide();
            });

            // ── Save profile ─────────────────────────────────────────
            overlay.querySelector('#nl-pf-save').addEventListener('click', async (e) => {
                e.stopPropagation();
                const errEl = overlay.querySelector('#nl-pf-error');
                const successEl = overlay.querySelector('#nl-pf-success');
                const btn = overlay.querySelector('#nl-pf-save');

                const name = overlay.querySelector('#nl-pf-name').value.trim();
                const bio = overlay.querySelector('#nl-pf-bio').value.trim();
                const picture = overlay.querySelector('#nl-pf-picture').value.trim();
                const banner = overlay.querySelector('#nl-pf-banner').value.trim();
                const website = overlay.querySelector('#nl-pf-website').value.trim();
                const nip05 = overlay.querySelector('#nl-pf-nip05').value.trim();

                if (!name && !bio && !picture) {
                    errEl.textContent = 'Please fill in at least your name or picture.';
                    errEl.style.display = 'block';
                    return;
                }

                errEl.style.display = 'none';
                successEl.style.display = 'none';
                btn.disabled = true;
                btn.textContent = 'Saving...';

                try {
                    const profileData = {};
                    if (name) { profileData.name = name; profileData.display_name = name; }
                    if (bio) profileData.about = bio;
                    if (picture) profileData.picture = picture;
                    if (banner) profileData.banner = banner;
                    if (website) profileData.website = website;
                    if (nip05) profileData.nip05 = nip05;

                    await api.publishProfile(profileData);
                    // Cache the saved values so they persist on re-open
                    window.localStorage.setItem('nl_profile_cache', JSON.stringify(profileData));
                    successEl.style.display = 'block';
                    setTimeout(() => { successEl.style.display = 'none'; }, 3000);
                } catch (err) {
                    errEl.textContent = err.message || 'Failed to save profile. Please try again.';
                    errEl.style.display = 'block';
                } finally {
                    btn.disabled = false;
                    btn.textContent = 'Save Profile';
                }
            });

            return { show, hide };
        }
    };

    console.log('[NostrProfileView] Loaded');
})();
