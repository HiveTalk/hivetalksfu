'use strict';

if (location.href.substr(0, 5) !== 'https') location.href = 'https' + location.href.substr(4, location.href.length - 4);

/**
 * MiroTalk SFU - Room component
 *
 * @link    GitHub: https://github.com/miroslavpejic85/mirotalksfu
 * @link    Official Live demo: https://sfu.mirotalk.com
 * @license For open source use: AGPLv3
 * @license For commercial or closed source, contact us at license.mirotalk@gmail.com or purchase directly via CodeCanyon
 * @license CodeCanyon: https://codecanyon.net/item/mirotalk-sfu-webrtc-realtime-video-conferences/40769970
 * @author  Miroslav Pejic - miroslav.pejic.85@gmail.com
 * @version 1.5.67
 *
 */

// ####################################################
// STATIC SETTINGS
// ####################################################
console.log('Window Location', window.location);

var loggedIn = false;

// Access the functions from the global object
const { relayInit, generateSecretKey, getPublicKey, SimplePool } = NostrTools;

const nip19 = NostrTools.nip19;
const pool = new SimplePool();

// default fall back relays
let defaultRelays = [
    'wss://relay.primal.net',
    'wss://relay.damus.io/',
    //    'wss://relay.nostr.band/all',
    'wss://nos.lol',
    //    'wss://hivetalk.nostr1.com',
];

const socket = io({ transports: ['websocket'] });

let survey = {
    enabled: true,
    url: 'https://t.me/+2Ll1IFwXwCJlMGFl', // telegram link
};

let redirect = {
    enabled: true,
    url: '/newroom',
};

let recCodecs = null;
let recPrioritizeH264 = false;

const _PEER = {
    presenter: '<i class="fa-solid fa-user-shield"></i>',
    guest: '<i class="fa-solid fa-signal"></i>',
    audioOn: '<i class="fas fa-microphone"></i>',
    audioOff: '<i class="fas fa-microphone-slash red"></i>',
    videoOn: '<i class="fas fa-video"></i>',
    videoOff: '<i class="fas fa-video-slash red"></i>',
    screenOn: '<i class="fas fa-desktop"></i>',
    screenOff: '<i class="fas fa-desktop red"></i>',
    raiseHand: '<i style="color: rgb(0, 255, 71);" class="fas fa-hand-paper pulsate"></i>',
    lowerHand: '',
    acceptPeer: '<i class="fas fa-check"></i>',
    banPeer: '<i class="fas fa-ban red"></i>',
    ejectPeer: '<i class="fas fa-right-from-bracket red"></i>',
    geoLocation: '<i class="fas fa-location-dot"></i>',
    sendFile: '<i class="fas fa-upload"></i>',
    sendMsg: '<i class="fas fa-paper-plane"></i>',
    sendVideo: '<i class="fab fa-youtube"></i>',
};

const initNostr = document.getElementById('initNostr');

const initUser = document.getElementById('initUser');
const initVideoContainerClass = document.querySelector('.init-video-container');
const bars = document.querySelectorAll('.volume-bar');

const userAgent = navigator.userAgent.toLowerCase();
const isTabletDevice = isTablet(userAgent);
const isIPadDevice = isIpad(userAgent);
const thisInfo = getInfo();

const Base64Prefix = 'data:application/pdf;base64,';

// Whiteboard
const wbImageInput = 'image/*';
const wbPdfInput = 'application/pdf';
const wbWidth = 1366;
const wbHeight = 768;
const wbGridSize = 20;
const wbStroke = '#cccccc63';
let wbGridLines = [];
let wbGridVisible = false;

const swalImageUrl = '../images/pricing-illustration.svg';

// Media
const sinkId = 'sinkId' in HTMLMediaElement.prototype;

// ####################################################
// LOCAL STORAGE
// ####################################################

const lS = new LocalStorage();

const localStorageSettings = lS.getLocalStorageSettings() || lS.SFU_SETTINGS;

const localStorageDevices = lS.getLocalStorageDevices() || lS.LOCAL_STORAGE_DEVICES;

const localStorageInitConfig = lS.getLocalStorageInitConfig() || lS.INIT_CONFIG;

console.log('LOCAL_STORAGE', {
    localStorageSettings: localStorageSettings,
    localStorageDevices: localStorageDevices,
    localStorageInitConfig: localStorageInitConfig,
});

// ####################################################
// THEME CUSTOM COLOR - PICKER
// ####################################################

const themeCustom = {
    input: document.getElementById('themeColorPicker'),
    color: localStorageSettings.theme_color ? localStorageSettings.theme_color : '#000000',
    keep: localStorageSettings.theme_custom ? localStorageSettings.theme_custom : false,
};

const pickr = Pickr.create({
    el: themeCustom.input,
    theme: 'classic', // or 'monolith', or 'nano'
    default: themeCustom.color,
    useAsButton: true,

    swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)',
    ],

    components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
            hex: false,
            rgba: false,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: false,
            clear: false,
            save: false,
        },
    },
})
    .on('init', (pickr) => {
        themeCustom.input.value = pickr.getSelectedColor().toHEXA().toString(0);
    })
    .on('change', (color) => {
        themeCustom.color = color.toHEXA().toString();
        themeCustom.input.value = themeCustom.color;
        setCustomTheme();
    })
    .on('changestop', (color) => {
        localStorageSettings.theme_color = themeCustom.color;
        lS.setSettings(localStorageSettings);
    });

// ####################################################
// ENUMERATE DEVICES SELECTS
// ####################################################

const videoSelect = getId('videoSelect');
const initVideoSelect = getId('initVideoSelect');
const microphoneSelect = getId('microphoneSelect');
const initMicrophoneSelect = getId('initMicrophoneSelect');
const speakerSelect = getId('speakerSelect');
const initSpeakerSelect = getId('initSpeakerSelect');

// ####################################################
// DYNAMIC SETTINGS
// ####################################################

let swalBackground = 'radial-gradient(#393939, #000000)'; //'rgba(0, 0, 0, 0.7)';

let rc = null;
let producer = null;
let participantsCount = 0;
let lobbyParticipantsCount = 0;
let chatMessagesId = 0;

let room_id = getRoomId();
let room_password = getRoomPassword();
let peer_name = getPeerName();
let peer_uuid = getPeerUUID();
let peer_token = getPeerToken();
let isScreenAllowed = getScreen();
let isHideMeActive = getHideMeActive();
let notify = getNotify();
isPresenter = isPeerPresenter();

let peer_url = null;
let peer_pubkey = null;
let peer_npub = null;
let peer_lnaddress = null;

let peer_info = null;

let isPushToTalkActive = false;
let isSpaceDown = false;
let isPitchBarEnabled = true;
let isSoundEnabled = true;
let isBroadcastingEnabled = false;
let isLobbyEnabled = false;
let isLobbyOpen = false;
let hostOnlyRecording = false;
let isEnumerateAudioDevices = false;
let isEnumerateVideoDevices = false;
let isAudioAllowed = false;
let isVideoAllowed = false;
let isVideoPrivacyActive = false;
let isRecording = false;
let isAudioVideoAllowed = false;
let isParticipantsListOpen = false;
let isVideoControlsOn = false;
let isChatPasteTxt = false;
let isChatMarkdownOn = false;
let isChatGPTOn = false;
let isSpeechSynthesisSupported = 'speechSynthesis' in window;
let joinRoomWithoutAudioVideo = true;
let joinRoomWithScreen = false;

let recTimer = null;
let recElapsedTime = null;

let wbCanvas = null;
let wbIsLock = false;
let wbIsDrawing = false;
let wbIsOpen = false;
let wbIsRedoing = false;
let wbIsEraser = false;
let wbIsBgTransparent = false;
let wbPop = [];
let coords = {};

let isButtonsVisible = false;
let isButtonsBarOver = false;

let isRoomLocked = false;

let initStream = null;

let scriptProcessor = null;

const RoomURL = window.location.origin + '/join/' + room_id; // window.location.origin + '/join/?room=' + roomId + '&token=' + myToken

let transcription;

let showFreeAvatars = true;

let quill = null;

// ####################################################
// INIT ROOM
// ####################################################

document.addEventListener('DOMContentLoaded', function () {
    // show nostr dialog on click in profile settings, only show if logged in
    document.getElementById('nostrButton').addEventListener('click', function () {
        document.dispatchEvent(new CustomEvent('nlLaunch', { detail: 'switch-account' }));
    });
    console.log('00 ----> init Nostr Login');
    hide(loadingDiv);
    // check localstorage if actually logged in before
    console.log('CHECK IF LOGGED IN on Nostr or Previously in LocalStorage');

    try {
        const userInfo = JSON.parse(window.localStorage.getItem('__nostrlogin_accounts'));

        if (userInfo && userInfo.length > 0) {
            // Do something with the userInfo
            const user = userInfo[0];
            peer_name = user.name;
            if (user.name !== undefined && user.name.length > 30) {
                // truncate peer_name to be < 30 chars
                peer_name = truncateString(user.name, 29);
            }
            peer_pubkey = user.pubkey;
            window.localStorage.peer_pubkey = user.pubkey;

            signSampleEvent(peer_pubkey); // send a sample event to the test relay

            peer_npub = nip19.npubEncode(user.pubkey);
            window.localStorage.peer_npub = peer_npub;

            // if there is no peer_name but we have a pubkey, use first 5 chars
            if (user.name === undefined) {
                // offer to set a username as the first 7 chars of the pubkey
                peer_name = truncateString(user.pubkey + '...', 10);
            }
            window.localStorage.peer_name = user.name;

            peer_url = user.picture;
            window.localStorage.peer_url = user.picture;
            console.log('checkUserInfo :', user.pubkey, user.name, user.picture, peer_npub);

            if (peer_name && peer_pubkey) {
                console.log('discovery complete: checkUserInfo: ', peer_name, peer_pubkey, peer_url);

                // try to get lightning address
                loggedIn = getInfoAndContinue();
                console.log('checking if loggedIn pre clearInterval: ', loggedIn);

                if (loggedIn) {
                    // clearInterval(checkInterval);      // Then clear the interval
                    continueNostrLogin('nostr'); // And continue with the next step
                }
            }
        } else {
            // look for peer_name and peer lnaddress from previous local storage session
            // if not found, offer to set a username
            if (window.localStorage.peer_name) {
                peer_name = window.localStorage.peer_name;
                if (window.localStorage.peer_url) {
                    peer_url = window.localStorage.peer_url;
                }
                if (window.localStorage.peer_lnaddress) {
                    peer_lnaddress = window.localStorage.peer_lnaddress;
                }
                console.log('adopt prior localStorage ', peer_name, peer_pubkey, peer_url);
                loggedIn = true; // set logged in is now true
                continueNostrLogin('priorlocalStorage'); // And continue with the next step
                // if the user doesn't want the above settings, they can change it
                // during the continueNostrLogin() flow
            }
        }
    } catch (error) {
        console.log('Error parsing userInfo:', error);
    }
    // if both of the above methods fail then we try nostr or random login
    if (!loggedIn) {
        console.log(' no priornostr login, try setting random username');
        checkInterval = setInterval(checkUserInfo, 1000);
        nostrLogin();
    }
});

// Check every 500 milliseconds (0.5 second)
let checkInterval = null;
// checkInterval = setInterval(checkUserInfo, 1000);
let cycleCount = 0;
const maxCycles = 360; // 240 cycles, 120 seconds = 2 minutes to login with Nostr before redirecting to Home Page

// helper methods
function generateRandomName() {
    // Define some syllables to combine into a name
    const syllables = [
        'la',
        'ma',
        'ra',
        'sa',
        'ta',
        'na',
        'ka',
        'pa',
        'fa',
        'zi',
        'li',
        'mi',
        'nu',
        'ke',
        'jo',
        'lu',
        'vi',
        'ri',
        'si',
        'di',
        'bi',
        'ti',
        'mo',
        'no',
    ];
    let name = '';
    const maxLength = 10; // Ensure the name length is < 30 chars
    while (name.length < maxLength) {
        const randomIndex = Math.floor(Math.random() * syllables.length);
        const newSyllable = syllables[randomIndex];
        // Check if adding the new syllable would exceed the maxLength
        if (name.length + newSyllable.length >= maxLength) break;
        name += newSyllable;
    }
    // Capitalize the first letter of the generated name
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return name;
}

function setRandomName() {
    let name = generateRandomName();
    console.log('just set a peer name');
    name = filterXSS(name);
    // if (!getCookie(room_id + '_name')) {
    //     window.localStorage.peer_name = name;
    // }
    // TODO - deal with cookies on leave room
    // setCookie(room_id + '_name', name, 30);
    peer_name = name;
}

// try to get the lightning address associated with profile
// and/or grab NIP-05 or Nprofile info
async function getNostrProfile(pubkey, relays) {
    return new Promise((resolve, reject) => {
        let h = pool.subscribeMany(
            relays,
            [
                {
                    kinds: [0],
                    authors: [pubkey],
                },
            ],
            {
                onevent(event) {
                    if (event && event.kind === 0 && event.pubkey === pubkey) {
                        const content = JSON.parse(event.content);
                        const lightningAddress = content.lud16 || content.lud06;
                        console.log('relays: ', relays);

                        // incase the relay pool still returns undefined
                        if (content['name'] === undefined) {
                            peer_name = truncateString(peer_pubkey + '...', 10);
                        } else {
                            peer_name = content['name']; // override default
                            peer_url = content['image'] || content['picture']; // override default
                            console.log('content: ', content, 'peer_name', peer_name, 'peer_url', peer_url);
                            window.localStorage.peer_name = peer_name;
                            window.localStorage.peer_url = peer_url;
                        }
                        // peer_nip05 = content['nip05']

                        if (lightningAddress) {
                            console.log(`User's Lightning Address: ${lightningAddress}`);
                            peer_lnaddress = lightningAddress;
                            window.localStorage.peer_lnaddress = lightningAddress;
                        } else {
                            // so if we can't find the lightning address, let the user set it later
                            peer_lnaddress = '';
                            window.localStorage.peer_lnaddress = '';
                            console.log('Lightning Address not found in the profile.');
                        }
                        h.close();
                        // login fetch info now complete, set it to be true to exit login loop
                        // even if there is no lightning address, that's ok, we are logged in.
                        loggedIn = true;
                    }
                },
                onclose() {
                    h.close();
                },
            },
        );
    });
}

// get nostr profile info based on default or preferred relays
async function getInfoAndContinue() {
    try {
        // fetch preferred relays as an option
        // for now, we usedefault relays instead of fetching preferred relays
        await getNostrProfile(peer_pubkey, defaultRelays); // Wait for getNostrProfile to complete
        return true;
    } catch (error) {
        console.error('Error in getInfo:', error);
    }
}

// nostr-login auth
document.addEventListener('nlAuth', (e) => {
    console.log('nlauth', e);
    if (e.detail.type === 'login' || e.detail.type === 'signup') {
        if (!loggedIn) {
            console.log('Logging In');
            // loggedIn = true
            // get pubkey with window.nostr and show user profile
            //const login = window.localStorage.getItem('login');
            console.log('NLAUTH -->  login info: ', e.detail.type); // , login)
        }
    } else {
        // clear local user data, hide profile info
        if (loggedIn) {
            setTimeout(function () {
                console.log('logoff section');
                loggedIn = false;
                //  clear user info from the local storage
                document.dispatchEvent(new Event('nlLogout')); // logout from nostr-login
                openURL('/'); // redirect to front page on logout
            }, 200);
        }
    }
});

// load nostr user from nostr-login dialog pop up
async function loadUser() {
    if (window.nostr) {
        window.nostr
            .getPublicKey()
            .then(function (pubkey) {
                if (pubkey) {
                    console.log('LOAD USER --> fetched pubkey', pubkey);

                    peer_pubkey = pubkey;
                    peer_npub = nip19.npubEncode(pubkey);
                    console.log('npub: ', peer_npub);
                    window.localStorage.peer_pubkey = pubkey;
                    window.localStorage.peer_npub = peer_npub;
                    // first attempt to grab user info from nostr-login if logged in
                    //getDisplayUserInfo();
                    const userInfo = JSON.parse(window.localStorage.getItem('__nostrlogin_accounts'));
                    try {
                        if (userInfo && userInfo.length > 0) {
                            const user = userInfo[0];
                            console.log('user from _nostrlogin_accounts: ', user.name);
                            console.log('user picture: ', user.picture);
                            peer_name = user.name;
                            if (peer_name !== undefined && peer_name.length > 30) {
                                // truncate peer_name to be < 30 chars
                                peer_name = truncateString(user.name, 29);
                            }
                            peer_url = user.picture;
                            peer_pubkey = user.pubkey;
                            peer_npub = nip19.npubEncode(user.pubkey);

                            signSampleEvent(peer_pubkey); // send a sample event to the test relay

                            window.localStorage.peer_pubkey = user.pubkey;
                            window.localStorage.peer_name = user.name;
                            window.localStorage.peer_url = user.picture;
                            window.localStorage.peer_npub = peer_npub;

                            if (user.name === undefined) {
                                // offer to set a username as the first 7 chars of the pubkey
                                peer_name = truncateString(user.pubkey + '...', 10);
                                window.localStorage.peer_name = peer_name;
                            }
                        } else {
                            console.log('No user info available (empty array)');
                        }
                    } catch (error) {
                        console.log('Error parsing userInfo:', error);
                    }
                }
            })
            .catch((err) => {
                console.log('LoadUser Err', err);
                console.log('logoff section');
                loggedIn = false;
                document.dispatchEvent(new Event('nlLogout')); // logout from nostr-login
            });
    }
}

function truncateString(str, maxLength) {
    if (str.length > maxLength) {
        return str.slice(0, maxLength - 3) + '...';
    }
    return str;
}

function checkUserInfo() {
    console.log('....inside checkUserInfo....' + cycleCount);
    cycleCount++;

    // wait until timer is up in 1 min (120 cycles) and then go back to home page.
    if (cycleCount >= maxCycles) {
        clearInterval(checkInterval);
        console.log('checkUserInfo aborted after 120 cycles.');
        let timerInterval;
        Swal.fire({
            background: swalBackground,
            title: 'No Nostr Login Detected!',
            html: 'Redirecting to Home Page in <b></b> milliseconds.',
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector('b');
                timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
            },
            willClose: () => {
                clearInterval(timerInterval);
                document.dispatchEvent(new Event('nlLogout')); // logout from nostr-login
                openURL('/newroom'); // redirect to new room page on logout
                return;
            },
        });
    }

    const userInfo = JSON.parse(window.localStorage.getItem('__nostrlogin_accounts'));

    try {
        if (userInfo && userInfo.length > 0) {
            // Do something with the userInfo
            const user = userInfo[0];
            peer_name = user.name;
            if (user.name !== undefined && user.name.length > 30) {
                // truncate peer_name to be < 30 chars
                peer_name = truncateString(user.name, 29);
            }
            peer_url = user.picture;
            peer_pubkey = user.pubkey;
            peer_npub = nip19.npubEncode(user.pubkey);

            signSampleEvent(peer_pubkey); // send a sample event to the test relay

            window.localStorage.peer_name = user.name;
            window.localStorage.peer_url = user.picture;
            window.localStorage.peer_pubkey = user.pubkey;
            window.localStorage.peer_npub = peer_npub;
            console.log('checkUserInfo :', user.pubkey, user.name, user.picture, peer_npub);

            // TODO: what do we do here if there is no peer_name but we have a pubkey?
            // we are assuming peer_name exists. if not, then we need to offer
            // option to set a username after 60 sec period of checking and no username

            if (user.name === undefined) {
                // offer to set a username as the first 7 chars of the pubkey
                peer_name = truncateString(user.pubkey + '...', 10);
                window.localStorage.peer_name = peer_name;
            }

            if (peer_name && peer_pubkey) {
                console.log('discovery complete: checkUserInfo: ', peer_name, peer_pubkey, peer_url);

                // try to get lightning address
                getInfoAndContinue();
                console.log('checking if loggedIn pre clearInteraval: ', loggedIn);

                if (loggedIn) {
                    clearInterval(checkInterval); // Then clear the interval
                    continueNostrLogin('nostr'); // And continue with the next step
                }
            }
        }
    } catch (error) {
        console.log('Error parsing userInfo:', error);
    }
}

async function isValidLightningAddress(address) {
    console.log('.... inside isValidLightningAddress: ', address);
    const parts = address.split('@');
    if (parts.length !== 2) {
        return false; // Invalid format
    }
    const [username, domain] = parts;
    if (!username || !domain) {
        return false; // Invalid format
    }

    // Construct the URL to query the .well-known endpoint
    const url = `https://${domain}/.well-known/lnurlp/${username}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            return false; // Not a valid address if the response is not 200
        }

        const data = await response.json();

        // Check if the response contains required fields for a valid LNURL-pay endpoint
        if (data.callback && data.maxSendable && data.minSendable && data.metadata) {
            return true; // Valid Lightning Address
        } else {
            return false; // Missing required fields
        }
    } catch (error) {
        console.error('Error validating Lightning Address:', error);
        return false; // Error during the request
    }
}

function isValidLNFormat(address) {
    // Regular expression for Lightning Address format validation
    const regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+$/;
    return regex.test(address);
}

function nostrLogin() {
    console.log('0.1.00 ----> Nostr or Other Login');

    Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: swalBackground,
        title: '<img src="../images/hivelogo50x200.svg"/>',
        html: 'Welcome! Questions? see the <a href="/faq" target="_blank">FAQ</a> ',
        showDenyButton: true,
        denyButtonText: `Just set a Name`,
        denyButtonColor: 'green',
        confirmButtonText: 'Login with Nostr',
        confirmButtonColor: '#3085d6',
        preConfirm: async () => {
            try {
                setTimeout(() => {
                    // triggers nostr login extension
                    loadUser();
                }, 500);
            } catch (error) {
                // loggedIn = false
                Swal.showValidationMessage(`
                Request failed: ${error}
              `);
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            // see checkUserInfo to continue login
            console.log('NOSTR LOGIN Selected by User');
        } else if (result.isDenied) {
            setRandomName();
            //console.log("Set Random Name")
            // blank out the other values (might not need this)
            peer_pubkey = '';
            peer_npub = '';
            peer_lnaddress = '';
            peer_url = '';
            Swal.fire({
                allowOutsideClick: false,
                allowEscapeKey: false,
                background: swalBackground,
                title: 'Set Name or Lightning Address',
                inputValue: peer_name,
                input: 'text',
                inputAttributes: {
                    maxlength: 30,
                    autocapitalize: 'off',
                    autocorrect: 'off',
                    placeholder: peer_name,
                },
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true,
                reverseButtons: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                preConfirm: async (name) => {
                    peer_name = name;
                    window.localStorage.peer_name = name;
                    isValidLightningAddress(peer_name).then((isValid) => {
                        if (isValid) {
                            console.log(`${peer_name} is a valid Lightning Address.`);
                            peer_lnaddress = peer_name;
                            window.localStorage.peer_lnaddress = peer_name;
                        } else {
                            console.log(`${peer_name} is not a valid Lightning Address.`);
                        }
                    });
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('nostrLogin: user confirmed');
                    clearInterval(checkInterval);
                    console.log('.... clear check interval NOW ....');

                    setTimeout(function () {
                        show(loadingDiv);
                        initClient();
                        console.log('init client.......');
                    }, 200);
                } else {
                    console.log('Random Name: user canceled');
                    openURL('/');
                }
            });
        } else {
            console.log('nostrLogin: user canceled');
            openURL('/');
        }
    });

    console.log('NostrLogin - Logged in status : ', loggedIn);
}

function continueNostrLogin(type) {
    let info = '';
    let exitinfo = '';
    if (type === 'priorlocalStorage') {
        info = 'Using cached local data';
        exitinfo = ' and Flush';
    } else if (type === 'nostr') {
        info = 'Logged in with Nostr';
    }
    console.log('0.2.00 ----> Continue Nostr Login');

    Swal.fire({
        background: swalBackground,
        title: 'Hello ' + peer_name,
        text: info,
        imageUrl: peer_url || '', // only if peer_url is not null
        imageWidth: 100,
        imageHeight: 100,
        reverseButtons: true,
        confirmButtonText: "OK, Let's Go",
        confirmButtonColor: '#228B22', //"#32CD32",
        cancelButtonText: 'Exit' + exitinfo,
        cancelButtonColor: '#d33',
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            console.log('nostrLogin: user confirmed');
            // clearInterval(checkInterval);
            setTimeout(function () {
                show(loadingDiv);
                initClient();
                console.log('init client.......');
            }, 200);
        } else {
            // flush all old local data
            const keysToRemove = ['peer_name', 'peer_lnaddress', 'peer_npub', 'peer_pubkey', 'peer_url', 'peer_uuid'];
            keysToRemove.forEach((key) => {
                window.localStorage.removeItem(key);
            });
            console.log('nostrLogin: user canceled');
            openURL('/');
        }
    });
}

function initClient() {
    console.log('Starting InitClient() sequence .....');
    setTheme();

    // Transcription
    transcription = new Transcription();
    transcription.init();

    if (!DetectRTC.isMobileDevice) {
        refreshMainButtonsToolTipPlacement();
        setTippy('closeEmojiPickerContainer', 'Close', 'bottom');
        setTippy('mySettingsCloseBtn', 'Close', 'bottom');
        setTippy(
            'switchPushToTalk',
            'If Active, When SpaceBar keydown the microphone will be resumed, on keyup will be paused, like a walkie-talkie.',
            'right',
        );
        setTippy('lobbyAcceptAllBtn', 'Accept', 'top');
        setTippy('lobbyRejectAllBtn', 'Reject', 'top');
        setTippy(
            'switchBroadcasting',
            'Broadcasting is the dissemination of audio or video content to a large audience (one to many)',
            'right',
        );
        setTippy(
            'switchLobby',
            'Lobby mode lets you protect your meeting by only allowing people to enter after a formal approval by a moderator',
            'right',
        );
        setTippy('initVideoAudioRefreshButton', 'Refresh audio/video devices', 'top');
        setTippy('switchPitchBar', 'Toggle audio pitch bar', 'right');
        setTippy('switchSounds', 'Toggle the sounds notifications', 'right');
        setTippy('switchShare', "Show 'Share Room' popup on join", 'right');
        setTippy('roomId', 'Room name (click to copy)', 'right');
        setTippy('sessionTime', 'Session time', 'right');
        setTippy('recordingImage', 'Toggle recording', 'right');
        setTippy(
            'switchHostOnlyRecording',
            'Only the host (presenter) has the capability to record the meeting',
            'right',
        );
        setTippy(
            'switchH264Recording',
            'Prioritize h.264 with AAC or h.264 with Opus codecs over VP8 with Opus or VP9 with Opus codecs',
            'right',
        );
        setTippy('refreshVideoFiles', 'Refresh', 'left');
        setTippy('switchServerRecording', 'The recording will be stored on the server rather than locally', 'right');
        setTippy('whiteboardGhostButton', 'Toggle transparent background', 'bottom');
        setTippy('whiteboardGridBtn', 'Toggle whiteboard grid', 'bottom');
        setTippy('wbBackgroundColorEl', 'Background color', 'bottom');
        setTippy('wbDrawingColorEl', 'Drawing color', 'bottom');
        setTippy('whiteboardPencilBtn', 'Drawing mode', 'bottom');
        setTippy('whiteboardObjectBtn', 'Object mode', 'bottom');
        setTippy('whiteboardUndoBtn', 'Undo', 'bottom');
        setTippy('whiteboardRedoBtn', 'Redo', 'bottom');
        setTippy('whiteboardLockBtn', 'Toggle Lock whiteboard', 'right');
        setTippy('whiteboardUnlockBtn', 'Toggle Lock whiteboard', 'right');
        setTippy('whiteboardCloseBtn', 'Close', 'right');
        setTippy('chatCleanTextButton', 'Clean', 'top');
        setTippy('chatPasteButton', 'Paste', 'top');
        setTippy('chatSendButton', 'Send', 'top');
        setTippy('showChatOnMsg', 'Show chat on new message comes', 'bottom');
        setTippy('speechIncomingMsg', 'Speech the incoming messages', 'bottom');
        setTippy('chatSpeechStartButton', 'Start speech recognition', 'top');
        setTippy('chatSpeechStopButton', 'Stop speech recognition', 'top');
        setTippy('chatEmojiButton', 'Emoji', 'top');
        setTippy('chatMarkdownButton', 'Markdown', 'top');
        setTippy('chatCloseButton', 'Close', 'bottom');
        setTippy('chatTogglePin', 'Toggle pin', 'bottom');
        setTippy('chatHideParticipantsList', 'Hide', 'bottom');
        setTippy('chatShowParticipantsList', 'Toggle participants list', 'bottom');
        setTippy('chatMaxButton', 'Maximize', 'bottom');
        setTippy('chatMinButton', 'Minimize', 'bottom');
        setTippy('pollTogglePin', 'Toggle pin', 'bottom');
        setTippy('pollMaxButton', 'Maximize', 'bottom');
        setTippy('pollMinButton', 'Minimize', 'bottom');
        setTippy('pollSaveButton', 'Save results', 'bottom');
        setTippy('pollCloseBtn', 'Close', 'bottom');
        setTippy('editorLockBtn', 'Toggle Lock editor', 'bottom');
        setTippy('editorUnlockBtn', 'Toggle Lock editor', 'bottom');
        setTippy('editorTogglePin', 'Toggle pin', 'bottom');
        setTippy('editorUndoBtn', 'Undo', 'bottom');
        setTippy('editorRedoBtn', 'Redo', 'bottom');
        setTippy('editorCopyBtn', 'Copy', 'bottom');
        setTippy('editorSaveBtn', 'Save', 'bottom');
        setTippy('editorCloseBtn', 'Close', 'bottom');
        setTippy('editorCleanBtn', 'Clean', 'bottom');
        setTippy('pollAddOptionBtn', 'Add option', 'top');
        setTippy('pollDelOptionBtn', 'Delete option', 'top');
        setTippy('participantsSaveBtn', 'Save participants info', 'bottom');
        setTippy('participantsRaiseHandBtn', 'Toggle raise hands', 'bottom');
        setTippy('participantsUnreadMessagesBtn', 'Toggle unread messages', 'bottom');
        setTippy('transcriptionCloseBtn', 'Close', 'bottom');
        setTippy('transcriptionTogglePinBtn', 'Toggle pin', 'bottom');
        setTippy('transcriptionMaxBtn', 'Maximize', 'bottom');
        setTippy('transcriptionMinBtn', 'Minimize', 'bottom');
        setTippy('transcriptionSpeechStatus', 'Status', 'bottom');
        setTippy('transcriptShowOnMsg', 'Show transcript on new message comes', 'bottom');
        setTippy('transcriptionSpeechStart', 'Start transcription', 'top');
        setTippy('transcriptionSpeechStop', 'Stop transcription', 'top');
    }
    setupWhiteboard();
    initEnumerateDevices();
    setupInitButtons();
}

// ####################################################
// HANDLE MAIN BUTTONS TOOLTIP
// ####################################################

function refreshMainButtonsToolTipPlacement() {
    if (!DetectRTC.isMobileDevice) {
        //
        const position = BtnsBarPosition.options[BtnsBarPosition.selectedIndex].value;
        const placement = position == 'vertical' ? 'right' : 'top';
        const bPlacement = position == 'vertical' ? 'top' : 'right';

        // Control buttons
        setTippy('shareButton', 'Share room', placement);
        setTippy('startRecButton', 'Start recording', placement);
        setTippy('stopRecButton', 'Stop recording', placement);
        setTippy('emojiRoomButton', 'Toggle emoji reaction', placement);
        setTippy('chatButton', 'Toggle the chat', placement);
        setTippy('pollButton', 'Toggle the poll', placement);
        setTippy('editorButton', 'Toggle the editor', placement);
        setTippy('transcriptionButton', 'Toggle transcription', placement);
        setTippy('whiteboardButton', 'Toggle the whiteboard', placement);
        setTippy('snapshotRoomButton', 'Snapshot screen, window, or tab', placement);
        setTippy('settingsButton', 'Toggle the settings', placement);
        setTippy('aboutButton', 'About this project', placement);

        // Bottom buttons
        setTippy('startAudioButton', 'Start the audio', bPlacement);
        setTippy('stopAudioButton', 'Stop the audio', bPlacement);
        setTippy('startVideoButton', 'Start the video', bPlacement);
        setTippy('stopVideoButton', 'Stop the video', bPlacement);
        setTippy('swapCameraButton', 'Swap the camera', bPlacement);
        setTippy('hideMeButton', 'Toggle hide self view', bPlacement);
        setTippy('startScreenButton', 'Start screen share', bPlacement);
        setTippy('stopScreenButton', 'Stop screen share', bPlacement);
        setTippy('raiseHandButton', 'Raise your hand', bPlacement);
        setTippy('lowerHandButton', 'Lower your hand', bPlacement);
        setTippy('exitButton', 'Leave room', bPlacement);
    }
}

// ####################################################
// HANDLE TOOLTIP
// ####################################################

function setTippy(elem, content, placement, allowHTML = false) {
    const element = document.getElementById(elem);
    if (element) {
        if (element._tippy) {
            element._tippy.destroy();
        }
        try {
            tippy(element, {
                content: content,
                placement: placement,
                allowHTML: allowHTML,
            });
        } catch (err) {
            console.error('setTippy error', err.message);
        }
    } else {
        console.warn('setTippy element not found with content', content);
    }
}

// ####################################################
// GET ROOM ID
// ####################################################

function getRoomId() {
    let qs = new URLSearchParams(window.location.search);
    let queryRoomId = filterXSS(qs.get('room'));
    let roomId = queryRoomId ? queryRoomId : location.pathname.substring(6);
    if (roomId == '') {
        roomId = makeId(12);
    }
    console.log('Direct join', { room: roomId });
    window.localStorage.lastRoom = roomId;
    return roomId;
}

function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// ####################################################
// INIT ROOM
// ####################################################

async function initRoom() {
    if (!isAudioAllowed && !isVideoAllowed && !joinRoomWithoutAudioVideo) {
        openURL(`/permission?room_id=${room_id}&message=Not allowed both Audio and Video`);
    } else {
        setButtonsInit();
        handleSelectsInit();
        await whoAreYou();
        await setSelectsInit();
    }
}

// ####################################################
// ENUMERATE DEVICES
// ####################################################

async function initEnumerateDevices() {
    console.log('01 ----> init Enumerate Devices');
    await initEnumerateVideoDevices();
    await initEnumerateAudioDevices();
    await initRoom();
}

async function refreshMyAudioVideoDevices() {
    await refreshMyVideoDevices();
    await refreshMyAudioDevices();
}

async function refreshMyVideoDevices() {
    if (!isVideoAllowed) return;
    const initVideoSelectIndex = initVideoSelect ? initVideoSelect.selectedIndex : 0;
    const videoSelectIndex = videoSelect ? videoSelect.selectedIndex : 0;
    await initEnumerateVideoDevices();
    if (initVideoSelect) initVideoSelect.selectedIndex = initVideoSelectIndex;
    if (videoSelect) videoSelect.selectedIndex = videoSelectIndex;
}

async function refreshMyAudioDevices() {
    if (!isAudioAllowed) return;
    const initMicrophoneSelectIndex = initMicrophoneSelect ? initMicrophoneSelect.selectedIndex : 0;
    const initSpeakerSelectIndex = initSpeakerSelect ? initSpeakerSelect.selectedIndex : 0;
    const microphoneSelectIndex = microphoneSelect ? microphoneSelect.selectedIndex : 0;
    const speakerSelectIndex = speakerSelect ? speakerSelect.selectedIndex : 0;
    await initEnumerateAudioDevices();
    if (initMicrophoneSelect) initMicrophoneSelect.selectedIndex = initMicrophoneSelectIndex;
    if (initSpeakerSelect) initSpeakerSelect.selectedIndex = initSpeakerSelectIndex;
    if (microphoneSelect) microphoneSelect.selectedIndex = microphoneSelectIndex;
    if (speakerSelect) speakerSelect.selectedIndex = speakerSelectIndex;
}

async function initEnumerateVideoDevices() {
    // allow the video
    await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(async (stream) => {
            await enumerateVideoDevices(stream);
            isVideoAllowed = true;
        })
        .catch(() => {
            isVideoAllowed = false;
        });
}

async function enumerateVideoDevices(stream) {
    console.log('02 ----> Get Video Devices');

    if (videoSelect) videoSelect.innerHTML = '';
    if (initVideoSelect) initVideoSelect.innerHTML = '';

    await navigator.mediaDevices
        .enumerateDevices()
        .then((devices) =>
            devices.forEach(async (device) => {
                let el,
                    eli = null;
                if ('videoinput' === device.kind) {
                    if (videoSelect) el = videoSelect;
                    if (initVideoSelect) eli = initVideoSelect;
                    lS.DEVICES_COUNT.video++;
                }
                if (!el) return;
                await addChild(device, [el, eli]);
            }),
        )
        .then(async () => {
            await stopTracks(stream);
            isEnumerateVideoDevices = true;
        });
}

async function initEnumerateAudioDevices() {
    // allow the audio
    await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(async (stream) => {
            await enumerateAudioDevices(stream);
            await getMicrophoneVolumeIndicator(stream);
            isAudioAllowed = true;
        })
        .catch(() => {
            isAudioAllowed = false;
        });
}

async function enumerateAudioDevices(stream) {
    console.log('03 ----> Get Audio Devices');

    if (microphoneSelect) microphoneSelect.innerHTML = '';
    if (initMicrophoneSelect) initMicrophoneSelect.innerHTML = '';

    if (speakerSelect) speakerSelect.innerHTML = '';
    if (initSpeakerSelect) initSpeakerSelect.innerHTML = '';

    await navigator.mediaDevices
        .enumerateDevices()
        .then((devices) =>
            devices.forEach(async (device) => {
                let el,
                    eli = null;
                if ('audioinput' === device.kind) {
                    if (microphoneSelect) el = microphoneSelect;
                    if (initMicrophoneSelect) eli = initMicrophoneSelect;
                    lS.DEVICES_COUNT.audio++;
                } else if ('audiooutput' === device.kind) {
                    if (speakerSelect) el = speakerSelect;
                    if (initSpeakerSelect) eli = initSpeakerSelect;
                    lS.DEVICES_COUNT.speaker++;
                }
                if (!el) return;
                await addChild(device, [el, eli]);
            }),
        )
        .then(async () => {
            await stopTracks(stream);
            isEnumerateAudioDevices = true;
            speakerSelect.disabled = !sinkId;
            // Check if there is speakers
            if (!sinkId || initSpeakerSelect.options.length === 0) {
                hide(initSpeakerSelect);
                hide(speakerSelectDiv);
            }
        });
}

async function stopTracks(stream) {
    stream.getTracks().forEach((track) => {
        track.stop();
    });
}

async function addChild(device, els) {
    let kind = device.kind;
    els.forEach((el) => {
        let option = document.createElement('option');
        option.value = device.deviceId;
        switch (kind) {
            case 'videoinput':
                option.innerText = `📹 ` + device.label || `📹 camera ${el.length + 1}`;
                break;
            case 'audioinput':
                option.innerText = `🎤 ` + device.label || `🎤 microphone ${el.length + 1}`;
                break;
            case 'audiooutput':
                option.innerText = `🔈 ` + device.label || `🔈 speaker ${el.length + 1}`;
                break;
            default:
                break;
        }
        el.appendChild(option);
    });
}

// ####################################################
// INIT AUDIO/VIDEO/SCREEN BUTTONS
// ####################################################

function setupInitButtons() {
    initVideoAudioRefreshButton.onclick = () => {
        refreshMyAudioVideoDevices();
    };
    initVideoButton.onclick = () => {
        handleVideo();
    };
    initAudioButton.onclick = () => {
        handleAudio();
    };
    initAudioVideoButton.onclick = async (e) => {
        await handleAudioVideo(e);
    };
    initStartScreenButton.onclick = async () => {
        await toggleScreenSharing();
    };
    initStopScreenButton.onclick = async () => {
        await toggleScreenSharing();
    };
}

// ####################################################
// MICROPHONE VOLUME INDICATOR
// ####################################################

async function getMicrophoneVolumeIndicator(stream) {
    if (isAudioContextSupported() && hasAudioTrack(stream)) {
        stopMicrophoneProcessing();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const microphone = audioContext.createMediaStreamSource(stream);
        scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1);
        scriptProcessor.onaudioprocess = function (event) {
            const inputBuffer = event.inputBuffer.getChannelData(0);
            let sum = 0;
            for (let i = 0; i < inputBuffer.length; i++) {
                sum += inputBuffer[i] * inputBuffer[i];
            }
            const rms = Math.sqrt(sum / inputBuffer.length);
            const volume = Math.max(0, Math.min(1, rms * 10));
            updateVolumeIndicator(volume);
        };
        microphone.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
    }
}

function stopMicrophoneProcessing() {
    if (scriptProcessor) {
        scriptProcessor.disconnect();
        scriptProcessor = null;
    }
    bars.forEach((bar) => {
        bar.classList.toggle('inactive');
    });
}

function updateVolumeIndicator(volume) {
    const activeBars = Math.ceil(volume * bars.length);
    bars.forEach((bar, index) => {
        bar.classList.toggle('active', index < activeBars);
    });
}

function isAudioContextSupported() {
    return !!(window.AudioContext || window.webkitAudioContext);
}

function hasAudioTrack(mediaStream) {
    const audioTracks = mediaStream.getAudioTracks();
    return audioTracks.length > 0;
}

function hasVideoTrack(mediaStream) {
    const videoTracks = mediaStream.getVideoTracks();
    return videoTracks.length > 0;
}

// ####################################################
// API CHECK
// ####################################################

function getScreen() {
    let qs = new URLSearchParams(window.location.search);
    let screen = filterXSS(qs.get('screen'));
    if (screen) {
        screen = screen.toLowerCase();
        let queryScreen = screen === '1' || screen === 'true';
        if (queryScreen != null && (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia)) {
            console.log('Direct join', { screen: queryScreen });
            return queryScreen;
        }
    }
    console.log('Direct join', { screen: false });
    return false;
}

function getNotify() {
    let qs = new URLSearchParams(window.location.search);
    let notify = filterXSS(qs.get('notify'));
    if (notify) {
        notify = notify.toLowerCase();
        let queryNotify = notify === '1' || notify === 'true';
        if (queryNotify != null) {
            console.log('Direct join', { notify: queryNotify });
            return queryNotify;
        }
    }
    notify = localStorageSettings.share_on_join;
    console.log('Direct join', { notify: notify });
    return notify;
}

function getHideMeActive() {
    let qs = new URLSearchParams(window.location.search);
    let hide = filterXSS(qs.get('hide'));
    let queryHideMe = false;
    if (hide) {
        hide = hide.toLowerCase();
        queryHideMe = hide === '1' || hide === 'true';
    }
    console.log('Direct join', { hide: queryHideMe });
    return queryHideMe;
}

function isPeerPresenter() {
    let qs = new URLSearchParams(window.location.search);
    let presenter = filterXSS(qs.get('isPresenter'));
    if (presenter) {
        presenter = presenter.toLowerCase();
        let queryPresenter = presenter === '1' || presenter === 'true';
        if (queryPresenter != null) {
            console.log('Direct join Reconnect', { isPresenter: queryPresenter });
            return queryPresenter;
        }
    }
    console.log('Direct join Reconnect', { presenter: false });
    return false;
}

function getPeerName() {
    const qs = new URLSearchParams(window.location.search);
    const name = filterXSS(qs.get('name'));
    if (isHtml(name)) {
        console.log('Direct join', { name: 'Invalid name' });
        return 'Invalid name';
    }
    console.log('Direct join', { name: name });
    return name;
}

function getPeerUUID() {
    if (lS.getItemLocalStorage('peer_uuid')) {
        return lS.getItemLocalStorage('peer_uuid');
    }
    const peer_uuid = getUUID();
    lS.setItemLocalStorage('peer_uuid', peer_uuid);
    return peer_uuid;
}

function getPeerToken() {
    if (window.sessionStorage.peer_token) return window.sessionStorage.peer_token;
    let qs = new URLSearchParams(window.location.search);
    let token = filterXSS(qs.get('token'));
    let queryToken = false;
    if (token) {
        queryToken = token;
    }
    console.log('Direct join', { token: queryToken });
    return queryToken;
}

function getRoomPassword() {
    let qs = new URLSearchParams(window.location.search);
    let roomPassword = filterXSS(qs.get('roomPassword'));
    if (roomPassword) {
        let queryNoRoomPassword = roomPassword === '0' || roomPassword === 'false';
        if (queryNoRoomPassword) {
            roomPassword = false;
        }
        console.log('Direct join', { password: roomPassword });
        return roomPassword;
    }
    return false;
}

// ####################################################
// INIT CONFIG
// ####################################################

async function checkInitConfig() {
    const localStorageInitConfig = lS.getLocalStorageInitConfig();
    console.log('04.5 ----> Get init config', localStorageInitConfig);
    if (localStorageInitConfig) {
        if (isAudioVideoAllowed && !localStorageInitConfig.audioVideo) {
            await handleAudioVideo();
        } else {
            if (isAudioAllowed && !localStorageInitConfig.audio) handleAudio();
            if (isVideoAllowed && !localStorageInitConfig.video) handleVideo();
        }
    }
}

// ####################################################
// SOME PEER INFO
// ####################################################

function getPeerInfo() {
    peer_info = {
        join_data_time: getDataTimeString(),
        peer_uuid: peer_uuid,
        peer_id: socket.id,
        peer_name: peer_name,
        peer_pubkey: peer_pubkey,
        peer_npub: peer_npub,
        peer_lnaddress: peer_lnaddress,
        peer_url: peer_url,
        peer_token: peer_token,
        peer_presenter: isPresenter,
        peer_audio: isAudioAllowed,
        peer_video: isVideoAllowed,
        peer_screen: isScreenAllowed,
        peer_recording: isRecording,
        peer_video_privacy: isVideoPrivacyActive,
        peer_hand: false,
        is_desktop_device: !DetectRTC.isMobileDevice && !isTabletDevice && !isIPadDevice,
        is_mobile_device: DetectRTC.isMobileDevice,
        is_tablet_device: isTabletDevice,
        is_ipad_pro_device: isIPadDevice,
        os_name: DetectRTC.osName,
        os_version: DetectRTC.osVersion,
        browser_name: DetectRTC.browser.name,
        browser_version: DetectRTC.browser.version,
        user_agent: userAgent,
    };
}

function getInfo() {
    const parser = new UAParser(userAgent);

    try {
        const parserResult = parser.getResult();
        console.log('Info', parserResult);

        // Filter out properties with 'Unknown' values
        const filterUnknown = (obj) => {
            const filtered = {};
            for (const [key, value] of Object.entries(obj)) {
                if (value && value !== 'Unknown') {
                    filtered[key] = value;
                }
            }
            return filtered;
        };

        const filteredResult = {
            //ua: parserResult.ua,
            browser: filterUnknown(parserResult.browser),
            cpu: filterUnknown(parserResult.cpu),
            device: filterUnknown(parserResult.device),
            engine: filterUnknown(parserResult.engine),
            os: filterUnknown(parserResult.os),
        };

        // Convert the filtered result to a readable JSON string
        const resultString = JSON.stringify(filteredResult, null, 2);

        extraInfo.innerText = resultString;

        return parserResult;
    } catch (error) {
        console.error('Error parsing user agent:', error);
    }
}

// ####################################################
// ENTER YOUR NAME | Enable/Disable AUDIO/VIDEO
// ####################################################

async function whoAreYou() {
    console.log('04 ----> Who are you?');

    hide(loadingDiv);
    document.body.style.background = 'var(--body-bg)';

    try {
        const response = await axios.get('/config', {
            timeout: 5000,
        });
        const serverButtons = response.data.message;
        if (serverButtons) {
            BUTTONS = serverButtons;
            console.log('04 ----> AXIOS ROOM BUTTONS SETTINGS', {
                serverButtons: serverButtons,
                clientButtons: BUTTONS,
            });
        }
    } catch (error) {
        console.error('04 ----> AXIOS GET CONFIG ERROR', error.message);
    }

    if (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia) {
        BUTTONS.main.startScreenButton && show(initStartScreenButton);
    }

    if (peer_name) {
        checkMedia();
        getPeerInfo();
        joinRoom(peer_name, room_id);
        return;
    }

    let default_name = window.localStorage.peer_name ? window.localStorage.peer_name : '';
    if (getCookie(room_id + '_name')) {
        default_name = getCookie(room_id + '_name');
    }

    if (!BUTTONS.main.startVideoButton) {
        isVideoAllowed = false;
        elemDisplay('initVideo', false);
        elemDisplay('initVideoButton', false);
        elemDisplay('initAudioVideoButton', false);
        elemDisplay('initVideoAudioRefreshButton', false);
        elemDisplay('initVideoSelect', false);
        elemDisplay('tabVideoDevicesBtn', false);
        initVideoContainerShow(false);
    }
    if (!BUTTONS.main.startAudioButton) {
        isAudioAllowed = false;
        elemDisplay('initAudioButton', false);
        elemDisplay('initAudioVideoButton', false);
        elemDisplay('initVideoAudioRefreshButton', false);
        elemDisplay('initMicrophoneSelect', false);
        elemDisplay('initSpeakerSelect', false);
        elemDisplay('tabAudioDevicesBtn', false);
    }
    if (!BUTTONS.main.startScreenButton) {
        hide(initStartScreenButton);
    }

    initUser.classList.toggle('hidden');

    Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: swalBackground,
        title: BRAND.app.name,
        input: 'text',
        inputPlaceholder: 'Enter your email or name',
        inputAttributes: { maxlength: 32 },
        inputValue: default_name,
        html: initUser, // Inject HTML
        confirmButtonText: `Lets Go!`,
        customClass: { popup: 'init-modal-size' },
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        inputValidator: (name) => {
            if (!name) return 'Please enter your email or name';
            if (name.length > 30) return 'Name must be max 30 char';
            name = filterXSS(name);
            if (isHtml(name)) return 'Invalid name!';
            if (!getCookie(room_id + '_name')) {
                window.localStorage.peer_name = name;
            }
            // TODO - deal with cookies on leave room
            setCookie(room_id + '_name', name, 30);
            peer_name = name;
        },
    }).then(async () => {
        if (initStream && !joinRoomWithScreen) {
            await stopTracks(initStream);
            elemDisplay('initVideo', false);
            initVideoContainerShow(false);
        }
        getPeerInfo();
        joinRoom(peer_name, room_id);
    });

    if (!isVideoAllowed) {
        elemDisplay('initVideo', false);
        initVideoContainerShow(false);
        hide(initVideoSelect);
    }
    if (!isAudioAllowed) {
        hide(initMicrophoneSelect);
        hide(initSpeakerSelect);
    }
}

function handleAudio() {
    isAudioAllowed = isAudioAllowed ? false : true;
    initAudioButton.className = 'fas fa-microphone' + (isAudioAllowed ? '' : '-slash');
    setColor(initAudioButton, isAudioAllowed ? 'white' : 'red');
    setColor(startAudioButton, isAudioAllowed ? 'white' : 'red');
    checkInitAudio(isAudioAllowed);
    lS.setInitConfig(lS.MEDIA_TYPE.audio, isAudioAllowed);
}

function handleVideo() {
    isVideoAllowed = isVideoAllowed ? false : true;
    initVideoButton.className = 'fas fa-video' + (isVideoAllowed ? '' : '-slash');
    setColor(initVideoButton, isVideoAllowed ? 'white' : 'red');
    setColor(startVideoButton, isVideoAllowed ? 'white' : 'red');
    checkInitVideo(isVideoAllowed);
    lS.setInitConfig(lS.MEDIA_TYPE.video, isVideoAllowed);
}

async function handleAudioVideo() {
    isAudioVideoAllowed = isAudioVideoAllowed ? false : true;
    isAudioAllowed = isAudioVideoAllowed;
    isVideoAllowed = isAudioVideoAllowed;
    lS.setInitConfig(lS.MEDIA_TYPE.audio, isAudioVideoAllowed);
    lS.setInitConfig(lS.MEDIA_TYPE.video, isAudioVideoAllowed);
    lS.setInitConfig(lS.MEDIA_TYPE.audioVideo, isAudioVideoAllowed);
    initAudioButton.className = 'fas fa-microphone' + (isAudioVideoAllowed ? '' : '-slash');
    initVideoButton.className = 'fas fa-video' + (isAudioVideoAllowed ? '' : '-slash');
    initAudioVideoButton.className = 'fas fa-eye' + (isAudioVideoAllowed ? '' : '-slash');
    if (!isAudioVideoAllowed) {
        hide(initAudioButton);
        hide(initVideoButton);
        hide(initVideoAudioRefreshButton);
    }
    if (isAudioAllowed && isVideoAllowed && !DetectRTC.isMobileDevice) show(initVideoAudioRefreshButton);
    setColor(initAudioVideoButton, isAudioVideoAllowed ? 'white' : 'red');
    setColor(initAudioButton, isAudioAllowed ? 'white' : 'red');
    setColor(initVideoButton, isVideoAllowed ? 'white' : 'red');
    setColor(startAudioButton, isAudioAllowed ? 'white' : 'red');
    setColor(startVideoButton, isVideoAllowed ? 'white' : 'red');
    await checkInitVideo(isVideoAllowed);
    checkInitAudio(isAudioAllowed);
}

async function checkInitVideo(isVideoAllowed) {
    if (isVideoAllowed && BUTTONS.main.startVideoButton) {
        if (initVideoSelect.value) {
            initVideoContainerShow();
            await changeCamera(initVideoSelect.value);
        }
        sound('joined');
    } else {
        if (initStream) {
            stopTracks(initStream);
            elemDisplay('initVideo', false);
            initVideoContainerShow(false);
            sound('left');
        }
    }
    initVideoSelect.disabled = !isVideoAllowed;
}

function checkInitAudio(isAudioAllowed) {
    initMicrophoneSelect.disabled = !isAudioAllowed;
    initSpeakerSelect.disabled = !isAudioAllowed;
    isAudioAllowed ? sound('joined') : sound('left');
}

function initVideoContainerShow(show = true) {
    initVideoContainerClass.style.width = show ? '100%' : 'auto';
}

function checkMedia() {
    let qs = new URLSearchParams(window.location.search);
    let audio = filterXSS(qs.get('audio'));
    let video = filterXSS(qs.get('video'));
    if (audio) {
        audio = audio.toLowerCase();
        let queryPeerAudio = audio === '1' || audio === 'true';
        if (queryPeerAudio != null) isAudioAllowed = queryPeerAudio;
    }
    if (video) {
        video = video.toLowerCase();
        let queryPeerVideo = video === '1' || video === 'true';
        if (queryPeerVideo != null) isVideoAllowed = queryPeerVideo;
    }
    // elemDisplay('tabVideoDevicesBtn', isVideoAllowed);
    // elemDisplay('tabAudioDevicesBtn', isAudioAllowed);

    console.log('Direct join', {
        audio: isAudioAllowed,
        video: isVideoAllowed,
    });
}

async function signSampleEvent(publicKey) {
    try {
        // Create an event and sign it to make sure user is who they say they are.
        // also useful if they want to blast a note out to their relays
        const event = {
            kind: 27235,
            pubkey: publicKey,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: "Hi I'm using \n #HiveTalk",
        };
        console.log('Kind 1 - Event created', event);
        // Request the nos2x extension to sign the event
        const signedEvent = await window.nostr.signEvent(event);
        console.log('Signed Event:', signedEvent);
        const eventID = signedEvent['id'];
        console.log('Event ID', eventID);
    } catch (error) {
        console.error('An error occurred while sending Sample Event', error);
        // fail silently
    }
}

// ####################################################
// SHARE ROOM ON NOSTR - initial scaffolding
// ####################################################

// 1. create an event and sign and post to relays
// 2. assume preferred relays are captured, else post to default relays

async function sendEvent(textNote, publicKey) {
    try {
        let hiveRelays = ['wss://hivetalk.nostr1.com'];
        const relays = [...hiveRelays, ...defaultRelays];
        //const relays = [...hiveRelays]

        // Create an event
        const event = {
            kind: 1,
            pubkey: publicKey,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: textNote + '\n Live Now in #HiveTalk',
        };
        console.log('Kind 1 - Event created', event);
        // Request the nos2x extension to sign the event
        const signedEvent = await window.nostr.signEvent(event);
        console.log('Signed Event:', signedEvent);
        const eventID = signedEvent['id'];
        console.log('Event ID', eventID);

        // Create a pool and publish the event
        const pool = new window.NostrTools.SimplePool();
        await Promise.any(pool.publish(relays, signedEvent));
        console.log('Published to at least one relay!');

        // Subscribe to all user events, log the one we just published
        const h = pool.subscribeMany(
            [...relays],
            [
                {
                    authors: [publicKey],
                },
            ],
            {
                onevent(event) {
                    if (event.id === eventID) {
                        console.log('Event received:', event);
                        Swal.fire({
                            background: swalBackground,
                            position: 'center',
                            icon: 'success',
                            title: 'Note Sent',
                            html: `<p>Sent to Nostr successfully!</p> <p>Note: <a href="https://snort.social/e/${eventID}" target="_blank">${eventID}</a></p>`,
                        });
                    }
                },
                oneose() {
                    h.close();
                },
            },
        );
    } catch (error) {
        console.error('An error occurred:', error);
        Swal.fire({
            background: swalBackground,
            position: 'center',
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong posting to Nostr! Try again?',
        });
    }
}

async function shareRoomOnNostr(pubkey) {
    share(pubkey);
    function share(pubkey) {
        sound('open');
        try {
            let textNote = '';
            Swal.fire({
                background: swalBackground,
                // position: 'center',
                title: 'Share on Nostr',
                input: 'textarea',
                inputValue: `We're having a party in here!  ${RoomURL} `,
                inputAutoTrim: true,
                html: `
                <p style="background:transparent; color:rgb(8, 189, 89);">${RoomURL}</p>
                <p>Share a note about this room. Text and Links only. No Markdown or HTML. (Kind 1)</p>`,
                reverseButtons: true,
                showCancelButton: true,
                confirmButtonColor: '#8338ec',
                cancelButtonColor: '#d33',
                denyButtonColor: '#3085d6',
                confirmButtonText: 'Post to NOSTR!',
                showDenyButton: true,
                denyButtonText: `Copy URL`,
            }).then((result) => {
                if (result.isConfirmed) {
                    textNote = result.value;
                    console.log('Text', textNote);
                    sendEvent(textNote, pubkey);
                } else if (result.isDenied) {
                    copyRoomURL();
                }
            });
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
}

// ####################################################
// SHARE ROOM
// ####################################################

async function shareRoom(useNavigator = false) {
    if (peer_info.peer_pubkey) {
        console.log('share room on nostr', peer_info.peer_pubkey);
        shareRoomOnNostr(peer_info.peer_pubkey);
    } else {
        if (navigator.share && useNavigator) {
            try {
                await navigator.share({ url: RoomURL });
                userLog('info', 'Room Shared successfully', 'top-end');
            } catch (err) {
                share();
            }
        } else {
            console.log('share room info on button click');
            share();
        }
    }
    function share() {
        sound('open');

        Swal.fire({
            background: swalBackground,
            position: 'center',
            title: 'Share the room',
            html: `
            <div id="qrRoomContainer">
                <canvas id="qrRoom"></canvas>
            </div>
            <br/>
            <p style="background:transparent; color:rgb(8, 189, 89);">Join from your mobile device</p>
            <p style="background:transparent; color:white; font-family: Arial, Helvetica, sans-serif;">No need for apps, simply capture the QR code with your mobile camera Or Invite someone else to join by sending them the following URL</p>
            <p style="background:transparent; color:rgb(8, 189, 89);">${RoomURL}</p>`,
            showDenyButton: false,
            showCancelButton: true,
            cancelButtonColor: 'red',
            confirmButtonText: `Copy URL`,
            cancelButtonText: `Close`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.isConfirmed) {
                copyRoomURL();
            }
            if (isScreenAllowed) {
                rc.shareScreen();
            }
        });
        makeRoomQR();
    }
}

// ####################################################
// ROOM UTILITY
// ####################################################

function isDesktopDevice() {
    return !DetectRTC.isMobileDevice && !isTabletDevice && !isIPadDevice;
}

function makeRoomQR() {
    let qr = new QRious({
        element: document.getElementById('qrRoom'),
        value: RoomURL,
    });
    qr.set({
        size: 256,
    });
}

function copyRoomURL() {
    let tmpInput = document.createElement('input');
    document.body.appendChild(tmpInput);
    tmpInput.value = RoomURL;
    tmpInput.select();
    tmpInput.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(tmpInput.value);
    document.body.removeChild(tmpInput);
    userLog('info', 'Meeting URL copied to clipboard 👍', 'top-end');
}

function copyToClipboard(txt, showTxt = true) {
    let tmpInput = document.createElement('input');
    document.body.appendChild(tmpInput);
    tmpInput.value = txt;
    tmpInput.select();
    tmpInput.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(tmpInput.value);
    document.body.removeChild(tmpInput);
    showTxt
        ? userLog('info', `${txt} copied to clipboard 👍`, 'top-end')
        : userLog('info', `Copied to clipboard 👍`, 'top-end');
}

function shareRoomByEmail() {
    Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: swalBackground,
        imageUrl: image.email,
        position: 'center',
        title: 'Select a Date and Time',
        html: '<input type="text" id="datetimePicker" class="flatpickr" />',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonColor: 'red',
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        preConfirm: () => {
            const newLine = '%0D%0A%0D%0A';
            const selectedDateTime = document.getElementById('datetimePicker').value;
            const roomPassword =
                isRoomLocked && (room_password || rc.RoomPassword)
                    ? 'Password: ' + (room_password || rc.RoomPassword) + newLine
                    : '';
            const email = '';
            const emailSubject = `Please join our ${BRAND.app.name} Video Chat Meeting`;
            const emailBody = `The meeting is scheduled at: ${newLine} DateTime: ${selectedDateTime} ${newLine}${roomPassword}Click to join: ${RoomURL} ${newLine}`;
            document.location = 'mailto:' + email + '?subject=' + emailSubject + '&body=' + emailBody;
        },
    });
    flatpickr('#datetimePicker', {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        time_24hr: true,
    });
}

// ####################################################
// JOIN ROOM
// ####################################################

function joinRoom(peer_name, room_id) {
    if (rc && rc.isConnected()) {
        console.log('Already connected to a room');
    } else {
        console.log('05 ----> join Room ' + room_id);
        roomId.innerText = room_id;
        userName.innerText = peer_name;
        isUserPresenter.innerText = isPresenter;
        rc = new RoomClient(
            localAudio,
            remoteAudios,
            videoMediaContainer,
            videoPinMediaContainer,
            window.mediasoupClient,
            socket,
            room_id,
            peer_name,
            peer_uuid,
            peer_info,
            isAudioAllowed,
            isVideoAllowed,
            isScreenAllowed,
            joinRoomWithScreen,
            isSpeechSynthesisSupported,
            transcription,
            roomIsReady,
        );
        handleRoomClientEvents();
        //notify ? shareRoom() : sound('joined');
    }
}

let boltavatar = 'https://hivetalk.org/images/lnwhitep.png';

function roomIsReady() {
    console.log('06 ----> roomIsReady');
    console.log('Set nostr avatar here in roomIsReady');
    let avatar = peer_info.peer_url;
    console.log('roomIsReady - nostr avatar', avatar);
    // set Nostr Avatar here
    isValidLightningAddress(peer_name).then((isValid) => {
        if (isValid) {
            myProfileAvatar.style.borderRadius = `50px`;
            myProfileAvatar.setAttribute('src', boltavatar);
        } else if (rc.isValidEmail(peer_name)) {
            myProfileAvatar.style.borderRadius = `50px`;
            myProfileAvatar.setAttribute('src', rc.genGravatar(peer_name));
        } else if (avatar) {
            // if nostr avatar is not null
            myProfileAvatar.setAttribute('src', avatar);
        } else {
            myProfileAvatar.setAttribute('src', rc.genAvatarSvg(peer_name, 64));
        }
    });

    BUTTONS.main.exitButton && show(exitButton);
    BUTTONS.main.shareButton && show(shareButton);
    BUTTONS.main.hideMeButton && show(hideMeButton);
    if (BUTTONS.settings.tabRecording) {
        show(startRecButton);
    } else {
        hide(startRecButton);
        hide(tabRecordingBtn);
    }
    BUTTONS.main.chatButton && show(chatButton);
    BUTTONS.main.pollButton && show(pollButton);
    BUTTONS.main.editorButton && show(editorButton);
    BUTTONS.main.raiseHandButton && show(raiseHandButton);
    BUTTONS.main.emojiRoomButton && show(emojiRoomButton);
    !BUTTONS.chat.chatSaveButton && hide(chatSaveButton);
    BUTTONS.chat.chatEmojiButton && show(chatEmojiButton);
    BUTTONS.chat.chatMarkdownButton && show(chatMarkdownButton);

    !BUTTONS.poll.pollSaveButton && hide(pollSaveButton);

    isWebkitSpeechRecognitionSupported && BUTTONS.chat.chatSpeechStartButton
        ? show(chatSpeechStartButton)
        : (BUTTONS.chat.chatSpeechStartButton = false);

    transcription.isSupported() && BUTTONS.main.transcriptionButton
        ? show(transcriptionButton)
        : (BUTTONS.main.transcriptionButton = false);

    show(chatCleanTextButton);
    show(chatPasteButton);
    show(chatSendButton);
    if (isDesktopDevice()) {
        show(whiteboardGridBtn);
    }
    if (DetectRTC.isMobileDevice) {
        hide(initVideoAudioRefreshButton);
        hide(refreshVideoDevices);
        hide(refreshAudioDevices);
        BUTTONS.main.swapCameraButton && show(swapCameraButton);
        rc.chatMaximize();
        hide(chatTogglePin);
        hide(chatMaxButton);
        hide(chatMinButton);
        rc.pollMaximize();
        hide(pollTogglePin);
        hide(editorTogglePin);
        hide(pollMaxButton);
        hide(pollMinButton);
        transcription.maximize();
        hide(transcriptionTogglePinBtn);
        hide(transcriptionMaxBtn);
        hide(transcriptionMinBtn);
    } else {
        rc.makeDraggable(emojiPickerContainer, emojiPickerHeader);
        rc.makeDraggable(chatRoom, chatHeader);
        rc.makeDraggable(pollRoom, pollHeader);
        //rc.makeDraggable(editorRoom, editorHeader);
        rc.makeDraggable(mySettings, mySettingsHeader);
        rc.makeDraggable(whiteboard, whiteboardHeader);
        rc.makeDraggable(sendFileDiv, imgShareSend);
        rc.makeDraggable(receiveFileDiv, imgShareReceive);
        rc.makeDraggable(lobby, lobbyHeader);
        rc.makeDraggable(transcriptionRoom, transcriptionHeader);
        if (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia) {
            if (BUTTONS.main.startScreenButton) {
                show(startScreenButton);
                show(ScreenFpsDiv);
            }
            BUTTONS.main.snapshotRoomButton && show(snapshotRoomButton);
        }
        BUTTONS.chat.chatPinButton && show(chatTogglePin);
        BUTTONS.chat.chatMaxButton && show(chatMaxButton);
        BUTTONS.poll.pollPinButton && show(pollTogglePin);
        show(editorTogglePin);
        BUTTONS.poll.pollMaxButton && show(pollMaxButton);
        BUTTONS.settings.pushToTalk && show(pushToTalkDiv);
        BUTTONS.settings.tabRTMPStreamingBtn &&
            show(tabRTMPStreamingBtn) &&
            show(startRtmpButton) &&
            show(startRtmpURLButton) &&
            show(streamerRtmpButton);
    }
    if (DetectRTC.browser.name != 'Safari') {
        document.onfullscreenchange = () => {
            if (!document.fullscreenElement) rc.isDocumentOnFullScreen = false;
        };
        show(fullScreenButton);
    }
    BUTTONS.main.whiteboardButton && show(whiteboardButton);
    BUTTONS.main.settingsButton && show(settingsButton);
    isAudioAllowed ? show(stopAudioButton) : BUTTONS.main.startAudioButton && show(startAudioButton);
    isVideoAllowed ? show(stopVideoButton) : BUTTONS.main.startVideoButton && show(startVideoButton);
    BUTTONS.settings.fileSharing && show(fileShareButton);
    BUTTONS.settings.lockRoomButton && show(lockRoomButton);
    BUTTONS.settings.broadcastingButton && show(broadcastingButton);
    BUTTONS.settings.lobbyButton && show(lobbyButton);
    BUTTONS.settings.sendEmailInvitation && show(sendEmailInvitation);
    if (rc.recording.recSyncServerRecording) show(roomRecordingServer);
    BUTTONS.main.aboutButton && show(aboutButton);
    if (!DetectRTC.isMobileDevice) show(pinUnpinGridDiv);
    if (!isSpeechSynthesisSupported) hide(speechMsgDiv);
    handleButtons();
    handleSelects();
    handleInputs();
    handleChatEmojiPicker();
    handleRoomEmojiPicker();
    handleEditor();
    loadSettingsFromLocalStorage();
    startSessionTimer();
    document.body.addEventListener('mousemove', (e) => {
        showButtons();
    });
    checkButtonsBar();
    if (room_password) {
        lockRoomButton.click();
    }
}

function elemDisplay(element, display, mode = 'block') {
    const elem = document.getElementById(element);
    elem ? (elem.style.display = display ? mode : 'none') : console.error('elemDisplay not found', element);
}

function hide(elem) {
    if (!elem.classList.contains('hidden')) elem.classList.toggle('hidden');
}

function show(elem) {
    if (elem.classList.contains('hidden')) elem.classList.toggle('hidden');
}

function disable(elem, disabled) {
    elem.disabled = disabled;
}

function setColor(elem, color) {
    elem.style.color = color;
}

// ####################################################
// SESSION TIMER
// ####################################################

function startSessionTimer() {
    sessionTime.style.display = 'inline';
    let callStartTime = Date.now();
    setInterval(function printTime() {
        let callElapsedTime = Date.now() - callStartTime;
        sessionTime.innerText = getTimeToString(callElapsedTime);
    }, 1000);
}

function getTimeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);
    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);
    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);
    let formattedHH = hh.toString().padStart(2, '0');
    let formattedMM = mm.toString().padStart(2, '0');
    let formattedSS = ss.toString().padStart(2, '0');
    return `${formattedHH}:${formattedMM}:${formattedSS}`;
}

// ####################################################
// RECORDING TIMER
// ####################################################

function secondsToHms(d) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);
    let hDisplay = h > 0 ? h + 'h' : '';
    let mDisplay = m > 0 ? m + 'm' : '';
    let sDisplay = s > 0 ? s + 's' : '';
    return hDisplay + ' ' + mDisplay + ' ' + sDisplay;
}

function startRecordingTimer() {
    recElapsedTime = 0;
    recTimer = setInterval(function printTime() {
        if (rc.isRecording()) {
            recElapsedTime++;
            recordingStatus.innerText = secondsToHms(recElapsedTime);
        }
    }, 1000);
}
function stopRecordingTimer() {
    clearInterval(recTimer);
}

// ####################################################
// HTML BUTTONS
// ####################################################

function handleButtons() {
    // Lobby...
    document.getElementById('lobbyUsers').addEventListener('click', function (event) {
        switch (event.target.id) {
            case 'lobbyAcceptAllBtn':
                rc.lobbyAcceptAll();
                break;
            case 'lobbyRejectAllBtn':
                rc.lobbyRejectAll();
                break;
            default:
                break;
        }
    });
    control.onmouseover = () => {
        isButtonsBarOver = true;
    };
    control.onmouseout = () => {
        isButtonsBarOver = false;
    };
    bottomButtons.onmouseover = () => {
        isButtonsBarOver = true;
    };
    bottomButtons.onmouseout = () => {
        isButtonsBarOver = false;
    };
    exitButton.onclick = () => {
        rc.exitRoom();
    };
    shareButton.onclick = () => {
        shareRoom(true);
    };
    hideMeButton.onclick = (e) => {
        if (isHideALLVideosActive) {
            return userLog('warning', 'To use this feature, please toggle video focus mode', 'top-end', 6000);
        }
        isHideMeActive = !isHideMeActive;
        rc.handleHideMe();
    };
    settingsButton.onclick = () => {
        rc.toggleMySettings();
    };
    mySettingsCloseBtn.onclick = () => {
        rc.toggleMySettings();
    };
    tabVideoDevicesBtn.onclick = (e) => {
        rc.openTab(e, 'tabVideoDevices');
    };
    tabAudioDevicesBtn.onclick = (e) => {
        rc.openTab(e, 'tabAudioDevices');
    };
    tabRecordingBtn.onclick = (e) => {
        rc.openTab(e, 'tabRecording');
    };
    tabRoomBtn.onclick = (e) => {
        rc.openTab(e, 'tabRoom');
    };
    tabVideoShareBtn.onclick = (e) => {
        rc.openTab(e, 'tabVideoShare');
    };
    tabRTMPStreamingBtn.onclick = (e) => {
        rc.getRTMP();
        rc.openTab(e, 'tabRTMPStreaming');
    };
    refreshVideoFiles.onclick = () => {
        rc.getRTMP();
        userLog('info', 'Refreshed video files', 'top-end');
    };
    tabAspectBtn.onclick = (e) => {
        rc.openTab(e, 'tabAspect');
    };
    tabModeratorBtn.onclick = (e) => {
        rc.openTab(e, 'tabModerator');
    };
    tabProfileBtn.onclick = (e) => {
        rc.openTab(e, 'tabProfile');
    };
    tabStylingBtn.onclick = (e) => {
        rc.openTab(e, 'tabStyling');
    };
    tabLanguagesBtn.onclick = (e) => {
        rc.openTab(e, 'tabLanguages');
    };
    tabVideoAIBtn.onclick = (e) => {
        rc.openTab(e, 'tabVideoAI');
        rc.getAvatarList();
        rc.getVoiceList();
    };
    avatarVideoAIStart.onclick = (e) => {
        rc.stopSession();
        rc.handleVideoAI();
        rc.toggleMySettings();
    };
    switchAvatars.onchange = (e) => {
        showFreeAvatars = e.currentTarget.checked;
        rc.getAvatarList();
    };
    avatarQuality.onchange = (e) => {
        VideoAI.quality = e.target.value;
    };
    refreshVideoDevices.onclick = async () => {
        await refreshMyVideoDevices();
        userLog('info', 'Refreshed video devices', 'top-end');
    };
    refreshAudioDevices.onclick = async () => {
        await refreshMyAudioDevices();
        userLog('info', 'Refreshed audio devices', 'top-end');
    };
    applyAudioOptionsButton.onclick = () => {
        rc.closeThenProduce(RoomClient.mediaType.audio, microphoneSelect.value);
    };
    speakerTestBtn.onclick = () => {
        sound('ring', true);
    };
    roomId.onclick = () => {
        DetectRTC.isMobileDevice ? shareRoom(true) : copyRoomURL();
    };
    roomSendEmail.onclick = () => {
        shareRoomByEmail();
    };
    chatButton.onclick = () => {
        rc.toggleChat();
        if (DetectRTC.isMobileDevice) {
            rc.toggleShowParticipants();
        }
    };
    // Polls
    pollButton.onclick = () => {
        rc.togglePoll();
    };
    pollMaxButton.onclick = () => {
        rc.pollMaximize();
    };
    pollMinButton.onclick = () => {
        rc.pollMinimize();
    };
    pollCloseBtn.onclick = () => {
        rc.togglePoll();
    };
    pollTogglePin.onclick = () => {
        rc.togglePollPin();
    };
    pollSaveButton.onclick = () => {
        rc.pollSaveResults();
    };
    pollAddOptionBtn.onclick = () => {
        rc.pollAddOptions();
    };
    pollDelOptionBtn.onclick = () => {
        rc.pollDeleteOptions();
    };
    pollCreateForm.onsubmit = (e) => {
        rc.pollCreateNewForm(e);
    };
    editorButton.onclick = () => {
        rc.toggleEditor();
        if (isPresenter && !rc.editorIsLocked()) {
            rc.editorSendAction('open');
        }
    };
    editorCloseBtn.onclick = () => {
        rc.toggleEditor();
        if (isPresenter && !rc.editorIsLocked()) {
            rc.editorSendAction('close');
        }
    };
    editorTogglePin.onclick = () => {
        rc.toggleEditorPin();
    };
    editorLockBtn.onclick = () => {
        rc.toggleLockUnlockEditor();
    };
    editorUnlockBtn.onclick = () => {
        rc.toggleLockUnlockEditor();
    };
    editorCleanBtn.onclick = () => {
        rc.editorClean();
    };
    editorCopyBtn.onclick = () => {
        rc.editorCopy();
    };
    editorSaveBtn.onclick = () => {
        rc.editorSave();
    };
    editorUndoBtn.onclick = () => {
        rc.editorUndo();
    };
    editorRedoBtn.onclick = () => {
        rc.editorRedo();
    };
    transcriptionButton.onclick = () => {
        transcription.toggle();
    };
    transcriptionCloseBtn.onclick = () => {
        transcription.toggle();
    };
    transcriptionTogglePinBtn.onclick = () => {
        transcription.togglePinUnpin();
    };
    transcriptionMaxBtn.onclick = () => {
        transcription.maximize();
    };
    transcriptionMinBtn.onclick = () => {
        transcription.minimize();
    };
    transcriptionGhostBtn.onclick = () => {
        transcription.toggleBg();
    };
    transcriptionSaveBtn.onclick = () => {
        transcription.save();
    };
    transcriptionCleanBtn.onclick = () => {
        transcription.delete();
    };
    chatHideParticipantsList.onclick = (e) => {
        rc.toggleShowParticipants();
    };
    chatShowParticipantsList.onclick = (e) => {
        rc.toggleShowParticipants();
    };
    chatShareRoomBtn.onclick = (e) => {
        shareRoom(true);
    };
    chatGhostButton.onclick = (e) => {
        rc.chatToggleBg();
    };
    chatCleanButton.onclick = () => {
        rc.chatClean();
    };
    chatSaveButton.onclick = () => {
        rc.chatSave();
    };
    chatCloseButton.onclick = () => {
        rc.toggleChat();
    };
    chatTogglePin.onclick = () => {
        rc.toggleChatPin();
    };
    chatMaxButton.onclick = () => {
        rc.chatMaximize();
    };
    chatMinButton.onclick = () => {
        rc.chatMinimize();
    };
    chatCleanTextButton.onclick = () => {
        rc.cleanMessage();
    };
    chatPasteButton.onclick = () => {
        rc.pasteMessage();
    };
    chatSendButton.onclick = () => {
        rc.sendMessage();
    };
    chatEmojiButton.onclick = () => {
        rc.toggleChatEmoji();
    };
    chatMarkdownButton.onclick = () => {
        isChatMarkdownOn = !isChatMarkdownOn;
        setColor(chatMarkdownButton, isChatMarkdownOn ? 'lime' : 'white');
    };
    chatSpeechStartButton.onclick = () => {
        startSpeech();
    };
    chatSpeechStopButton.onclick = () => {
        stopSpeech();
    };
    transcriptionSpeechStart.onclick = () => {
        transcription.start();
    };
    transcriptionSpeechStop.onclick = () => {
        transcription.stop();
    };
    fullScreenButton.onclick = () => {
        rc.toggleFullScreen();
    };
    recordingImage.onclick = () => {
        isRecording ? stopRecButton.click() : startRecButton.click();
    };
    startRecButton.onclick = () => {
        rc.startRecording();
    };
    stopRecButton.onclick = () => {
        rc.stopRecording();
    };
    pauseRecButton.onclick = () => {
        rc.pauseRecording();
    };
    resumeRecButton.onclick = () => {
        rc.resumeRecording();
    };
    swapCameraButton.onclick = () => {
        if (isHideMeActive) rc.handleHideMe();
        rc.closeThenProduce(RoomClient.mediaType.video, null, true);
    };
    raiseHandButton.onclick = () => {
        rc.updatePeerInfo(peer_name, socket.id, 'hand', true);
    };
    lowerHandButton.onclick = () => {
        rc.updatePeerInfo(peer_name, socket.id, 'hand', false);
    };
    startAudioButton.onclick = async () => {
        const moderator = rc.getModerator();
        if (moderator.audio_cant_unmute) {
            return userLog('warning', 'The moderator does not allow you to unmute', 'top-end', 6000);
        }
        if (isPushToTalkActive) return;
        setAudioButtonsDisabled(true);
        if (!isEnumerateAudioDevices) await initEnumerateAudioDevices();

        const producerExist = rc.producerExist(RoomClient.mediaType.audio);
        console.log('START AUDIO producerExist --->', producerExist);

        producerExist
            ? await rc.resumeProducer(RoomClient.mediaType.audio)
            : await rc.produce(RoomClient.mediaType.audio, microphoneSelect.value);

        rc.updatePeerInfo(peer_name, socket.id, 'audio', true);
    };
    stopAudioButton.onclick = async () => {
        if (isPushToTalkActive) return;
        setAudioButtonsDisabled(true);

        const producerExist = rc.producerExist(RoomClient.mediaType.audio);
        console.log('STOP AUDIO producerExist --->', producerExist);

        producerExist
            ? await rc.pauseProducer(RoomClient.mediaType.audio)
            : await rc.closeProducer(RoomClient.mediaType.audio);

        rc.updatePeerInfo(peer_name, socket.id, 'audio', false);
    };
    startVideoButton.onclick = async () => {
        const moderator = rc.getModerator();
        if (moderator.video_cant_unhide) {
            return userLog('warning', 'The moderator does not allow you to unhide', 'top-end', 6000);
        }
        setVideoButtonsDisabled(true);
        if (!isEnumerateVideoDevices) await initEnumerateVideoDevices();
        await rc.produce(RoomClient.mediaType.video, videoSelect.value);
        // await rc.resumeProducer(RoomClient.mediaType.video);
    };
    stopVideoButton.onclick = () => {
        setVideoButtonsDisabled(true);
        rc.closeProducer(RoomClient.mediaType.video);
        // await rc.pauseProducer(RoomClient.mediaType.video);
    };
    startScreenButton.onclick = async () => {
        const moderator = rc.getModerator();
        if (moderator.screen_cant_share) {
            return userLog('warning', 'The moderator does not allow you to share the screen', 'top-end', 6000);
        }
        await rc.produce(RoomClient.mediaType.screen);
    };
    stopScreenButton.onclick = () => {
        rc.closeProducer(RoomClient.mediaType.screen);
    };
    copyRtmpUrlButton.onclick = () => {
        rc.copyRTMPUrl(rtmpLiveUrl.value);
    };
    startRtmpButton.onclick = () => {
        if (rc.selectedRtmpFilename == '') {
            userLog('warning', 'Please select the Video file to stream', 'top-end', 6000);
            return;
        }
        rc.startRTMP();
    };
    stopRtmpButton.onclick = () => {
        rc.stopRTMP();
    };
    streamerRtmpButton.onclick = () => {
        rc.openRTMPStreamer();
    };
    startRtmpURLButton.onclick = () => {
        rc.startRTMPfromURL(rtmpStreamURL.value);
    };
    stopRtmpURLButton.onclick = () => {
        rc.stopRTMPfromURL();
    };
    fileShareButton.onclick = () => {
        rc.selectFileToShare(socket.id, true);
    };
    videoShareButton.onclick = () => {
        rc.shareVideo('all');
    };
    videoCloseBtn.onclick = () => {
        rc.closeVideo(true);
    };
    sendAbortBtn.onclick = () => {
        rc.abortFileTransfer();
    };
    receiveAbortBtn.onclick = () => {
        rc.abortReceiveFileTransfer();
    };
    receiveHideBtn.onclick = () => {
        rc.hideFileTransfer();
    };
    whiteboardButton.onclick = () => {
        toggleWhiteboard();
    };
    snapshotRoomButton.onclick = () => {
        rc.snapshotRoom();
    };
    whiteboardPencilBtn.onclick = () => {
        whiteboardIsDrawingMode(true);
    };
    whiteboardObjectBtn.onclick = () => {
        whiteboardIsDrawingMode(false);
    };
    whiteboardUndoBtn.onclick = () => {
        whiteboardAction(getWhiteboardAction('undo'));
    };
    whiteboardRedoBtn.onclick = () => {
        whiteboardAction(getWhiteboardAction('redo'));
    };
    whiteboardSaveBtn.onclick = () => {
        wbCanvasSaveImg();
    };
    whiteboardImgFileBtn.onclick = () => {
        whiteboardAddObj('imgFile');
    };
    whiteboardPdfFileBtn.onclick = () => {
        whiteboardAddObj('pdfFile');
    };
    whiteboardImgUrlBtn.onclick = () => {
        whiteboardAddObj('imgUrl');
    };
    whiteboardTextBtn.onclick = () => {
        whiteboardAddObj('text');
    };
    whiteboardLineBtn.onclick = () => {
        whiteboardAddObj('line');
    };
    whiteboardRectBtn.onclick = () => {
        whiteboardAddObj('rect');
    };
    whiteboardTriangleBtn.onclick = () => {
        whiteboardAddObj('triangle');
    };
    whiteboardCircleBtn.onclick = () => {
        whiteboardAddObj('circle');
    };
    whiteboardEraserBtn.onclick = () => {
        whiteboardIsEraser(true);
    };
    whiteboardCleanBtn.onclick = () => {
        confirmClearBoard();
    };
    whiteboardCloseBtn.onclick = () => {
        whiteboardAction(getWhiteboardAction('close'));
    };
    whiteboardLockBtn.onclick = () => {
        toggleLockUnlockWhiteboard();
    };
    whiteboardUnlockBtn.onclick = () => {
        toggleLockUnlockWhiteboard();
    };
    participantsSaveBtn.onclick = () => {
        saveRoomPeers();
    };
    participantsUnreadMessagesBtn.onclick = () => {
        rc.toggleUnreadMsg();
    };
    participantsRaiseHandBtn.onclick = () => {
        rc.toggleRaiseHands();
    };
    searchParticipantsFromList.onkeyup = () => {
        rc.searchPeer();
    };
    lockRoomButton.onclick = () => {
        rc.roomAction('lock');
    };
    unlockRoomButton.onclick = () => {
        rc.roomAction('unlock');
    };
    aboutButton.onclick = () => {
        showAbout();
    };
    // restartICE.onclick = async () => {
    //     await rc.restartIce();
    // };
}

// ####################################################
// HANDLE INIT USER
// ####################################################

function setButtonsInit() {
    if (!DetectRTC.isMobileDevice) {
        setTippy('initAudioButton', 'Toggle the audio', 'top');
        setTippy('initVideoButton', 'Toggle the video', 'top');
        setTippy('initAudioVideoButton', 'Toggle the audio & video', 'top');
        setTippy('initStartScreenButton', 'Toggle screen sharing', 'top');
        setTippy('initStopScreenButton', 'Toggle screen sharing', 'top');
    }
    if (!isAudioAllowed) hide(initAudioButton);
    if (!isVideoAllowed) hide(initVideoButton);
    if (!isAudioAllowed || !isVideoAllowed) hide(initAudioVideoButton);
    if ((!isAudioAllowed && !isVideoAllowed) || DetectRTC.isMobileDevice) hide(initVideoAudioRefreshButton);
    isAudioVideoAllowed = isAudioAllowed && isVideoAllowed;
}

function handleSelectsInit() {
    // devices init options
    initVideoSelect.onchange = async () => {
        await changeCamera(initVideoSelect.value);
        videoSelect.selectedIndex = initVideoSelect.selectedIndex;
        refreshLsDevices();
    };
    initMicrophoneSelect.onchange = () => {
        microphoneSelect.selectedIndex = initMicrophoneSelect.selectedIndex;
        refreshLsDevices();
    };
    initSpeakerSelect.onchange = () => {
        speakerSelect.selectedIndex = initSpeakerSelect.selectedIndex;
        refreshLsDevices();
    };
}

async function setSelectsInit() {
    if (localStorageDevices) {
        console.log('04.0 ----> Get Local Storage Devices before', localStorageDevices);
        //
        const initMicrophoneExist = selectOptionByValueExist(initMicrophoneSelect, localStorageDevices.audio.select);
        const initSpeakerExist = selectOptionByValueExist(initSpeakerSelect, localStorageDevices.speaker.select);
        const initVideoExist = selectOptionByValueExist(initVideoSelect, localStorageDevices.video.select);
        //
        const microphoneExist = selectOptionByValueExist(microphoneSelect, localStorageDevices.audio.select);
        const speakerExist = selectOptionByValueExist(speakerSelect, localStorageDevices.speaker.select);
        const videoExist = selectOptionByValueExist(videoSelect, localStorageDevices.video.select);

        console.log('Check for audio changes', {
            previous: localStorageDevices.audio.select,
            current: microphoneSelect.value,
        });

        if (!initMicrophoneExist || !microphoneExist) {
            console.log('04.1 ----> Audio devices seems changed, use default index 0');
            initMicrophoneSelect.selectedIndex = 0;
            microphoneSelect.selectedIndex = 0;
            refreshLsDevices();
        }

        console.log('Check for speaker changes', {
            previous: localStorageDevices.speaker.select,
            current: speakerSelect.value,
        });

        if (!initSpeakerExist || !speakerExist) {
            console.log('04.2 ----> Speaker devices seems changed, use default index 0');
            initSpeakerSelect.selectedIndex = 0;
            speakerSelect.selectedIndex = 0;
            refreshLsDevices();
        }

        console.log('Check for video changes', {
            previous: localStorageDevices.video.select,
            current: videoSelect.value,
        });

        if (!initVideoExist || !videoExist) {
            console.log('04.3 ----> Video devices seems changed, use default index 0');
            initVideoSelect.selectedIndex = 0;
            videoSelect.selectedIndex = 0;
            refreshLsDevices();
        }

        //
        console.log('04.4 ----> Get Local Storage Devices after', lS.getLocalStorageDevices());
    }
    if (initVideoSelect.value) await changeCamera(initVideoSelect.value);
}

function selectOptionByValueExist(selectElement, value) {
    let foundValue = false;
    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value === value) {
            selectElement.selectedIndex = i;
            foundValue = true;
            break;
        }
    }
    return foundValue;
}

function refreshLsDevices() {
    lS.setLocalStorageDevices(lS.MEDIA_TYPE.video, videoSelect.selectedIndex, videoSelect.value);
    lS.setLocalStorageDevices(lS.MEDIA_TYPE.audio, microphoneSelect.selectedIndex, microphoneSelect.value);
    lS.setLocalStorageDevices(lS.MEDIA_TYPE.speaker, speakerSelect.selectedIndex, speakerSelect.value);
}

async function changeCamera(deviceId) {
    if (initStream) {
        await stopTracks(initStream);
        elemDisplay('initVideo', true);
        initVideoContainerShow();
        if (!initVideo.classList.contains('mirror')) {
            initVideo.classList.toggle('mirror');
        }
    }
    const videoConstraints = {
        audio: false,
        video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            deviceId: deviceId,
            aspectRatio: 1.777,
        },
    };
    await navigator.mediaDevices
        .getUserMedia(videoConstraints)
        .then((camStream) => {
            initVideo.className = 'mirror';
            initVideo.srcObject = camStream;
            initStream = camStream;
            console.log(
                '04.5 ----> Success attached init cam video stream',
                initStream.getVideoTracks()[0].getSettings(),
            );
            checkInitConfig();
            handleCameraMirror(initVideo);
        })
        .catch((error) => {
            console.error('[Error] changeCamera', error);
            handleMediaError('video/audio', error, '/');
        });
}

// ####################################################
// HANDLE MEDIA ERROR
// ####################################################

function handleMediaError(mediaType, err, redirectURL = false) {
    sound('alert');

    let errMessage = err;
    let getUserMediaError = true;

    switch (err.name) {
        case 'NotFoundError':
        case 'DevicesNotFoundError':
            errMessage = 'Required track is missing';
            break;
        case 'NotReadableError':
        case 'TrackStartError':
            errMessage = 'Already in use';
            break;
        case 'OverconstrainedError':
        case 'ConstraintNotSatisfiedError':
            errMessage = 'Constraints cannot be satisfied by available devices';
            break;
        case 'NotAllowedError':
        case 'PermissionDeniedError':
            errMessage = 'Permission denied in browser';
            break;
        case 'TypeError':
            errMessage = 'Empty constraints object';
            break;
        default:
            getUserMediaError = false;
            break;
    }

    let html = `
    <ul style="text-align: left">
        <li>Media type: ${mediaType}</li>
        <li>Error name: ${err.name}</li>
        <li>
            <p>Error message:</p>
            <p style="color: red">${errMessage}</p>
        </li>`;

    if (getUserMediaError) {
        html += `
        <li>Common: <a href="https://blog.addpipe.com/common-getusermedia-errors" target="_blank">getUserMedia errors</a></li>`;
    }
    html += `
        </ul>
    `;

    popupHtmlMessage(null, image.forbidden, 'Access denied', html, 'center', redirectURL);

    throw new Error(
        `Access denied for ${mediaType} device [${err.name}]: ${errMessage} check the common getUserMedia errors: https://blog.addpipe.com/common-getusermedia-errors/`,
    );
}

function popupHtmlMessage(icon, imageUrl, title, html, position, redirectURL = false, reloadPage = false) {
    Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: swalBackground,
        position: position,
        icon: icon,
        imageUrl: imageUrl,
        title: title,
        html: html,
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' },
    }).then((result) => {
        if (result.isConfirmed) {
            if (redirectURL) {
                return openURL(redirectURL);
            }
            if (reloadPage) {
                location.href = location.href;
            }
        }
    });
}

async function toggleScreenSharing() {
    if (initStream) {
        await stopTracks(initStream);
        elemDisplay('initVideo', true);
        initVideoContainerShow();
    }
    joinRoomWithScreen = !joinRoomWithScreen;
    if (joinRoomWithScreen) {
        const defaultFrameRate = { ideal: 30 };
        const selectedValue = getId('videoFps').options[localStorageSettings.screen_fps].value;
        const customFrameRate = parseInt(selectedValue, 10);
        const frameRate = selectedValue == 'max' ? defaultFrameRate : customFrameRate;
        await navigator.mediaDevices
            .getDisplayMedia({ audio: true, video: { frameRate: frameRate } })
            .then((screenStream) => {
                if (initVideo.classList.contains('mirror')) {
                    initVideo.classList.toggle('mirror');
                }
                initVideo.srcObject = screenStream;
                initStream = screenStream;
                console.log('04.6 ----> Success attached init screen video stream', initStream);
                show(initStopScreenButton);
                hide(initStartScreenButton);
                disable(initVideoSelect, true);
                disable(initVideoButton, true);
                disable(initAudioVideoButton, true);
                disable(initVideoAudioRefreshButton, true);
            })
            .catch((error) => {
                console.error('[Error] toggleScreenSharing', error);
                joinRoomWithScreen = false;
                return checkInitVideo(isVideoAllowed);
            });
    } else {
        checkInitVideo(isVideoAllowed);
        hide(initStopScreenButton);
        show(initStartScreenButton);
        disable(initVideoSelect, false);
        disable(initVideoButton, false);
        disable(initAudioVideoButton, false);
        disable(initVideoAudioRefreshButton, false);
    }
}

function handleCameraMirror(video) {
    if (isDesktopDevice()) {
        // Desktop devices...
        if (!video.classList.contains('mirror')) {
            video.classList.toggle('mirror');
        }
    } else {
        // Mobile, Tablet, IPad devices...
        if (video.classList.contains('mirror')) {
            video.classList.remove('mirror');
        }
    }
}

function handleSelects() {
    // devices options
    videoSelect.onchange = () => {
        videoQuality.selectedIndex = 0;
        rc.closeThenProduce(RoomClient.mediaType.video, videoSelect.value);
        refreshLsDevices();
    };
    videoQuality.onchange = () => {
        rc.closeThenProduce(RoomClient.mediaType.video, videoSelect.value);
    };
    videoFps.onchange = () => {
        rc.closeThenProduce(RoomClient.mediaType.video, videoSelect.value);
        localStorageSettings.video_fps = videoFps.selectedIndex;
        lS.setSettings(localStorageSettings);
    };
    screenFps.onchange = () => {
        rc.closeThenProduce(RoomClient.mediaType.screen);
        localStorageSettings.screen_fps = screenFps.selectedIndex;
        lS.setSettings(localStorageSettings);
    };
    microphoneSelect.onchange = () => {
        rc.closeThenProduce(RoomClient.mediaType.audio, microphoneSelect.value);
        refreshLsDevices();
    };
    speakerSelect.onchange = () => {
        rc.changeAudioDestination();
        refreshLsDevices();
    };
    switchPushToTalk.onchange = async (e) => {
        const producerExist = rc.producerExist(RoomClient.mediaType.audio);
        if (!producerExist && !isPushToTalkActive) {
            console.log('Push-to-talk: start audio producer');
            setAudioButtonsDisabled(true);
            if (!isEnumerateAudioDevices) initEnumerateAudioDevices();
            await rc.produce(RoomClient.mediaType.audio, microphoneSelect.value);
            setTimeout(async function () {
                await rc.pauseProducer(RoomClient.mediaType.audio);
                rc.updatePeerInfo(peer_name, socket.id, 'audio', false);
            }, 1000);
        }
        isPushToTalkActive = !isPushToTalkActive;
        if (producerExist && !isPushToTalkActive) {
            console.log('Push-to-talk: resume audio producer');
            await rc.resumeProducer(RoomClient.mediaType.audio);
            rc.updatePeerInfo(peer_name, socket.id, 'audio', true);
        }
        e.target.blur(); // Removes focus from the element
        rc.roomMessage('ptt', isPushToTalkActive);
        console.log(`Push-to-talk enabled: ${isPushToTalkActive}`);
    };
    document.addEventListener('keydown', async (e) => {
        if (!isPushToTalkActive) return;
        if (e.code === 'Space') {
            if (isSpaceDown) return;
            await rc.resumeProducer(RoomClient.mediaType.audio);
            rc.updatePeerInfo(peer_name, socket.id, 'audio', true);
            isSpaceDown = true;
            console.log('Push-to-talk: audio resumed');
        }
    });
    document.addEventListener('keyup', async (e) => {
        if (!isPushToTalkActive) return;
        if (e.code === 'Space') {
            await rc.pauseProducer(RoomClient.mediaType.audio);
            rc.updatePeerInfo(peer_name, socket.id, 'audio', false);
            isSpaceDown = false;
            console.log('Push-to-talk: audio paused');
        }
    });
    // room
    switchBroadcasting.onchange = (e) => {
        isBroadcastingEnabled = e.currentTarget.checked;
        rc.roomAction('broadcasting');
        localStorageSettings.broadcasting = isBroadcastingEnabled;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchLobby.onchange = (e) => {
        isLobbyEnabled = e.currentTarget.checked;
        rc.roomAction(isLobbyEnabled ? 'lobbyOn' : 'lobbyOff');
        rc.lobbyToggle();
        localStorageSettings.lobby = isLobbyEnabled;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchPitchBar.onchange = (e) => {
        isPitchBarEnabled = e.currentTarget.checked;
        rc.roomMessage('pitchBar', isPitchBarEnabled);
        localStorageSettings.pitch_bar = isPitchBarEnabled;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchVideoMirror.onchange = (e) => {
        rc.toggleVideoMirror();
        rc.roomMessage('toggleVideoMirror', e.currentTarget.checked);
        e.target.blur();
    };
    switchSounds.onchange = (e) => {
        isSoundEnabled = e.currentTarget.checked;
        rc.roomMessage('sounds', isSoundEnabled);
        localStorageSettings.sounds = isSoundEnabled;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchShare.onchange = (e) => {
        notify = e.currentTarget.checked;
        rc.roomMessage('notify', notify);
        localStorageSettings.share_on_join = notify;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchKeepButtonsVisible.onchange = (e) => {
        isButtonsBarOver = e.currentTarget.checked;
        localStorageSettings.keep_buttons_visible = isButtonsBarOver;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };

    // audio options
    switchAutoGainControl.onchange = (e) => {
        localStorageSettings.mic_auto_gain_control = e.currentTarget.checked;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchEchoCancellation.onchange = (e) => {
        localStorageSettings.mic_echo_cancellations = e.currentTarget.checked;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchNoiseSuppression.onchange = (e) => {
        localStorageSettings.mic_noise_suppression = e.currentTarget.checked;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    sampleRateSelect.onchange = (e) => {
        localStorageSettings.mic_sample_rate = e.currentTarget.selectedIndex;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    sampleSizeSelect.onchange = (e) => {
        localStorageSettings.mic_sample_size = e.currentTarget.selectedIndex;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    channelCountSelect.onchange = (e) => {
        localStorageSettings.mic_channel_count = e.currentTarget.selectedIndex;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    micLatencyRange.oninput = (e) => {
        localStorageSettings.mic_latency = e.currentTarget.value;
        lS.setSettings(localStorageSettings);
        micLatencyValue.innerText = e.currentTarget.value;
        e.target.blur();
    };
    micVolumeRange.oninput = (e) => {
        localStorageSettings.mic_volume = e.currentTarget.value;
        lS.setSettings(localStorageSettings);
        micVolumeValue.innerText = e.currentTarget.value;
        e.target.blur();
    };
    // recording
    switchHostOnlyRecording.onchange = (e) => {
        hostOnlyRecording = e.currentTarget.checked;
        rc.roomAction(hostOnlyRecording ? 'hostOnlyRecordingOn' : 'hostOnlyRecordingOff');
        localStorageSettings.host_only_recording = hostOnlyRecording;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchH264Recording.onchange = (e) => {
        recPrioritizeH264 = e.currentTarget.checked;
        rc.roomMessage('recPrioritizeH264', recPrioritizeH264);
        localStorageSettings.rec_prioritize_h264 = recPrioritizeH264;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchServerRecording.onchange = (e) => {
        rc.recording.recSyncServerRecording = e.currentTarget.checked;
        rc.roomMessage('recSyncServer', rc.recording.recSyncServerRecording);
        localStorageSettings.rec_server = rc.recording.recSyncServerRecording;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    // styling
    keepCustomTheme.onchange = (e) => {
        themeCustom.keep = e.currentTarget.checked;
        selectTheme.disabled = themeCustom.keep;
        rc.roomMessage('customThemeKeep', themeCustom.keep);
        localStorageSettings.theme_custom = themeCustom.keep;
        localStorageSettings.theme_color = themeCustom.color;
        lS.setSettings(localStorageSettings);
        setTheme();
        e.target.blur();
    };
    BtnAspectRatio.onchange = () => {
        setAspectRatio(BtnAspectRatio.value);
    };
    BtnVideoObjectFit.onchange = () => {
        rc.handleVideoObjectFit(BtnVideoObjectFit.value);
        localStorageSettings.video_obj_fit = BtnVideoObjectFit.selectedIndex;
        lS.setSettings(localStorageSettings);
    }; // cover
    BtnVideoControls.onchange = () => {
        rc.handleVideoControls(BtnVideoControls.value);
        localStorageSettings.video_controls = BtnVideoControls.selectedIndex;
        lS.setSettings(localStorageSettings);
    };
    selectTheme.onchange = () => {
        localStorageSettings.theme = selectTheme.selectedIndex;
        lS.setSettings(localStorageSettings);
        setTheme();
    };
    BtnsBarPosition.onchange = () => {
        rc.changeBtnsBarPosition(BtnsBarPosition.value);
        localStorageSettings.buttons_bar = BtnsBarPosition.selectedIndex;
        lS.setSettings(localStorageSettings);
        refreshMainButtonsToolTipPlacement();
        resizeMainButtons();
    };
    pinVideoPosition.onchange = () => {
        rc.toggleVideoPin(pinVideoPosition.value);
        localStorageSettings.pin_grid = pinVideoPosition.selectedIndex;
        lS.setSettings(localStorageSettings);
    };
    // chat
    showChatOnMsg.onchange = (e) => {
        rc.showChatOnMessage = e.currentTarget.checked;
        rc.roomMessage('showChat', rc.showChatOnMessage);
        localStorageSettings.show_chat_on_msg = rc.showChatOnMessage;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    speechIncomingMsg.onchange = (e) => {
        rc.speechInMessages = e.currentTarget.checked;
        rc.roomMessage('speechMessages', rc.speechInMessages);
        localStorageSettings.speech_in_msg = rc.speechInMessages;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    transcriptShowOnMsg.onchange = (e) => {
        transcription.showOnMessage = e.currentTarget.checked;
        rc.roomMessage('transcriptShowOnMsg', transcription.showOnMessage);
        localStorageSettings.transcript_show_on_msg = transcription.showOnMessage;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    // whiteboard options
    wbDrawingColorEl.onchange = () => {
        wbCanvas.freeDrawingBrush.color = wbDrawingColorEl.value;
        whiteboardIsDrawingMode(true);
    };
    wbBackgroundColorEl.onchange = () => {
        setWhiteboardBgColor(wbBackgroundColorEl.value);
    };
    whiteboardGhostButton.onclick = (e) => {
        wbIsBgTransparent = !wbIsBgTransparent;
        wbIsBgTransparent ? wbCanvasBackgroundColor('rgba(0, 0, 0, 0.100)') : setTheme();
    };
    whiteboardGridBtn.onclick = (e) => {
        toggleCanvasGrid();
    };
    // room moderator rules
    switchEveryonePrivacy.onchange = (e) => {
        const videoStartPrivacy = e.currentTarget.checked;
        isVideoPrivacyActive = !videoStartPrivacy;
        rc.toggleVideoPrivacyMode();
        rc.updateRoomModerator({ type: 'video_start_privacy', status: videoStartPrivacy });
        rc.roomMessage('video_start_privacy', videoStartPrivacy);
        localStorageSettings.moderator_video_start_privacy = videoStartPrivacy;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchEveryoneMute.onchange = (e) => {
        const audioStartMuted = e.currentTarget.checked;
        rc.updateRoomModerator({ type: 'audio_start_muted', status: audioStartMuted });
        rc.roomMessage('audio_start_muted', audioStartMuted);
        localStorageSettings.moderator_audio_start_muted = audioStartMuted;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchEveryoneHidden.onchange = (e) => {
        const videoStartHidden = e.currentTarget.checked;
        rc.updateRoomModerator({ type: 'video_start_hidden', status: videoStartHidden });
        rc.roomMessage('video_start_hidden', videoStartHidden);
        localStorageSettings.moderator_video_start_hidden = videoStartHidden;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchEveryoneCantUnmute.onchange = (e) => {
        const audioCantUnmute = e.currentTarget.checked;
        rc.updateRoomModerator({ type: 'audio_cant_unmute', status: audioCantUnmute });
        rc.roomMessage('audio_cant_unmute', audioCantUnmute);
        localStorageSettings.moderator_audio_cant_unmute = audioCantUnmute;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchEveryoneCantUnhide.onchange = (e) => {
        const videoCantUnhide = e.currentTarget.checked;
        rc.updateRoomModerator({ type: 'video_cant_unhide', status: videoCantUnhide });
        rc.roomMessage('video_cant_unhide', videoCantUnhide);
        localStorageSettings.moderator_video_cant_unhide = videoCantUnhide;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchEveryoneCantShareScreen.onchange = (e) => {
        const screenCantShare = e.currentTarget.checked;
        rc.updateRoomModerator({ type: 'screen_cant_share', status: screenCantShare });
        rc.roomMessage('screen_cant_share', screenCantShare);
        localStorageSettings.moderator_screen_cant_share = screenCantShare;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchEveryoneCantChatPrivately.onchange = (e) => {
        const chatCantPrivately = e.currentTarget.checked;
        rc.updateRoomModerator({ type: 'chat_cant_privately', status: chatCantPrivately });
        rc.roomMessage('chat_cant_privately', chatCantPrivately);
        localStorageSettings.moderator_chat_cant_privately = chatCantPrivately;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchEveryoneCantChatChatGPT.onchange = (e) => {
        const chatCantChatGPT = e.currentTarget.checked;
        rc.updateRoomModerator({ type: 'chat_cant_chatgpt', status: chatCantChatGPT });
        rc.roomMessage('chat_cant_chatgpt', chatCantChatGPT);
        localStorageSettings.moderator_chat_cant_chatgpt = chatCantChatGPT;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
    switchDisconnectAllOnLeave.onchange = (e) => {
        const disconnectAll = e.currentTarget.checked;
        rc.roomMessage('disconnect_all_on_leave', disconnectAll);
        localStorageSettings.moderator_disconnect_all_on_leave = disconnectAll;
        lS.setSettings(localStorageSettings);
        e.target.blur();
    };
}

// ####################################################
// HTML INPUTS
// ####################################################

function handleInputs() {
    chatMessage.onkeyup = (e) => {
        if (e.keyCode === 13 && (DetectRTC.isMobileDevice || !e.shiftKey)) {
            e.preventDefault();
            chatSendButton.click();
        }
    };
    chatMessage.oninput = function () {
        const chatInputEmoji = {
            '<3': '❤️',
            '</3': '💔',
            ':D': '😀',
            ':)': '😃',
            ';)': '😉',
            ':(': '😒',
            ':p': '😛',
            ';p': '😜',
            ":'(": '😢',
            ':+1:': '👍',
            ':*': '😘',
            ':O': '😲',
            ':|': '😐',
            ':*(': '😭',
            XD: '😆',
            ':B': '😎',
            ':P': '😜',
            '<(': '👎',
            '>:(': '😡',
            ':S': '😟',
            ':X': '🤐',
            ';(': '😥',
            ':T': '😖',
            ':@': '😠',
            ':$': '🤑',
            ':&': '🤗',
            ':#': '🤔',
            ':!': '😵',
            ':W': '😷',
            ':%': '🤒',
            ':*!': '🤩',
            ':G': '😬',
            ':R': '😋',
            ':M': '🤮',
            ':L': '🥴',
            ':C': '🥺',
            ':F': '🥳',
            ':Z': '🤢',
            ':^': '🤓',
            ':K': '🤫',
            ':D!': '🤯',
            ':H': '🧐',
            ':U': '🤥',
            ':V': '🤪',
            ':N': '🥶',
            ':J': '🥴',
        };
        // Create a regular expression pattern for all keys in chatInputEmoji
        const regexPattern = new RegExp(
            Object.keys(chatInputEmoji)
                .map((key) => key.replace(/([()[{*+.$^\\|?])/g, '\\$1'))
                .join('|'),
            'gim',
        );
        // Replace matching patterns with corresponding emojis
        this.value = this.value.replace(regexPattern, (match) => chatInputEmoji[match]);

        rc.checkLineBreaks();
    };

    chatMessage.onpaste = () => {
        isChatPasteTxt = true;
        rc.checkLineBreaks();
    };
}

// ####################################################
// EMOJI PIKER
// ####################################################

function handleChatEmojiPicker() {
    const pickerOptions = {
        theme: 'dark',
        onEmojiSelect: addEmojiToMsg,
    };
    const emojiPicker = new EmojiMart.Picker(pickerOptions);
    rc.getId('chatEmoji').appendChild(emojiPicker);

    function addEmojiToMsg(data) {
        chatMessage.value += data.native;
        rc.toggleChatEmoji();
    }
}

function handleRoomEmojiPicker() {
    const pickerRoomOptions = {
        theme: 'dark',
        onEmojiSelect: sendEmojiToRoom,
    };

    const emojiRoomPicker = new EmojiMart.Picker(pickerRoomOptions);
    emojiPickerContainer.appendChild(emojiRoomPicker);
    emojiPickerContainer.style.display = 'none';

    emojiRoomButton.onclick = () => {
        toggleEmojiPicker();
    };
    closeEmojiPickerContainer.onclick = () => {
        toggleEmojiPicker();
    };

    function sendEmojiToRoom(data) {
        console.log('Selected Emoji', data.native);
        const cmd = {
            type: 'roomEmoji',
            peer_name: peer_name,
            emoji: data.native,
            broadcast: true,
        };
        if (rc.thereAreParticipants()) {
            rc.emitCmd(cmd);
        }
        rc.handleCmd(cmd);
        // toggleEmojiPicker();
    }

    function toggleEmojiPicker() {
        if (emojiPickerContainer.style.display === 'block') {
            emojiPickerContainer.style.display = 'none';
            setColor(emojiRoomButton, 'white');
        } else {
            emojiPickerContainer.style.display = 'block';
            setColor(emojiRoomButton, 'yellow');
        }
    }
}

function boltEmoji(msg) {
    console.log('bolt Emoji: ', msg);
    const cmd = {
        type: 'zapEmoji',
        peer_name: peer_name,
        emoji: '⚡️ ' + msg,
        broadcast: true,
    };
    console.log(cmd);
    rc.emitCmd(cmd);
    rc.handleCmd(cmd);
}

// ####################################################
// ROOM EDITOR
// ####################################################

function handleEditor() {
    const toolbarOptions = [
        [{ header: [1, 2, 3, false] }, { align: [] }, { background: [] }],
        ['bold', 'italic', 'underline', 'strike', 'link', 'image', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ indent: '+1' }, { indent: '-1' }],
        ['clean'], // Custom button to clear formatting
        //...
    ];

    quill = new Quill('#editor', {
        modules: {
            toolbar: {
                container: toolbarOptions,
            },
            syntax: true,
        },
        theme: 'snow',
    });

    applySyntaxHighlighting();

    quill.on('text-change', (delta, oldDelta, source) => {
        if (!isPresenter && rc.editorIsLocked()) {
            return;
        }
        // console.log('text-change', { delta, oldDelta, source });
        applySyntaxHighlighting();
        if (rc.thereAreParticipants() && source === 'user') {
            socket.emit('editorChange', delta);
        }
    });
}

function applySyntaxHighlighting() {
    const codeBlocks = document.querySelectorAll('.ql-syntax');
    codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
    });
}

// ####################################################
// LOAD SETTINGS FROM LOCAL STORAGE
// ####################################################

function loadSettingsFromLocalStorage() {
    rc.showChatOnMessage = localStorageSettings.show_chat_on_msg;
    transcription.showOnMessage = localStorageSettings.transcript_show_on_msg;
    rc.speechInMessages = localStorageSettings.speech_in_msg;
    isPitchBarEnabled = localStorageSettings.pitch_bar;
    isSoundEnabled = localStorageSettings.sounds;
    showChatOnMsg.checked = rc.showChatOnMessage;
    transcriptShowOnMsg.checked = transcription.showOnMessage;
    speechIncomingMsg.checked = rc.speechInMessages;
    switchPitchBar.checked = isPitchBarEnabled;
    switchSounds.checked = isSoundEnabled;
    switchShare.checked = notify;
    isButtonsBarOver = localStorageSettings.keep_buttons_visible || false;
    document.getElementById('switchKeepButtonsVisible').checked = isButtonsBarOver;

    recPrioritizeH264 = localStorageSettings.rec_prioritize_h264;
    switchH264Recording.checked = recPrioritizeH264;

    switchServerRecording.checked = localStorageSettings.rec_server;

    keepCustomTheme.checked = themeCustom.keep;
    selectTheme.disabled = themeCustom.keep;
    themeCustom.input.value = themeCustom.color;

    switchAutoGainControl.checked = localStorageSettings.mic_auto_gain_control;
    switchEchoCancellation.checked = localStorageSettings.mic_echo_cancellations;
    switchNoiseSuppression.checked = localStorageSettings.mic_noise_suppression;
    sampleRateSelect.selectedIndex = localStorageSettings.mic_sample_rate;
    sampleSizeSelect.selectedIndex = localStorageSettings.mic_sample_size;
    channelCountSelect.selectedIndex = localStorageSettings.mic_channel_count;

    micLatencyRange.value = localStorageSettings.mic_latency || 50;
    micLatencyValue.innerText = localStorageSettings.mic_latency || 50;
    micVolumeRange.value = localStorageSettings.mic_volume || 100;
    micVolumeValue.innerText = localStorageSettings.mic_volume || 100;

    videoFps.selectedIndex = localStorageSettings.video_fps;
    screenFps.selectedIndex = localStorageSettings.screen_fps;
    BtnVideoObjectFit.selectedIndex = localStorageSettings.video_obj_fit;
    BtnVideoControls.selectedIndex = localStorageSettings.video_controls;
    BtnsBarPosition.selectedIndex = localStorageSettings.buttons_bar;
    pinVideoPosition.selectedIndex = localStorageSettings.pin_grid;
    rc.handleVideoObjectFit(BtnVideoObjectFit.value);
    rc.handleVideoControls(BtnVideoControls.value);
    rc.changeBtnsBarPosition(BtnsBarPosition.value);
    rc.toggleVideoPin(pinVideoPosition.value);
    refreshMainButtonsToolTipPlacement();
    resizeMainButtons();
}

// ####################################################
// ROOM CLIENT EVENT LISTNERS
// ####################################################

function handleRoomClientEvents() {
    rc.on(RoomClient.EVENTS.startRec, () => {
        console.log('Room event: Client start recoding');
        hide(startRecButton);
        show(stopRecButton);
        show(pauseRecButton);
        show(recordingTime);
        startRecordingTimer();
        isRecording = true;
        rc.updatePeerInfo(peer_name, socket.id, 'recording', true);
    });
    rc.on(RoomClient.EVENTS.pauseRec, () => {
        console.log('Room event: Client pause recoding');
        hide(pauseRecButton);
        show(resumeRecButton);
    });
    rc.on(RoomClient.EVENTS.resumeRec, () => {
        console.log('Room event: Client resume recoding');
        hide(resumeRecButton);
        show(pauseRecButton);
    });
    rc.on(RoomClient.EVENTS.stopRec, () => {
        console.log('Room event: Client stop recoding');
        hide(stopRecButton);
        hide(pauseRecButton);
        hide(resumeRecButton);
        hide(recordingTime);
        show(startRecButton);
        stopRecordingTimer();
        isRecording = false;
        rc.updatePeerInfo(peer_name, socket.id, 'recording', false);
    });
    rc.on(RoomClient.EVENTS.raiseHand, () => {
        console.log('Room event: Client raise hand');
        hide(raiseHandButton);
        show(lowerHandButton);
        setColor(lowerHandIcon, 'lime');
    });
    rc.on(RoomClient.EVENTS.lowerHand, () => {
        console.log('Room event: Client lower hand');
        hide(lowerHandButton);
        show(raiseHandButton);
        setColor(lowerHandIcon, 'white');
    });
    rc.on(RoomClient.EVENTS.startAudio, () => {
        console.log('Room event: Client start audio');
        hide(startAudioButton);
        show(stopAudioButton);
        setColor(startAudioButton, 'red');
        setAudioButtonsDisabled(false);
    });
    rc.on(RoomClient.EVENTS.pauseAudio, () => {
        console.log('Room event: Client pause audio');
        hide(stopAudioButton);
        show(startAudioButton);
        setColor(startAudioButton, 'red');
        setAudioButtonsDisabled(false);
    });
    rc.on(RoomClient.EVENTS.resumeAudio, () => {
        console.log('Room event: Client resume audio');
        hide(startAudioButton);
        show(stopAudioButton);
        setAudioButtonsDisabled(false);
    });
    rc.on(RoomClient.EVENTS.stopAudio, () => {
        console.log('Room event: Client stop audio');
        hide(stopAudioButton);
        show(startAudioButton);
        setAudioButtonsDisabled(false);
        stopMicrophoneProcessing();
    });
    rc.on(RoomClient.EVENTS.startVideo, () => {
        console.log('Room event: Client start video');
        hide(startVideoButton);
        show(stopVideoButton);
        setColor(startVideoButton, 'red');
        setVideoButtonsDisabled(false);
        switchVideoMirror.disabled = false;
        // if (isParticipantsListOpen) getRoomParticipants();
    });
    rc.on(RoomClient.EVENTS.pauseVideo, () => {
        console.log('Room event: Client pause video');
        hide(stopVideoButton);
        show(startVideoButton);
        setColor(startVideoButton, 'red');
        setVideoButtonsDisabled(false);
    });
    rc.on(RoomClient.EVENTS.resumeVideo, () => {
        console.log('Room event: Client resume video');
        hide(startVideoButton);
        show(stopVideoButton);
        setVideoButtonsDisabled(false);
        isVideoPrivacyActive = false;
    });
    rc.on(RoomClient.EVENTS.stopVideo, () => {
        console.log('Room event: Client stop video');
        hide(stopVideoButton);
        show(startVideoButton);
        setVideoButtonsDisabled(false);
        isVideoPrivacyActive = false;
        switchVideoMirror.disabled = true;
        // if (isParticipantsListOpen) getRoomParticipants();
    });
    rc.on(RoomClient.EVENTS.startScreen, () => {
        console.log('Room event: Client start screen');
        hide(startScreenButton);
        show(stopScreenButton);
        // if (isParticipantsListOpen) getRoomParticipants();
    });
    rc.on(RoomClient.EVENTS.pauseScreen, () => {
        console.log('Room event: Client pause screen');
        hide(startScreenButton);
        show(stopScreenButton);
    });
    rc.on(RoomClient.EVENTS.resumeScreen, () => {
        console.log('Room event: Client resume screen');
        hide(stopScreenButton);
        show(startScreenButton);
    });
    rc.on(RoomClient.EVENTS.stopScreen, () => {
        console.log('Room event: Client stop screen');
        hide(stopScreenButton);
        show(startScreenButton);
        // if (isParticipantsListOpen) getRoomParticipants();
    });
    rc.on(RoomClient.EVENTS.roomLock, () => {
        console.log('Room event: Client lock room');
        hide(lockRoomButton);
        show(unlockRoomButton);
        setColor(unlockRoomButton, 'red');
        isRoomLocked = true;
    });
    rc.on(RoomClient.EVENTS.roomUnlock, () => {
        console.log('Room event: Client unlock room');
        hide(unlockRoomButton);
        show(lockRoomButton);
        isRoomLocked = false;
    });
    rc.on(RoomClient.EVENTS.lobbyOn, () => {
        console.log('Room event: Client room lobby enabled');
        if (isRulesActive && !isPresenter) {
            hide(lobbyButton);
        }
        sound('lobby');
        isLobbyEnabled = true;
    });
    rc.on(RoomClient.EVENTS.lobbyOff, () => {
        console.log('Room event: Client room lobby disabled');
        isLobbyEnabled = false;
    });
    rc.on(RoomClient.EVENTS.hostOnlyRecordingOn, () => {
        if (isRulesActive && !isPresenter) {
            console.log('Room event: host only recording enabled');
            // Stop recording ...
            if (rc.isRecording() || recordingStatus.innerText != '0s') {
                rc.saveRecording('Room event: host only recording enabled, going to stop recording');
            }
            hide(startRecButton);
            hide(recordingImage);
            hide(roomHostOnlyRecording);
            hide(roomRecordingOptions);
            hide(roomRecordingServer);
            show(recordingMessage);
            hostOnlyRecording = true;
        }
    });
    rc.on(RoomClient.EVENTS.hostOnlyRecordingOff, () => {
        if (isRulesActive && !isPresenter) {
            console.log('Room event: host only recording disabled');
            show(startRecButton);
            show(recordingImage);
            hide(roomHostOnlyRecording);
            hide(recordingMessage);
            hostOnlyRecording = false;
        }
    });
    rc.on(RoomClient.EVENTS.startRTMP, () => {
        console.log('Room event: RTMP started');
        hide(startRtmpButton);
        show(stopRtmpButton);
    });
    rc.on(RoomClient.EVENTS.stopRTMP, () => {
        console.log('Room event: RTMP stopped');
        hide(stopRtmpButton);
        show(startRtmpButton);
    });
    rc.on(RoomClient.EVENTS.endRTMP, () => {
        console.log('Room event: RTMP ended');
        hide(stopRtmpButton);
        show(startRtmpButton);
    });
    rc.on(RoomClient.EVENTS.startRTMPfromURL, () => {
        console.log('Room event: RTMP from URL started');
        hide(startRtmpURLButton);
        show(stopRtmpURLButton);
    });
    rc.on(RoomClient.EVENTS.stopRTMPfromURL, () => {
        console.log('Room event: RTMP from URL stopped');
        hide(stopRtmpURLButton);
        show(startRtmpURLButton);
    });
    rc.on(RoomClient.EVENTS.endRTMPfromURL, () => {
        console.log('Room event: RTMP from URL ended');
        hide(stopRtmpURLButton);
        show(startRtmpURLButton);
    });
    rc.on(RoomClient.EVENTS.exitRoom, () => {
        if (rc.isRecording() || recordingStatus.innerText != '0s') {
            rc.saveRecording('Room event: Client save recording before to exit');
        }
        if (survey && survey.enabled) {
            leaveFeedback();
        } else {
            redirectOnLeave();
        }
    });
}

// ####################################################
// UTILITY
// ####################################################

function leaveFeedback() {
    Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        showDenyButton: true,
        background: swalBackground,
        imageUrl: image.feedback,
        title: 'Leave a feedback',
        text: 'Do you want to rate your HiveTalk experience?',
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' },
    }).then((result) => {
        if (result.isConfirmed) {
            openURL(survey.url);
        } else {
            redirectOnLeave();
        }
    });
}

function redirectOnLeave() {
    loggedIn = false;
    console.log('Room event: Client leave room');
    // document.dispatchEvent(new Event("nlLogout")); // logout from nostr-login
    redirect && redirect.enabled ? openURL(redirect.url) : openURL('/');
}

function userLog(icon, message, position, timer = 3000) {
    const Toast = Swal.mixin({
        background: swalBackground,
        toast: true,
        position: position,
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
    });
    Toast.fire({
        icon: icon,
        title: message,
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' },
    });
}

function saveDataToFile(dataURL, fileName) {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = dataURL;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(dataURL);
    }, 100);
}

function saveObjToJsonFile(dataObj, name) {
    console.log('Save data', { dataObj: dataObj, name: name });
    const dataTime = getDataTimeString();
    let a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataObj, null, 1));
    a.download = `${dataTime}-${name}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
    }, 100);
    sound('download');
}

function getDataTimeString() {
    const d = new Date();
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().split(' ')[0];
    return `${date}-${time}`;
}

function getDataTimeStringFormat() {
    const d = new Date();
    const date = d.toISOString().split('T')[0].replace(/-/g, '_');
    const time = d.toTimeString().split(' ')[0].replace(/:/g, '_');
    return `${date}_${time}`;
}

function getUUID() {
    const uuid4 = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
    );
    if (window.localStorage.uuid) {
        return window.localStorage.uuid;
    }
    window.localStorage.uuid = uuid4;
    return uuid4;
}

function showButtons() {
    if (
        isButtonsBarOver ||
        isButtonsVisible ||
        (rc.isMobileDevice && rc.isChatOpen) ||
        (rc.isMobileDevice && rc.isMySettingsOpen)
    )        
    toggleClassElements('videoMenuBar', 'inline');
    control.style.display = 'flex';
    bottomButtons.style.display = 'flex';
    isButtonsVisible = true;
}

function checkButtonsBar() {
    if (!isButtonsBarOver) {
        toggleClassElements('videoMenuBar', 'none');
        control.style.display = 'none';
        bottomButtons.style.display = 'none';
        isButtonsVisible = false;
    }
    setTimeout(() => {
        checkButtonsBar();
    }, 10000);
}

function toggleClassElements(className, displayState) {
    let elements = rc.getEcN(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = displayState;
    }
}

function setAudioButtonsDisabled(disabled) {
    startAudioButton.disabled = disabled;
    stopAudioButton.disabled = disabled;
}

function setVideoButtonsDisabled(disabled) {
    startVideoButton.disabled = disabled;
    stopVideoButton.disabled = disabled;
}

async function sound(name, force = false) {
    if (!isSoundEnabled && !force) return;
    let sound = '../sounds/' + name + '.wav';
    let audio = new Audio(sound);
    try {
        audio.volume = 0.5;
        await audio.play();
    } catch (err) {
        return false;
    }
}

function isImageURL(url) {
    return url.match(/\.(jpeg|jpg|gif|png|tiff|bmp)$/) != null;
}

function isMobile(userAgent) {
    return !!/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(userAgent || '');
}

function isTablet(userAgent) {
    return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
        userAgent,
    );
}

function isIpad(userAgent) {
    return /macintosh/.test(userAgent) && 'ontouchend' in document;
}

function openURL(url, blank = false) {
    blank ? window.open(url, '_blank') : (window.location.href = url);
}

function bytesToSize(bytes) {
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function setCookie(name, value, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires + '; path=/';
}

function getCookie(cName) {
    const name = cName + '=';
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach((val) => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
}

function isHtml(str) {
    var a = document.createElement('div');
    a.innerHTML = str;
    for (var c = a.childNodes, i = c.length; i--; ) {
        if (c[i].nodeType == 1) return true;
    }
    return false;
}

function getId(id) {
    return document.getElementById(id);
}

// ####################################################
// HANDLE WHITEBOARD
// ####################################################

function toggleWhiteboard() {
    if (!wbIsOpen) rc.sound('open');
    whiteboardCenter();
    whiteboard.classList.toggle('show');
    wbIsOpen = !wbIsOpen;
}

function whiteboardCenter() {
    whiteboard.style.top = '50%';
    whiteboard.style.left = '50%';
}

function setupWhiteboard() {
    setupWhiteboardCanvas();
    setupWhiteboardCanvasSize();
    setupWhiteboardLocalListners();
}

function setupWhiteboardCanvas() {
    wbCanvas = new fabric.Canvas('wbCanvas');
    wbCanvas.freeDrawingBrush.color = '#FFFFFF';
    wbCanvas.freeDrawingBrush.width = 3;
    whiteboardIsDrawingMode(true);
}

function setupWhiteboardCanvasSize() {
    const optimalSize = [wbWidth, wbHeight];
    const scaleFactorX = window.innerWidth / optimalSize[0];
    const scaleFactorY = window.innerHeight / optimalSize[1];
    const scaleFactor = Math.min(scaleFactorX, scaleFactorY, 1);

    const newWidth = optimalSize[0] * scaleFactor;
    const newHeight = optimalSize[1] * scaleFactor;

    wbCanvas.setWidth(newWidth);
    wbCanvas.setHeight(newHeight);
    wbCanvas.setZoom(scaleFactor);
    setWhiteboardSize(newWidth, newHeight);

    wbCanvas.calcOffset();
    wbCanvas.renderAll();
}

function setWhiteboardSize(w, h) {
    document.documentElement.style.setProperty('--wb-width', w);
    document.documentElement.style.setProperty('--wb-height', h);
}

function drawCanvasGrid() {
    const width = wbCanvas.getWidth();
    const height = wbCanvas.getHeight();

    removeCanvasGrid();

    // Draw vertical lines
    for (let i = 0; i <= width; i += wbGridSize) {
        wbGridLines.push(createGridLine(i, 0, i, height));
    }
    // Draw horizontal lines
    for (let i = 0; i <= height; i += wbGridSize) {
        wbGridLines.push(createGridLine(0, i, width, i));
    }

    // Create a group for grid lines and send it to the back
    const gridGroup = new fabric.Group(wbGridLines, { selectable: false, evented: false });
    wbCanvas.add(gridGroup);
    gridGroup.sendToBack();
    wbCanvas.renderAll();
}

function createGridLine(x1, y1, x2, y2) {
    return new fabric.Line([x1, y1, x2, y2], {
        stroke: wbStroke,
        selectable: false,
        evented: false,
    });
}

function removeCanvasGrid() {
    wbGridLines.forEach((line) => {
        line.set({ stroke: wbGridVisible ? wbStroke : 'rgba(255, 255, 255, 0)' });
        wbCanvas.remove(line);
    });
    wbGridLines = [];
    wbCanvas.renderAll();
}

function toggleCanvasGrid() {
    wbGridVisible = !wbGridVisible;
    wbGridVisible ? drawCanvasGrid() : removeCanvasGrid();
    wbCanvasToJson();
}

function setWhiteboardBgColor(color) {
    let data = {
        peer_name: peer_name,
        action: 'bgcolor',
        color: color,
    };
    whiteboardAction(data);
}

function whiteboardIsDrawingMode(status) {
    wbCanvas.isDrawingMode = status;
    if (status) {
        setColor(whiteboardPencilBtn, 'green');
        setColor(whiteboardObjectBtn, 'white');
        setColor(whiteboardEraserBtn, 'white');
        wbIsEraser = false;
    } else {
        setColor(whiteboardPencilBtn, 'white');
        setColor(whiteboardObjectBtn, 'green');
    }
}

function whiteboardIsEraser(status) {
    whiteboardIsDrawingMode(false);
    wbIsEraser = status;
    setColor(whiteboardEraserBtn, wbIsEraser ? 'green' : 'white');
}

function whiteboardAddObj(type) {
    switch (type) {
        case 'imgUrl':
            Swal.fire({
                background: swalBackground,
                title: 'Image URL',
                input: 'text',
                showCancelButton: true,
                confirmButtonText: 'OK',
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            }).then((result) => {
                if (result.isConfirmed) {
                    let wbCanvasImgURL = result.value;
                    if (isImageURL(wbCanvasImgURL)) {
                        fabric.Image.fromURL(wbCanvasImgURL, function (myImg) {
                            addWbCanvasObj(myImg);
                        });
                    } else {
                        userLog('error', 'The URL is not a valid image', 'top-end');
                    }
                }
            });
            break;
        case 'imgFile':
            setupFileSelection('Select the image', wbImageInput, renderImageToCanvas);
            break;
        case 'pdfFile':
            setupFileSelection('Select the PDF', wbPdfInput, renderPdfToCanvas);
            break;
        case 'text':
            const text = new fabric.IText('Lorem Ipsum', {
                top: 0,
                left: 0,
                fontFamily: 'Montserrat',
                fill: wbCanvas.freeDrawingBrush.color,
                strokeWidth: wbCanvas.freeDrawingBrush.width,
                stroke: wbCanvas.freeDrawingBrush.color,
            });
            addWbCanvasObj(text);
            break;
        case 'line':
            const line = new fabric.Line([50, 100, 200, 200], {
                top: 0,
                left: 0,
                fill: wbCanvas.freeDrawingBrush.color,
                strokeWidth: wbCanvas.freeDrawingBrush.width,
                stroke: wbCanvas.freeDrawingBrush.color,
            });
            addWbCanvasObj(line);
            break;
        case 'circle':
            const circle = new fabric.Circle({
                radius: 50,
                fill: 'transparent',
                stroke: wbCanvas.freeDrawingBrush.color,
                strokeWidth: wbCanvas.freeDrawingBrush.width,
            });
            addWbCanvasObj(circle);
            break;
        case 'rect':
            const rect = new fabric.Rect({
                top: 0,
                left: 0,
                width: 150,
                height: 100,
                fill: 'transparent',
                stroke: wbCanvas.freeDrawingBrush.color,
                strokeWidth: wbCanvas.freeDrawingBrush.width,
            });
            addWbCanvasObj(rect);
            break;
        case 'triangle':
            const triangle = new fabric.Triangle({
                top: 0,
                left: 0,
                width: 150,
                height: 100,
                fill: 'transparent',
                stroke: wbCanvas.freeDrawingBrush.color,
                strokeWidth: wbCanvas.freeDrawingBrush.width,
            });
            addWbCanvasObj(triangle);
            break;
        default:
            break;
    }
}

function setupFileSelection(title, accept, renderToCanvas) {
    Swal.fire({
        allowOutsideClick: false,
        background: swalBackground,
        position: 'center',
        title: title,
        input: 'file',
        html: `
        <div id="dropArea">
            <p>Drag and drop your file here</p>
        </div>
        `,
        inputAttributes: {
            accept: accept,
            'aria-label': title,
        },
        didOpen: () => {
            const dropArea = document.getElementById('dropArea');
            dropArea.addEventListener('dragenter', handleDragEnter);
            dropArea.addEventListener('dragover', handleDragOver);
            dropArea.addEventListener('dragleave', handleDragLeave);
            dropArea.addEventListener('drop', handleDrop);
        },
        showDenyButton: true,
        confirmButtonText: `OK`,
        denyButtonText: `Cancel`,
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' },
    }).then((result) => {
        if (result.isConfirmed) {
            renderToCanvas(result.value);
        }
    });

    function handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.style.background = 'var(--body-bg)';
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.style.background = '';
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
        e.target.style.background = '';
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            console.log('Selected file:', file);
            Swal.close();
            renderToCanvas(file);
        }
    }
}

function renderImageToCanvas(wbCanvasImg) {
    if (wbCanvasImg && wbCanvasImg.size > 0) {
        let reader = new FileReader();
        reader.onload = function (event) {
            let imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function () {
                let image = new fabric.Image(imgObj);
                image.set({ top: 0, left: 0 }).scale(0.3);
                addWbCanvasObj(image);
            };
        };
        reader.readAsDataURL(wbCanvasImg);
    }
}

async function renderPdfToCanvas(wbCanvasPdf) {
    if (wbCanvasPdf && wbCanvasPdf.size > 0) {
        let reader = new FileReader();
        reader.onload = async function (event) {
            wbCanvas.requestRenderAll();
            await pdfToImage(event.target.result, wbCanvas);
            whiteboardIsDrawingMode(false);
            wbCanvasToJson();
        };
        reader.readAsDataURL(wbCanvasPdf);
    }
}

function readBlob(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result));
        reader.addEventListener('error', reject);
        reader.readAsDataURL(blob);
    });
}

async function loadPDF(pdfData, pages) {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfData = pdfData instanceof Blob ? await readBlob(pdfData) : pdfData;
    const data = atob(pdfData.startsWith(Base64Prefix) ? pdfData.substring(Base64Prefix.length) : pdfData);
    try {
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        const numPages = pdf.numPages;
        const canvases = await Promise.all(
            Array.from({ length: numPages }, (_, i) => {
                const pageNumber = i + 1;
                if (pages && pages.indexOf(pageNumber) === -1) return null;
                return pdf.getPage(pageNumber).then(async (page) => {
                    const viewport = page.getViewport({ scale: window.devicePixelRatio });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };
                    await page.render(renderContext).promise;
                    return canvas;
                });
            }),
        );
        return canvases.filter((canvas) => canvas !== null);
    } catch (error) {
        console.error('Error loading PDF', error.message);
        throw error.message;
    }
}

async function pdfToImage(pdfData, canvas) {
    const scale = 1 / window.devicePixelRatio;
    try {
        const canvases = await loadPDF(pdfData);
        canvases.forEach(async (c) => {
            canvas.add(
                new fabric.Image(await c, {
                    scaleX: scale,
                    scaleY: scale,
                }),
            );
        });
    } catch (error) {
        console.error('Error converting PDF to images', error.message);
        throw error.message;
    }
}

function addWbCanvasObj(obj) {
    if (obj) {
        wbCanvas.add(obj).setActiveObject(obj);
        whiteboardIsDrawingMode(false);
        wbCanvasToJson();
    } else {
        console.error('Invalid input. Expected an obj of canvas elements');
    }
}

function setupWhiteboardLocalListners() {
    wbCanvas.on('mouse:down', function (e) {
        mouseDown(e);
    });
    wbCanvas.on('mouse:up', function () {
        mouseUp();
    });
    wbCanvas.on('mouse:move', function () {
        mouseMove();
    });
    wbCanvas.on('object:added', function () {
        objectAdded();
    });
}

function mouseDown(e) {
    wbIsDrawing = true;
    if (wbIsEraser && e.target) {
        wbCanvas.remove(e.target);
        return;
    }
}

function mouseUp() {
    wbIsDrawing = false;
    wbCanvasToJson();
}

function mouseMove() {
    if (wbIsEraser) {
        wbCanvas.hoverCursor = 'not-allowed';
        return;
    } else {
        wbCanvas.hoverCursor = 'move';
    }
    if (!wbIsDrawing) return;
}

function objectAdded() {
    if (!wbIsRedoing) wbPop = [];
    wbIsRedoing = false;
}

function wbCanvasBackgroundColor(color) {
    document.documentElement.style.setProperty('--wb-bg', color);
    wbBackgroundColorEl.value = color;
    wbCanvas.setBackgroundColor(color);
    wbCanvas.renderAll();
}

function wbCanvasUndo() {
    if (wbCanvas._objects.length > 0) {
        wbPop.push(wbCanvas._objects.pop());
        wbCanvas.renderAll();
    }
}

function wbCanvasRedo() {
    if (wbPop.length > 0) {
        wbIsRedoing = true;
        wbCanvas.add(wbPop.pop());
    }
}

function wbCanvasSaveImg() {
    const dataURL = wbCanvas.toDataURL({
        width: wbCanvas.getWidth(),
        height: wbCanvas.getHeight(),
        left: 0,
        top: 0,
        format: 'png',
    });
    const dataNow = getDataTimeString();
    const fileName = `whiteboard-${dataNow}.png`;
    saveDataToFile(dataURL, fileName);
}

function wbUpdate() {
    if (wbIsOpen && (!isRulesActive || isPresenter)) {
        console.log('IsPresenter: update whiteboard canvas to the participants in the room');
        wbCanvasToJson();
        whiteboardAction(getWhiteboardAction(wbIsLock ? 'lock' : 'unlock'));
    }
}

function wbCanvasToJson() {
    if (!isPresenter && wbIsLock) return;
    if (rc.thereAreParticipants()) {
        let wbCanvasJson = JSON.stringify(wbCanvas.toJSON());
        rc.socket.emit('wbCanvasToJson', wbCanvasJson);
    }
}

function JsonToWbCanvas(json) {
    if (!wbIsOpen) toggleWhiteboard();
    wbCanvas.loadFromJSON(json);
    wbCanvas.renderAll();
    if (!isPresenter && !wbCanvas.isDrawingMode && wbIsLock) {
        wbDrawing(false);
    }
}

function getWhiteboardAction(action) {
    return {
        peer_name: peer_name,
        action: action,
    };
}

function confirmClearBoard() {
    Swal.fire({
        background: swalBackground,
        imageUrl: image.delete,
        position: 'center',
        title: 'Clean the board',
        text: 'Are you sure you want to clean the board?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' },
    }).then((result) => {
        if (result.isConfirmed) {
            whiteboardAction(getWhiteboardAction('clear'));
            sound('delete');
        }
    });
}

function toggleLockUnlockWhiteboard() {
    wbIsLock = !wbIsLock;

    const btnToShow = wbIsLock ? whiteboardLockBtn : whiteboardUnlockBtn;
    const btnToHide = wbIsLock ? whiteboardUnlockBtn : whiteboardLockBtn;
    const btnColor = wbIsLock ? 'red' : 'white';
    const action = wbIsLock ? 'lock' : 'unlock';

    show(btnToShow);
    hide(btnToHide);
    setColor(whiteboardLockBtn, btnColor);

    whiteboardAction(getWhiteboardAction(action));

    if (wbIsLock) {
        userLog('info', 'The whiteboard is locked. \n The participants cannot interact with it.', 'top-right');
        sound('locked');
    }
}

function whiteboardAction(data, emit = true) {
    if (emit) {
        if (rc.thereAreParticipants()) {
            rc.socket.emit('whiteboardAction', data);
        }
    } else {
        userLog(
            'info',
            `${data.peer_name} <i class="fas fa-chalkboard-teacher"></i> whiteboard action: ${data.action}`,
            'top-end',
        );
    }

    switch (data.action) {
        case 'bgcolor':
            wbCanvasBackgroundColor(data.color);
            break;
        case 'undo':
            wbCanvasUndo();
            break;
        case 'redo':
            wbCanvasRedo();
            break;
        case 'clear':
            wbCanvas.clear();
            break;
        case 'lock':
            if (!isPresenter) {
                elemDisplay('whiteboardTitle', false);
                elemDisplay('whiteboardOptions', false);
                elemDisplay('whiteboardButton', false);
                wbDrawing(false);
                wbIsLock = true;
            }
            break;
        case 'unlock':
            if (!isPresenter) {
                elemDisplay('whiteboardTitle', true, 'flex');
                elemDisplay('whiteboardOptions', true, 'inline');
                elemDisplay('whiteboardButton', true);
                wbDrawing(true);
                wbIsLock = false;
            }
            break;
        case 'close':
            if (wbIsOpen) toggleWhiteboard();
            break;
        default:
            break;
        //...
    }
}

function wbDrawing(status) {
    wbCanvas.isDrawingMode = status; // Disable free drawing
    wbCanvas.selection = status; // Disable object selection
    wbCanvas.forEachObject(function (obj) {
        obj.selectable = status; // Make all objects unselectable
    });
}

// ####################################################
// HANDLE PARTICIPANTS
// ####################################################

async function getRemotePeerInfo(peer_id) {
    const peers = await getRoomPeers();
    for (let peer of Array.from(peers.keys()).filter((id) => id === peer_id)) {
        return peers.get(peer).peer_info;
    }
    return false;
}

async function getRoomPeers() {
    let room_info = await rc.getRoomInfo();
    return new Map(JSON.parse(room_info.peers));
}

async function saveRoomPeers() {
    const peers = await getRoomPeers();
    let peersToSave = [];
    for (let peer of Array.from(peers.keys())) {
        peersToSave.push(peers.get(peer).peer_info);
    }
    saveObjToJsonFile(peersToSave, 'PARTICIPANTS');
}

async function getRoomParticipants() {
    const peers = await getRoomPeers();
    const lists = getParticipantsList(peers);
    participantsCount = peers.size;
    participantsList.innerHTML = lists;
    refreshParticipantsCount(participantsCount, false);
    setParticipantsTippy(peers);
    console.log('*** Refresh Chat participant lists ***');
}

function getParticipantsList(peers) {
    let li = '';

    const chatGPT = BUTTONS.chat.chatGPT !== undefined ? BUTTONS.chat.chatGPT : true;

    // CHAT-GPT
    if (chatGPT) {
        li = `
        <li 
            id="ChatGPT" 
            data-to-id="ChatGPT"
            data-to-name="ChatGPT"
            class="clearfix" 
            onclick="rc.showPeerAboutAndMessages(this.id, 'ChatGPT', event)"
        >
            <img 
                src="${image.chatgpt}"
                alt="avatar"
            />
            <div class="about">
                <div class="name">ChatGPT</div>
                <div class="status"><i class="fa fa-circle online"></i> online</div>
            </div>
        </li>`;
    }

    // ALL
    li += `
    <li id="all"
        data-to-id="all"
        data-to-name="all"
        class="clearfix active" 
        onclick="rc.showPeerAboutAndMessages(this.id, 'all', event)"
    >
        <img 
            src="${image.all}"
            alt="avatar"
        />
        <div class="about">
            <div class="name">Public chat</div>
            <div class="status"> <i class="fa fa-circle online"></i> online ${participantsCount}</div>
        </div>`;

    // ONLY PRESENTER CAN EXECUTE THIS CMD
    if (!isRulesActive || isPresenter) {
        li += `
        <div style="class="dropdown">
            <button 
                class="dropdown-toggle" 
                type="button" 
                id="${socket.id}-chatDropDownMenu" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                style="float: right"
            >
            <!-- <i class="fas fa-bars"></i> -->
            <i class="fas fa-ellipsis-vertical"></i>
            </button>
            <ul class="dropdown-menu text-start" aria-labelledby="${socket.id}-chatDropDownMenu">`;

        li += `<li><button class="ml5" id="muteAllParticipantsButton" onclick="rc.peerAction('me','${socket.id}','mute',true,true)">${_PEER.audioOff} Mute all participants</button></li>`;
        li += `<li><button class="ml5" id="hideAllParticipantsButton" onclick="rc.peerAction('me','${socket.id}','hide',true,true)">${_PEER.videoOff} Hide all participants</button></li>`;
        li += `<li><button class="ml5" id="stopAllParticipantsButton" onclick="rc.peerAction('me','${socket.id}','stop',true,true)">${_PEER.screenOff} Stop all screens sharing</button></li>`;

        if (BUTTONS.participantsList.sendFileAllButton) {
            li += `<li><button class="btn-sm ml5" id="sendAllButton" onclick="rc.selectFileToShare('${socket.id}', true)">${_PEER.sendFile} Share file to all</button></li>`;
        }

        li += `<li><button class="btn-sm ml5" id="sendVideoToAll" onclick="rc.shareVideo('all');">${_PEER.sendVideo} Share audio/video to all</button></li>`;

        if (BUTTONS.participantsList.ejectAllButton) {
            li += `<li><button class="btn-sm ml5" id="ejectAllButton" onclick="rc.peerAction('me','${socket.id}','eject',true,true)">${_PEER.ejectPeer} Eject all participants</button></li>`;
        }

        li += `</ul>
        </div>

        <br/>

        <div class="about-buttons mt5">
            <button class="ml5" id="muteAllButton" onclick="rc.peerAction('me','${socket.id}','mute',true,true)">${_PEER.audioOff}</button>
            <button class="ml5" id="hideAllButton" onclick="rc.peerAction('me','${socket.id}','hide',true,true)">${_PEER.videoOff}</button>
            <button class="ml5" id="stopAllButton" onclick="rc.peerAction('me','${socket.id}','stop',true,true)">${_PEER.screenOff}</button>
        </div>`;
    }

    li += `
    </li>
    `;

    // PEERS IN THE CURRENT ROOM
    for (const peer of Array.from(peers.keys())) {
        const peer_info = peers.get(peer).peer_info;
        const peer_name = peer_info.peer_name;
        const peer_name_limited = peer_name.length > 15 ? peer_name.substring(0, 10) + '*****' : peer_name;
        //const peer_presenter = peer_info.peer_presenter ? _PEER.presenter : _PEER.guest;
        const peer_audio = peer_info.peer_audio ? _PEER.audioOn : _PEER.audioOff;
        const peer_video = peer_info.peer_video ? _PEER.videoOn : _PEER.videoOff;
        const peer_screen = peer_info.peer_screen ? _PEER.screenOn : _PEER.screenOff;
        const peer_hand = peer_info.peer_hand ? _PEER.raiseHand : _PEER.lowerHand;
        const peer_ban = _PEER.banPeer;
        const peer_eject = _PEER.ejectPeer;
        const peer_geoLocation = _PEER.geoLocation;
        const peer_sendFile = _PEER.sendFile;
        const peer_id = peer_info.peer_id;
        const peer_pubkey = peer_info.peer_pubkey;
        let peer_npub = peer_info.peer_npub;
        // comment out later
        if (peer_pubkey) {
            // only get the npub if there is a nostr pubkey
            peer_npub = nip19.npubEncode(peer_pubkey);
        }
        //        console.log("getParticipant list - peer_name :", peer_name, ", peer_pubkey :", peer_pubkey, "npub:", peer_npub)
        //        console.log("getParticipant list - setting avatarImg :", peer_info.peer_url)
        const avatarImg = peer_info.peer_url || getParticipantAvatar(peer_name);
        // || rc.genAvatarSvg(peer_name, 32);

        // NOT ME
        if (socket.id !== peer_id) {
            // PRESENTER HAS MORE OPTIONS
            if (isRulesActive && isPresenter) {
                li += `
                <li 
                    id='${peer_id}'
                    data-to-id="${peer_id}" 
                    data-to-name="${peer_name}"
                    class="clearfix" 
                    onclick="rc.showPeerAboutAndMessages(this.id, '${peer_name}', event)"
                >`;

                if (peer_npub) {
                    li += `                
                    <a href="https://njump.me/${peer_npub}" target="_blank">
                    <img
                    src="${avatarImg}"
                    alt="avatar" 
                    />
                    </a>`;
                } else {
                    li += `<img src="${avatarImg}" alt="avatar" />`;
                }

                li += `
                    <div class="about">
                        <div class="name">${peer_name_limited}</div>
                        <div class="status"> <i class="fa fa-circle online"></i> online <i id="${peer_id}-unread-msg" class="fas fa-comments hidden"></i> </div>
                    </div>

                    <div style="class="dropdown">
                        <button 
                            class="dropdown-toggle" 
                            type="button" 
                            id="${peer_id}-chatDropDownMenu" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                            style="float: right"
                        >
                        <!-- <i class="fas fa-bars"></i> -->
                        <i class="fas fa-ellipsis-vertical"></i>
                        </button>
                        <ul class="dropdown-menu text-start" aria-labelledby="${peer_id}-chatDropDownMenu">`;

                li += `<li><button class="ml5" id='${peer_id}___pAudioMute' onclick="rc.peerAction('me',this.id,'mute')">${_PEER.audioOn} Toggle audio</button></li>`;
                li += `<li><button class="ml5" id='${peer_id}___pVideoHide' onclick="rc.peerAction('me',this.id,'hide')">${_PEER.videoOn} Toggle video</button></li>`;
                li += `<li><button class="ml5" id='${peer_id}___pScreenStop' onclick="rc.peerAction('me',this.id,'stop')">${_PEER.screenOn} Toggle screen</button></li>`;

                if (BUTTONS.participantsList.sendFileButton) {
                    li += `<li><button class="btn-sm ml5" id='${peer_id}___shareFile' onclick="rc.selectFileToShare('${peer_id}', false)">${peer_sendFile} Share file</button></li>`;
                }

                li += `<li><button class="btn-sm ml5" id="${peer_id}___sendVideoTo" onclick="rc.shareVideo('${peer_id}');">${_PEER.sendVideo} Share audio/video</button></li>`;

                if (BUTTONS.participantsList.geoLocationButton) {
                    li += `<li><button class="btn-sm ml5" id='${peer_id}___geoLocation' onclick="rc.askPeerGeoLocation(this.id)">${peer_geoLocation} Get geolocation</button></li>`;
                }
                if (BUTTONS.participantsList.banButton) {
                    li += `<li><button class="btn-sm ml5" id='${peer_id}___pBan' onclick="rc.peerAction('me',this.id,'ban')">${peer_ban} Ban participant</button></li>`;
                }
                if (BUTTONS.participantsList.ejectButton) {
                    li += `<li><button class="btn-sm ml5" id='${peer_id}___pEject' onclick="rc.peerAction('me',this.id,'eject')">${peer_eject} Eject participant</button></li>`;
                }

                li += `</ul>
                    </div>

                    <br/>

                    <div class="about-buttons mt5"> 
                        <button class="ml5" id='${peer_id}___pAudio' onclick="rc.peerAction('me',this.id,'mute')">${peer_audio}</button>
                        <button class="ml5" id='${peer_id}___pVideo' onclick="rc.peerAction('me',this.id,'hide')">${peer_video}</button>
                        <button class="ml5" id='${peer_id}___pScreen' onclick="rc.peerAction('me',this.id,'stop')">${peer_screen}</button>
                `;

                // li += `
                //         <button class="ml5" >${peer_presenter}</button>`;

                if (peer_info.peer_hand) {
                    li += `
                        <button class="ml5" >${peer_hand}</button>`;
                }

                li += ` 
                    </div>
                </li>
                `;
            } else {
                // GUEST USER
                li += `
                <li 
                    id='${peer_id}' 
                    data-to-id="${peer_id}"
                    data-to-name="${peer_name}"
                    class="clearfix" 
                    onclick="rc.showPeerAboutAndMessages(this.id, '${peer_name}', event)"
                >`;

                if (peer_npub) {
                    li += `                
                    <a href="https://njump.me/${peer_npub}" target="_blank">
                    <img
                    src="${avatarImg}"
                    alt="avatar" 
                    />
                    </a>`;
                } else {
                    li += `<img src="${avatarImg}" alt="avatar" />`;
                }

                li += `
                    <div class="about">
                        <div class="name">${peer_name_limited}</div>
                        <div class="status"> <i class="fa fa-circle online"></i> online <i id="${peer_id}-unread-msg" class="fas fa-comments hidden"></i> </div>
                    </div>
                `;

                // NO ROOM BROADCASTING
                if (!isBroadcastingEnabled) {
                    li += `
                    <div style="class="dropdown">
                        <button 
                            class="dropdown-toggle" 
                            type="button" 
                            id="${peer_id}-chatDropDownMenu" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                            style="float: right"
                        >
                        <!-- <i class="fas fa-bars"></i> -->
                        <i class="fas fa-ellipsis-vertical"></i>
                        </button>
                        <ul class="dropdown-menu text-start" aria-labelledby="${peer_id}-chatDropDownMenu">`;

                    if (BUTTONS.participantsList.sendFileButton) {
                        li += `<li><button class="btn-sm ml5" id='${peer_id}___shareFile' onclick="rc.selectFileToShare('${peer_id}', false)">${peer_sendFile} Share file</button></li>`;
                    }

                    li += `<li><button class="btn-sm ml5" id="${peer_id}___sendVideoTo" onclick="rc.shareVideo('${peer_id}');">${_PEER.sendVideo} Share Audio/Video</button></li>
                        </ul>
                    </div>
                    `;
                }

                li += `
                    <br/>

                    <div class="about-buttons mt5"> 
                        <button class="ml5" id='${peer_id}___pAudio' onclick="rc.peerGuestNotAllowed('audio')">${peer_audio}</button>
                        <button class="ml5" id='${peer_id}___pVideo' onclick="rc.peerGuestNotAllowed('video')">${peer_video}</button>
                        <button class="ml5" id='${peer_id}___pScreen' onclick="rc.peerGuestNotAllowed('screen')">${peer_screen}</button>
                        `;

                // li += `
                //         <button class="ml5" >${peer_presenter}</button>`;

                if (peer_info.peer_hand) {
                    li += ` 
                        <button class="ml5" >${peer_hand}</button>`;
                }

                li += ` 
                    </div>
                </li>
                `;
            }
        }
    }
    return li;
}

function setParticipantsTippy(peers) {
    //
    if (!DetectRTC.isMobileDevice) {
        setTippy('muteAllButton', 'Mute all participants', 'top');
        setTippy('hideAllButton', 'Hide all participants', 'top');
        setTippy('stopAllButton', 'Stop screen share to all participants', 'top');
        //
        for (let peer of Array.from(peers.keys())) {
            const peer_info = peers.get(peer).peer_info;
            const peer_id = peer_info.peer_id;

            const peerAudioBtn = rc.getId(peer_id + '___pAudio');
            const peerVideoBtn = rc.getId(peer_id + '___pVideo');
            const peerScreenBtn = rc.getId(peer_id + '___pScreen');

            if (peerAudioBtn) setTippy(peerAudioBtn.id, 'Mute', 'top');
            if (peerVideoBtn) setTippy(peerVideoBtn.id, 'Hide', 'top');
            if (peerScreenBtn) setTippy(peerScreenBtn.id, 'Stop', 'top');
        }
    }
}

function refreshParticipantsCount(count, adapt = true) {
    if (adapt) adaptAspectRatio(count);
}

function getParticipantAvatar(peerName) {
    // console.log("getParticipantAvatar - peerName: ", peerName);
    isValidLightningAddress(peerName).then((isValid) => {
        if (isValid) {
            return boltavatar;
        }
    });
    if (rc.isValidEmail(peerName)) {
        return rc.genGravatar(peerName);
    }
    return rc.genAvatarSvg(peerName, 32);
}

// ####################################################
// SET THEME
// ####################################################

function setCustomTheme() {
    const color = themeCustom.color;
    swalBackground = `radial-gradient(${color}, ${color})`;
    document.documentElement.style.setProperty('--body-bg', `radial-gradient(${color}, ${color})`);
    document.documentElement.style.setProperty('--trx-bg', `radial-gradient(${color}, ${color})`);
    document.documentElement.style.setProperty('--msger-bg', `radial-gradient(${color}, ${color})`);
    document.documentElement.style.setProperty('--left-msg-bg', `${color}`);
    document.documentElement.style.setProperty('--right-msg-bg', `${color}`);
    document.documentElement.style.setProperty('--select-bg', `${color}`);
    document.documentElement.style.setProperty('--tab-btn-active', `${color}`);
    document.documentElement.style.setProperty('--settings-bg', `radial-gradient(${color}, ${color})`);
    document.documentElement.style.setProperty('--wb-bg', `radial-gradient(${color}, ${color})`);
    // document.documentElement.style.setProperty('--btns-bg-color', `${color}`);
    document.documentElement.style.setProperty('--btns-bg-color', 'rgba(0, 0, 0, 0.7)');
    document.documentElement.style.setProperty('--dd-color', '#FFFFFF');
    document.body.style.background = `radial-gradient(${color}, ${color})`;
}

function setTheme() {
    if (themeCustom.keep) return setCustomTheme();

    selectTheme.selectedIndex = localStorageSettings.theme;
    const theme = selectTheme.value;
    switch (theme) {
        case 'default':
            swalBackground = 'linear-gradient(135deg, #000000, #434343)';
            document.documentElement.style.setProperty('--body-bg', 'linear-gradient(135deg, #000000, #434343)');
            document.documentElement.style.setProperty('--trx-bg', 'linear-gradient(135deg, #000000, #434343)');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(135deg, #000000, #434343)');
            document.documentElement.style.setProperty('--left-msg-bg', '#1a1a1a');
            document.documentElement.style.setProperty('--right-msg-bg', '#2e2e2e');
            document.documentElement.style.setProperty('--select-bg', '#333333');
            document.documentElement.style.setProperty('--tab-btn-active', '#434343');
            document.documentElement.style.setProperty('--settings-bg', 'linear-gradient(135deg, #000000, #434343)');
            document.documentElement.style.setProperty('--wb-bg', 'linear-gradient(135deg, #000000, #434343)');
            document.documentElement.style.setProperty('--btns-bg-color', 'rgba(0, 0, 0, 0.7)');
            document.documentElement.style.setProperty('--dd-color', '#FFFFFF');
            document.body.style.background = 'linear-gradient(135deg, #000000, #434343)';
            selectTheme.selectedIndex = 0;
            break;
        case 'dark':
            swalBackground = 'linear-gradient(135deg, #000000, #1a1a1a)';
            document.documentElement.style.setProperty('--body-bg', 'linear-gradient(135deg, #000000, #1a1a1a)');
            document.documentElement.style.setProperty('--trx-bg', 'linear-gradient(135deg, #000000, #1a1a1a)');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(135deg, #000000, #1a1a1a)');
            document.documentElement.style.setProperty('--left-msg-bg', '#0d0d0d');
            document.documentElement.style.setProperty('--right-msg-bg', '#1a1a1a');
            document.documentElement.style.setProperty('--select-bg', '#1a1a1a');
            document.documentElement.style.setProperty('--tab-btn-active', '#1a1a1a');
            document.documentElement.style.setProperty('--settings-bg', 'linear-gradient(135deg, #000000, #1a1a1a)');
            document.documentElement.style.setProperty('--wb-bg', 'linear-gradient(135deg, #000000, #1a1a1a)');
            document.documentElement.style.setProperty('--btns-bg-color', 'rgba(0, 0, 0, 0.85)');
            document.documentElement.style.setProperty('--dd-color', '#FFFFFF');
            document.body.style.background = 'linear-gradient(135deg, #000000, #1a1a1a)';
            selectTheme.selectedIndex = 1;
            break;
        case 'grey':
            swalBackground = 'linear-gradient(135deg, #1a1a1a, #4f4f4f)';
            document.documentElement.style.setProperty('--body-bg', 'linear-gradient(135deg, #1a1a1a, #4f4f4f)');
            document.documentElement.style.setProperty('--trx-bg', 'linear-gradient(135deg, #1a1a1a, #4f4f4f)');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(135deg, #1a1a1a, #4f4f4f)');
            document.documentElement.style.setProperty('--left-msg-bg', '#2c2c2c');
            document.documentElement.style.setProperty('--right-msg-bg', '#3f3f3f');
            document.documentElement.style.setProperty('--select-bg', '#2a2a2a');
            document.documentElement.style.setProperty('--tab-btn-active', '#4f4f4f');
            document.documentElement.style.setProperty('--settings-bg', 'linear-gradient(135deg, #1a1a1a, #4f4f4f)');
            document.documentElement.style.setProperty('--wb-bg', 'linear-gradient(135deg, #1a1a1a, #4f4f4f)');
            document.documentElement.style.setProperty('--btns-bg-color', 'rgba(0, 0, 0, 0.7)');
            document.documentElement.style.setProperty('--dd-color', '#FFFFFF');
            document.body.style.background = 'linear-gradient(135deg, #1a1a1a, #4f4f4f)';
            selectTheme.selectedIndex = 2;
            break;
        case 'green':
            swalBackground = 'linear-gradient(135deg, #002a22, #004d40)';
            document.documentElement.style.setProperty('--body-bg', 'linear-gradient(135deg, #002a22, #004d40)');
            document.documentElement.style.setProperty('--trx-bg', 'linear-gradient(135deg, #002a22, #004d40)');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(135deg, #002a22, #004d40)');
            document.documentElement.style.setProperty('--left-msg-bg', '#001d1a');
            document.documentElement.style.setProperty('--right-msg-bg', '#003d2e');
            document.documentElement.style.setProperty('--select-bg', '#002a22');
            document.documentElement.style.setProperty('--tab-btn-active', '#004d40');
            document.documentElement.style.setProperty('--settings-bg', 'linear-gradient(135deg, #002a22, #004d40)');
            document.documentElement.style.setProperty('--wb-bg', 'linear-gradient(135deg, #002a22, #004d40)');
            document.documentElement.style.setProperty('--btns-bg-color', 'rgba(0, 42, 34, 0.7)');
            document.documentElement.style.setProperty('--dd-color', '#00FF00');
            document.body.style.background = 'linear-gradient(135deg, #002a22, #004d40)';
            selectTheme.selectedIndex = 3;
            break;
        case 'blue':
            swalBackground = 'linear-gradient(135deg, #00274d, #004d80)';
            document.documentElement.style.setProperty('--body-bg', 'linear-gradient(135deg, #00274d, #004d80)');
            document.documentElement.style.setProperty('--trx-bg', 'linear-gradient(135deg, #00274d, #004d80)');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(135deg, #00274d, #004d80)');
            document.documentElement.style.setProperty('--left-msg-bg', '#001f3f');
            document.documentElement.style.setProperty('--right-msg-bg', '#003366');
            document.documentElement.style.setProperty('--select-bg', '#00274d');
            document.documentElement.style.setProperty('--tab-btn-active', '#004d80');
            document.documentElement.style.setProperty('--settings-bg', 'linear-gradient(135deg, #00274d, #004d80)');
            document.documentElement.style.setProperty('--wb-bg', 'linear-gradient(135deg, #00274d, #004d80)');
            document.documentElement.style.setProperty('--btns-bg-color', 'rgba(0, 39, 77, 0.7)');
            document.documentElement.style.setProperty('--dd-color', '#1E90FF');
            document.body.style.background = 'linear-gradient(135deg, #00274d, #004d80)';
            selectTheme.selectedIndex = 4;
            break;
        case 'red':
            swalBackground = 'linear-gradient(135deg, #2a0d0d, #4d1a1a)';
            document.documentElement.style.setProperty('--body-bg', 'linear-gradient(135deg, #2a0d0d, #4d1a1a)');
            document.documentElement.style.setProperty('--trx-bg', 'linear-gradient(135deg, #2a0d0d, #4d1a1a)');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(135deg, #2a0d0d, #4d1a1a)');
            document.documentElement.style.setProperty('--left-msg-bg', '#2b0f0f');
            document.documentElement.style.setProperty('--right-msg-bg', '#4d1a1a');
            document.documentElement.style.setProperty('--select-bg', '#2a0d0d');
            document.documentElement.style.setProperty('--tab-btn-active', '#4d1a1a');
            document.documentElement.style.setProperty('--settings-bg', 'linear-gradient(135deg, #2a0d0d, #4d1a1a)');
            document.documentElement.style.setProperty('--wb-bg', 'linear-gradient(135deg, #2a0d0d, #4d1a1a)');
            document.documentElement.style.setProperty('--btns-bg-color', 'rgba(42, 13, 13, 0.7)');
            document.documentElement.style.setProperty('--dd-color', '#FF4500');
            document.body.style.background = 'linear-gradient(135deg, #2a0d0d, #4d1a1a)';
            selectTheme.selectedIndex = 5;
            break;
        case 'purple':
            swalBackground = 'linear-gradient(135deg, #2a001d, #4d004a)';
            document.documentElement.style.setProperty('--body-bg', 'linear-gradient(135deg, #2a001d, #4d004a)');
            document.documentElement.style.setProperty('--trx-bg', 'linear-gradient(135deg, #2a001d, #4d004a)');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(135deg, #2a001d, #4d004a)');
            document.documentElement.style.setProperty('--left-msg-bg', '#1b0014');
            document.documentElement.style.setProperty('--right-msg-bg', '#3e002a');
            document.documentElement.style.setProperty('--select-bg', '#2a001d');
            document.documentElement.style.setProperty('--tab-btn-active', '#4d004a');
            document.documentElement.style.setProperty('--settings-bg', 'linear-gradient(135deg, #2a001d, #4d004a)');
            document.documentElement.style.setProperty('--wb-bg', 'linear-gradient(135deg, #2a001d, #4d004a)');
            document.documentElement.style.setProperty('--btns-bg-color', 'rgba(42, 0, 29, 0.7)');
            document.documentElement.style.setProperty('--dd-color', '#BF00FF');
            document.body.style.background = 'linear-gradient(135deg, #2a001d, #4d004a)';
            selectTheme.selectedIndex = 6;
            break;
        case 'orange':
            swalBackground = 'linear-gradient(135deg, #3d1a00, #ff8c00)';
            document.documentElement.style.setProperty('--body-bg', 'linear-gradient(135deg, #3d1a00, #ff8c00)');
            document.documentElement.style.setProperty('--trx-bg', 'linear-gradient(135deg, #3d1a00, #ff8c00)');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(135deg, #3d1a00, #ff8c00)');
            document.documentElement.style.setProperty('--left-msg-bg', '#2c0f00');
            document.documentElement.style.setProperty('--right-msg-bg', '#ff8c00');
            document.documentElement.style.setProperty('--select-bg', '#3d1a00');
            document.documentElement.style.setProperty('--tab-btn-active', '#ff8c00');
            document.documentElement.style.setProperty('--settings-bg', 'linear-gradient(135deg, #3d1a00, #ff8c00)');
            document.documentElement.style.setProperty('--wb-bg', 'linear-gradient(135deg, #3d1a00, #ff8c00)');
            document.documentElement.style.setProperty('--btns-bg-color', 'rgba(61, 26, 0, 0.7)');
            document.documentElement.style.setProperty('--dd-color', '#FFA500');
            document.body.style.background = 'linear-gradient(135deg, #3d1a00, #ff8c00)';
            selectTheme.selectedIndex = 7;
            break;
        case 'pink':
            swalBackground = 'linear-gradient(135deg, #4d001d, #ff66b2)';
            document.documentElement.style.setProperty('--body-bg', 'linear-gradient(135deg, #4d001d, #ff66b2)');
            document.documentElement.style.setProperty('--trx-bg', 'linear-gradient(135deg, #4d001d, #ff66b2)');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(135deg, #4d001d, #ff66b2)');
            document.documentElement.style.setProperty('--left-msg-bg', '#3e0016');
            document.documentElement.style.setProperty('--right-msg-bg', '#ff66b2');
            document.documentElement.style.setProperty('--select-bg', '#4d001d');
            document.documentElement.style.setProperty('--tab-btn-active', '#ff66b2');
            document.documentElement.style.setProperty('--settings-bg', 'linear-gradient(135deg, #4d001d, #ff66b2)');
            document.documentElement.style.setProperty('--wb-bg', 'linear-gradient(135deg, #4d001d, #ff66b2)');
            document.documentElement.style.setProperty('--btns-bg-color', 'rgba(77, 0, 29, 0.7)');
            document.documentElement.style.setProperty('--dd-color', '#FF1493');
            document.body.style.background = 'linear-gradient(135deg, #4d001d, #ff66b2)';
            selectTheme.selectedIndex = 8;
            break;
        case 'yellow':
            swalBackground = 'linear-gradient(135deg, #4d3b00, #ffc107)';
            document.documentElement.style.setProperty('--body-bg', 'linear-gradient(135deg, #4d3b00, #ffc107)');
            document.documentElement.style.setProperty('--trx-bg', 'linear-gradient(135deg, #4d3b00, #ffc107)');
            document.documentElement.style.setProperty('--msger-bg', 'linear-gradient(135deg, #4d3b00, #ffc107)');
            document.documentElement.style.setProperty('--left-msg-bg', '#3b2d00');
            document.documentElement.style.setProperty('--right-msg-bg', '#ffc107');
            document.documentElement.style.setProperty('--select-bg', '#4d3b00');
            document.documentElement.style.setProperty('--tab-btn-active', '#ffc107');
            document.documentElement.style.setProperty('--settings-bg', 'linear-gradient(135deg, #4d3b00, #ffc107)');
            document.documentElement.style.setProperty('--wb-bg', 'linear-gradient(135deg, #4d3b00, #ffc107)');
            document.documentElement.style.setProperty('--btns-bg-color', 'rgba(77, 59, 0, 0.7)');
            document.documentElement.style.setProperty('--dd-color', '#FFD700');
            document.body.style.background = 'linear-gradient(135deg, #4d3b00, #ffc107)';
            selectTheme.selectedIndex = 9;
            break;
        default:
            break;
    }
    wbIsBgTransparent = false;
    if (rc) rc.isChatBgTransparent = false;
}

// ####################################################
// HANDLE ASPECT RATIO
// ####################################################

function handleAspectRatio() {
    if (participantsCount > 1) {
        adaptAspectRatio(videoMediaContainer.childElementCount);
    } else {
        resizeVideoMedia();
    }
}

function adaptAspectRatio(participantsCount) {
    /* 
        ['0:0', '4:3', '16:9', '1:1', '1:2'];
    */
    let desktop,
        mobile = 1;
    // desktop aspect ratio
    switch (participantsCount) {
        case 1:
        case 3:
        case 4:
        case 7:
        case 9:
            desktop = 2; // (16:9)
            break;
        case 5:
        case 6:
        case 10:
        case 11:
            desktop = 1; // (4:3)
            break;
        case 2:
        case 8:
            desktop = 3; // (1:1)
            break;
        default:
            desktop = 0; // (0:0)
    }
    // mobile aspect ratio
    switch (participantsCount) {
        case 3:
        case 9:
        case 10:
            mobile = 2; // (16:9)
            break;
        case 2:
        case 7:
        case 8:
        case 11:
            mobile = 1; // (4:3)
            break;
        case 1:
        case 4:
        case 5:
        case 6:
            mobile = 3; // (1:1)
            break;
        default:
            mobile = 3; // (1:1)
    }
    if (participantsCount > 11) {
        desktop = 1; // (4:3)
        mobile = 3; // (1:1)
    }
    BtnAspectRatio.selectedIndex = DetectRTC.isMobileDevice ? mobile : desktop;
    setAspectRatio(BtnAspectRatio.selectedIndex);
}

// ####################################################
// ABOUT
// ####################################################

function showAbout() {
    sound('open');
    let extractedIdentifier = 'soc@hivetalk.org';
    Swal.fire({
        background: swalBackground,
        imageUrl: image.about,
        customClass: { image: 'img-about' },
        position: 'center',
        title: 'HiveTalk',
        html: `
        <div id="about">
            <b>  Zap the developer: ${extractedIdentifier} </b><br/><br/>
                <label for="amount" style="font-size: 1.2em;">
                Amount (sats): </label>
                <input type="number" id="amount" class="swal2-input" placeholder="Enter amount" value="21">

        <br /> <br />
           Need help? Ask an admin in <a href="https://t.me/+2Ll1IFwXwCJlMGFl" target="_blank"  style="color: #3085d6;"> Telegram</a>.<br/>
           Find out more about this project on <a href="https://github.com/hivetalk" target="_blank"  style="color: #3085d6;"> Github</a>
            <br/><br/>

        </div>
        `,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Zap!',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'red',
        cancelButtonText: 'Close',
        // showClass: { popup: 'animate__animated animate__fadeInDown' },
        // hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        preConfirm: () => {
            const amount = document.getElementById('amount').value;
            // adjust amount to ln address specified range
            if (!amount || amount <= 0) {
                Swal.showValidationMessage('Please enter a valid amount');
                return false;
            }
            return amount;
        },
    }).then((result) => {
        if (result.isConfirmed) {
            let amt = result.value;
            console.log('Amount:', amt);
            console.log('lightning address:', extractedIdentifier);

            window.moduleFunctions
                .handleDonation(peer_name, extractedIdentifier, amt)
                .then((result) => {
                    console.log('handleDonationResult:', result);
                    // send zap msg to chat emoji pop up
                    boltEmoji(extractedIdentifier + ' ' + amt + ' sats');
                    // send zap message to chatroom if open
                    rc.broadcastMessage(result);
                })
                .catch((error) => {
                    console.log('Error:', error);
                });
        }
    });
}
