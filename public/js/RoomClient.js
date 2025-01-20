'use strict';

/**
 * MiroTalk SFU - Client component
 *
 * @link    GitHub: https://github.com/miroslavpejic85/mirotalksfu
 * @link    Official Live demo: https://sfu.mirotalk.com
 * @license For open source use: AGPLv3
 * @license For commercial or closed source, contact us at license.mirotalk@gmail.com or purchase directly via CodeCanyon
 * @license CodeCanyon: https://codecanyon.net/item/mirotalk-sfu-webrtc-realtime-video-conferences/40769970
 * @author  Miroslav Pejic - miroslav.pejic.85@gmail.com
 * @version 1.6.10
 *
 */

const cfg = {
    useAvatarSvg: true,
};

const html = {
    newline: '\n', //'<br />',
    hideMeOn: 'fas fa-user-slash',
    hideMeOff: 'fas fa-user',
    audioOn: 'fas fa-microphone',
    audioOff: 'fas fa-microphone-slash',
    videoOn: 'fas fa-video',
    videoOff: 'fas fa-video-slash',
    userName: 'username',
    nostrIcon: 'nostr-image-button',
    zapIcon: 'zap-image-button',
    userHand: 'fas fa-hand-paper pulsate',
    pip: 'fas fa-images',
    fullScreen: 'fas fa-expand',
    fullScreenOn: 'fas fa-compress-alt',
    fullScreenOff: 'fas fa-expand-alt',
    snapshot: 'fas fa-camera-retro',
    sendFile: 'fas fa-upload',
    sendMsg: 'fas fa-paper-plane',
    sendVideo: 'fab fa-youtube',
    geolocation: 'fas fa-location-dot',
    ban: 'fas fa-ban',
    kickOut: 'fas fa-times',
    ghost: 'fas fa-ghost',
    undo: 'fas fa-undo',
    bg: 'fas fa-circle-half-stroke',
    pin: 'fas fa-map-pin',
    videoPrivacy: 'far fa-circle',
    expand: 'fas fa-bars dropdown-button',
    hideALL: 'fas fa-eye',
    mirror: 'fas fa-arrow-right-arrow-left',
    close: 'fas fa-times',
    stop: 'fas fa-circle-stop',
};

const icons = {
    room: '<i class="fas fa-home"></i>',
    chat: '<i class="fas fa-comments"></i>',
    user: '<i class="fas fa-user"></i>',
    transcript: '<i class="fas fa-closed-captioning"></i>',
    speech: '<i class="fas fa-volume-high"></i>',
    share: '<i class="fas fa-share-alt"></i>',
    ptt: '<i class="fa-solid fa-hand-pointer"></i>',
    lobby: '<i class="fas fa-shield-halved"></i>',
    lock: '<i class="fa-solid fa-lock"></i>',
    unlock: '<i class="fa-solid fa-lock-open"></i>',
    pitchBar: '<i class="fas fa-microphone-lines"></i>',
    mirror: '<i class="fas fa-arrow-right-arrow-left"></i>',
    sounds: '<i class="fas fa-music"></i>',
    fileSend: '<i class="fa-solid fa-file-export"></i>',
    fileReceive: '<i class="fa-solid fa-file-import"></i>',
    recording: '<i class="fas fa-record-vinyl"></i>',
    moderator: '<i class="fas fa-user-shield"></i>',
    broadcaster: '<i class="fa-solid fa-wifi"></i>',
    codecs: '<i class="fa-solid fa-film"></i>',
    theme: '<i class="fas fa-fill-drip"></i>',
    recSync: '<i class="fa-solid fa-cloud-arrow-up"></i>',
    refresh: '<i class="fas fa-rotate"></i>',
    editor: '<i class="fas fa-pen-to-square"></i>',
    up: '<i class="fas fa-chevron-up"></i>',
    down: '<i class="fas fa-chevron-down"></i>',
};

const image = {
    //about: '../images/hivelogo50x200.svg',
    // avatar: '../images/mirotalksfu-logo.png',
    about: '',
    avatar: '',
    audio: '../images/audio.gif',
    poster: '../images/loader.gif',
    rec: '../images/rec.png',
    recording: '../images/recording.png',
    delete: '../images/delete.png',
    locked: '../images/locked.png',
    mute: '../images/mute.png',
    hide: '../images/hide.png',
    stop: '../images/stop.png',
    unmute: '../images/unmute.png',
    unhide: '../images/unhide.png',
    start: '../images/start.png',
    users: '../images/participants.png',
    user: '../images/participant.png',
    username: '../images/user.png',
    videoShare: '../images/video-share.png',
    message: '../images/message.png',
    share: '../images/share.png',
    exit: '../images/exit.png',
    feedback: '../images/feedback.png',
    lobby: '../images/lobby.png',
    email: '../images/email.png',
    chatgpt: '../images/chatgpt.png',
    all: '../images/all.png',
    forbidden: '../images/forbidden.png',
    broadcasting: '../images/broadcasting.png',
    geolocation: '../images/geolocation.png',
    network: '../images/network.gif',
    rtmp: '../images/rtmp.png',
    save: '../images/save.png',
};

const mediaType = {
    audio: 'audioType',
    audioTab: 'audioTab',
    video: 'videoType',
    camera: 'cameraType',
    screen: 'screenType',
    speaker: 'speakerType',
};

const _EVENTS = {
    openRoom: 'openRoom',
    exitRoom: 'exitRoom',
    startRec: 'startRec',
    pauseRec: 'pauseRec',
    resumeRec: 'resumeRec',
    stopRec: 'stopRec',
    raiseHand: 'raiseHand',
    lowerHand: 'lowerHand',
    startVideo: 'startVideo',
    pauseVideo: 'pauseVideo',
    resumeVideo: 'resumeVideo',
    stopVideo: 'stopVideo',
    startAudio: 'startAudio',
    pauseAudio: 'pauseAudio',
    resumeAudio: 'resumeAudio',
    stopAudio: 'stopAudio',
    startScreen: 'startScreen',
    pauseScreen: 'pauseScreen',
    resumeScreen: 'resumeScreen',
    stopScreen: 'stopScreen',
    roomLock: 'roomLock',
    lobbyOn: 'lobbyOn',
    lobbyOff: 'lobbyOff',
    roomUnlock: 'roomUnlock',
    hostOnlyRecordingOn: 'hostOnlyRecordingOn',
    hostOnlyRecordingOff: 'hostOnlyRecordingOff',
    startRTMP: 'startRTMP',
    stopRTMP: 'stopRTMP',
    endRTMP: 'endRTMP',
    startRTMPfromURL: 'startRTMPfromURL',
    stopRTMPfromURL: 'stopRTMPfromURL',
    endRTMPfromURL: 'endRTMPfromURL',
};

// Enums
const enums = {
    recording: {
        started: 'Started conference recording',
        start: 'Start conference recording',
        stop: 'Stop conference recording',
    },
    //...
};

// HeyGen config
const VideoAI = {
    enabled: true,
    active: false,
    info: {},
    avatarId: null,
    avatarName: 'Monica',
    avatarVoice: null,
    quality: 'medium',
    virtualBackground: true,
    background: '../images/virtual/1.jpg',
};

// Recording
let recordedBlobs = [];

// HANDLE LIGHTNING

function handleLightning(zp) {
    zp.addEventListener('click', function () {
        let id = this.id;
        let extractedIdentifier = id.split('__')[0];
        Swal.fire({
            background: swalBackground,
            title: `Zap ${extractedIdentifier}`,
            html: `
                <label for="amount" style="font-size: 1.2em;">Amount (sats): </label>
                <input type="number" id="amount" class="swal2-input" placeholder="Enter amount" value="21">
                <button id="preset-21" class="swal2-confirm swal2-styled" style="margin-right: 10px;">21</button>
                <button id="preset-100" class="swal2-confirm swal2-styled" style="margin-right: 10px;">100</button>
                <button id="preset-500" class="swal2-confirm swal2-styled" style="margin-right: 10px;">500</button>
                <button id="preset-1000" class="swal2-confirm swal2-styled">1000</button>
            `,
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: 'OK',
            confirmButtonColor: 'green',
            cancelButtonColor: 'red',
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
        document.getElementById('preset-21').addEventListener('click', function () {
            document.getElementById('amount').value = 21;
        });
        document.getElementById('preset-100').addEventListener('click', function () {
            document.getElementById('amount').value = 100;
        });
        document.getElementById('preset-500').addEventListener('click', function () {
            document.getElementById('amount').value = 500;
        });
        document.getElementById('preset-1000').addEventListener('click', function () {
            document.getElementById('amount').value = 1000;
        });
    });
}

// ####################################################
// HANDLE NOSTR
// ####################################################

// Define the getProfile for Nostr - temporarily get it from njump.me
function getProfile(eventParam) {
    var host = 'https://njump.me';

    var width = '100%'; // Set default width
    var height = '100%'; // Set default height
    var iframe = document.createElement('iframe');
    iframe.src = host + '/' + eventParam + '?embed=yes';
    //iframe.src = host + '/' + eventParam;
    iframe.style.width = width;
    iframe.style.height = 800 + 'px';
    iframe.style.border = 'none'; // Remove the border

    // Add a class to easily permit overwriting the styles
    iframe.classList.add('nostr-embedded');

    // Listen for messages from the iframe
    window.addEventListener('message', function (event) {
        console.log('Message received:', event.data);
        iframe.onload = function () {
            // This code will execute when the iframe content has loaded
            iframe.contentWindow.postMessage({ setDarkMode: true }, '*');
        };
    });
    return iframe;
}

class RoomClient {
    constructor(
        localAudioEl,
        remoteAudioEl,
        videoMediaContainer,
        videoPinMediaContainer,
        mediasoupClient,
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
        successCallback,
    ) {
        this.localAudioEl = localAudioEl;
        this.remoteAudioEl = remoteAudioEl;
        this.videoMediaContainer = videoMediaContainer;
        this.videoPinMediaContainer = videoPinMediaContainer;
        this.mediasoupClient = mediasoupClient;

        this.socket = socket;
        this.room_id = room_id;
        this.peer_id = socket.id;
        this.peer_name = peer_name;
        this.peer_uuid = peer_uuid;
        this.peer_info = peer_info;

        // RTMP selected file name
        this.selectedRtmpFilename = '';

        // Moderator
        this._moderator = {
            video_start_privacy: false,
            audio_start_muted: false,
            video_start_hidden: true,
            audio_cant_unmute: false,
            video_cant_unhide: false,
            screen_cant_share: false,
            chat_cant_privately: false,
            chat_cant_chatgpt: false,
            media_cant_sharing: false,
        };

        // Chat messages
        this.chatMessageLengthCheck = false;
        this.chatMessageLength = 4000; // chars
        this.chatMessageTimeLast = 0;
        this.chatMessageTimeBetween = 1000; // ms
        this.chatMessageNotifyDelay = 10000; // ms
        this.chatMessageSpamCount = 0;
        this.chatMessageSpamCountToBan = 10;
        this.chatPeerId = 'all';
        this.chatPeerName = 'all';

        // HeyGen Video AI
        this.videoAIContainer = null;
        this.videoAIElement = null;
        this.canvasAIElement = null;
        this.renderAIToken = null;
        this.peerConnection = null;

        this.isAudioAllowed = isAudioAllowed;
        this.isVideoAllowed = isVideoAllowed;
        this.isScreenAllowed = isScreenAllowed;
        this.joinRoomWithScreen = joinRoomWithScreen;
        this.producerTransport = null;
        this.consumerTransport = null;
        this.device = null;

        this.isMobileDevice = DetectRTC.isMobileDevice;
        this.isMobileSafari = this.isMobileDevice && DetectRTC.browser.name === 'Safari';

        this.isScreenShareSupported =
            navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia ? true : false;

        this.isMySettingsOpen = false;

        this._isConnected = false;
        this.isDocumentOnFullScreen = false;
        this.isVideoOnFullScreen = false;
        this.isVideoFullScreenSupported = this.isFullScreenSupported();
        this.isVideoPictureInPictureSupported = document.pictureInPictureEnabled;
        this.isZoomCenterMode = false;
        this.isChatOpen = false;
        this.isChatEmojiOpen = false;
        this.isPollOpen = false;
        this.isPollPinned = false;
        this.isEditorOpen = false;
        this.isEditorLocked = false;
        this.isEditorPinned = false;
        this.isSpeechSynthesisSupported = isSpeechSynthesisSupported;
        this.speechInMessages = false;
        this.showChatOnMessage = true;
        this.isChatBgTransparent = false;
        this.isVideoPinned = false;
        this.isChatPinned = false;
        this.isChatMaximized = false;
        this.isToggleUnreadMsg = false;
        this.isToggleRaiseHand = false;
        this.pinnedVideoPlayerId = null;
        this.camVideo = false;
        this.camera = 'user';
        this.videoQualitySelectedIndex = 0;

        this.pollSelectedOptions = {};
        this.chatGPTContext = [];
        this.chatMessages = [];
        this.leftMsgAvatar = null;
        this.rightMsgAvatar = null;

        this.localVideoStream = null;
        this.localAudioStream = null;
        this.localScreenStream = null;

        this.RoomPassword = false;

        this.transcription = transcription;

        // RTMP Streamer
        this.rtmpFileStreamer = false;
        this.rtmpUrltSreamer = false;

        // File transfer settings
        this.fileToSend = null;
        this.fileReader = null;
        this.receiveBuffer = [];
        this.receivedSize = 0;
        this.incomingFileInfo = null;
        this.incomingFileData = null;
        this.sendInProgress = false;
        this.receiveInProgress = false;
        this.fileSharingInput = '*';
        this.chunkSize = 1024 * 16; // 16kb/s

        // Recording
        this._isRecording = false;
        this.mediaRecorder = null;
        this.audioRecorder = null;
        this.recScreenStream = null;
        this.recording = {
            recSyncServerRecording: false,
            recSyncServerEndpoint: '',
        };
        this.recSyncTime = 4000; // 4 sec
        this.recSyncChunkSize = 1000000; // 1MB

        // Encodings
        this.forceVP8 = false; // Force VP8 codec for webcam and screen sharing
        this.forceVP9 = false; // Force VP9 codec for webcam and screen sharing
        this.forceH264 = false; // Force H264 codec for webcam and screen sharing
        this.enableWebcamLayers = true; // Enable simulcast or SVC for webcam
        this.enableSharingLayers = true; // Enable simulcast or SVC for screen sharing
        this.numSimulcastStreamsWebcam = 3; // Number of streams for simulcast in webcam
        this.numSimulcastStreamsSharing = 1; // Number of streams for simulcast in screen sharing
        this.webcamScalabilityMode = 'L3T3'; // Scalability Mode for webcam | 'L1T3' for VP8/H264 (in each simulcast encoding), 'L3T3_KEY' for VP9
        this.sharingScalabilityMode = 'L1T3'; // Scalability Mode for screen sharing | 'L1T3' for VP8/H264 (in each simulcast encoding), 'L3T3' for VP9

        this.myVideoEl = null;
        this.myAudioEl = null;
        this.showPeerInfo = false; // on peerName mouse hover show additional info

        this.videoProducerId = null;
        this.screenProducerId = null;
        this.audioProducerId = null;
        this.audioConsumers = new Map();

        this.peers = new Map();
        this.consumers = new Map();
        this.producers = new Map();
        this.producerLabel = new Map();
        this.eventListeners = new Map();

        this.openState = false;

        this.debug = false;
        this.debug ? window.localStorage.setItem('debug', 'mediasoup*') : window.localStorage.removeItem('debug');

        this.successCallback = successCallback; // Store callback

        // VideoMenuBar Behavior
        if (this.isMobileDevice) {
            this.addLowLatencySwipeListener();
        }

        console.log('06 ----> Load MediaSoup Client v', mediasoupClient.version);
        console.log('06.1 ----> PEER_ID', this.peer_id);

        Object.keys(_EVENTS).forEach((evt) => {
            this.eventListeners.set(evt, []);
        });

        this.socket.request = function request(type, data = {}) {
            return new Promise((resolve, reject) => {
                socket.emit(type, data, (data) => {
                    if (data.error) {
                        reject(data.error);
                    } else {
                        resolve(data);
                    }
                });
            });
        };

        // ####################################################
        // CREATE ROOM AND JOIN
        // ####################################################

        console.log('>>>>> peer_info.peer_name', this.peer_info.peer_name);
        console.log('>>>>> peer_info.peer_pubkey', this.peer_info.peer_pubkey);
        console.log('Room ID ', this.room_id);
        console.log('precheck this.openState:', this.openState)

        this.checkRoomHasPeers();
    }
    
    async checkRoomHasPeers() { 
        const response = await fetch('/api/check-room-peers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ room_id: this.room_id }),
        });

        const roomData = await response.json();
        if (roomData.peerCount > 0) {
            // Room already has peers, allow joining directly
            this.openState = true;
            this.createRoom(this.room_id).then(async () => {
                const data = {
                    room_id: this.room_id,
                    peer_info: this.peer_info,
                };
                await this.join(data);
                this.initSockets();
                this._isConnected = true;
                this.successCallback();
            });
        }  else { 
            this.checkRoomOwnership();
        }
    }
 
    async checkRoomOwnership() {
        try {
            const response = await fetch('/api/check-room-owner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ room_id: this.room_id }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to check room ownership');
            }
            
            const data = await response.json();
            console.log('checkRoomOwnership', data);
            // console.log('json response state = ', data[0].success)

            if (data[0].success) {
                // Convert peer_pubkey to npub format for comparison
                const peer_npub =  this.peer_info.peer_npub                                
                // console.log('peer_pubkey', this.peer_info.peer_pubkey, 
                //     'vs nostr_pubkey: ', data[0].nostr_pubkey);
                // console.log('compare against room npub', peer_npub, 
                //     'vs room_npub: ', data[0].room_npub);

                // Check if peer is the room owner, allow open
                if (this.peer_info?.peer_pubkey && data[0]?.nostr_pubkey && 
                    this.peer_info.peer_pubkey === data[0].nostr_pubkey) {                        
                    this.openState = true;
                }               
                if (peer_npub === data[0].room_npub) {
                    // Allow bot to open room
                    this.openState = true;
                }
            } else if (data[0].success === false) { 
                // allow room creation, not reserved
                console.log("Not a reserved room proceed with open")
                this.openState =  true;
            }

            // console.log("inside checkRoomOwnership openState: ", this.openState)
            if (this.openState) {
                this.createRoom(this.room_id).then(async () => {
                    const data = {
                        room_id: this.room_id,
                        peer_info: this.peer_info,
                    };
                    await this.join(data);
                    this.initSockets();
                    this._isConnected = true;
                    this.successCallback();
                });
            } else { 
                console.log("open state is false")
                Swal.fire({
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showDenyButton: true,
                        showConfirmButton: false,
                        background: swalBackground,
                        title: 'Oops, '+ this.room_id + ' Room is closed',
                        text: 'Sorry, this is a Reserved Room and can only be opened by the Room Owner!',
                        denyButtonText: `Leave room`,
                        showClass: { popup: 'animate__animated animate__fadeInDown' },
                        hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                    }).then((result) => {
                        if (!result.isConfirmed) {
                            this.event(_EVENTS.exitRoom);
                        } 
                    });
            }

        } catch (error) {
            console.error('Error checking room ownership:', error);
            // Handle error case can't connect to DB - show error message and exit
            Swal.fire({
                allowOutsideClick: false,
                allowEscapeKey: false,
                showDenyButton: true,
                showConfirmButton: false,
                background: swalBackground,
                title: 'Error',
                text: 'Unable to verify room ownership. Please try again later.',
                denyButtonText: `Leave room`,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            }).then((result) => {
                if (!result.isConfirmed) {
                    this.event(_EVENTS.exitRoom);
                } 
            });
        }
    }

    // ####################################################
    // GET STARTED
    // ####################################################

    async createRoom(room_id) {
        // console.log('######### CREATE NEW ROOM #########');        
        await this.socket
            .request('createRoom', {
                room_id,
            })
            .catch((err) => {
                console.log('Create room:', err);
            });
    }

    async join(data) {
        this.socket
            .request('join', data)
            .then(async (room) => {
                console.log('##### JOIN ROOM #####', room);
                if (room === 'invalid') {
                    console.log('00-WARNING ----> Invalid Room name! Path traversal pattern detected!');
                    return this.roomInvalid();
                }
                if (room === 'notAllowed') {
                    console.log(
                        '00-WARNING ----> Room is Unauthorized for current user, please provide a valid room name for this user',
                    );
                    return this.userRoomNotAllowed();
                }
                if (room === 'unauthorized') {
                    console.log(
                        '00-WARNING ----> Room is Unauthorized for current user, please provide a valid username and password',
                    );
                    return this.userUnauthorized();
                }
                if (room === 'isLocked') {
                    this.event(_EVENTS.roomLock);
                    console.log('00-WARNING ----> Room is Locked, Try to unlock by the password');
                    return this.unlockTheRoom();
                }
                if (room === 'isLobby') {
                    this.event(_EVENTS.lobbyOn);
                    console.log('00-WARNING ----> Room Lobby Enabled, Wait to confirm my join');
                    return this.waitJoinConfirm();
                }
                if (room === 'isBanned') {
                    console.log('00-WARNING ----> You are Banned from the Room!');
                    return this.isBanned();
                }
                // ##########################################
                this.peers = new Map(JSON.parse(room.peers));
                // ##########################################

                if (!peer_info.peer_token) {
                    // hack...
                    for (let peer of Array.from(this.peers.keys()).filter((id) => id !== this.peer_id)) {
                        let peer_info = this.peers.get(peer).peer_info;
                        if (peer_info.peer_name == this.peer_name) {
                            console.log('00-WARNING ----> Username already in use');
                            return this.userNameAlreadyInRoom();
                        }
                    }
                }
                await this.joinAllowed(room);
            })
            .catch((error) => {
                console.error('Join error:', error);
            });
    }

    async joinAllowed(room) {
        console.log('07 ----> Join Room allowed');
        await this.handleRoomInfo(room);
        const routerRtpCapabilities = await this.socket.request('getRouterRtpCapabilities');
        routerRtpCapabilities.headerExtensions = routerRtpCapabilities.headerExtensions.filter(
            (ext) => ext.uri !== 'urn:3gpp:video-orientation',
        );
        this.device = await this.loadDevice(routerRtpCapabilities);
        console.log('07.3 ----> Get Router Rtp Capabilities codecs: ', this.device.rtpCapabilities.codecs);
        await this.initTransports(this.device);
        // ###################################
        this.socket.emit('getProducers');
        // ###################################
        if (isBroadcastingEnabled) {
            isPresenter ? await this.startLocalMedia() : this.handleRoomBroadcasting();
        } else {
            await this.startLocalMedia();
        }
    }

    async handleRoomInfo(room) {
        console.log('07.0 ----> Room Survey', room.survey);
        survey = room.survey;
        console.log('07.0 ----> Room Leave Redirect', room.redirect);
        redirect = room.redirect;
        participantsCount = this.peers.size;
        // ME
        for (let peer of Array.from(this.peers.keys()).filter((id) => id == this.peer_id)) {
            let my_peer_info = this.peers.get(peer).peer_info;
            console.log('07.1 ----> My Peer info', my_peer_info);
            isPresenter = window.localStorage.isReconnected === 'true' ? isPresenter : my_peer_info.peer_presenter;
            this.peer_info.peer_presenter = isPresenter;
            this.getId('isUserPresenter').innerText = isPresenter;
            window.localStorage.isReconnected = false;
            handleRules(isPresenter);

            // ###################################################################################################
            isBroadcastingEnabled = isPresenter && !room.broadcasting ? isBroadcastingEnabled : room.broadcasting;
            console.log('07.1 ----> ROOM BROADCASTING', isBroadcastingEnabled);
            // ###################################################################################################

            if (BUTTONS.settings.tabRecording) {
                room.config.hostOnlyRecording
                    ? (console.log('07.1 ----> WARNING Room Host only recording enabled'),
                      this.event(_EVENTS.hostOnlyRecordingOn))
                    : this.event(_EVENTS.hostOnlyRecordingOff);
            }

            // ###################################################################################################
            if (room.recording) this.recording = room.recording;
            if (room.recording && room.recording.recSyncServerRecording) {
                console.log('07.1 WARNING ----> SERVER SYNC RECORDING ENABLED!');
                this.recording.recSyncServerRecording = localStorageSettings.rec_server;
                if (BUTTONS.settings.tabRecording && !room.config.hostOnlyRecording) {
                    show(roomRecordingServer);
                }
                switchServerRecording.checked = this.recording.recSyncServerRecording;
            }
            console.log('07.1 ----> SERVER SYNC RECORDING', this.recording);
            // ###################################################################################################

            // Handle Room moderator rules
            if (room.moderator && (!isRulesActive || !isPresenter)) {
                console.log('07.2 ----> ROOM MODERATOR', room.moderator);

                // Update `this._moderator` with properties from `room.moderator`, keeping existing ones.
                this._moderator = { ...this._moderator, ...room.moderator };

                if (this._moderator.video_start_privacy || localStorageSettings.moderator_video_start_privacy) {
                    this.peer_info.peer_video_privacy = true;
                    this.emitCmd({
                        type: 'privacy',
                        peer_id: this.peer_id,
                        active: true,
                        broadcast: true,
                    });
                    this.userLog('warning', 'The Moderator starts your video in privacy mode', 'top-end');
                }
                if (this._moderator.audio_start_muted && this._moderator.video_start_hidden) {
                    this.userLog('warning', 'The Moderator disabled your audio and video', 'top-end');
                } else {
                    if (this._moderator.audio_start_muted && !this._moderator.video_start_hidden) {
                        this.userLog('warning', 'The Moderator disabled your audio', 'top-end');
                    }
                    if (!this._moderator.audio_start_muted && this._moderator.video_start_hidden) {
                        this.userLog('warning', 'The Moderator disabled your video', 'top-end');
                    }
                }
                //
                this._moderator.audio_cant_unmute ? hide(tabAudioDevicesBtn) : show(tabAudioDevicesBtn);
                this._moderator.video_cant_unhide ? hide(tabVideoDevicesBtn) : show(tabVideoDevicesBtn);
            }
            // Check if VideoAI is enabled
            if (!room.videoAIEnabled) {
                VideoAI.enabled = false;
                elemDisplay('tabVideoAIBtn', false);
            }
            // Check che RTMP config
            if (room.rtmp) {
                console.log('RTMP config', room.rtmp);
                const { enabled, fromFile, fromUrl, fromStream } = room.rtmp;
                elemDisplay('tabRTMPStreamingBtn', enabled);
                elemDisplay('rtmpFromFile', fromFile);
                elemDisplay('rtmpFromUrl', fromUrl);
                elemDisplay('rtmpFromStream', fromStream);
                if (!fromFile && !fromUrl && !fromStream) {
                    elemDisplay('tabRTMPStreamingBtn', false);
                }
            }
            // There is polls
            if (room.thereIsPolls) {
                this.socket.emit('updatePoll');
            }
            // Host protected enabled in the server side
            if (room.hostProtected) {
                RoomURL = window.location.origin + '/join/?room=' + room_id;
            }

            // Share Media Data on Join
            if (
                room.shareMediaData &&
                Object.keys(room.shareMediaData).length !== 0 &&
                room.shareMediaData.action === 'open'
            ) {
                this.shareVideoAction(room.shareMediaData);
            }
        }

        // PARTICIPANTS
        for (let peer of Array.from(this.peers.keys()).filter((id) => id !== this.peer_id)) {
            let peer_info = this.peers.get(peer).peer_info;
            // console.log('07.1 ----> Remote Peer info', peer_info);

            const { peer_id, peer_name, peer_presenter, peer_video, peer_recording } = peer_info;

            const canSetVideoOff = !isBroadcastingEnabled || (isBroadcastingEnabled && peer_presenter);

            if (!peer_video && canSetVideoOff) {
                console.log('Detected peer video off ' + peer_name);
                this.setVideoOff(peer_info, true);
            }

            if (peer_recording) {
                this.handleRecordingAction({
                    peer_id: peer_id,
                    peer_name: peer_name,
                    action: enums.recording.started,
                });
            }
        }

        this.refreshParticipantsCount();

        console.log('07.2 Participants Count ---->', participantsCount);

        // notify && participantsCount == 1 ? shareRoom() : sound('joined');
        if (notify && participantsCount == 1) {
            console.log('share room pop dialog on initial join');
            //shareRoom();
            showAnnouncements();
        } else {
            if (this.isScreenAllowed) {
                this.shareScreen();
            }
            sound('joined');
        }
    }

    async loadDevice(routerRtpCapabilities) {
        let device;
        try {
            device = new this.mediasoupClient.Device();
        } catch (error) {
            if (error.name === 'UnsupportedError') {
                console.error('Browser not supported');
                this.userLog('error', 'Browser not supported', 'center', 6000);
            } else {
                console.error('Browser not supported: ', error);
                this.userLog('error', 'Browser not supported: ' + error, 'center', 6000);
            }
        }
        await device.load({
            routerRtpCapabilities,
        });
        return device;
    }

    // ####################################################
    // TRANSPORTS
    // ####################################################

    async initTransports(device) {
        // ####################################################
        // PRODUCER TRANSPORT
        // ####################################################

        const producerTransportData = await this.socket.request('createWebRtcTransport', {
            forceTcp: false,
            rtpCapabilities: device.rtpCapabilities,
        });

        if (producerTransportData.error) {
            console.error(producerTransportData.error);
            return;
        }

        producerTransportData['proprietaryConstraints'] = { optional: [{ googDscp: true }] };

        this.producerTransport = device.createSendTransport(producerTransportData);

        console.info('07.4 producerTransportData ---->', {
            producerTransportId: this.producerTransport.id,
            producerTransportData: producerTransportData,
        });

        this.producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
            try {
                await this.socket.request('connectTransport', {
                    transport_id: this.producerTransport.id,
                    dtlsParameters,
                });
                callback();
            } catch (err) {
                errback(err);
            }
        });

        this.producerTransport.on('produce', async ({ kind, appData, rtpParameters }, callback, errback) => {
            console.log('Going to produce', { kind, appData, rtpParameters });
            try {
                const { producer_id } = await this.socket.request('produce', {
                    producerTransportId: this.producerTransport.id,
                    kind,
                    appData,
                    rtpParameters,
                });
                callback({
                    id: producer_id,
                });
            } catch (err) {
                errback(err);
            }
        });

        this.producerTransport.on('connectionstatechange', (state) => {
            switch (state) {
                case 'connecting':
                    console.log('Producer Transport connecting...');
                    break;
                case 'connected':
                    console.log('Producer Transport connected', { id: this.producerTransport.id });
                    break;
                case 'disconnected':
                    console.log('Producer Transport disconnected', { id: this.producerTransport.id });

                    this.restartIce();

                    popupHtmlMessage(
                        null,
                        image.network,
                        'Producer Transport disconnected',
                        'Network connection may have dropped or changed (Restarted ICE)',
                        'center',
                        false,
                        false,
                    );
                    break;
                case 'failed':
                    console.warn('Producer Transport failed', { id: this.producerTransport.id });

                    this.producerTransport.close();

                    popupHtmlMessage(
                        null,
                        image.network,
                        'Producer Transport failed',
                        'Check Your Network Connectivity',
                        'center',
                        false,
                        true,
                    );
                    break;
                default:
                    console.log('Producer transport connection state changes', {
                        state: state,
                        id: this.producerTransport.id,
                    });
                    break;
            }
        });

        this.producerTransport.on('icegatheringstatechange', (state) => {
            console.log('Producer icegatheringstatechange', {
                state: state,
                id: this.producerTransport.id,
            });
        });

        // ####################################################
        // CONSUMER TRANSPORT
        // ####################################################

        const consumerTransportData = await this.socket.request('createWebRtcTransport', {
            forceTcp: false,
        });

        if (consumerTransportData.error) {
            console.error(consumerTransportData.error);
            return;
        }

        this.consumerTransport = device.createRecvTransport(consumerTransportData);

        console.info('07.5 consumerTransportData ---->', {
            consumerTransportId: this.consumerTransport.id,
            consumerTransportData: consumerTransportData,
        });

        this.consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
            try {
                await this.socket.request('connectTransport', {
                    transport_id: this.consumerTransport.id,
                    dtlsParameters,
                });
                callback();
            } catch (err) {
                errback(err);
            }
        });

        this.consumerTransport.on('connectionstatechange', (state) => {
            switch (state) {
                case 'connecting':
                    console.log('Consumer Transport connecting...');
                    break;
                case 'connected':
                    console.log('Consumer Transport connected', { id: this.consumerTransport.id });
                    break;
                case 'disconnected':
                    console.log('Consumer Transport disconnected', { id: this.consumerTransport.id });

                    this.restartIce();

                    popupHtmlMessage(
                        null,
                        image.network,
                        'Consumer Transport disconnected',
                        'Network connection may have dropped or changed (Restarted ICE)',
                        'center',
                        false,
                        false,
                    );
                    break;
                case 'failed':
                    console.warn('Consumer Transport failed', { id: this.consumerTransport.id });

                    this.consumerTransport.close();

                    popupHtmlMessage(
                        null,
                        image.network,
                        'Consumer Transport failed',
                        'Check Your Network Connectivity',
                        'center',
                        false,
                        true,
                    );
                    break;
                default:
                    console.log('Consumer transport connection state changes', {
                        state: state,
                        id: this.consumerTransport.id,
                    });
                    break;
            }
        });

        this.consumerTransport.on('icegatheringstatechange', (state) => {
            console.log('Consumer icegatheringstatechange', {
                state: state,
                id: this.consumerTransport.id,
            });
        });

        // ####################################################
        // TODO: DATA TRANSPORT
        // ####################################################

        //
    }

    // ####################################################
    // RESTART ICE
    // ####################################################

    async restartIce() {
        console.log('Restart ICE...');
        try {
            if (this.producerTransport) {
                const iceParameters = await this.socket.request('restartIce', {
                    transport_id: this.producerTransport.id,
                });

                console.log('Restarting producer transport ICE', iceParameters);

                await this.producerTransport.restartIce({ iceParameters });
            }

            if (this.consumerTransport) {
                const iceParameters = await this.socket.request('restartIce', {
                    transport_id: this.consumerTransport.id,
                });

                console.log('Restarting consumer transport ICE', iceParameters);

                await this.consumerTransport.restartIce({ iceParameters });
            }
            console.log('Restart ICE done');
        } catch (error) {
            console.error('Restart ICE error', error);
        }
    }

    // ####################################################
    // SOCKET ON
    // ####################################################

    initSockets() {
        this.socket.on('consumerClosed', this.handleConsumerClosed);
        this.socket.on('setVideoOff', this.handleSetVideoOff);
        this.socket.on('removeMe', this.handleRemoveMe);
        this.socket.on('refreshParticipantsCount', this.handleRefreshParticipantsCount);
        this.socket.on('newProducers', this.handleNewProducers);
        this.socket.on('message', this.handleMessage);
        this.socket.on('roomAction', this.handleRoomAction);
        this.socket.on('roomPassword', this.handleRoomPassword);
        this.socket.on('roomLobby', this.handleRoomLobby);
        this.socket.on('cmd', this.handleCmdData);
        this.socket.on('peerAction', this.handlePeerAction);
        this.socket.on('updatePeerInfo', this.handleUpdatePeerInfo);
        this.socket.on('fileInfo', this.handleFileInfoData);
        this.socket.on('file', this.handleFileData);
        this.socket.on('shareVideoAction', this.handleShareVideoAction);
        this.socket.on('fileAbort', this.handleFileAbortData);
        this.socket.on('receiveFileAbort', this.handleReceiveFileAbortData);
        this.socket.on('wbCanvasToJson', this.handleWbCanvasToJson);
        this.socket.on('whiteboardAction', this.handleWhiteboardAction);
        this.socket.on('audioVolume', this.handleAudioVolumeData);
        this.socket.on('dominantSpeaker', this.handleDominantSpeakerData);
        this.socket.on('updateRoomModerator', this.handleUpdateRoomModeratorData);
        this.socket.on('updateRoomModeratorALL', this.handleUpdateRoomModeratorALLData);
        this.socket.on('recordingAction', this.handleRecordingActionData);
        this.socket.on('connect', this.handleSocketConnect);
        this.socket.on('disconnect', this.handleSocketDisconnect);
        this.socket.on('endRTMP', this.handleEndRTMP);
        this.socket.on('errorRTMP', this.handleErrorRTMP);
        this.socket.on('endRTMPfromURL', this.handleEndRTMPfromURL);
        this.socket.on('errorRTMPfromURL', this.handleErrorRTMPfromURL);
        this.socket.on('updatePolls', this.handleUpdatePolls);
        this.socket.on('editorChange', this.handleEditorChange);
        this.socket.on('editorActions', this.handleEditorActions);
        this.socket.on('editorUpdate', this.handleEditorUpdate);
    }

    // ####################################################
    // HANDLE SOCKET DATA
    // ####################################################

    handleConsumerClosed = ({ consumer_id, consumer_kind }) => {
        console.log('SocketOn Closing consumer', { consumer_id, consumer_kind });
        this.removeConsumer(consumer_id, consumer_kind);
    };

    handleSetVideoOff = (data) => {
        if (!isBroadcastingEnabled || (isBroadcastingEnabled && data.peer_presenter)) {
            console.log('SocketOn setVideoOff', {
                peer_name: data.peer_name,
                peer_presenter: data.peer_presenter,
            });
            this.setVideoOff(data, true);
        }
    };

    handleRemoveMe = (data) => {
        console.log('SocketOn Remove me:', data);
        this.removeVideoOff(data.peer_id);
        this.lobbyRemoveMe(data.peer_id);
        participantsCount = data.peer_counts;
        if (!isBroadcastingEnabled) adaptAspectRatio(participantsCount);
        if (isParticipantsListOpen) getRoomParticipants();
        if (isBroadcastingEnabled && data.isPresenter) {
            this.userLog('info', `${icons.broadcaster} ${data.peer_name} disconnected`, 'top-end', 6000);
        }
    };

    handleRefreshParticipantsCount = (data) => {
        console.log('SocketOn Participants Count:', data);
        participantsCount = data.peer_counts;
        if (isBroadcastingEnabled) {
            if (isParticipantsListOpen) getRoomParticipants();
            wbUpdate();
            this.editorUpdate();
        } else {
            adaptAspectRatio(participantsCount);
        }
    };

    handleNewProducers = async (data) => {
        if (data.length > 0) {
            console.log('SocketOn New producers', data);
            for (let { producer_id, peer_name, peer_info, type } of data) {
                await this.consume(producer_id, peer_name, peer_info, type);
            }
        }
    };

    handleMessage = (data) => {
        console.log('SocketOn New message:', data);
        this.showMessage(data);
    };

    handleRoomAction = (data) => {
        console.log('SocketOn Room action:', data);
        this.roomAction(data, false);
    };

    handleRoomPassword = (data) => {
        console.log('SocketOn Room password:', data.password);
        this.roomPassword(data);
    };

    handleRoomLobby = (data) => {
        console.log('SocketOn Room lobby:', data);
        this.roomLobby(data);
    };

    handleCmdData = (data) => {
        console.log('SocketOn Peer cmd:', data);
        this.handleCmd(data);
    };

    handlePeerAction = (data) => {
        console.log('SocketOn Peer action:', data);
        this.peerAction(data.from_peer_name, data.peer_id, data.action, false, data.broadcast, true, data.message);
    };

    handleUpdatePeerInfo = (data) => {
        console.log('SocketOn Peer info update:', data);
        this.updatePeerInfo(data.peer_name, data.peer_id, data.type, data.status, false, data.peer_presenter);
    };

    handleFileInfoData = (data) => {
        console.log('SocketOn File info:', data);
        this.handleFileInfo(data);
    };

    handleFileData = (data) => {
        this.handleFile(data);
    };

    handleShareVideoAction = (data) => {
        this.shareVideoAction(data);
    };

    handleFileAbortData = (data) => {
        this.handleFileAbort(data);
    };

    handleReceiveFileAbortData = (data) => {
        this.handleReceiveFileAbort(data);
    };

    handleWbCanvasToJson = (data) => {
        console.log('SocketOn Received whiteboard canvas JSON');
        JsonToWbCanvas(data);
    };

    handleWhiteboardAction = (data) => {
        console.log('Whiteboard action', data);
        whiteboardAction(data, false);
    };

    handleAudioVolumeData = (data) => {
        this.handleAudioVolume(data);
    };

    handleDominantSpeakerData = (data) => {
        this.handleDominantSpeaker(data);
    };

    handleUpdateRoomModeratorData = (data) => {
        console.log('SocketOn Update room moderator', data);
        this.handleUpdateRoomModerator(data);
    };

    handleUpdateRoomModeratorALLData = (data) => {
        console.log('SocketOn Update room moderator ALL', data);
        this.handleUpdateRoomModeratorALL(data);
    };

    handleRecordingActionData = (data) => {
        console.log('SocketOn Recording action:', data);
        this.handleRecordingAction(data);
    };

    handleSocketConnect = () => {
        console.log('SocketOn Connected to signaling server!');
        this._isConnected = true;
        this.refreshBrowser();
    };

    handleSocketDisconnect = () => {
        this.exit(true);
        this.ServerAway();
        this.saveRecording('Socket disconnected');
    };

    handleEndRTMP = (data) => {
        this.endRTMP(data);
    };

    handleErrorRTMP = (data) => {
        this.errorRTMP(data);
    };

    handleEndRTMPfromURL = (data) => {
        this.endRTMPfromURL(data);
    };

    handleErrorRTMPfromURL = (data) => {
        this.errorRTMPfromURL(data);
    };

    handleUpdatePolls = (data) => {
        this.pollsUpdate(data);
    };

    handleEditorChange = (data) => {
        this.handleEditorData(data);
    };

    handleEditorActions = (data) => {
        this.handleEditorActionsData(data);
    };

    handleEditorUpdate = (data) => {
        this.handleEditorUpdateData(data);
    };

    // ####################################################
    // SERVER AWAY/MAINTENANCE
    // ####################################################

    ServerAway() {
        this.sound('alert');
        window.localStorage.isReconnected = true;
        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            showDenyButton: true,
            showConfirmButton: false,
            background: swalBackground,
            imageUrl: image.poster,
            title: 'Server away',
            text: 'The server seems away or in maintenance, please wait until it come back up.',
            denyButtonText: `Leave room`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (!result.isConfirmed) {
                this.event(_EVENTS.exitRoom);
            }
        });
    }

    refreshBrowser() {
        this.exit(true);
        getPeerName() ? location.reload() : openURL(this.getReconnectDirectJoinURL());
    }

    getReconnectDirectJoinURL() {
        // TODO: Add Direct join URL with peer info, decode peer token for nostr specific login
        const { peer_audio, peer_video, peer_screen, peer_token } = this.peer_info;
        const baseUrl = `${window.location.origin}/join`;
        const queryParams = {
            room: this.room_id,
            roomPassword: this.RoomPassword,
            name: this.peer_name,
            audio: peer_audio,
            video: peer_video,
            screen: peer_screen,
            notify: 0,
            isPresenter: isPresenter,
        };
        if (peer_token) queryParams.token = peer_token;
        const url = `${baseUrl}?${Object.entries(queryParams)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')}`;
        return url;
    }

    // ####################################################
    // CHECK USER
    // ####################################################

    userNameAlreadyInRoom() {
        this.sound('alert');
        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: swalBackground,
            imageUrl: image.user,
            position: 'center',
            title: 'Username',
            html: `The Username is already in use. <br/> Please try with another one`,
            showDenyButton: false,
            confirmButtonText: `OK`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.isConfirmed) {
                openURL((window.location.href = '/join/' + this.room_id));
            }
        });
    }

    // ####################################################
    // HANDLE ROOM BROADCASTING
    // ####################################################

    handleRoomBroadcasting() {
        console.log('07.4 ----> Room Broadcasting is currently active, and you are not the designated presenter');

        this.peer_info.peer_audio = false;
        this.peer_info.peer_video = false;
        this.peer_info.peer_screen = false;

        const mediaTypes = ['audio', 'video', 'screen'];

        mediaTypes.forEach((type) => {
            const data = {
                room_id: this.room_id,
                peer_name: this.peer_name,
                peer_id: this.peer_id,
                peer_presenter: isPresenter,
                type: type,
                status: false,
                broadcast: true,
            };
            this.socket.emit('updatePeerInfo', data);
        });

        handleRulesBroadcasting();
    }

    toggleRoomBroadcasting() {
        Swal.fire({
            background: swalBackground,
            position: 'center',
            imageUrl: image.broadcasting,
            title: 'Room broadcasting Enabled',
            text: 'Would you like to continue the room broadcast?',
            showDenyButton: true,
            confirmButtonColor: '#18392B',
            confirmButtonText: `Yes`,
            denyButtonText: `No`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.isDenied) {
                switchBroadcasting.click();
            }
        });
    }

    // ####################################################
    // START LOCAL AUDIO VIDEO MEDIA
    // ####################################################

    async startLocalMedia() {
        console.log('08 ----> START LOCAL MEDIA...');
        const audioProducerExist = this.producerExist(mediaType.audio);
        if (this.isAudioAllowed) {
            if (!audioProducerExist) {
                await this.produce(mediaType.audio, microphoneSelect.value);
                console.log('09 ----> START AUDIO MEDIA');
            }
            if (this._moderator.audio_start_muted) {
                await this.pauseAudioProducer();
            }
        } else {
            if (isEnumerateAudioDevices && !audioProducerExist) {
                await this.produce(mediaType.audio, microphoneSelect.value);
                console.log('09 ----> START AUDIO MEDIA');
                await this.pauseAudioProducer();
            }
        }

        if (this.isVideoAllowed && !this._moderator.video_start_hidden) {
            await this.produce(mediaType.video, videoSelect.value);
            console.log('10 ----> START VIDEO MEDIA');
        } else {
            setColor(startVideoButton, 'red');
            this.setVideoOff(this.peer_info, false);
            this.sendVideoOff();
            if (BUTTONS.main.startVideoButton) this.event(_EVENTS.stopVideo);
            this.updatePeerInfo(this.peer_name, this.peer_id, 'video', false);
            console.log('10 ----> VIDEO IS OFF');
        }

        if (this.joinRoomWithScreen && !this._moderator.screen_cant_share) {
            await this.produce(mediaType.screen, null, false, true);
            console.log('11 ----> START SCREEN MEDIA');
        }
        // if (this.isScreenAllowed) {
        //     this.shareScreen();
        // }
        console.log('[startLocalMedia] - PRODUCER LABEL', this.producerLabel);
    }

    async pauseAudioProducer() {
        setColor(startAudioButton, 'red');
        this.setIsAudio(this.peer_id, false);
        if (BUTTONS.main.startAudioButton) this.event(_EVENTS.stopAudio);
        await this.pauseProducer(mediaType.audio);
        console.log('09 ----> PAUSE AUDIO MEDIA');
        this.updatePeerInfo(this.peer_name, this.peer_id, 'audio', false);
    }

    // ####################################################
    // PRODUCER
    // ####################################################

    async produce(type, deviceId = null, swapCamera = false, init = false) {
        let mediaConstraints = {};
        let audio = false;
        let screen = false;
        switch (type) {
            case mediaType.audio:
                this.isAudioAllowed = true;
                mediaConstraints = this.getAudioConstraints(deviceId);
                audio = true;
                break;
            case mediaType.video:
                this.isVideoAllowed = true;
                swapCamera
                    ? (mediaConstraints = this.getCameraConstraints())
                    : (mediaConstraints = this.getVideoConstraints(deviceId));
                break;
            case mediaType.screen:
                mediaConstraints = this.getScreenConstraints();
                screen = true;
                break;
            default:
                return;
        }
        if (!this.device.canProduce('video') && !audio) {
            return console.error('Cannot produce video');
        }
        if (this.producerLabel.has(type)) {
            return console.warn('Producer already exists for this type ' + type);
        }

        const videoPrivacyBtn = this.getId(this.peer_id + '__vp');
        if (videoPrivacyBtn) videoPrivacyBtn.style.display = screen ? 'none' : 'inline';

        console.log(`Media constraints ${type}:`, mediaConstraints);

        let stream;
        try {
            if (init) {
                stream = initStream;
            } else {
                stream = screen
                    ? await navigator.mediaDevices.getDisplayMedia(mediaConstraints)
                    : await navigator.mediaDevices.getUserMedia(mediaConstraints);
            }

            console.log('Supported Constraints', navigator.mediaDevices.getSupportedConstraints());

            const track = audio ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];

            console.log(`${type} settings ->`, track.getSettings());

            const params = {
                track,
                appData: {
                    mediaType: type,
                },
            };

            if (audio) {
                console.log('AUDIO ENABLE OPUS');
                params.codecOptions = {
                    opusStereo: true,
                    opusDtx: true,
                    opusFec: true,
                    opusNack: true,
                };
            }

            if (!audio && !screen) {
                const { encodings, codec } = this.getWebCamEncoding();
                console.log('GET WEBCAM ENCODING', {
                    encodings: encodings,
                    codecs: codec,
                });
                params.encodings = encodings;
                params.codecs = codec;
                params.codecOptions = {
                    videoGoogleStartBitrate: 1000,
                };
            }

            if (!audio && screen) {
                const { encodings, codec } = this.getScreenEncoding();
                console.log('GET SCREEN ENCODING', {
                    encodings: encodings,
                    codecs: codec,
                });
                params.encodings = encodings;
                params.codecs = codec;
                params.codecOptions = {
                    videoGoogleStartBitrate: 1000,
                };
            }

            console.log('PRODUCER TYPE AND PARAMS', {
                type: type,
                params: params,
            });

            const producer = await this.producerTransport.produce(params);

            if (!producer) {
                throw new Error('Producer not found!');
            }

            console.log('PRODUCER MEDIA TYPE ----> ' + type);
            console.log('PRODUCER', producer);

            this.producers.set(producer.id, producer);
            this.producerLabel.set(type, producer.id);

            // if screen sharing produce the tab audio + microphone
            if (screen && stream.getAudioTracks()[0]) {
                this.produceScreenAudio(stream);
            }

            let elem, au;
            if (!audio) {
                this.localVideoStream = stream;
                if (type == mediaType.video) this.videoProducerId = producer.id;
                if (type == mediaType.screen) this.screenProducerId = producer.id;
                elem = await this.handleProducer(producer.id, type, stream);
                // No mirror effect for producer
                if (!isInitVideoMirror && elem.classList.contains('mirror')) {
                    elem.classList.remove('mirror');
                }
                //if (!screen && !isEnumerateDevices) enumerateVideoDevices(stream);
            } else {
                this.localAudioStream = stream;
                this.audioProducerId = producer.id;
                au = await this.handleProducer(producer.id, type, stream);
                //if (!isEnumerateDevices) enumerateAudioDevices(stream);
                getMicrophoneVolumeIndicator(stream);
            }

            if (type == mediaType.video) {
                this.handleHideMe();
            }

            producer.on('trackended', () => {
                console.log('Producer track ended', { id: producer.id, type });
                this.closeProducer(type);
            });

            producer.on('transportclose', () => {
                console.log('Producer transport close', { id: producer.id, type });
                if (!audio) {
                    const d = this.getId(producer.id + '__video');
                    const vb = this.getId(producer.id + '__vb');

                    elem.srcObject.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    elem.parentNode.removeChild(elem);

                    d.parentNode.removeChild(d);
                    vb.parentNode.removeChild(vb);

                    handleAspectRatio();
                    console.log('[transportClose] Video-element-count', this.videoMediaContainer.childElementCount);
                } else {
                    au.srcObject.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    au.parentNode.removeChild(au);
                    console.log('[transportClose] audio-element-count', this.localAudioEl.childElementCount);
                }
                this.closeProducer(type);
            });

            producer.on('close', () => {
                console.log('Closing producer', { id: producer.id, type });
                if (!audio) {
                    const d = this.getId(producer.id + '__video');
                    const vb = this.getId(producer.id + '__vb');

                    elem.srcObject.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    elem.parentNode.removeChild(elem);

                    d.parentNode.removeChild(d);
                    vb.parentNode.removeChild(vb);

                    handleAspectRatio();
                    console.log('[closingProducer] Video-element-count', this.videoMediaContainer.childElementCount);
                } else {
                    au.srcObject.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    au.parentNode.removeChild(au);
                    console.log('[closingProducer] audio-element-count', this.localAudioEl.childElementCount);
                }
                this.closeProducer(type);
            });

            switch (type) {
                case mediaType.audio:
                    this.setIsAudio(this.peer_id, true);
                    this.event(_EVENTS.startAudio);
                    break;
                case mediaType.video:
                    this.setIsVideo(true);
                    this.event(_EVENTS.startVideo);
                    break;
                case mediaType.screen:
                    this.setIsScreen(true);
                    this.event(_EVENTS.startScreen);
                    break;
                default:
                    break;
            }

            this.sound('joined');
            return producer;
        } catch (err) {
            console.error('Produce error:', err);

            handleMediaError(type, err);

            if (!audio && !screen && videoQuality.selectedIndex != 0) {
                videoQuality.selectedIndex = this.videoQualitySelectedIndex;
                this.sound('alert');
                this.userLog(
                    'error',
                    `Your device doesn't support the selected video quality (${videoQuality.value}), please select the another one.`,
                    'top-end',
                );
            }
        }
    }

    // ####################################################
    // AUDIO/VIDEO/SCREEN CONSTRAINTS
    // ####################################################

    getAudioConstraints(deviceId) {
        let constraints = {
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                deviceId: deviceId,
            },
            video: false,
        };
        if (isRulesActive && isPresenter) {
            constraints = {
                audio: {
                    autoGainControl: switchAutoGainControl.checked,
                    echoCancellation: switchNoiseSuppression.checked,
                    noiseSuppression: switchEchoCancellation.checked,
                    sampleRate: parseInt(sampleRateSelect.value),
                    sampleSize: parseInt(sampleSizeSelect.value),
                    channelCount: parseInt(channelCountSelect.value),
                    latency: parseInt(micLatencyRange.value),
                    volume: parseInt(micVolumeRange.value / 100),
                    deviceId: deviceId,
                },
                video: false,
            };
        }
        return constraints;
    }

    getCameraConstraints() {
        this.camera = this.camera == 'user' ? 'environment' : 'user';
        if (this.camera != 'user') this.camVideo = { facingMode: { exact: this.camera } };
        else this.camVideo = true;
        return {
            audio: false,
            video: this.camVideo,
        };
    }

    getVideoConstraints(deviceId) {
        const defaultFrameRate = { ideal: 30 };
        const selectedValue = this.getSelectedIndexValue(videoFps);
        const customFrameRate = parseInt(selectedValue, 10);
        const frameRate = selectedValue === 'max' ? defaultFrameRate : { ideal: customFrameRate };

        // Base constraints structure with dynamic values for resolution and frame rate
        const videoBaseConstraints = (width, height, exact = false) => ({
            audio: false,
            video: {
                width: exact ? { exact: width } : { ideal: width },
                height: exact ? { exact: height } : { ideal: height },
                deviceId: deviceId,
                aspectRatio: 1.777, // 16:9 aspect ratio
                frameRate: frameRate,
            },
        });

        const videoResolutionMap = {
            qvga: { width: 320, height: 240, exact: true },
            vga: { width: 640, height: 480, exact: true },
            hd: { width: 1280, height: 720, exact: true },
            fhd: { width: 1920, height: 1080, exact: true },
            '2k': { width: 2560, height: 1440, exact: true },
            '4k': { width: 3840, height: 2160, exact: true },
            '6k': { width: 6144, height: 3456, exact: true },
            '8k': { width: 7680, height: 4320, exact: true },
        };

        let videoConstraints;

        switch (videoQuality.value) {
            case 'default':
                // Default ideal HD resolution
                videoConstraints = videoBaseConstraints(1280, 720);
                videoFps.selectedIndex = 0;
                videoFps.disabled = true;
                break;
            default:
                // Ideal Full HD if no match found in the video resolution map
                const { width, height, exact } = videoResolutionMap[videoQuality.value] || {
                    width: 1920,
                    height: 1080,
                };
                videoConstraints = videoBaseConstraints(width, height, exact);
                break;
        }

        this.videoQualitySelectedIndex = videoQuality.selectedIndex;

        return videoConstraints;
    }

    getScreenConstraints() {
        const defaultFrameRate = { ideal: 30 };
        const selectedValue = this.getSelectedIndexValue(screenFps);
        const customFrameRate = parseInt(selectedValue, 10);
        const frameRate = selectedValue === 'max' ? defaultFrameRate : { ideal: customFrameRate };

        // Base constraints structure with dynamic values for resolution and frame rate
        const screenBaseConstraints = (width, height) => ({
            audio: true,
            video: {
                width: { ideal: width },
                height: { ideal: height },
                aspectRatio: 1.777, // 16:9 aspect ratio
                frameRate: frameRate,
            },
        });

        const screenResolutionMap = {
            hd: { width: 1280, height: 720 },
            fhd: { width: 1920, height: 1080 },
            '2k': { width: 2560, height: 1440 },
            '4k': { width: 3840, height: 2160 },
            '6k': { width: 6144, height: 3456 },
            '8k': { width: 7680, height: 4320 },
        };

        // Default to Full HD if no match found in the screen resolution map
        const { width, height } = screenResolutionMap[screenQuality.value] || { width: 1920, height: 1080 };

        return screenBaseConstraints(width, height);
    }

    // ####################################################
    // WEBCAM ENCODING
    // ####################################################

    getWebCamEncoding() {
        let encodings;
        let codec;

        console.log('WEBCAM ENCODING', {
            forceVP8: this.forceVP8,
            forceVP9: this.forceVP9,
            forceH264: this.forceH264,
            numSimulcastStreamsWebcam: this.numSimulcastStreamsWebcam,
            enableWebcamLayers: this.enableWebcamLayers,
            webcamScalabilityMode: this.webcamScalabilityMode,
        });

        if (this.forceVP8) {
            codec = this.device.rtpCapabilities.codecs.find((c) => c.mimeType.toLowerCase() === 'video/vp8');
            if (!codec) throw new Error('Desired VP8 codec+configuration is not supported');
        } else if (this.forceH264) {
            codec = this.device.rtpCapabilities.codecs.find((c) => c.mimeType.toLowerCase() === 'video/h264');
            if (!codec) throw new Error('Desired H264 codec+configuration is not supported');
        } else if (this.forceVP9) {
            codec = this.device.rtpCapabilities.codecs.find((c) => c.mimeType.toLowerCase() === 'video/vp9');
            if (!codec) throw new Error('Desired VP9 codec+configuration is not supported');
        }

        if (this.enableWebcamLayers) {
            console.log('WEBCAM SIMULCAST/SVC ENABLED');

            const firstVideoCodec = this.device.rtpCapabilities.codecs.find((c) => c.kind === 'video');
            console.log('WEBCAM ENCODING: first codec available', { firstVideoCodec: firstVideoCodec });

            // If VP9 is the only available video codec then use SVC.
            if ((this.forceVP9 && codec) || firstVideoCodec.mimeType.toLowerCase() === 'video/vp9') {
                console.log('WEBCAM ENCODING: VP9 with SVC');
                encodings = [
                    {
                        maxBitrate: 5000000,
                        scalabilityMode: this.webcamScalabilityMode || 'L3T3_KEY',
                    },
                ];
            } else {
                console.log('WEBCAM ENCODING: VP8 or H264 with simulcast');
                encodings = [
                    {
                        scaleResolutionDownBy: 1,
                        maxBitrate: 5000000,
                        scalabilityMode: this.webcamScalabilityMode || 'L1T3',
                    },
                ];
                if (this.numSimulcastStreamsWebcam > 1) {
                    encodings.unshift({
                        scaleResolutionDownBy: 2,
                        maxBitrate: 1000000,
                        scalabilityMode: this.webcamScalabilityMode || 'L1T3',
                    });
                }
                if (this.numSimulcastStreamsWebcam > 2) {
                    encodings.unshift({
                        scaleResolutionDownBy: 4,
                        maxBitrate: 500000,
                        scalabilityMode: this.webcamScalabilityMode || 'L1T3',
                    });
                }
            }
        }
        return { encodings, codec };
    }

    // ####################################################
    // SCREEN ENCODING
    // ####################################################

    getScreenEncoding() {
        let encodings;
        let codec;

        console.log('SCREEN ENCODING', {
            forceVP8: this.forceVP8,
            forceVP9: this.forceVP9,
            forceH264: this.forceH264,
            numSimulcastStreamsSharing: this.numSimulcastStreamsSharing,
            enableSharingLayers: this.enableSharingLayers,
            sharingScalabilityMode: this.sharingScalabilityMode,
        });

        if (this.forceVP8) {
            codec = this.device.rtpCapabilities.codecs.find((c) => c.mimeType.toLowerCase() === 'video/vp8');
            if (!codec) throw new Error('Desired VP8 codec+configuration is not supported');
        } else if (this.forceH264) {
            codec = this.device.rtpCapabilities.codecs.find((c) => c.mimeType.toLowerCase() === 'video/h264');
            if (!codec) throw new Error('Desired H264 codec+configuration is not supported');
        } else if (this.forceVP9) {
            codec = this.device.rtpCapabilities.codecs.find((c) => c.mimeType.toLowerCase() === 'video/vp9');
            if (!codec) throw new Error('Desired VP9 codec+configuration is not supported');
        }

        if (this.enableSharingLayers) {
            console.log('SCREEN SIMULCAST/SVC ENABLED');

            const firstVideoCodec = this.device.rtpCapabilities.codecs.find((c) => c.kind === 'video');
            console.log('SCREEN ENCODING: first codec available', { firstVideoCodec: firstVideoCodec });

            // If VP9 is the only available video codec then use SVC.
            if ((this.forceVP9 && codec) || firstVideoCodec.mimeType.toLowerCase() === 'video/vp9') {
                console.log('SCREEN ENCODING: VP9 with SVC');
                encodings = [
                    {
                        maxBitrate: 5000000,
                        scalabilityMode: this.sharingScalabilityMode || 'L3T3',
                        dtx: true,
                    },
                ];
            } else {
                console.log('SCREEN ENCODING: VP8 or H264 with simulcast.');
                encodings = [
                    {
                        scaleResolutionDownBy: 1,
                        maxBitrate: 5000000,
                        scalabilityMode: this.sharingScalabilityMode || 'L1T3',
                        dtx: true,
                    },
                ];
                if (this.numSimulcastStreamsSharing > 1) {
                    encodings.unshift({
                        scaleResolutionDownBy: 2,
                        maxBitrate: 1000000,
                        scalabilityMode: this.sharingScalabilityMode || 'L1T3',
                        dtx: true,
                    });
                }
                if (this.numSimulcastStreamsSharing > 2) {
                    encodings.unshift({
                        scaleResolutionDownBy: 4,
                        maxBitrate: 500000,
                        scalabilityMode: this.sharingScalabilityMode || 'L1T3',
                        dtx: true,
                    });
                }
            }
        }
        return { encodings, codec };
    }

    // ####################################################
    // HELPERS
    // ####################################################

    createButton(id, className) {
        const button = document.createElement('button');
        button.id = id;
        button.className = className;
        return button;
    }

    getConsumerIdByProducerId(producerId) {
        for (let [consumerId, consumer] of this.consumers.entries()) {
            if (consumer._producerId === producerId) {
                return consumerId;
            }
        }
        return null;
    }

    getProducerIdByConsumerId(consumerId) {
        const consumer = this.consumers.get(consumerId);
        if (consumer) {
            return consumer._producerId;
        }
        return null;
    }

    // ####################################################
    // PRODUCER
    // ####################################################

    handleHideMe() {
        const myScreenWrap = this.getId(this.screenProducerId + '__video');
        const myVideoWrap = this.getId(this.videoProducerId + '__video');
        const myVideoWrapOff = this.getId(this.peer_id + '__videoOff');
        const myVideoPinBtn = this.getId(this.videoProducerId + '__pin');
        const myScreenPinBtn = this.getId(this.screenProducerId + '__pin');
        console.log('handleHideMe', {
            isHideMeActive: isHideMeActive,
            myScreenWrap: myScreenWrap ? myScreenWrap.id : null,
            myVideoWrap: myVideoWrap ? myVideoWrap.id : null,
            myVideoWrapOff: myVideoWrapOff ? myVideoWrapOff.id : null,
            myVideoPinBtn: myVideoPinBtn ? myVideoPinBtn.id : null,
            myScreenPinBtn: myScreenPinBtn ? myScreenPinBtn.id : null,
        });
        if (myScreenWrap) myScreenWrap.style.display = isHideMeActive ? 'none' : 'block';
        if (isHideMeActive && this.isVideoPinned && myVideoPinBtn) myVideoPinBtn.click();
        if (isHideMeActive && this.isVideoPinned && myScreenPinBtn) myScreenPinBtn.click();
        if (myVideoWrap) myVideoWrap.style.display = isHideMeActive ? 'none' : 'block';
        if (myVideoWrapOff) myVideoWrapOff.style.display = isHideMeActive ? 'none' : 'block';
        hideMeIcon.className = isHideMeActive ? html.hideMeOn : html.hideMeOff;
        hideMeIcon.style.color = isHideMeActive ? 'red' : 'white';
        isHideMeActive ? this.sound('left') : this.sound('joined');
        resizeVideoMedia();
    }

    producerExist(type) {
        return this.producerLabel.has(type);
    }

    closeThenProduce(type, deviceId = null, swapCamera = false) {
        this.closeProducer(type);
        setTimeout(async function () {
            await rc.produce(type, deviceId, swapCamera);
        }, 1000);
    }

    async handleProducer(id, type, stream) {
        let elem, vb, vp, ts, d, p, i, au, pip, fs, pm, pb, pn, pv, mv;
        switch (type) {
            case mediaType.video:
            case mediaType.screen:
                let isScreen = type === mediaType.screen;
                this.removeVideoOff(this.peer_id);

                d = document.createElement('div');
                d.className = 'Camera';
                d.id = id + '__video';

                elem = document.createElement('video');
                elem.setAttribute('id', id);
                elem.setAttribute('volume', this.peer_id + '___pVolume');
                !isScreen && elem.setAttribute('name', this.peer_id);
                elem.setAttribute('playsinline', true);
                elem.controls = isVideoControlsOn;
                elem.autoplay = true;
                elem.muted = true;
                elem.volume = 0;
                elem.poster = image.poster;
                elem.style.objectFit = isScreen || isBroadcastingEnabled ? 'contain' : 'var(--videoObjFit)';
                elem.className = this.isMobileDevice || isScreen ? '' : 'mirror';

                vb = document.createElement('div');
                vb.id = id + '__vb';
                vb.className = 'videoMenuBar hidden';

                pip = this.createButton(id + '__pictureInPicture', html.pip);
                fs = this.createButton(id + '__fullScreen', html.fullScreen);
                ts = this.createButton(id + '__snapshot', html.snapshot);
                mv = this.createButton(id + '__mirror', html.mirror);
                pn = this.createButton(id + '__pin', html.pin);
                vp = this.createButton(this.peer_id + '__vp', html.videoPrivacy);
                au = this.createButton(
                    this.peer_id + '__audio',
                    this.peer_info.peer_audio ? html.audioOn : html.audioOff,
                );
                au.style.cursor = 'default';

                p = document.createElement('p');
                p.id = this.peer_id + '__name';
                p.className = html.userName;
                p.innerText = (isPresenter ? '⭐️ ' : '') + this.peer_name + ' (me)';

                i = document.createElement('i');
                i.id = this.peer_id + '__hand';
                i.className = html.userHand;

                pm = document.createElement('div');
                pb = document.createElement('div');
                pm.setAttribute('id', this.peer_id + '_pitchMeter');
                pb.setAttribute('id', this.peer_id + '_pitchBar');
                pm.className = 'speechbar';
                pb.className = 'bar';
                pb.style.height = '1%';
                pm.appendChild(pb);

                pv = document.createElement('input');
                pv.id = this.peer_id + '___pVolume';
                pv.type = 'range';
                pv.min = 0;
                pv.max = 100;
                pv.value = 100;

                BUTTONS.producerVideo.audioVolumeInput && vb.appendChild(pv);
                BUTTONS.producerVideo.muteAudioButton && vb.appendChild(au);
                BUTTONS.producerVideo.videoPrivacyButton && !isScreen && vb.appendChild(vp);
                BUTTONS.producerVideo.snapShotButton && vb.appendChild(ts);
                BUTTONS.producerVideo.videoPictureInPicture &&
                    this.isVideoPictureInPictureSupported &&
                    vb.appendChild(pip);
                BUTTONS.producerVideo.videoMirrorButton && vb.appendChild(mv);
                BUTTONS.producerVideo.fullScreenButton && this.isVideoFullScreenSupported && vb.appendChild(fs);

                if (!this.isMobileDevice) vb.appendChild(pn);

                vb.appendChild(p);
                d.appendChild(elem);
                d.appendChild(pm);
                d.appendChild(i);

                // add lightning address or lnurl for zaps
                if (peer_lnaddress) {
                    const zp = document.createElement('button');
                    zp.id = peer_lnaddress + '__zap';
                    zp.className = html.zapIcon;
                    zp.addEventListener('click', (event) => {
                        event.stopPropagation(); // Prevent click from bubbling up
                        handleLightning(zp);
                    });
                    d.appendChild(zp);
                }
                d.appendChild(p);
             /*   this.videoMediaContainer.appendChild(vb);
                this.videoMediaContainer.appendChild(d);

                let pv;
    
                // Create and append volume control to peerNameSpan
                pv = document.createElement('input');
                pv.id = this.peer_id + '___pVolume';
                pv.type = 'range';
                pv.min = 0;
                pv.max = 100;
                pv.value = 100;
                peerNameContainer.appendChild(pv);
                
                peerNameContainer.appendChild(peerNameSpan); */
    
                if (peer_info.peer_npub) {
                    const nostrIcon = document.createElement('span');
                    nostrIcon.className = html.nostrIcon + ' nostr-icon-inline';
                    nostrIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        this.handleNostrClick(peer_info.peer_npub);
                    });
                    vb.appendChild(nostrIcon);
                }

                // Create and append peer name header
                const peerNameHeader = document.createElement('div');
                peerNameHeader.className = 'peer-name-header';
                
                const peerNameContainer = document.createElement('div');
                peerNameContainer.className = 'peer-name-container';
                
                const peerNameSpan = document.createElement('span');
                peerNameSpan.className = 'peer-name';
                peerNameSpan.textContent = peer_name;                 

    
                peerNameHeader.appendChild(peerNameContainer);
                vb.appendChild(peerNameHeader);

                
              /*  // Update the event listener
                d.addEventListener('click', (event) => {
                    if (!event.target.closest('.' + html.zapIcon.split(' ')[0])) {
                        const menuBarElement = vb; // Reference to the videoMenuBar element
                        this.toggleVideoMenuBar(menuBarElement);
                    }
                });


                this.attachMediaStream(elem, stream, type, 'Producer'); */
                //d.appendChild(vb);
                document.body.appendChild(vb);
                this.videoMediaContainer.appendChild(d);

                await this.attachMediaStream(elem, stream, type, 'Producer');

                this.myVideoEl = elem;
                this.isVideoPictureInPictureSupported && this.handlePIP(elem.id, pip.id);
                this.isVideoFullScreenSupported && this.handleFS(elem.id, fs.id);
                this.handleVB(d.id, vb.id);
                this.handleDD(elem.id, this.peer_id, true);
                this.handleTS(elem.id, ts.id);
                this.handleMV(elem.id, mv.id);
                this.handlePN(elem.id, pn.id, d.id, isScreen);
                this.handleZV(elem.id, d.id, this.peer_id);
                this.handlePV(id + '___' + pv.id);

                this.setAV(
                    this.audioConsumers.get(this.peer_id + '___pVolume'),
                    this.peer_id + '___pVolume',
                    this.peer_info.peer_audio_volume,
                );

                if (!isScreen) this.handleVP(elem.id, vp.id);

                this.popupPeerInfo(p.id, this.peer_info);
                this.checkPeerInfoStatus(this.peer_info);

                if (isScreen) pn.click();

                handleAspectRatio();

                console.log('[addProducer] Video-element-count', this.videoMediaContainer.childElementCount);
                break;
            case mediaType.audio:
                elem = document.createElement('audio');
                elem.setAttribute('id', id);
                elem.setAttribute('name', id + '__localAudio');
                elem.setAttribute('volume', this.peer_id + '___pVolume');
                elem.controls = false;
                elem.autoplay = true;
                elem.muted = true;
                elem.volume = 0;
                this.myAudioEl = elem;
                this.localAudioEl.appendChild(elem);

                await this.attachMediaStream(elem, stream, type, 'Producer');

                const audioConsumerId = this.peer_id + '___pVolume';
                this.audioConsumers.set(audioConsumerId, elem.id);

                this.setAV(elem.id, audioConsumerId, this.peer_info.peer_audio_volume);
                this.handlePV(elem.id + '___' + audioConsumerId);

                console.log('[addProducer] audio-element-count', this.localAudioEl.childElementCount);
                break;
            default:
                break;
        }
        return elem;
    }

    async pauseProducer(type) {
        if (!this.producerLabel.has(type)) {
            return console.warn('There is no producer for this type ' + type);
        }

        const producer_id = this.producerLabel.get(type);
        this.producers.get(producer_id).pause();

        try {
            const response = await this.socket.request('pauseProducer', { producer_id: producer_id });
            console.log('Producer paused', response);
        } catch (error) {
            console.error('Error pausing producer', error);
        }

        switch (type) {
            case mediaType.audio:
                this.event(_EVENTS.pauseAudio);
                this.setIsAudio(this.peer_id, false);
                break;
            case mediaType.video:
                this.event(_EVENTS.pauseVideo);
                break;
            case mediaType.screen:
                this.event(_EVENTS.pauseScreen);
                break;
            default:
                return;
        }
    }

    async resumeProducer(type) {
        if (!this.producerLabel.has(type)) {
            return console.warn('There is no producer for this type ' + type);
        }

        const producer_id = this.producerLabel.get(type);
        this.producers.get(producer_id).resume();

        try {
            const response = await this.socket.request('resumeProducer', { producer_id: producer_id });
            console.log('Producer resumed', response);
        } catch (error) {
            console.error('Error resuming producer', error);
        }

        switch (type) {
            case mediaType.audio:
                this.event(_EVENTS.resumeAudio);
                this.setIsAudio(this.peer_id, true);
                break;
            case mediaType.video:
                this.event(_EVENTS.resumeVideo);
                break;
            case mediaType.screen:
                this.event(_EVENTS.resumeScreen);
                break;
            default:
                return;
        }
    }

    closeProducer(type) {
        if (!this.producerLabel.has(type)) {
            return console.warn('There is no producer for this type ' + type);
        }

        const producer_id = this.producerLabel.get(type);

        const data = {
            peer_name: this.peer_name,
            producer_id: producer_id,
            type: type,
            status: false,
        };
        console.log(`Close producer ${type}`, data);

        this.socket.emit('producerClosed', data);

        this.producers.get(producer_id).close();
        this.producers.delete(producer_id);
        this.producerLabel.delete(type);

        console.log('[closeProducer] - PRODUCER LABEL', this.producerLabel);

        if (type !== mediaType.audio) {
            const elem = this.getId(producer_id);
            const d = this.getId(producer_id + '__video');
            const vb = this.getId(producer_id + '__vb');
            elem.srcObject.getTracks().forEach(function (track) {
                track.stop();
            });
            d.parentNode.removeChild(d);
            vb.parentNode.removeChild(vb);

            //alert(this.pinnedVideoPlayerId + '==' + producer_id);
            if (this.isVideoPinned && this.pinnedVideoPlayerId == producer_id) {
                this.removeVideoPinMediaContainer();
                console.log('Remove pin container due the Producer close', {
                    producer_id: producer_id,
                    producer_type: type,
                });
            }

            handleAspectRatio();

            console.log('[producerClose] Video-element-count', this.videoMediaContainer.childElementCount);
        }

        if (type === mediaType.audio) {
            const au = this.getName(producer_id + '__localAudio');
            au.srcObject.getTracks().forEach(function (track) {
                track.stop();
            });
            this.localAudioEl.removeChild(au);
            console.log('[producerClose] Audio-element-count', this.localAudioEl.childElementCount);
        }

        switch (type) {
            case mediaType.audio:
                this.setIsAudio(this.peer_id, false);
                this.event(_EVENTS.stopAudio);
                break;
            case mediaType.video:
                this.setIsVideo(false);
                this.event(_EVENTS.stopVideo);
                break;
            case mediaType.screen:
                this.setIsScreen(false);
                this.event(_EVENTS.stopScreen);
                break;
            default:
                break;
        }

        this.sound('left');
    }

    async produceScreenAudio(stream) {
        try {
            if (this.producerLabel.has(mediaType.audioTab)) {
                return console.warn('Producer already exists for this type ' + mediaType.audioTab);
            }

            const track = stream.getAudioTracks()[0];
            const params = {
                track,
                appData: {
                    mediaType: mediaType.audio,
                },
            };

            const producerSa = await this.producerTransport.produce(params);

            console.log('PRODUCER SCREEN AUDIO', producerSa);

            this.producers.set(producerSa.id, producerSa);
            this.producerLabel.set(mediaType.audioTab, producerSa.id);

            console.log('[produceScreenAudio] - PRODUCER LABEL', this.producerLabel);

            const sa = await this.handleProducer(producerSa.id, mediaType.audio, stream);

            producerSa.on('trackended', () => {
                console.log('Producer Screen audio track ended', { id: producerSa.id });
                this.closeProducer(mediaType.audioTab);
            });

            producerSa.on('transportclose', () => {
                console.log('Producer Screen audio transport close', { id: producerSa.id });
                sa.srcObject.getTracks().forEach(function (track) {
                    track.stop();
                });
                sa.parentNode.removeChild(sa);
                console.log('[transportClose] audio-element-count', this.localAudioEl.childElementCount);
                this.closeProducer(mediaType.audioTab);
            });

            producerSa.on('close', () => {
                console.log('Closing Screen audio producer', { id: producerSa.id });
                sa.srcObject.getTracks().forEach(function (track) {
                    track.stop();
                });
                sa.parentNode.removeChild(sa);
                console.log('[closingProducer] audio-element-count', this.localAudioEl.childElementCount);
                this.closeProducer(mediaType.audioTab);
            });
        } catch (err) {
            console.error('Produce error:', err);
        }
    }

    // ####################################################
    // CONSUMER
    // ####################################################

    async consume(producer_id, peer_name, peer_info, type) {
        try {
            wbUpdate();

            this.editorUpdate();

            const { consumer, stream, kind } = await this.getConsumeStream(producer_id, peer_info.peer_id, type);

            console.log('CONSUMER MEDIA TYPE ----> ' + type);
            console.log('CONSUMER', consumer);

            this.consumers.set(consumer.id, consumer);

            // https://mediasoup.discourse.group/t/create-server-side-consumers-with-paused-true/244
            try {
                const response = await this.socket.request('resumeConsumer', { consumer_id: consumer.id });
                console.log('Consumer resumed', response);
            } catch (error) {
                console.error('Error resuming consumer', error);
            }

            consumer.on('trackended', () => {
                console.log('Consumer track end', { id: consumer.id, type });
                this.removeConsumer(consumer.id, consumer.kind);
            });

            consumer.on('transportclose', () => {
                console.log('Consumer transport close', { id: consumer.id, type });
                this.removeConsumer(consumer.id, consumer.kind);
            });

            this.handleConsumer(consumer.id, type, stream, peer_name, peer_info);

            if (kind === 'video' && isParticipantsListOpen) {
                await getRoomParticipants();
            }
        } catch (error) {
            console.error('Error in consume', error);
        }
    }

    async getConsumeStream(producerId, peer_id, type) {
        const { rtpCapabilities } = this.device;

        const data = await this.socket.request('consume', {
            rtpCapabilities,
            consumerTransportId: this.consumerTransport.id,
            producerId,
        });

        console.log('DATA', data);

        const { id, kind, rtpParameters } = data;
        const codecOptions = {};
        const streamId = peer_id + (type == mediaType.screen ? '-screen-sharing' : '-mic-webcam');
        const consumer = await this.consumerTransport.consume({
            id,
            producerId,
            kind,
            rtpParameters,
            codecOptions,
            streamId,
        });

        const stream = new MediaStream();
        stream.addTrack(consumer.track);

        return {
            consumer,
            stream,
            kind,
        };
    }

   /* handleConsumer(id, type, stream, peer_name, peer_info) {
        const {
            peer_id: remotePeerId,
            peer_audio: remotePeerAudio,
            peer_video_privacy: remotePrivacyOn,
            peer_presenter: remotePeerPresenter,
            peer_lnaddress: remoteLNAddress,
            peer_npub,
            peer_url
        } = peer_info;
    
        const isScreen = type === mediaType.screen;
    
        const createButton = (id, className) => {
            const button = document.createElement('button');
            button.id = id;
            button.className = className;
            return button;
        };
    
        let elem, vb, d, p, i, cm, au, pip, fs, ts, sf, sm, sv, gl, ban, ko, pb, pm, pv, pn; */
    
    async handleConsumer(id, type, stream, peer_name, peer_info) {
        let elem, vb, d, p, i, cm, au, pip, fs, ts, sf, sm, sv, gl, ban, ko, pb, pm, pv, pn, ha, mv;

        let eDiv, eBtn, eVc; // expand buttons

        console.log('PEER-INFO', peer_info);

        const remotePeerId = peer_info.peer_id;
        const remoteIsScreen = type == mediaType.screen;
        const remotePeerAudio = peer_info.peer_audio;
        const remotePeerAudioVolume = peer_info.peer_audio_volume;
        const remotePrivacyOn = peer_info.peer_video_privacy;
        const remotePeerPresenter = peer_info.peer_presenter; 
        const remoteLNAddress = peer_info.peer_lnaddress;
        const peer_npub = peer_info.peer_npub;
        const peer_url = peer_info.peer_url;


        switch (type) {
            case mediaType.video:
            case mediaType.screen:
                this.removeVideoOff(remotePeerId);

                d = document.createElement('div');
                d.className = 'Camera';
                d.id = id + '__video';

                elem = document.createElement('video');
                elem.setAttribute('id', id);
                elem.setAttribute('volumeBar', remotePeerId + '___pVolume');
                !remoteIsScreen && elem.setAttribute('name', remotePeerId);
                elem.setAttribute('playsinline', true);
                elem.controls = isVideoControlsOn;
                elem.autoplay = true;
                elem.className = '';
                elem.poster = image.poster;
           /*     elem.style.objectFit = isScreen || isBroadcastingEnabled ? 'contain' : 'var(--videoObjFit)';
                vb = document.createElement('div');
                vb.setAttribute('id', remotePeerId + '__vb');
                vb.className = 'videoMenuBar fadein';
                
                // Create and append peer name header
                const peerNameHeader = document.createElement('div');
                peerNameHeader.className = 'peer-name-header';
                
                const peerNameContainer = document.createElement('div');
                peerNameContainer.className = 'peer-name-container';
                
                const peerNameSpan = document.createElement('span');
                peerNameSpan.className = 'peer-name';
                peerNameSpan.textContent = peer_name;
    
                // Create and append volume control to peerNameSpan
                pv = document.createElement('input');
                pv.id = remotePeerId + '___pVolume';
                pv.type = 'range';
                pv.min = 0;
                pv.max = 100;
                pv.value = 100;                
                peerNameContainer.appendChild(peerNameSpan);
                peerNameContainer.appendChild(pv);  */
        
                /*  this.addCloseButton(peerNameHeader, vb);
    
                pip = createButton(id + '__pictureInPicture', html.pip);
                fs = createButton(id + '__fullScreen', html.fullScreen);
                ts = createButton(id + '__snapshot', html.snapshot);
                pn = createButton(id + '__pin', html.pin);
                sf = createButton(id + '___' + remotePeerId + '___sendFile', html.sendFile);
                sm = createButton(id + '___' + remotePeerId + '___sendMsg', html.sendMsg);
                sv = createButton(id + '___' + remotePeerId + '___sendVideo', html.sendVideo);
                cm = createButton(id + '___' + remotePeerId + '___video', html.videoOn);
                au = createButton(remotePeerId + '__audio', remotePeerAudio ? html.audioOn : html.audioOff);
                gl = createButton(id + '___' + remotePeerId + '___geoLocation', html.geolocation);
                ban = createButton(id + '___' + remotePeerId + '___ban', html.ban);
                ko = createButton(id + '___' + remotePeerId + '___kickOut', html.kickOut); */
    
                elem.style.objectFit = remoteIsScreen || isBroadcastingEnabled ? 'contain' : 'var(--videoObjFit)';

                vb = document.createElement('div');
                vb.id = id + '__vb';
                vb.className = 'videoMenuBar hidden';

                if (p) {
                    const nostrIcon = document.createElement('span');
                    nostrIcon.className = html.nostrIcon + ' nostr-icon-inline';
                    nostrIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        this.handleNostrClick(peer_npub);
                    });
                    vb.appendChild(nostrIcon);
                }

                eDiv = document.createElement('div');
                eDiv.className = 'expand-video';

                eBtn = this.createButton(remotePeerId + '_videoExpandBtn', html.expand);

                eVc = document.createElement('div');
                eVc.className = 'expand-video-content';

                pip = this.createButton(id + '__pictureInPicture', html.pip);
                mv = this.createButton(id + '__videoMirror', html.mirror);
                fs = this.createButton(id + '__fullScreen', html.fullScreen);
                ts = this.createButton(id + '__snapshot', html.snapshot);
                pn = this.createButton(id + '__pin', html.pin);
                ha = this.createButton(id + '__hideALL', html.hideALL + ' focusMode');
                sf = this.createButton(id + '___' + remotePeerId + '___sendFile', html.sendFile);
                sm = this.createButton(id + '___' + remotePeerId + '___sendMsg', html.sendMsg);
                sv = this.createButton(id + '___' + remotePeerId + '___sendVideo', html.sendVideo);
                cm = this.createButton(id + '___' + remotePeerId + '___video', html.videoOn);
                au = this.createButton(remotePeerId + '__audio', remotePeerAudio ? html.audioOn : html.audioOff);
                gl = this.createButton(id + '___' + remotePeerId + '___geoLocation', html.geolocation);
                ban = this.createButton(id + '___' + remotePeerId + '___ban', html.ban);
                ko = this.createButton(id + '___' + remotePeerId + '___kickOut', html.kickOut);

                i = document.createElement('i');
                i.id = remotePeerId + '__hand';
                i.className = html.userHand;

                p = document.createElement('p');
                p.id = remotePeerId + '__name';
                p.className = html.userName;
                p.innerText = (remotePeerPresenter ? '⭐️ ' : '') + peer_name;

                pm = document.createElement('div');
                pb = document.createElement('div');
                pm.setAttribute('id', remotePeerId + '__pitchMeter');
                pb.setAttribute('id', remotePeerId + '__pitchBar');
                pm.className = 'speechbar';
                pb.className = 'bar';
                pb.style.height = '1%';
                pm.appendChild(pb);
    
      /*          const appendButtons = (parent, buttons) => {
                    buttons.forEach(button => parent.appendChild(button));
                };
    
                if (this.isMobileDevice) {
                    appendButtons(vb, [sm, sf, sv, gl, ban, ko, au, cm]);
                } else {
                    const eDiv = document.createElement('div');
                    eDiv.className = 'expand-video';
                    const eBtn = createButton(remotePeerId + '_videoExpandBtn', html.expand);
                    const eVc = document.createElement('div');
                    eVc.className = 'expand-video-content';
                    eDiv.appendChild(eBtn);
                    appendButtons(eVc, [sm, sf, sv, gl, ban, ko]);
                    eDiv.appendChild(eVc);
                    appendButtons(vb, [au, cm]);
                    vb.appendChild(eDiv);
                
                    // Add event listener for expand button
                    eBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        eDiv.classList.toggle('show');
                    });
                
                    // Close expand menu when clicking outside
                    document.addEventListener('click', () => {
                        eDiv.classList.remove('show');
                    });
                
                    eDiv.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                }
                
                appendButtons(vb, [ts, pip, fs]);
                if (!this.isMobileDevice) vb.appendChild(pn); */
                    

                const peerNameHeader = document.createElement('div');
                peerNameHeader.className = 'peer-name-header';

                const peerNameContainer = document.createElement('div');
                peerNameContainer.className = 'peer-name-container';

                const peerNameSpan = document.createElement('span');
                peerNameSpan.className = 'peer-name';
                peerNameSpan.textContent = peer_name;

                this.addCloseVBButton(peerNameHeader);

                peerNameContainer.appendChild(peerNameSpan);

                pv = document.createElement('input');
                pv.id = remotePeerId + '___pVolume';
                pv.type = 'range';
                pv.min = 0;
                pv.max = 100;
                pv.value = 100;

                BUTTONS.consumerVideo.audioVolumeInput && peerNameContainer.appendChild(pv);
                peerNameHeader.appendChild(peerNameContainer);

                vb.appendChild(peerNameHeader);
                eVc.appendChild(peerNameHeader);
                if (this.isMobileDevice) {
                    peerNameHeader.style.backgroundImage = `url('${peer_url || image.avatar}')`;
                }

                BUTTONS.consumerVideo.sendMessageButton && eVc.appendChild(sm);
                BUTTONS.consumerVideo.sendFileButton && eVc.appendChild(sf);
                BUTTONS.consumerVideo.sendVideoButton && eVc.appendChild(sv);
                BUTTONS.consumerVideo.geolocationButton && eVc.appendChild(gl);
                BUTTONS.consumerVideo.banButton && eVc.appendChild(ban);
                BUTTONS.consumerVideo.ejectButton && eVc.appendChild(ko);

                eDiv.appendChild(eBtn);
                eDiv.appendChild(eVc);
                vb.appendChild(eDiv);

                vb.appendChild(au);
                vb.appendChild(cm);
                BUTTONS.consumerVideo.snapShotButton && vb.appendChild(ts);
                BUTTONS.consumerVideo.videoPictureInPicture &&
                    this.isVideoPictureInPictureSupported &&
                    vb.appendChild(pip);
                BUTTONS.consumerVideo.videoMirrorButton && vb.appendChild(mv);
                BUTTONS.consumerVideo.fullScreenButton && this.isVideoFullScreenSupported && vb.appendChild(fs);
                BUTTONS.consumerVideo.focusVideoButton && vb.appendChild(ha);

                if (!this.isMobileDevice) vb.appendChild(pn);

                d.appendChild(elem);
                d.appendChild(i);
    
                if (remoteLNAddress) {
                    const zp = document.createElement('button');
                    zp.id = remoteLNAddress + '__zap';
                    zp.className = html.zapIcon;
                    handleLightning(zp);
                    d.appendChild(zp);
                }
    
                d.appendChild(p);
                d.appendChild(pm);

                d.addEventListener('click', (e) => {
                    if (!e.target.closest('.' + html.zapIcon.split(' ')[0])) {
                        this.toggleVideoMenuBar(vb);
                    }
                });
                
                document.body.appendChild(vb);
                this.videoMediaContainer.appendChild(d);
                await this.attachMediaStream(elem, stream, type, 'Consumer');
                this.isVideoPictureInPictureSupported && this.handlePIP(elem.id, pip.id);
                this.isVideoFullScreenSupported && this.handleFS(elem.id, fs.id);
                this.handleVB(d.id, vb.id);
                this.handleDD(elem.id, remotePeerId);
                this.handleTS(elem.id, ts.id);
                this.handleMV(elem.id, mv.id);
                this.handleSF(sf.id);
                this.handleSM(sm.id, peer_name);
                this.handleSV(sv.id);
                BUTTONS.consumerVideo.muteVideoButton && this.handleCM(cm.id);
                BUTTONS.consumerVideo.muteAudioButton && this.handleAU(au.id);
                this.handleCV(id + '___' + pv.id);
                this.handleGL(gl.id);
                this.handleBAN(ban.id);
                this.handleKO(ko.id);
                this.handlePN(elem.id, pn.id, d.id, remoteIsScreen);
                this.handleZV(elem.id, d.id, remotePeerId);
                this.popupPeerInfo(p.id, peer_info);
                this.checkPeerInfoStatus(peer_info);

                if (!remoteIsScreen && remotePrivacyOn) this.setVideoPrivacyStatus(remotePeerId, remotePrivacyOn);

                if (remoteIsScreen && !isHideALLVideosActive) pn.click();

                if (isHideALLVideosActive) {
                    isHideALLVideosActive = false;
                    const children = this.videoMediaContainer.children;
                    const btnsHA = document.querySelectorAll('.focusMode');
                    for (let child of children) {
                        child.style.display = 'block';
                    }
                    btnsHA.forEach((btn) => {
                        btn.style.color = 'white';
                    });
                }

                console.log('[addConsumer] Video-element-count', this.videoMediaContainer.childElementCount);

                if (!this.isMobileDevice) {
                    this.setTippy(pn.id, 'Toggle Pin', 'bottom');
                    this.setTippy(pip.id, 'Toggle picture in picture', 'bottom');
                    this.setTippy(mv.id, 'Toggle mirror', 'bottom');
                    this.setTippy(ts.id, 'Snapshot', 'bottom');
                    this.setTippy(sf.id, 'Send file', 'bottom');
                    this.setTippy(sm.id, 'Send message', 'bottom');
                    this.setTippy(sv.id, 'Send video', 'bottom');
                    this.setTippy(cm.id, 'Hide', 'bottom');
                    this.setTippy(au.id, 'Mute', 'bottom');
                    this.setTippy(pv.id, '🔊 Volume', 'bottom');
                    this.setTippy(gl.id, 'Geolocation', 'bottom');
                    this.setTippy(ban.id, 'Ban', 'bottom');
                    this.setTippy(ko.id, 'Eject', 'bottom');
                }

                // Use helper function to set audio volume
                this.setAV(
                    this.audioConsumers.get(remotePeerId + '___pVolume'),
                    remotePeerId + '___pVolume',
                    remotePeerAudioVolume,
                    true,
                );

                this.setPeerAudio(remotePeerId, remotePeerAudio);

                handleAspectRatio();
                this.sound('joined');
                break;
            case mediaType.audio:
                elem = document.createElement('audio');
                elem.setAttribute('id', id);
                elem.setAttribute('volumeBar', remotePeerId + '___pVolume');
                elem.autoplay = true;
                elem.audio = 1.0;
                this.remoteAudioEl.appendChild(elem);

                await this.attachMediaStream(elem, stream, type, 'Consumer');

                // Store audio consumer and set volume
                const audioConsumerId = remotePeerId + '___pVolume';
                this.audioConsumers.set(audioConsumerId, id);

                // Use helper function to set audio volume
                this.setAV(id, audioConsumerId, remotePeerAudioVolume, true);
                this.handleCV(id + '___' + audioConsumerId);

                this.setPeerAudio(remotePeerId, remotePeerAudio);

                if (sinkId && speakerSelect.value) {
                    this.changeAudioDestination(elem);
                }

                //elem.addEventListener('play', () => { elem.volume = 0.1 });
                console.log('[Add audioConsumers]', this.audioConsumers);
                break;
            default:
                break;
        }
        return elem;
    }

    removeConsumer(consumer_id, consumer_kind) {
        console.log('Remove consumer', { consumer_id: consumer_id, consumer_kind: consumer_kind });

        const elem = this.getId(consumer_id);
        if (elem) {
            elem.srcObject.getTracks().forEach(function (track) {
                track.stop();
            });
            elem.parentNode.removeChild(elem);
        }

        if (consumer_kind === 'video') {
            const d = this.getId(consumer_id + '__video');
            const vb = this.getId(consumer_id + '__vb');

            if (d) {
                // Check if video is in focus-mode...
                if (d.hasAttribute('focus-mode')) {
                    const dhaBtn = this.getId(consumer_id + '__hideALL');
                    if (dhaBtn) {
                        dhaBtn.click();
                    }
                }
                d.parentNode.removeChild(d);
                vb.parentNode.removeChild(vb);

                //alert(this.pinnedVideoPlayerId + '==' + consumer_id);
                if (this.isVideoPinned && this.pinnedVideoPlayerId == consumer_id) {
                    this.removeVideoPinMediaContainer();
                    console.log('Remove pin container due the Consumer close', {
                        consumer_id: consumer_id,
                        consumer_kind: consumer_kind,
                    });
                }
            }

            handleAspectRatio();
            console.log(
                '[removeConsumer - ' + consumer_kind + '] Video-element-count',
                this.videoMediaContainer.childElementCount,
            );
        }

        if (consumer_kind === 'audio') {
            const audioConsumerPlayerId = this.getMapKeyByValue(this.audioConsumers, consumer_id);
            if (audioConsumerPlayerId) {
                const inputPv = this.getId(audioConsumerPlayerId);
                if (inputPv) inputPv.style.display = 'none';
                this.audioConsumers.delete(audioConsumerPlayerId);
                console.log('Remove audio Consumer', {
                    consumer_id: consumer_id,
                    audioConsumerPlayerId: audioConsumerPlayerId,
                    audioConsumers: this.audioConsumers,
                });
            }
        }

        this.consumers.get(consumer_id).close();
        this.consumers.delete(consumer_id);
        this.sound('left');
    }

    // ####################################################
    // HANDLE VIDEO OFF
    // ####################################################

    setVideoOff(peer_info, remotePeer = false) {
        console.log('setVideoOff', peer_info);
        let d, vb, i, h, au, sf, sm, sv, gl, ban, ko, p, pm, pb, pv;
    
        const { peer_id, peer_name, peer_audio, peer_presenter, peer_npub, peer_lnaddress, peer_url } = peer_info;
    
        // Error handling: Check if peer_id is valid
        if (!peer_id) {
            console.error('Invalid peer_id in setVideoOff');
            return;
        }
    
        this.removeVideoOff(peer_id);
        
     /*   // Create main container
        d = document.createElement('div');
        d.className = 'Camera';
        d.id = peer_id + '__videoOff';
    
        // Create video menu bar
        vb = document.createElement('div');
        vb.id = peer_id + 'vb';
        vb.className = 'videoMenuBar fadein';
    
        // Create and append peer name header
        const peerNameHeader = document.createElement('div');
        peerNameHeader.className = 'peer-name-header';
        
        const peerNameContainer = document.createElement('div');
        peerNameContainer.className = 'peer-name-container';
        
        const peerNameSpan = document.createElement('span');
        peerNameSpan.className = 'peer-name';
        peerNameSpan.textContent = peer_name;
        peerNameContainer.appendChild(peerNameSpan);
        
        if (this.isMobileDevice) {
            peerNameHeader.style.backgroundImage = `url('${peer_info.peer_url || image.avatar}')`;
        } */
        
    
      /*  peerNameHeader.appendChild(peerNameContainer);
        vb.appendChild(peerNameHeader);
    
        // Create audio button
        au = document.createElement('button');
        au.id = peer_id + '__audio';
        au.className = peer_audio ? html.audioOn : html.audioOff;
            
        // Create and append controls for remote peers
        if (remotePeer) {
            pv = document.createElement('input');
            pv.id = 'remotePeer___' + peer_id + '___pVolume';
            pv.type = 'range';
            pv.min = 0;
            pv.max = 100;
            pv.value = 100;
            peerNameContainer.appendChild(pv);
                    

            sf = document.createElement('button');
            sf.id = 'remotePeer___' + peer_id + '___sendFile';
            sf.className = html.sendFile;
    
            sm = document.createElement('button');
            sm.id = 'remotePeer___' + peer_id + '___sendMsg';
            sm.className = html.sendMsg;
    
            sv = document.createElement('button');
            sv.id = 'remotePeer___' + peer_id + '___sendVideo';
            sv.className = html.sendVideo;
    
            gl = document.createElement('button');
            gl.id = 'remotePeer___' + peer_id + '___geoLocation';
            gl.className = html.geolocation;
    
            ban = document.createElement('button');
            ban.id = 'remotePeer___' + peer_id + '___ban';
            ban.className = html.ban;
    
            ko = document.createElement('button');
            ko.id = 'remotePeer___' + peer_id + '___kickOut';
            ko.className = html.kickOut;
    
            // Append buttons to video menu bar  */

        d = document.createElement('div');
        d.className = 'Camera';
        d.id = peer_id + '__videoOff';

        vb = document.createElement('div');
        vb.id = peer_id + '__vb';
        vb.className = 'videoMenuBar hidden';

        au = this.createButton(peer_id + '__audio', peer_audio ? html.audioOn : html.audioOff);

        if (peer_npub) {
            console.log('peer_npub', peer_npub);
            const nostrIcon = document.createElement('span');
            nostrIcon.className = html.nostrIcon + ' nostr-icon-inline';
            nostrIcon.addEventListener('click', (event) => {
                event.stopPropagation();
                this.handleNostrClick(peer_npub);
            });
            vb.appendChild(nostrIcon);
        }

        pv = document.createElement('input');
        pv.id = peer_id + '___pVolume';
        pv.type = 'range';
        pv.min = 0;
        pv.max = 100;
        pv.value = 100;

        if (remotePeer) {
            sf = this.createButton('remotePeer___' + peer_id + '___sendFile', html.sendFile);
            sm = this.createButton('remotePeer___' + peer_id + '___sendMsg', html.sendMsg);
            sv = this.createButton('remotePeer___' + peer_id + '___sendVideo', html.sendVideo);
            gl = this.createButton('remotePeer___' + peer_id + '___geoLocation', html.geolocation);
            ban = this.createButton('remotePeer___' + peer_id + '___ban', html.ban);
            ko = this.createButton('remotePeer___' + peer_id + '___kickOut', html.kickOut);
        }

        // Create and append avatar image
        i = document.createElement('img');
        i.className = 'videoAvatarImage center';
        i.id = peer_id + '__img';
        d.appendChild(i);
            

        p = document.createElement('p');
        p.id = peer_id + '__name';
        p.className = html.userName;
        p.innerText = (peer_presenter ? '⭐️ ' : '') + peer_name + (remotePeer ? '' : ' (me) ');

        h = document.createElement('i');
        h.id = peer_id + '__hand';
        h.className = html.userHand;

        pm = document.createElement('div');
        pb = document.createElement('div');
        pm.setAttribute('id', peer_id + '__pitchMeter');
        pb.setAttribute('id', peer_id + '__pitchBar');
        pm.className = 'speechbar';
        pb.className = 'bar';
        pb.style.height = '1%';
        pm.appendChild(pb);

        if (remotePeer) {
            BUTTONS.videoOff.ejectButton && vb.appendChild(ko);
            BUTTONS.videoOff.banButton && vb.appendChild(ban);
            BUTTONS.videoOff.geolocationButton && vb.appendChild(gl);
            BUTTONS.videoOff.sendVideoButton && vb.appendChild(sv);
            BUTTONS.videoOff.sendFileButton && vb.appendChild(sf);
            BUTTONS.videoOff.sendMessageButton && vb.appendChild(sm);
        }
        BUTTONS.videoOff.audioVolumeInput && vb.appendChild(pv);

        vb.appendChild(au);
    
        // Add lightning address button if available
        if (peer_lnaddress) {
            const zp = document.createElement('button');
            zp.id = peer_lnaddress + '__zap';
            zp.className = html.zapIcon;
            zp.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent click from bubbling up
                handleLightning(zp);
            });
            d.appendChild(zp);
        }
            
        // Create and append other UI elements
        p = document.createElement('p');
        p.id = peer_id + '__name';
        p.className = html.userName;
        p.innerText = (peer_presenter ? '⭐️ ' : '') + peer_name + (remotePeer ? '' : ' (me) ');
    
        h = document.createElement('i');
        h.id = peer_id + '__hand';
        h.className = html.userHand;
    
        pm = document.createElement('div');
        pb = document.createElement('div');
        pm.id = peer_id + '__pitchMeter';
        pb.id = peer_id + '__pitchBar';
        pm.className = 'speechbar';
        pb.className = 'bar';
        pb.style.height = '1%';
        pm.appendChild(pb);
    
        d.appendChild(p);
        d.appendChild(h);
        d.appendChild(pm);
        //d.appendChild(vb);

        document.body.appendChild(vb);
        this.videoMediaContainer.appendChild(d);
    
        // Set up event handlers
        BUTTONS.videoOff.muteAudioButton && this.handleAU(au.id);

        if (remotePeer) {
            this.handleCV('remotePeer___' + pv.id);
            this.handleSM(sm.id);
            this.handleSF(sf.id);
            this.handleSV(sv.id);
            this.handleGL(gl.id);
            this.handleBAN(ban.id);
            this.handleKO(ko.id);
        } else {
            this.handlePV(this.audioConsumers.get(pv.id) + '___' + pv.id);
        }

        this.handleVB(d.id, vb.id);
        this.handleDD(d.id, peer_id, !remotePeer);
        this.popupPeerInfo(p.id, peer_info);
        this.checkPeerInfoStatus(peer_info);
        this.setVideoAvatarImgName(i.id, peer_name, peer_url);
        this.getId(i.id).style.display = 'block';

        handleAspectRatio();

        if (isParticipantsListOpen) getRoomParticipants();

        if (!this.isMobileDevice && remotePeer) {
            this.setTippy(sm.id, 'Send message', 'bottom');
            this.setTippy(sf.id, 'Send file', 'bottom');
            this.setTippy(sv.id, 'Send video', 'bottom');
            this.setTippy(au.id, 'Mute', 'bottom');
            this.setTippy(pv.id, '🔊 Volume', 'bottom');
            this.setTippy(gl.id, 'Geolocation', 'bottom');
            this.setTippy(ban.id, 'Ban', 'bottom');
            this.setTippy(ko.id, 'Eject', 'bottom');
        }
        remotePeer ? this.setPeerAudio(peer_id, peer_audio) : this.setIsAudio(peer_id, peer_audio);
    
        // Update the event listener
        d.addEventListener('click', (event) => {
            if (!event.target.closest('.' + html.zapIcon.split(' ')[0])) {
                const menuBarElement = vb; // Reference to the videoMenuBar element
                this.toggleVideoMenuBar(menuBarElement);
            }
        });

        // This was close button for the menu bar which may be needed after merge.
        // this.addCloseButton(peerNameHeader, vb);

    
        console.log('[setVideoOff] Video-element-count', this.videoMediaContainer.childElementCount);
        wbUpdate();

        this.editorUpdate();

        this.handleHideMe();
    }
    
    // Helper function to handle Nostr button click
    handleNostrClick(peer_npub) {
        const iframe = getProfile(peer_npub);
        Swal.fire({
            background: swalBackground,
            html: iframe.outerHTML,
            position: 'top-end',
            showClass: {
                popup: 'animate__animated animate__fadeInRight animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutRight animate__faster'
            },
            grow: 'column',
            width: 600,
            showCloseButton: true,
            showConfirmButton: false,
        });
    }
    
    toggleVideoMenuBar(menuBarElement, options = {}) {
        if (!menuBarElement) {
            console.warn('toggleVideoMenuBar called with undefined menuBarElement');
            return;
        }
        
        const { isMobile = this.isMobileDevice, closeOthers = true } = options;
    
        const isActive = menuBarElement.classList.contains('active');
    
        if (isActive) {
            // Close the menu bar
            menuBarElement.classList.remove('active');
            if (isMobile) {
                document.body.style.overflow = '';
                menuBarElement.style.transition = 'transform 0.3s, opacity 0.3s';
                menuBarElement.style.transform = 'translateY(100%)';
                menuBarElement.style.opacity = '0';
                setTimeout(() => {
                    if (menuBarElement && menuBarElement.style) {
                        menuBarElement.style.transition = '';
                    }
                }, 300);
            }
        } else {
            // Open the menu bar
            if (closeOthers) {
                this.closeOtherMenuBars(menuBarElement);
            }
            menuBarElement.classList.add('active');
            if (isMobile) {
                document.body.style.overflow = 'hidden';
                menuBarElement.style.transition = 'transform 0.3s, opacity 0.3s';
                menuBarElement.style.transform = 'translateY(0)';
                menuBarElement.style.opacity = '1';
                setTimeout(() => {
                    if (menuBarElement && menuBarElement.style) {
                        menuBarElement.style.transition = '';
                    }
                }, 300);
            }
        }
    }
    
    closeVideoMenuBar(peer_id) {
        const videoMenuBar = this.findVideoMenuBar(peer_id);
        if (!videoMenuBar) return;
    
        videoMenuBar.classList.remove('active');
        
        if (this.isMobileDevice) {
            document.body.style.overflow = '';
            videoMenuBar.style.transition = 'transform 0.3s, opacity 0.3s';
            videoMenuBar.style.transform = 'translateY(100%)';
            videoMenuBar.style.opacity = '0';
            setTimeout(() => {
                videoMenuBar.style.transition = '';
            }, 300);
        }
    }
    
    findMenuBar(selector) {
        return document.querySelector(selector);
    }
            
    closeAllVideoMenuBars() {
        const allMenuBars = document.querySelectorAll('.videoMenuBar.active');
        allMenuBars.forEach(menuBar => {
            const peerId = this.findPeerId(menuBar);
            if (peerId) {
                this.closeVideoMenuBar(peerId);
            }
        });
    }
    
    closeOtherMenuBars(exceptMenuBar) {
        const allMenuBars = document.querySelectorAll('.videoMenuBar.active');
        allMenuBars.forEach(bar => {
            if (bar !== exceptMenuBar) {
                bar.classList.remove('active');
                if (this.isMobileDevice) {
                    bar.style.transform = 'translateY(100%)';
                    bar.style.opacity = '0';
                }
            }
        });
    }
        
    addCloseButton(containerElement, menuBarElement) {
        // Create close button
        const closeBtn = document.createElement('div');
        closeBtn.className = 'videoMenuBarClose';
        closeBtn.innerHTML = '&times;'; // Unicode for 'x'
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleVideoMenuBar(menuBarElement);
        });
        containerElement.appendChild(closeBtn);
    }
        
    addLowLatencySwipeListener() {
        let startY, currentY;
        let isDragging = false;
        let activeMenuBar = null;
    
        const handleTouchStart = (e) => {
            if (e.target.type === 'range') return;
    
            activeMenuBar = e.target.closest('.videoMenuBar');
            if (!activeMenuBar) return;
    
            startY = currentY = e.touches[0].clientY;
            isDragging = true;
        };
    
        const handleTouchMove = (e) => {
            if (!isDragging || !activeMenuBar) return;
            e.preventDefault();
            currentY = e.touches[0].clientY;
    
            const deltaY = currentY - startY;
            if (deltaY > 0) {
                const progress = Math.min(deltaY / activeMenuBar.offsetHeight, 1);
                const opacity = 1 - progress;
                activeMenuBar.style.transform = `translateY(${deltaY}px)`;
                activeMenuBar.style.opacity = opacity.toFixed(2);
            }
        };
    
        const handleTouchEnd = (e) => {
            if (!isDragging || !activeMenuBar) return;
    
            isDragging = false;
            const finalDeltaY = currentY - startY;
    
            if (finalDeltaY > activeMenuBar.offsetHeight / 4) {
                this.toggleVideoMenuBar(activeMenuBar);
            } else {
                activeMenuBar.style.transition = 'transform 0.3s, opacity 0.3s';
                activeMenuBar.style.transform = 'translateY(0)';
                activeMenuBar.style.opacity = '1';
                setTimeout(() => {
                    if (activeMenuBar && activeMenuBar.style) {
                        activeMenuBar.style.transition = '';
                    }
                }, 300);
            }
    
            activeMenuBar = null;
        };
    
        this.videoMediaContainer.addEventListener('touchstart', handleTouchStart);
        this.videoMediaContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        this.videoMediaContainer.addEventListener('touchend', handleTouchEnd);
    }
    
    removeVideoOff(peer_id) {
        const pvOff = this.getId(peer_id + '__videoOff');
        const vb = this.getId(peer_id + '__vb');

        if (vb) vb.parentNode.removeChild(vb);

        if (pvOff) {
            pvOff.parentNode.removeChild(pvOff);
            handleAspectRatio();
            console.log('[removeVideoOff] Video-element-count', this.videoMediaContainer.childElementCount);
            if (peer_id != this.peer_id) this.sound('left');
        }
    }

    // ####################################################
    // SHARE SCREEN ON JOIN
    // ####################################################

    shareScreen() {
        if (!this.isMobileDevice && (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia)) {
            this.sound('open');
            // startScreenButton.click(); // Chrome - Opera - Edge - Brave
            // handle error: getDisplayMedia requires transient activation from a user gesture on Safari - FireFox
            Swal.fire({
                background: swalBackground,
                position: 'center',
                icon: 'question',
                text: 'Do you want to share your screen?',
                showDenyButton: true,
                confirmButtonText: `Yes`,
                denyButtonText: `No`,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            }).then((result) => {
                if (result.isConfirmed) {
                    startScreenButton.click();
                    console.log('11 ----> Screen is on');
                } else {
                    console.log('11 ----> Screen is on');
                }
            });
        } else {
            console.log('11 ----> Screen is off');
        }
    }

    // ####################################################
    // EXIT ROOM
    // ####################################################

    exit(offline = false) {
        if (VideoAI.active) this.stopSession();
        if (this.rtmpFilestreamer) this.stopRTMP();
        if (this.rtmpUrlstreamer) this.stopRTMPfromURL();

        const clean = () => {
            this._isConnected = false;
            if (this.consumerTransport) this.consumerTransport.close();
            if (this.producerTransport) this.producerTransport.close();
            this.socket.off('disconnect');
            this.socket.off('newProducers');
            this.socket.off('consumerClosed');
        };

        if (!offline) {
            this.socket
                .request('exitRoom')
                .then((e) => console.log('Exit Room', e))
                .catch((e) => console.warn('Exit Room ', e))
                .finally(() => {
                    clean();
                    this.event(_EVENTS.exitRoom);
                });
        } else {
            clean();
        }
    }

    exitRoom() {
        //...
        if (isPresenter && switchDisconnectAllOnLeave.checked) {
            this.ejectAllOnLeave();
        }
        this.exit();
    }

    // ####################################################
    // EJECT ALL ON LEAVE ROOM
    // ####################################################

    ejectAllOnLeave() {
        const cmd = {
            type: 'ejectAll',
            peer_name: this.peer_name,
            peer_uuid: this.peer_uuid,
            broadcast: true,
        };
        this.emitCmd(cmd);
    }

    // ####################################################
    // HELPERS
    // ####################################################

    async attachMediaStream(elem, stream, type, who) {
        let track;
        switch (type) {
            case mediaType.audio:
                track = stream.getAudioTracks()[0];
                break;
            case mediaType.video:
            case mediaType.screen:
                track = stream.getVideoTracks()[0];
                break;
            default:
                break;
        }
        const consumerStream = new MediaStream();
        consumerStream.addTrack(track);
        elem.srcObject = consumerStream;
        console.log(who + ' Success attached media ' + type);
    }

    async changeAudioDestination(audioElement = false) {
        const audioDestination = speakerSelect.value;
        if (audioElement) {
            await this.attachSinkId(audioElement, audioDestination);
        } else {
            const audioElements = this.remoteAudioEl.querySelectorAll('audio');
            audioElements.forEach(async (audioElement) => {
                await this.attachSinkId(audioElement, audioDestination);
            });
        }
    }

    async attachSinkId(elem, sinkId) {
        if (typeof elem.sinkId !== 'undefined') {
            elem.setSinkId(sinkId)
                .then(() => {
                    console.log(`Success, audio output device attached: ${sinkId}`);
                })
                .catch((err) => {
                    let errorMessage = err;
                    let speakerSelect = this.getId('speakerSelect');
                    if (err.name === 'SecurityError')
                        errorMessage = `You need to use HTTPS for selecting audio output device: ${err}`;
                    console.error('Attach SinkId error: ', errorMessage);
                    this.userLog('error', errorMessage, 'top-end', 6000);
                    speakerSelect.selectedIndex = 0;
                    refreshLsDevices();
                });
        } else {
            const error = `Browser seems doesn't support output device selection.`;
            console.warn(error);
            this.userLog('error', error, 'top-end', 6000);
        }
    }

    event(evt) {
        if (this.eventListeners.has(evt)) {
            this.eventListeners.get(evt).forEach((callback) => callback());
        }
    }

    on(evt, callback) {
        this.eventListeners.get(evt).push(callback);
    }

    // ####################################################
    // SET
    // ####################################################

    setTippy(elem, content, placement, allowHTML = false) {
        if (DetectRTC.isMobileDevice) return;
        const element = this.getId(elem);
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

    setVideoAvatarImgName(elemId, peer_name, peer_url, remotePeer = false) {
        let elem = this.getId(elemId);
        if (cfg.useAvatarSvg) {
            console.log('setVideoAvatarImgName: ', peer_name, 'url: ', peer_url);
            let avatarImg = '';
            if (peer_url) {
                elem.setAttribute('src', peer_url); // this.getNostrAvatar(peer_name))
            } else {
                isValidLightningAddress(peer_name).then((isValid) => {
                    if (isValid) {
                        avatarImg = elem.setAttribute('src', boltavatar);
                        console.log('valid lightning address', avatarImg);
                    } else {
                        avatarImg = rc.isValidEmail(peer_name)
                            ? elem.setAttribute('src', this.genGravatar(peer_name))
                            : elem.setAttribute('src', this.genAvatarSvg(peer_name, 250));
                        console.log('avatar img', avatarImg);
                    }
                });
            }
        } else {
            elem.setAttribute('src', image.avatar);
        }
    }

    genGravatar(email, size = false) {
        const hash = md5(email.toLowerCase().trim());
        const gravatarURL = `https://www.gravatar.com/avatar/${hash}` + (size ? `?s=${size}` : '?s=250') + '?d=404';
        console.log('inside genGravatar: gravatarURL', gravatarURL);
        return gravatarURL;
        function md5(input) {
            return CryptoJS.MD5(input).toString();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    genAvatarSvg(peerName, avatarImgSize) {
        const charCodeRed = peerName.charCodeAt(0);
        const charCodeGreen = peerName.charCodeAt(1) || charCodeRed;
        const red = Math.pow(charCodeRed, 7) % 200;
        const green = Math.pow(charCodeGreen, 7) % 200;
        const blue = (red + green) % 200;
        const bgColor = `rgb(${red}, ${green}, ${blue})`;
        const textColor = '#ffffff';
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        width="${avatarImgSize}px" 
        height="${avatarImgSize}px" 
        viewBox="0 0 ${avatarImgSize} ${avatarImgSize}" 
        version="1.1">
            <circle 
                fill="${bgColor}" 
                width="${avatarImgSize}" 
                height="${avatarImgSize}" 
                cx="${avatarImgSize / 2}" 
                cy="${avatarImgSize / 2}" 
                r="${avatarImgSize / 2}"
            />
            <text 
                x="50%" 
                y="50%" 
                style="color:${textColor}; 
                line-height:1; 
                font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
                alignment-baseline="middle" 
                text-anchor="middle" 
                font-size="${Math.round(avatarImgSize * 0.4)}" 
                font-weight="normal" 
                dy=".1em" 
                dominant-baseline="middle" 
                fill="${textColor}">${peerName.substring(0, 2).toUpperCase()}
            </text>
        </svg>`;
        return 'data:image/svg+xml,' + svg.replace(/#/g, '%23').replace(/"/g, "'").replace(/&/g, '&amp;');
    }

    setPeerAudio(peer_id, status) {
        console.log('Set peer audio enabled: ' + status);
        const audioStatus = this.getPeerAudioBtn(peer_id); // producer, consumers
        const audioVolume = this.getPeerAudioVolumeBar(peer_id); // consumers
        if (audioStatus) audioStatus.className = status ? html.audioOn : html.audioOff;
        if (audioVolume) status ? show(audioVolume) : hide(audioVolume);
    }

    setIsAudio(peer_id, status) {
        if (!isBroadcastingEnabled || (isBroadcastingEnabled && isPresenter)) {
            console.log('Set local audio enabled: ' + status);
            this.peer_info.peer_audio = status;
            const audioStatus = this.getPeerAudioBtn(peer_id); // producer, consumers
            const audioVolume = this.getPeerAudioVolumeBar(peer_id); // consumers
            if (audioStatus) audioStatus.className = status ? html.audioOn : html.audioOff;
            if (audioVolume) status ? show(audioVolume) : hide(audioVolume);
        }
    }

    setIsVideo(status) {
        if (!isBroadcastingEnabled || (isBroadcastingEnabled && isPresenter)) {
            this.peer_info.peer_video = status;
            if (!this.peer_info.peer_video) {
                console.log('Set local video enabled: ' + status);
                this.setVideoOff(this.peer_info, false);
                this.sendVideoOff();
            }
        }
    }

    setIsScreen(status) {
        if (!isBroadcastingEnabled || (isBroadcastingEnabled && isPresenter)) {
            this.peer_info.peer_screen = status;
            if (!this.peer_info.peer_screen && !this.peer_info.peer_video) {
                console.log('Set local screen enabled: ' + status);
                this.setVideoOff(this.peer_info, false);
                this.sendVideoOff();
            }
        }
    }

    sendVideoOff() {
        this.socket.emit('setVideoOff', this.peer_info);
    }

    // ####################################################
    // GET
    // ####################################################

    isConnected() {
        return this._isConnected;
    }

    isRecording() {
        return this._isRecording;
    }

    static get mediaType() {
        return mediaType;
    }

    static get EVENTS() {
        return _EVENTS;
    }

    getTimeNow() {
        return new Date().toTimeString().split(' ')[0];
    }

    getId(id) {
        return document.getElementById(id);
    }

    getName(name) {
        return document.getElementsByName(name)[0];
    }

    getEcN(cn) {
        return document.getElementsByClassName(cn);
    }

    async getRoomInfo() {
        let room_info = await this.socket.request('getRoomInfo');
        return room_info;
    }

    refreshParticipantsCount() {
        this.socket.emit('refreshParticipantsCount');
    }

    getPeerAudioBtn(peer_id) {
        return this.getId(peer_id + '__audio');
    }

    getPeerAudioVolumeBar(peer_id) {
        return this.getId(peer_id + '___pVolume');
    }

    getPeerHandBtn(peer_id) {
        return this.getId(peer_id + '__hand');
    }

    getMapKeyByValue(map, searchValue) {
        for (let [key, value] of map.entries()) {
            if (value === searchValue) return key;
        }
    }

    getSelectedIndexValue(elem) {
        return elem.options[elem.selectedIndex].value;
    }

    // ####################################################
    // UTILITY
    // ####################################################

    async sound(name, force = false) {
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

    userLog(icon, message, position, timer = 5000) {
        const Toast = Swal.mixin({
            background: swalBackground,
            toast: true,
            position: position,
            showConfirmButton: false,
            timer: timer,
            timerProgressBar: true,
        });
        switch (icon) {
            case 'html':
                Toast.fire({
                    icon: icon,
                    html: message,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                });
                break;
            default:
                Toast.fire({
                    icon: icon,
                    title: message,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                });
        }
    }

    msgPopup(type, message, timer = 3000) {
        switch (type) {
            case 'warning':
            case 'error':
                Swal.fire({
                    background: swalBackground,
                    position: 'center',
                    icon: type,
                    title: type,
                    text: message,
                    showClass: { popup: 'animate__animated animate__rubberBand' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                });
                this.sound('alert');
                break;
            case 'info':
            case 'success':
                Swal.fire({
                    background: swalBackground,
                    position: 'center',
                    icon: type,
                    title: type,
                    text: message,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                });
                break;
            case 'html':
                Swal.fire({
                    background: swalBackground,
                    position: 'center',
                    icon: type,
                    html: message,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                });
                break;
            case 'toast':
                const Toast = Swal.mixin({
                    background: swalBackground,
                    position: 'top-end',
                    icon: 'info',
                    showConfirmButton: false,
                    timerProgressBar: true,
                    toast: true,
                    timer: timer,
                });
                Toast.fire({
                    icon: 'info',
                    title: message,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                });
                break;
            // ......
            default:
                alert(message);
        }
    }

    msgHTML(data, icon, imageUrl, title, html, position = 'center') {
        switch (data.type) {
            case 'recording':
                switch (data.action) {
                    case enums.recording.started:
                    case enums.recording.start:
                        html = html + '<br/> Your presence implies you agree to being recorded';
                        toastMessage(6000);
                        break;
                    case enums.recording.stop:
                        toastMessage(3000);
                        break;
                    //...
                    default:
                        break;
                }
                if (!this.speechInMessages) this.speechText(`${data.peer_name} ${data.action}`);
                break;
            //...
            default:
                defaultMessage();
                break;
        }
        // TOAST less invasive
        function toastMessage(duration = 3000) {
            const Toast = Swal.mixin({
                background: swalBackground,
                position: 'top-end',
                icon: icon,
                showConfirmButton: false,
                timerProgressBar: true,
                toast: true,
                timer: duration,
            });
            Toast.fire({
                title: title,
                html: html,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            });
        }
        // DEFAULT
        function defaultMessage() {
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
            });
        }
        //...
    }

    thereAreParticipants() {
        // console.log('participantsCount ---->', participantsCount);
        if (this.consumers.size > 0 || participantsCount > 1) {
            return true;
        }
        return false;
    }

    // ####################################################
    // MY SETTINGS
    // ####################################################

    toggleMySettings() {
        let mySettings = this.getId('mySettings');
        mySettings.style.top = '50%';
        mySettings.style.left = '50%';
        if (this.isMobileDevice) {
            mySettings.style.width = '100%';
            mySettings.style.height = '100%';
        }
        mySettings.classList.toggle('show');
        this.isMySettingsOpen = this.isMySettingsOpen ? false : true;
    }

    openTab(evt, tabName) {
        let i, tabcontent, tablinks;
        tabcontent = this.getEcN('tabcontent');
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = 'none';
        }
        tablinks = this.getEcN('tablinks');
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(' active', '');
        }
        this.getId(tabName).style.display = 'block';
        evt.currentTarget.className += ' active';
    }

    changeBtnsBarPosition(position) {
        switch (position) {
            case 'vertical':
                document.documentElement.style.setProperty('--btns-top', '50%');
                document.documentElement.style.setProperty('--btns-right', '0%');
                document.documentElement.style.setProperty('--btns-left', '10px');
                document.documentElement.style.setProperty('--btns-margin-left', '0px');
                document.documentElement.style.setProperty('--btns-width', '60px');
                document.documentElement.style.setProperty('--btns-flex-direction', 'column');
                // bottomButtons horizontally
                document.documentElement.style.setProperty('--bottom-btns-top', 'auto');
                document.documentElement.style.setProperty('--bottom-btns-left', '50%');
                document.documentElement.style.setProperty('--bottom-btns-bottom', '0');
                document.documentElement.style.setProperty('--bottom-btns-translate-X', '-50%');
                document.documentElement.style.setProperty('--bottom-btns-translate-Y', '0%');
                document.documentElement.style.setProperty('--bottom-btns-margin-bottom', '16px');
                document.documentElement.style.setProperty('--bottom-btns-flex-direction', 'row');
                break;
            case 'horizontal':
                document.documentElement.style.setProperty('--btns-top', '95%');
                document.documentElement.style.setProperty('--btns-right', '25%');
                document.documentElement.style.setProperty('--btns-left', '50%');
                document.documentElement.style.setProperty('--btns-margin-left', '-240px');
                document.documentElement.style.setProperty('--btns-width', '480px');
                document.documentElement.style.setProperty('--btns-flex-direction', 'row');
                // bottomButtons vertically
                document.documentElement.style.setProperty('--bottom-btns-top', '50%');
                document.documentElement.style.setProperty('--bottom-btns-left', '15px');
                document.documentElement.style.setProperty('--bottom-btns-bottom', 'auto');
                document.documentElement.style.setProperty('--bottom-btns-translate-X', '0%');
                document.documentElement.style.setProperty('--bottom-btns-translate-Y', '-50%');
                document.documentElement.style.setProperty('--bottom-btns-margin-bottom', '0');
                document.documentElement.style.setProperty('--bottom-btns-flex-direction', 'column');
                break;
            default:
                break;
        }
    }

    // ####################################################
    // PICTURE IN PICTURE
    // ####################################################

    handlePIP(elemId, pipId) {
        let videoPlayer = this.getId(elemId);
        let btnPIP = this.getId(pipId);
        if (btnPIP) {
            btnPIP.addEventListener('click', () => {
                if (videoPlayer.pictureInPictureElement) {
                    videoPlayer.exitPictureInPicture();
                } else if (document.pictureInPictureEnabled) {
                    videoPlayer.requestPictureInPicture().catch((error) => {
                        console.error('Failed to enter Picture-in-Picture mode:', error);
                        this.userLog('warning', error.message, 'top-end', 6000);
                        elemDisplay(btnPIP.id, false);
                    });
                }
            });
        }
    }

    // ####################################################
    // FULL SCREEN
    // ####################################################

    isFullScreenSupported() {
        const fsSupported =
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled;

        fsSupported ? this.handleFullScreenEvents() : (this.getId('fullScreenButton').style.display = 'none');

        return fsSupported;
    }

    handleFullScreenEvents() {
        document.addEventListener('fullscreenchange', (e) => {
            const fullscreenElement = document.fullscreenElement;
            if (!fullscreenElement) {
                const fullScreenIcon = this.getId('fullScreenIcon');
                fullScreenIcon.className = html.fullScreenOff;
                this.isDocumentOnFullScreen = false;
            }
        });
    }

    toggleRoomFullScreen() {
        const fullScreenIcon = this.getId('fullScreenIcon');
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            fullScreenIcon.className = html.fullScreenOn;
            this.isDocumentOnFullScreen = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullScreenIcon.className = html.fullScreenOff;
                this.isDocumentOnFullScreen = false;
            }
        }
    }
    
    toggleFullScreen(elem = null) {
        if (this.isDocumentOnFullScreen) return;
        const element = elem ? elem : document.documentElement;
        const fullScreen = this.isFullScreen();
        if (fullScreen) {
            this.goOutFullscreen(element);
        } else {
            this.goInFullscreen(element);
        }
        if (elem === null) this.isVideoOnFullScreen = fullScreen;
    }
    

    isFullScreen() {
        const elementFullScreen =
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement ||
            null;
        if (elementFullScreen === null) return false;
        return true;
    }

    goInFullscreen(element) {
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();
        else if (element.webkitEnterFullscreen) {
            // iOS Safari
            element.webkitEnterFullscreen();
        } else {
            this.userLog('warning', 'Full screen mode not supported by this browser on this device', 'top-end');
        }
    }
    

    goOutFullscreen(element) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        else {
            // On iOS Safari, cannot exit fullscreen programmatically
            this.userLog('info', 'Tap "Done" to exit fullscreen mode on iOS devices', 'top-end');
        }
    }
    
    handleFS(elemId, fsId) {
        let videoPlayer = this.getId(elemId);
        let btnFs = this.getId(fsId);
        if (videoPlayer && btnFs) {
            this.setTippy(fsId, 'Full screen', 'bottom');
            btnFs.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from reaching container
                if (videoPlayer.classList.contains('videoCircle')) {
                    return this.userLog('info', 'Full Screen not allowed if video on privacy mode', 'top-end');
                }
                this.toggleFullScreen(videoPlayer);
            });
            videoPlayer.addEventListener('fullscreenchange', (e) => {
                if (!document.fullscreenElement) {
                    videoPlayer.style.pointerEvents = 'auto';
                    this.isVideoOnFullScreen = false;
                }
            });
            videoPlayer.addEventListener('webkitfullscreenchange', () => {
                this.isVideoOnFullScreen = !!document.webkitFullscreenElement;
                videoPlayer.style.pointerEvents = 'auto';
            });
            videoPlayer.addEventListener('mozfullscreenchange', () => {
                this.isVideoOnFullScreen = !!document.mozFullScreenElement;
                videoPlayer.style.pointerEvents = 'auto';
            });
            videoPlayer.addEventListener('msfullscreenchange', () => {
                this.isVideoOnFullScreen = !!document.msFullscreenElement;
                videoPlayer.style.pointerEvents = 'auto';
            });
            videoPlayer.addEventListener('webkitbeginfullscreen', () => {
                this.isVideoOnFullScreen = true;
                videoPlayer.style.pointerEvents = 'auto';
            });
            videoPlayer.addEventListener('webkitendfullscreen', () => {
                this.isVideoOnFullScreen = false;
                videoPlayer.style.pointerEvents = 'auto';
            });
        
        }
    }

    // ####################################################
    // HANDLE VIDEO | OBJ FIT | CONTROLS | PIN-UNPIN
    // ####################################################

    handleVideoObjectFit(value) {
        document.documentElement.style.setProperty('--videoObjFit', value);
    }

    handleVideoControls(value) {
        isVideoControlsOn = value == 'on' ? true : false;
        let cameras = this.getEcN('Camera');
        for (let i = 0; i < cameras.length; i++) {
            let cameraId = cameras[i].id.replace('__video', '');
            let videoPlayer = this.getId(cameraId);
            videoPlayer.hasAttribute('controls')
                ? videoPlayer.removeAttribute('controls')
                : videoPlayer.setAttribute('controls', isVideoControlsOn);
        }
    }

    handlePN(elemId, pnId, camId, remoteIsScreen = false, isAvatar = false) {
        let videoPlayer = this.getId(elemId);
        let btnPn = this.getId(pnId);
        let cam = this.getId(camId);
        if (btnPn && videoPlayer && cam) {
            btnPn.addEventListener('click', () => {
                if (this.isMobileDevice) return;
                this.sound('click');
                this.isVideoPinned = !this.isVideoPinned;
                if (this.isVideoPinned) {
                    if (!videoPlayer.classList.contains('videoCircle')) {
                        videoPlayer.style.objectFit = 'contain';
                    }
                    cam.className = '';
                    cam.style.width = '100%';
                    cam.style.height = '100%';
                    this.toggleVideoPin(pinVideoPosition.value);
                    this.videoPinMediaContainer.appendChild(cam);
                    this.videoPinMediaContainer.style.display = 'block';
                    this.pinnedVideoPlayerId = elemId;
                    setColor(btnPn, 'lime');
                } else {
                    if (this.pinnedVideoPlayerId != videoPlayer.id) {
                        this.isVideoPinned = true;
                        if (this.isScreenAllowed) return;
                        return this.msgPopup('toast', 'Another video seems pinned, unpin it before to pin this one');
                    }
                    if (!remoteIsScreen && !isBroadcastingEnabled) videoPlayer.style.objectFit = 'var(--videoObjFit)';
                    this.videoPinMediaContainer.removeChild(cam);
                    cam.className = 'Camera';
                    this.videoMediaContainer.appendChild(cam);
                    this.removeVideoPinMediaContainer();
                    setColor(btnPn, 'white');
                }
                this.resizeVideoMenuBar();
                handleAspectRatio();
            });

            if (isAvatar && !this.isMobileDevice) btnPn.click();
        }
    }

    toggleVideoPin(position) {
        if (!this.isVideoPinned) return;
        switch (position) {
            case 'top':
                this.videoPinMediaContainer.style.top = '25%';
                this.videoPinMediaContainer.style.width = '100%';
                this.videoPinMediaContainer.style.height = '75%';
                this.videoMediaContainer.style.top = '0%';
                this.videoMediaContainer.style.right = null;
                this.videoMediaContainer.style.width = null;
                this.videoMediaContainer.style.width = '100% !important';
                this.videoMediaContainer.style.height = '25%';
                break;
            case 'vertical':
                this.videoPinMediaContainer.style.top = 0;
                this.videoPinMediaContainer.style.width = '75%';
                this.videoPinMediaContainer.style.height = '100%';
                this.videoMediaContainer.style.top = 0;
                this.videoMediaContainer.style.width = '25%';
                this.videoMediaContainer.style.height = '100%';
                this.videoMediaContainer.style.right = 0;
                break;
            case 'horizontal':
                this.videoPinMediaContainer.style.top = 0;
                this.videoPinMediaContainer.style.width = '100%';
                this.videoPinMediaContainer.style.height = '75%';
                this.videoMediaContainer.style.top = '75%';
                this.videoMediaContainer.style.right = null;
                this.videoMediaContainer.style.width = null;
                this.videoMediaContainer.style.width = '100% !important';
                this.videoMediaContainer.style.height = '25%';
                break;
            default:
                break;
        }
        resizeVideoMedia();
    }

    // ####################################################
    // HANDLE VIDEO ZOOM-IN/OUT
    // ####################################################

    handleZV(elemId, divId, peerId) {
        let videoPlayer = this.getId(elemId);
        let videoWrap = this.getId(divId);
        let videoPeerId = peerId;
        let zoom = 1;

        const ZOOM_IN_FACTOR = 1.1;
        const ZOOM_OUT_FACTOR = 0.9;
        const MAX_ZOOM = 15;
        const MIN_ZOOM = 1;

        if (this.isZoomCenterMode) {
            if (videoPlayer) {
                videoPlayer.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    let delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
                    delta > 0 ? (zoom *= 1.2) : (zoom /= 1.2);
                    if (zoom < 1) zoom = 1;
                    videoPlayer.style.scale = zoom;
                });
            }
        } else {
            if (videoPlayer && videoWrap) {
                videoPlayer.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    if (isVideoPrivacyActive) return;
                    const rect = videoWrap.getBoundingClientRect();
                    const cursorX = e.clientX - rect.left;
                    const cursorY = e.clientY - rect.top;
                    const zoomDirection = e.deltaY > 0 ? 'zoom-out' : 'zoom-in';
                    const scaleFactor = zoomDirection === 'zoom-out' ? ZOOM_OUT_FACTOR : ZOOM_IN_FACTOR;
                    zoom *= scaleFactor;
                    zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
                    videoPlayer.style.transformOrigin = `${cursorX}px ${cursorY}px`;
                    videoPlayer.style.transform = `scale(${zoom})`;
                    videoPlayer.style.cursor = zoom === 1 ? 'pointer' : zoomDirection;
                });

                videoWrap.addEventListener('mouseleave', () => {
                    videoPlayer.style.cursor = 'pointer';
                    if (videoPeerId === this.peer_id) {
                        zoom = 1;
                        videoPlayer.style.transform = '';
                        videoPlayer.style.transformOrigin = 'center';
                    }
                });
                videoPlayer.addEventListener('mouseleave', () => {
                    videoPlayer.style.cursor = 'pointer';
                });
            }
        }
    }

    // ####################################################
    // HANDLE VIDEO AND MENU BAR
    // ####################################################

    handleVB(videoId, videoBarId) {
        const videoPlayer = this.getId(videoId);
        const videoBar = this.getId(videoBarId);
        if (videoPlayer && videoBar) {
            videoPlayer.addEventListener('click', () => {
                const videoMenuBar = rc.getEcN('videoMenuBar');
                for (let i = 0; i < videoMenuBar.length; i++) {
                    const menuBar = videoMenuBar[i];
                    if (menuBar.id != videoBarId) {
                        hide(menuBar);
                    }
                }

                rc.resizeVideoMenuBar();
                setCamerasBorderNone();

                if (videoBar.classList.contains('hidden')) {
                    rc.sound('open');
                    show(videoBar);
                    animateCSS(videoBar, 'fadeInDown');
                    if (participantsCount > 1) videoPlayer.style.border = 'var(--videoBar-active)';
                } else {
                    animateCSS(videoBar, 'fadeOutUp').then((msg) => {
                        hide(videoBar);
                    });
                    videoPlayer.style.border = 'none';
                }
            });
        }
    }

    resizeVideoMenuBar() {
        const somethingPinned =
            this.isVideoPinned ||
            this.isChatPinned ||
            this.isEditorPinned ||
            this.isPollPinned ||
            transcription.isPin();
        const menuBarWidth =
            this.isVideoPinned || this.isChatPinned || this.isPollPinned || transcription.isPin() ? '75%' : '70%';
        const videoMenuBar = rc.getEcN('videoMenuBar');
        for (let i = 0; i < videoMenuBar.length; i++) {
            const menuBar = videoMenuBar[i];
            menuBar.style.width = somethingPinned ? menuBarWidth : '100%';
        }
    }

    addCloseVBButton(containerElement) {
        const closeBtn = document.createElement('div');
        closeBtn.className = `${html.close} videoMenuBarClose`;
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideClassElements('videoMenuBar');
        });
        containerElement.appendChild(closeBtn);
    }

    // ####################################################
    // REMOVE VIDEO PIN MEDIA CONTAINER
    // ####################################################

    removeVideoPinMediaContainer() {
        this.videoPinMediaContainer.style.display = 'none';
        this.videoMediaContainerUnpin();
        this.pinnedVideoPlayerId = null;
        this.isVideoPinned = false;
        if (this.isChatPinned) {
            this.chatPin();
        }
        if (this.isPollPinned) {
            this.pollPin();
        }
        if (this.isEditorPinned) {
            this.editorPin();
        }
        if (this.transcription.isPin()) {
            this.transcription.pinned();
        }
    }

    videoMediaContainerPin() {
        this.videoMediaContainer.style.top = 0;
        this.videoMediaContainer.style.width = '75%';
        this.videoMediaContainer.style.height = '100%';
        this.resizeVideoMenuBar();
    }

    videoMediaContainerUnpin() {
        this.videoMediaContainer.style.top = 0;
        this.videoMediaContainer.style.right = null;
        this.videoMediaContainer.style.width = '100%';
        this.videoMediaContainer.style.height = '100%';
        this.resizeVideoMenuBar();
    }

    adaptVideoObjectFit(index) {
        // 1 (cover) 2 (contain)
        BtnVideoObjectFit.selectedIndex = index;
        BtnVideoObjectFit.onchange();
    }

    // ####################################################
    // TAKE SNAPSHOT
    // ####################################################

    handleTS(elemId, tsId) {
        let videoPlayer = this.getId(elemId);
        let btnTs = this.getId(tsId);
        if (btnTs && videoPlayer) {
            btnTs.addEventListener('click', () => {
                if (videoPlayer.classList.contains('videoCircle')) {
                    return this.userLog('info', 'SnapShoot not allowed if video on privacy mode', 'top-end');
                }
                this.sound('snapshot');
                let context, canvas, width, height, dataURL;
                width = videoPlayer.videoWidth;
                height = videoPlayer.videoHeight;
                canvas = canvas || document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                context = canvas.getContext('2d');
                context.drawImage(videoPlayer, 0, 0, width, height);
                dataURL = canvas.toDataURL('image/png');
                // console.log(dataURL);
                saveDataToFile(dataURL, getDataTimeString() + '-SNAPSHOT.png');
            });
        }
    }

    // ####################################################
    // HANDLE VIDEO MIRROR
    // ####################################################

    handleMV(elemId, tsId) {
        let videoPlayer = this.getId(elemId);
        let btnMv = this.getId(tsId);
        if (btnMv && videoPlayer) {
            btnMv.addEventListener('click', () => {
                videoPlayer.classList.toggle('mirror');
                //rc.roomMessage('toggleVideoMirror', videoPlayer.classList.contains('mirror'));
            });
        }
    }

    // ####################################################
    // VIDEO CIRCLE - PRIVACY MODE
    // ####################################################

    handleVP(elemId, vpId) {
        const startVideoInPrivacyMode =
            this._moderator.video_start_privacy || localStorageSettings.moderator_video_start_privacy;
        let videoPlayer = this.getId(elemId);
        let btnVp = this.getId(vpId);
        if (btnVp && videoPlayer) {
            btnVp.addEventListener('click', () => {
                this.sound('click');
                this.toggleVideoPrivacyMode();
            });

            if (startVideoInPrivacyMode) {
                btnVp.click();
            }
        }
    }

    toggleVideoPrivacyMode() {
        isVideoPrivacyActive = !isVideoPrivacyActive;
        this.setVideoPrivacyStatus(this.peer_id, isVideoPrivacyActive);
        this.emitCmd({
            type: 'privacy',
            peer_id: this.peer_id,
            active: isVideoPrivacyActive,
            broadcast: true,
        });
    }

    setVideoPrivacyStatus(elemName, privacy) {
        let videoPlayer = this.getName(elemName);
        if (!videoPlayer) return;
        if (privacy) {
            videoPlayer.classList.remove('videoDefault');
            videoPlayer.classList.add('videoCircle');
            videoPlayer.style.objectFit = 'cover';
        } else {
            videoPlayer.classList.remove('videoCircle');
            videoPlayer.classList.add('videoDefault');
            videoPlayer.style.objectFit = 'var(--videoObjFit)';
        }
    }

    // ####################################################
    // DRAGGABLE
    // ####################################################

    makeDraggable(elmnt, dragObj) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        if (dragObj) {
            dragObj.onmousedown = dragMouseDown;
        } else {
            elmnt.onmousedown = dragMouseDown;
        }
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
            elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    makeUnDraggable(elmnt, dragObj) {
        if (dragObj) {
            dragObj.onmousedown = null;
        } else {
            elmnt.onmousedown = null;
        }
        elmnt.style.top = '';
        elmnt.style.left = '';
    }

    // ####################################################
    // CHAT
    // ####################################################

    handleSM(uid, name) {
        const words = uid.split('___');
        let peer_id = words[1];
        let peer_name = name;
        let btnSm = this.getId(uid);
        if (btnSm) {
            btnSm.addEventListener('click', () => {
                this.sendMessageTo(peer_id, peer_name);
            });
        }
    }

    isPlistOpen() {
        const plist = this.getId('plist');
        return !plist.classList.contains('hidden');
    }

    async toggleChat() {
        const chatRoom = this.getId('chatRoom');
        chatRoom.classList.toggle('show');

        if (!this.isChatOpen) {
            await getRoomParticipants();
            hide(chatMinButton);
            if (!this.isMobileDevice) {
                BUTTONS.chat.chatMaxButton && show(chatMaxButton);
            }
            this.chatCenter();
            this.sound('open');
            this.showPeerAboutAndMessages(this.chatPeerId, this.chatPeerName);
        }
        // console.log("toggleChat: isPinned", this.isChatPinned, " isChatOpen ", this.isChatOpen)
        isParticipantsListOpen = !isParticipantsListOpen;
        this.isChatOpen = !this.isChatOpen;
        if (this.isMobileDevice) {
            document.body.style.overflow = this.isChatOpen ? 'hidden' : '';
        } else {
            if (this.isChatPinned) {
                this.chatUnpin();
            } else {
                this.chatPin();
            }
        }

        resizeChatRoom();
    }

    toggleShowParticipants() {
        const plist = this.getId('plist');
        const chat = this.getId('chat');
        plist.classList.toggle('hidden');
        const isParticipantsListHidden = !this.isPlistOpen();
        chat.style.marginLeft = isParticipantsListHidden ? 0 : '300px';
        chat.style.borderLeft = isParticipantsListHidden ? 'none' : '1px solid rgb(255 255 255 / 32%)';
        if (this.isChatPinned) elemDisplay(chat.id, isParticipantsListHidden);
        if (!this.isChatPinned) elemDisplay(chat.id, true);
        this.toggleChatHistorySize(isParticipantsListHidden && (this.isChatPinned || this.isChatMaximized));
        plist.style.width = this.isChatPinned || this.isMobileDevice ? '100%' : '300px';
        plist.style.position = this.isMobileDevice ? 'fixed' : 'absolute';
    }

    toggleChatHistorySize(max = true) {
        const chatHistory = this.getId('chatHistory');
        chatHistory.style.minHeight = max ? 'calc(100vh - 210px)' : '490px';
        chatHistory.style.maxHeight = max ? 'calc(100vh - 210px)' : '490px';
    }

    toggleChatPin() {
        if (transcription.isPin()) {
            return userLog('info', 'Please unpin the transcription that appears to be currently pinned', 'top-end');
        }
        if (this.isPollPinned) {
            return userLog('info', 'Please unpin the poll that appears to be currently pinned', 'top-end');
        }
        if (this.isEditorPinned) {
            return userLog('info', 'Please unpin the editor that appears to be currently pinned', 'top-end');
        }
        this.isChatPinned ? this.chatUnpin() : this.chatPin();
        this.sound('click');
    }

    chatMaximize() {
        this.isChatMaximized = true;
        hide(chatMaxButton);
        BUTTONS.chat.chatMaxButton && show(chatMinButton);
        this.chatCenter();
        document.documentElement.style.setProperty('--msger-width', '100%');
        document.documentElement.style.setProperty('--msger-height', '100%');
        this.toggleChatHistorySize(true);
        // console.log(" chatMaximize ", this.isChatMaximized)
    }

    chatMinimize() {
        this.isChatMaximized = false;
        hide(chatMinButton);
        BUTTONS.chat.chatMaxButton && show(chatMaxButton);
        if (this.isChatPinned) {
            this.chatPin();
        } else {
            this.chatCenter();
            document.documentElement.style.setProperty('--msger-width', '800px');
            document.documentElement.style.setProperty('--msger-height', '700px');
            this.toggleChatHistorySize(false);
        }
        // console.log(" chatMinimize ", this.isChatMaximized)
    }

    chatPin() {
        // console.log("chatPin Method: ", this.isChatPinned)

        if (!this.isVideoPinned) {
            this.videoMediaContainerPin();
        }
        this.chatPinned();
        this.isChatPinned = true;
        setColor(chatTogglePin, 'lime');
        this.resizeVideoMenuBar();
        resizeVideoMedia();
        chatRoom.style.resize = 'none';
        if (!this.isMobileDevice) this.makeUnDraggable(chatRoom, chatHeader);
        if (this.isPlistOpen()) this.toggleShowParticipants();
        if (chatRoom.classList.contains('container')) chatRoom.classList.remove('container');
    }

    chatUnpin() {
        // console.log("chat unpin method: ", this.isChatPinned)
        if (!this.isVideoPinned) {
            this.videoMediaContainerUnpin();
        }
        document.documentElement.style.setProperty('--msger-width', '800px');
        document.documentElement.style.setProperty('--msger-height', '700px');
        hide(chatMinButton);
        BUTTONS.chat.chatMaxButton && show(chatMaxButton);
        this.chatCenter();
        this.isChatPinned = false;
        setColor(chatTogglePin, 'white');
        this.resizeVideoMenuBar();
        resizeVideoMedia();
        if (!this.isMobileDevice) this.makeDraggable(chatRoom, chatHeader);
        if (!this.isPlistOpen()) this.toggleShowParticipants();
        if (!chatRoom.classList.contains('container')) chatRoom.classList.add('container');
        resizeChatRoom();
    }

    chatCenter() {
        chatRoom.style.position = 'fixed';
        chatRoom.style.transform = 'translate(-50%, -50%)';
        chatRoom.style.top = '50%';
        chatRoom.style.left = '50%';
    }

    chatPinned() {
        chatRoom.style.position = 'absolute';
        chatRoom.style.top = 0;
        chatRoom.style.right = 0;
        chatRoom.style.left = null;
        chatRoom.style.transform = null;
        document.documentElement.style.setProperty('--msger-width', '25%');
        document.documentElement.style.setProperty('--msger-height', '100%');
    }

    toggleChatEmoji() {
        this.getId('chatEmoji').classList.toggle('show');
        this.isChatEmojiOpen = this.isChatEmojiOpen ? false : true;
        this.getId('chatEmojiButton').style.color = this.isChatEmojiOpen ? '#FFFF00' : '#FFFFFF';
    }

    addEmojiToMsg(data) {
        msgerInput.value += data.native;
        toggleChatEmoji();
    }

    cleanMessage() {
        chatMessage.value = '';
        chatMessage.setAttribute('rows', '1');
    }

    pasteMessage() {
        navigator.clipboard
            .readText()
            .then((text) => {
                chatMessage.value += text;
                isChatPasteTxt = true;
                this.checkLineBreaks();
            })
            .catch((err) => {
                console.error('Failed to read clipboard contents: ', err);
            });
    }

    broadcastMessage(msg) {
        // chatMessage.value = "broadcast this message"
        const peer_msg = this.formatMsg(this.peer_name + ' ' + msg);

        const data = {
            room_id: this.room_id,
            peer_name: this.peer_name,
            peer_id: this.peer_id,
            peer_msg: peer_msg,
        };
        const participantsList = this.getId('participantsList');
        const participantsListItems = participantsList.getElementsByTagName('li');
        for (let i = 0; i < participantsListItems.length; i++) {
            const li = participantsListItems[i];
            if (li.classList.contains('active')) {
                data.to_peer_id = li.getAttribute('data-to-id');
                data.to_peer_name = li.getAttribute('data-to-name');
                console.log('Send message:', data);
                this.socket.emit('message', data);
                this.setMsgAvatar('left', this.peer_name);
                this.appendMessage(
                    'left',
                    this.leftMsgAvatar,
                    this.peer_name,
                    this.peer_id,
                    peer_msg,
                    data.to_peer_id,
                    data.to_peer_name,
                );
                this.cleanMessage();
            }
        }
    }

    wrapLongStrings(message) {
        const allowedPrefixes = ['npub', 'nprofile', 'note', 'nevent', 'nrelay', 'naddr',]; // You can add more prefixes here
    
        try {
            const words = message.split(' ');
            const wrappedWords = words.map(word => {
                            // Ignore words that start with 'https'
                if (word.startsWith('https')) {
                    return word; // Ignore this word, return it as is
                }

                // Check if the word starts with any of the allowed prefixes
                const hasPrefix = allowedPrefixes.some(prefix => word.startsWith(prefix));
    
                if (hasPrefix && word.length > 30) {
                    // If it has a prefix and is longer than 30, wrap it in quotes
                    return `"${word}"`;
                } else if (!hasPrefix && word.length > 30) {
                    // If it doesn't have a prefix and is longer than 30, alert and stop processing
                    alert(`The entered text "${word}" is too long and cannot be processed for security reasons.`);
                    throw new Error(`Text "${word}" exceeds allowed length without a valid prefix.`);
                }
    
                // Return the word unmodified if none of the above conditions are met
                return word;
            });
    
            // Join the modified words back into a string and return
            return wrappedWords.join(' ');
    
        } catch (error) {
            console.error('An error occurred: ', error.message);
            return null; // or you can return a different message if needed
        }
    }
    

    sendMessage() {
        // comment out for testing,  allow send if no participants
        // if (!this.thereAreParticipants() && !isChatGPTOn) {
        //     this.cleanMessage();
        //     isChatPasteTxt = false;
        //     return this.userLog('info', 'No participants in the room', 'top-end');
        // }

        // Prevent long messages
        if (this.chatMessageLengthCheck && chatMessage.value.length > this.chatMessageLength) {
            return this.userLog(
                'warning',
                `The message seems too long, with a maximum of ${this.chatMessageLength} characters allowed`,
                'top-end',
            );
        }

        // Spamming detected ban the user from the room
        if (this.chatMessageSpamCount == this.chatMessageSpamCountToBan) {
            return this.roomAction('isBanned', true);
        }

        // Prevent Spam messages
        const currentTime = Date.now();
        if (chatMessage.value && currentTime - this.chatMessageTimeLast <= this.chatMessageTimeBetween) {
            this.cleanMessage();
            chatMessage.readOnly = true;
            chatSendButton.disabled = true;
            setTimeout(function () {
                chatMessage.readOnly = false;
                chatSendButton.disabled = false;
            }, this.chatMessageNotifyDelay);
            this.chatMessageSpamCount++;
            return this.userLog(
                'warning',
                `Kindly refrain from spamming. Please wait ${this.chatMessageNotifyDelay / 1000} seconds before sending another message`,
                'top-end',
                this.chatMessageNotifyDelay,
            );
        }
        this.chatMessageTimeLast = currentTime;

        chatMessage.value = filterXSS(chatMessage.value.trim());
        const wrappedMessage = this.wrapLongStrings(chatMessage.value);
        const peer_msg = this.formatMsg(wrappedMessage);
        if (!peer_msg) {
            return this.cleanMessage();
        }
        this.peer_name = filterXSS(this.peer_name);
    
        const data = {
            room_id: this.room_id,
            peer_name: this.peer_name,
            peer_id: this.peer_id,
            to_peer_id: 'ChatGPT',
            to_peer_name: 'ChatGPT',
            peer_msg: peer_msg,
            peer_info: this.peer_info,
        };
        
        if (isChatGPTOn) {
            console.log('Send message:', data);
            this.socket.emit('message', data);
            this.setMsgAvatar('left', this.peer_name, this.peer_info);
            this.appendMessage(
                'left',
                this.leftMsgAvatar,
                this.peer_name,
                this.peer_id,
                peer_msg,
                data.to_peer_id,
                data.to_peer_name,
                this.peer_info,
            );
            this.cleanMessage();

            this.socket
                .request('getChatGPT', {
                    time: getDataTimeString(),
                    room: this.room_id,
                    name: this.peer_name,
                    prompt: peer_msg,
                    context: this.chatGPTContext,
                })
                .then((completion) => {
                    if (!completion) return;
                    const { message, context } = completion;
                    this.chatGPTContext = context ? context : [];
                    console.log('Receive message:', message);
                    this.setMsgAvatar('right', 'ChatGPT'); // assume no avatar?
                    this.appendMessage('right', image.chatgpt, 'ChatGPT', this.peer_id, message, 'ChatGPT', 'ChatGPT');
                    this.cleanMessage();
                    this.streamingTask(message); // Video AI avatar speak
                    this.speechInMessages && !VideoAI.active
                        ? this.speechMessage(true, 'ChatGPT', message)
                        : this.sound('message');
                })
                .catch((err) => {
                    console.log('ChatGPT error:', err);
                });
        } else {
            // send message to group chat room
            console.log('send msg to group room');
            const participantsList = this.getId('participantsList');
            const participantsListItems = participantsList.getElementsByTagName('li');
            for (let i = 0; i < participantsListItems.length; i++) {
                const li = participantsListItems[i];
                if (li.classList.contains('active')) {
                    data.to_peer_id = li.getAttribute('data-to-id');
                    data.to_peer_name = li.getAttribute('data-to-name');
                    console.log('Send message:', data);
                    this.socket.emit('message', data);
                    this.setMsgAvatar('left', this.peer_name, this.peer_info);
                    this.appendMessage(
                        'left',
                        this.leftMsgAvatar,
                        this.peer_name,
                        this.peer_id,
                        peer_msg,
                        data.to_peer_id,
                        data.to_peer_name,
                        this.peer_info,
                    );
                    this.cleanMessage();
                }
            }
        }
    }

    sendMessageTo(to_peer_id, to_peer_name) {
        if (!this.thereAreParticipants()) {
            isChatPasteTxt = false;
            this.cleanMessage();
            return this.userLog('info', 'No participants in the room except you', 'top-end');
        }
        Swal.fire({
            background: swalBackground,
            position: 'center',
            imageUrl: image.message,
            input: 'text',
            inputPlaceholder: '💬 Enter your message...',
            showCancelButton: true,
            confirmButtonText: `Send`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.value) {
                result.value = filterXSS(result.value.trim());
                let peer_msg = this.formatMsg(result.value);
                if (!peer_msg) {
                    return this.cleanMessage();
                }
                this.peer_name = filterXSS(this.peer_name);
                const toPeerName = filterXSS(to_peer_name);
                let data = {
                    peer_name: this.peer_name,
                    peer_id: this.peer_id,
                    to_peer_id: to_peer_id,
                    to_peer_name: toPeerName,
                    peer_msg: peer_msg,
                };
                console.log('Send message:', data);
                this.socket.emit('message', data);
                this.setMsgAvatar('left', this.peer_name, this.peer_info);
                this.appendMessage(
                    'left',
                    this.leftMsgAvatar,
                    this.peer_name,
                    this.peer_id,
                    peer_msg,
                    to_peer_id,
                    toPeerName,
                    data.to_peer_name,
                );
                if (!this.isChatOpen) this.toggleChat();
            }
        });
    }

    async showMessage(data) {
        if (!this.isChatOpen && this.showChatOnMessage) await this.toggleChat();
        this.setMsgAvatar('right', data.peer_name, data.peer_info);
        this.appendMessage(
            'right',
            this.rightMsgAvatar,
            data.peer_name,
            data.peer_id,
            data.peer_msg,
            data.to_peer_id,
            data.to_peer_name,
            data.peer_info,
        );
        if (!this.showChatOnMessage) {
            this.userLog('info', `💬 New message from: ${data.peer_name}`, 'top-end');
        }

        if (this.speechInMessages) {
            VideoAI.active
                ? this.streamingTask(`New message from: ${data.peer_name}, the message is: ${data.peer_msg}`)
                : this.speechMessage(true, data.peer_name, data.peer_msg);
        } else {
            this.sound('message');
        }

        const participantsList = this.getId('participantsList');
        const participantsListItems = participantsList.getElementsByTagName('li');
        for (let i = 0; i < participantsListItems.length; i++) {
            const li = participantsListItems[i];
            // INCOMING PRIVATE MESSAGE
            if (li.id === data.peer_id && data.to_peer_id != 'all') {
                li.classList.add('pulsate');
                if (!['all', 'ChatGPT'].includes(data.to_peer_id)) {
                    this.getId(`${data.peer_id}-unread-msg`).classList.remove('hidden');
                }
            }
        }
    }

    setMsgAvatar(avatar, peerName, peerInfo) {
        let avatarImg;
    
        if (peerInfo && peerInfo.peer_url) {
            // Use the avatar URL from peerInfo
            avatarImg = peerInfo.peer_url;
        } else if (rc.isValidEmail(peerName)) {
            // Use Gravatar if peerName is an email
            avatarImg = this.genGravatar(peerName);
        } else {
            // Generate an avatar SVG based on peerName
            avatarImg = this.genAvatarSvg(peerName, 32);
        }
    
        // Set the avatar image for the appropriate side
        if (avatar === 'left') {
            this.leftMsgAvatar = avatarImg;
        } else {
            this.rightMsgAvatar = avatarImg;
        }
    }
        
    appendMessage(side, img, fromName, fromId, msg, toId, toName, peerInfo) {
        //
        const getSide = filterXSS(side);
        const getImg = filterXSS(img);
        const getFromName = filterXSS(fromName);
        const getFromId = filterXSS(fromId);
        const getMsg = filterXSS(msg);
        const getToId = filterXSS(toId);
        const getToName = filterXSS(toName);
        const time = this.getTimeNow();

        const myMessage = getSide === 'left';
        const messageClass = myMessage ? 'my-message' : 'other-message float-right';
        const messageData = myMessage ? 'text-start' : 'text-end';
        const timeAndName = myMessage
            ? `<span class="message-data-time">${time}, ${getFromName} ( me ) </span>`
            : `<span class="message-data-time">${time}, ${getFromName} </span>`;

        const formatMessage = this.formatMsg(getMsg);
        console.log('FormatMessage', formatMessage);
        const speechButton = this.isSpeechSynthesisSupported
            ? `<button 
                    id="msg-speech-${chatMessagesId}" 
                    class="mr5" 
                    onclick="rc.speechText('${formatMessage}')">
                    <i class="fas fa-volume-high"></i>
                </button>`
            : '';

        const avatarImg = peerInfo && peerInfo.peer_url ? peerInfo.peer_url : img;

        const positionFirst = myMessage
            ? `<img src="${avatarImg}" alt="avatar" />${timeAndName}`
            : `${timeAndName}<img src="${avatarImg}" alt="avatar" />`;

        const message = getFromName === 'ChatGPT' ? `<pre>${getMsg}</pre>` : getMsg;

        const newMessageHTML = `
            <li id="msg-${chatMessagesId}"  
                data-from-id="${getFromId}" 
                data-from-name="${getFromName}"
                data-to-id="${getToId}" 
                data-to-name="${getToName}"
                class="clearfix"
            >
                <div class="message-data ${messageData}">
                    ${positionFirst}
                </div>
                <div class="message ${messageClass}">
                    <span class="text-start " id="${chatMessagesId}">${message}</span>
                    <hr/>
                    <div class="about-buttons mt5">
                        <button 
                            id="msg-copy-${chatMessagesId}" 
                            class="mr5" 
                            onclick="rc.copyToClipboard('${chatMessagesId}')">
                            <i class="fas fa-paste"></i>
                        </button>
                        ${speechButton}
                        <button 
                            id="msg-delete-${chatMessagesId}"   
                            class="mr5" 
                            onclick="rc.deleteMessage('msg-${chatMessagesId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </li>
        `;

        this.collectMessages(time, getFromName, getMsg);

        console.log('Append message to:', { to_id: getToId, to_name: getToName });

        switch (getToId) {
            case 'ChatGPT':
                chatGPTMessages.insertAdjacentHTML('beforeend', newMessageHTML);
                break;
            case 'all':
                chatPublicMessages.insertAdjacentHTML('beforeend', newMessageHTML);
                break;
            default:
                chatPrivateMessages.insertAdjacentHTML('beforeend', newMessageHTML);
                break;
        }

        chatHistory.scrollTop += 500;

        if (!this.isMobileDevice) {
            this.setTippy('msg-delete-' + chatMessagesId, 'Delete', 'top');
            this.setTippy('msg-copy-' + chatMessagesId, 'Copy', 'top');
            this.setTippy('msg-speech-' + chatMessagesId, 'Speech', 'top');
        }

        chatMessagesId++;
    }

    deleteMessage(id) {
        Swal.fire({
            background: swalBackground,
            position: 'center',
            title: 'Delete this Message?',
            imageUrl: image.delete,
            showDenyButton: true,
            confirmButtonText: `Yes`,
            denyButtonText: `No`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.isConfirmed) {
                this.getId(id).remove();
                this.sound('delete');
            }
        });
    }

    copyToClipboard(id) {
        const text = this.getId(id).innerText;
        navigator.clipboard
            .writeText(text)
            .then(() => {
                this.userLog('success', 'Message copied!', 'top-end', 1000);
            })
            .catch((err) => {
                this.userLog('error', err, 'top-end', 6000);
            });
    }

    formatMsg(msg) {
        const message = filterXSS(msg);
        if (message.trim().length == 0) return;
        if (this.isHtml(message)) return this.sanitizeHtml(message);
        if (this.isValidHttpURL(message)) {
            if (this.isImageURL(message)) return this.getImage(message);
            //if (this.isVideoTypeSupported(message)) return this.getIframe(message);
            return this.getLink(message);
        }
        if (isChatMarkdownOn) return marked.parse(message);
        if (isChatPasteTxt && this.getLineBreaks(message) > 1) {
            isChatPasteTxt = false;
            return this.getPre(message);
        }
        if (this.getLineBreaks(message) > 1) return this.getPre(message);
        console.log('FormatMsg', message);
        return message;
    }

    sanitizeHtml(input) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
            '/': '&#x2F;',
        };
        return input.replace(/[&<>"'/]/g, (m) => map[m]);
    }

    isHtml(str) {
        var a = document.createElement('div');
        a.innerHTML = str;
        for (var c = a.childNodes, i = c.length; i--; ) {
            if (c[i].nodeType == 1) return true;
        }
        return false;
    }

    isValidHttpURL(input) {
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                'localhost|' + // allow localhost
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$',
            'i',
        ); // fragment locator
        return pattern.test(input);
    }

    isImageURL(input) {
        return input.match(/\.(jpeg|jpg|gif|png|tiff|bmp)$/) != null;
    }

    getImage(input) {
        const url = filterXSS(input);
        const div = document.createElement('div');
        const img = document.createElement('img');
        img.setAttribute('src', url);
        img.setAttribute('width', '200px');
        img.setAttribute('height', 'auto');
        div.appendChild(img);
        console.log('GetImg', div.firstChild.outerHTML);
        return div.firstChild.outerHTML;
    }

    getLink(input) {
        const url = filterXSS(input);
        const a = document.createElement('a');
        const div = document.createElement('div');
        const linkText = document.createTextNode(url);
        a.setAttribute('href', url);
        a.setAttribute('target', '_blank');
        a.appendChild(linkText);
        div.appendChild(a);
        console.log('GetLink', div.firstChild.outerHTML);
        return div.firstChild.outerHTML;
    }

    getPre(input) {
        const text = filterXSS(input);
        const pre = document.createElement('pre');
        const div = document.createElement('div');
        pre.textContent = text;
        div.appendChild(pre);
        console.log('GetPre', div.firstChild.outerHTML);
        return div.firstChild.outerHTML;
    }

    getIframe(input) {
        const url = filterXSS(input);
        const iframe = document.createElement('iframe');
        const div = document.createElement('div');
        const is_youtube = this.getVideoType(url) == 'na' ? true : false;
        const video_audio_url = is_youtube ? this.getYoutubeEmbed(url) : url;
        iframe.setAttribute('title', 'Chat-IFrame');
        iframe.setAttribute('src', video_audio_url);
        iframe.setAttribute('width', 'auto');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute(
            'allow',
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        );
        iframe.setAttribute('allowfullscreen', 'allowfullscreen');
        div.appendChild(iframe);
        console.log('GetIFrame', div.firstChild.outerHTML);
        return div.firstChild.outerHTML;
    }

    getLineBreaks(message) {
        return (message.match(/\n/g) || []).length;
    }

    checkLineBreaks() {
        chatMessage.style.height = '';
        if (this.getLineBreaks(chatMessage.value) > 0 || chatMessage.value.length > 50) {
            chatMessage.setAttribute('rows', '2');
        }
    }

    collectMessages(time, from, msg) {
        this.chatMessages.push({
            time: time,
            from: from,
            msg: msg,
        });
    }

    speechMessage(newMsg = true, from, msg) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = (newMsg ? 'New' : '') + ' message from:' + from + '. The message is:' + msg;
        speech.rate = 0.9;
        window.speechSynthesis.speak(speech);
    }

    speechText(msg) {
        if (VideoAI.active) {
            this.streamingTask(msg);
        } else {
            const speech = new SpeechSynthesisUtterance();
            speech.text = msg;
            speech.rate = 0.9;
            window.speechSynthesis.speak(speech);
        }
    }

    chatToggleBg() {
        this.isChatBgTransparent = !this.isChatBgTransparent;
        this.isChatBgTransparent
            ? document.documentElement.style.setProperty('--msger-bg', 'rgba(0, 0, 0, 0.100)')
            : setTheme();
    }

    chatClean() {
        if (this.chatMessages.length === 0) {
            return userLog('info', 'No chat messages to clean', 'top-end');
        }
        Swal.fire({
            background: swalBackground,
            position: 'center',
            title: 'Clean up all chat Messages?',
            imageUrl: image.delete,
            showDenyButton: true,
            confirmButtonText: `Yes`,
            denyButtonText: `No`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.isConfirmed) {
                function removeAllChildNodes(parentNode) {
                    while (parentNode.firstChild) {
                        parentNode.removeChild(parentNode.firstChild);
                    }
                }
                // Remove child nodes from different message containers
                removeAllChildNodes(chatGPTMessages);
                removeAllChildNodes(chatPublicMessages);
                removeAllChildNodes(chatPrivateMessages);
                this.chatMessages = [];
                this.chatGPTContext = [];
                this.sound('delete');
            }
        });
    }

    chatSave() {
        if (this.chatMessages.length === 0) {
            return userLog('info', 'No chat messages to save', 'top-end');
        }
        saveObjToJsonFile(this.chatMessages, 'CHAT');
    }

    // ##############################################
    // POOLS
    // ##############################################

    togglePoll() {
        pollRoom.classList.toggle('show');
        if (!this.isPollOpen) {
            hide(pollMinButton);
            if (!this.isMobileDevice) {
                BUTTONS.poll.pollMaxButton && show(pollMaxButton);
            }
            this.pollCenter();
            this.sound('open');
        }
        this.isPollOpen = !this.isPollOpen;
        if (this.isPollPinned) this.pollUnpin();
    }

    togglePollPin() {
        if (transcription.isPin()) {
            return userLog('info', 'Please unpin the transcription that appears to be currently pinned', 'top-end');
        }
        if (this.isChatPinned) {
            return userLog('info', 'Please unpin the chat that appears to be currently pinned', 'top-end');
        }
        if (this.isEditorPinned) {
            return userLog('info', 'Please unpin the editor that appears to be currently pinned', 'top-end');
        }
        this.isPollPinned ? this.pollUnpin() : this.pollPin();
        this.sound('click');
    }

    pollPin() {
        if (!this.isVideoPinned) {
            this.videoMediaContainerPin();
        }
        this.pollPinned();
        this.isPollPinned = true;
        setColor(pollTogglePin, 'lime');
        this.resizeVideoMenuBar();
        resizeVideoMedia();
        pollRoom.style.resize = 'none';
        if (!this.isMobileDevice) this.makeUnDraggable(pollRoom, pollHeader);
    }

    pollUnpin() {
        if (!this.isVideoPinned) {
            this.videoMediaContainerUnpin();
        }
        pollRoom.style.maxWidth = '600px';
        pollRoom.style.maxHeight = '700px';
        this.pollCenter();
        this.isPollPinned = false;
        setColor(pollTogglePin, 'white');
        this.resizeVideoMenuBar();
        resizeVideoMedia();
        if (!this.isMobileDevice) this.makeDraggable(pollRoom, pollHeader);
    }

    pollPinned() {
        pollRoom.style.position = 'absolute';
        pollRoom.style.top = 0;
        pollRoom.style.right = 0;
        pollRoom.style.left = null;
        pollRoom.style.transform = null;
        pollRoom.style.maxWidth = '25%';
        pollRoom.style.maxHeight = '100%';
    }

    pollCenter() {
        pollRoom.style.position = 'fixed';
        pollRoom.style.transform = 'translate(-50%, -50%)';
        pollRoom.style.top = '50%';
        pollRoom.style.left = '50%';
    }

    pollMaximize() {
        pollRoom.style.maxHeight = '100vh';
        pollRoom.style.maxWidth = '100vw';
        this.pollCenter();
        hide(pollMaxButton);
        BUTTONS.poll.pollMaxButton && show(pollMinButton);
    }

    pollMinimize() {
        this.pollCenter();
        hide(pollMinButton);
        BUTTONS.poll.pollMaxButton && show(pollMaxButton);
        if (this.isPollPinned) {
            this.pollPin();
        } else {
            pollRoom.style.maxWidth = '600px';
            pollRoom.style.maxHeight = '700px';
        }
    }

    pollsUpdate(polls) {
        if (!this.isPollOpen) this.togglePoll();

        pollsContainer.innerHTML = '';
        polls.forEach((poll, index) => {
            const pollDiv = document.createElement('div');
            pollDiv.className = 'poll';

            const question = document.createElement('p');
            question.className = 'poll-question';
            question.textContent = poll.question;
            pollDiv.appendChild(question);

            const options = document.createElement('div');
            options.className = 'options';

            poll.options.forEach((option) => {
                const optionDiv = document.createElement('div');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `poll${index}`;
                input.value = option;
                if (this.pollSelectedOptions[index] === option) {
                    input.checked = true;
                }

                input.addEventListener('change', () => {
                    this.pollSelectedOptions[index] = option;
                    this.socket.emit('vote', { pollIndex: index, option });
                });

                const label = document.createElement('label');
                label.textContent = option;

                optionDiv.appendChild(input);
                optionDiv.appendChild(label);
                options.appendChild(optionDiv);
            });
            pollDiv.appendChild(options);

            // Only the presenters
            // if (isPresenter) {
            const pollButtonsDiv = document.createElement('div');
            pollButtonsDiv.className = 'poll-btns';

            // Toggle voters button
            const toggleButton = document.createElement('button');
            const toggleButtonIcon = document.createElement('i');
            toggleButtonIcon.className = 'fas fa-users';
            toggleButton.id = 'toggleVoters';
            toggleButton.className = 'view-btn';
            // Append the icon to the button
            toggleButton.insertBefore(toggleButtonIcon, toggleButton.firstChild);
            toggleButton.addEventListener('click', () => {
                votersList.style.display === 'none'
                    ? (votersList.style.display = 'block')
                    : (votersList.style.display = 'none');
            });
            pollButtonsDiv.appendChild(toggleButton);

            // Edit poll button using swal
            const editPollButton = document.createElement('button');
            const editPollButtonIcon = document.createElement('i');
            editPollButtonIcon.className = 'fas fa-pen-to-square';
            editPollButton.id = 'editPoll';
            editPollButton.className = 'poll-btn';
            editPollButton.insertBefore(editPollButtonIcon, editPollButton.firstChild);
            editPollButton.addEventListener('click', () => {
                Swal.fire({
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    background: swalBackground,
                    title: 'Edit Poll',
                    html: this.createPollInputs(poll),
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: 'Save',
                    cancelButtonText: 'Cancel',
                    cancelButtonColor: '#dc3545',
                    preConfirm: () => {
                        const newQuestion = document.getElementById('swal-input-question').value;
                        const newOptions = this.getPollOptions(poll.options.length);
                        this.socket.emit('editPoll', {
                            index,
                            question: newQuestion,
                            options: newOptions,
                            peer_name: this.peer_name,
                            peer_uuid: this.peer_uuid,
                        });
                    },
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                });
            });
            pollButtonsDiv.appendChild(editPollButton);

            // Delete poll button
            const deletePollButton = document.createElement('button');
            const deletePollButtonIcon = document.createElement('i');
            deletePollButtonIcon.className = 'fas fa-minus';
            deletePollButton.id = 'delPoll';
            deletePollButton.className = 'del-btn';
            deletePollButton.insertBefore(deletePollButtonIcon, deletePollButton.firstChild);
            deletePollButton.addEventListener('click', () => {
                this.socket.emit('deletePoll', { index, peer_name: this.peer_name, peer_uuid: this.peer_uuid });
            });
            pollButtonsDiv.appendChild(deletePollButton);

            // Add thematic break
            const hr = document.createElement('hr');
            pollDiv.appendChild(hr);

            // Append buttons to poll
            pollDiv.appendChild(pollButtonsDiv);

            // Create voter lists
            const votersList = document.createElement('ul');
            votersList.style.display = 'none';
            for (const [user, vote] of Object.entries(poll.voters)) {
                const voter = document.createElement('li');
                voter.textContent = `${user}: ${vote}`;
                votersList.appendChild(voter);
            }
            pollDiv.appendChild(votersList);
            // }

            pollsContainer.appendChild(pollDiv);

            if (!this.isMobileDevice) {
                setTippy('toggleVoters', 'Toggle voters', 'top');
                setTippy('delPoll', 'Delete poll', 'top');
                setTippy('editPoll', 'Edit poll', 'top');
            }
        });
    }

    pollCreateNewForm(e) {
        e.preventDefault();

        const question = e.target.question.value;
        const optionInputs = document.querySelectorAll('.option-input');
        const options = Array.from(optionInputs).map((input) => input.value.trim());

        this.socket.emit('createPoll', { question, options });

        e.target.reset();
        optionsContainer.innerHTML = '';
        const initialOptionInput = document.createElement('input');
        initialOptionInput.type = 'text';
        initialOptionInput.name = 'option';
        initialOptionInput.className = 'option-input';
        initialOptionInput.required = true;
        optionsContainer.appendChild(initialOptionInput);
    }

    pollAddOptions() {
        const optionInput = document.createElement('input');
        optionInput.type = 'text';
        optionInput.name = 'option';
        optionInput.className = 'option-input';
        optionInput.required = true;
        optionsContainer.appendChild(optionInput);
    }

    pollDeleteOptions() {
        const optionInputs = document.querySelectorAll('.option-input');
        if (optionInputs.length > 1) {
            optionsContainer.removeChild(optionInputs[optionInputs.length - 1]);
        }
    }

    createPollInputs(poll) {
        const questionInput = `<input id="swal-input-question" class="swal2-input" value="${poll.question}">`;
        const optionsInputs = poll.options
            .map((option, i) => `<input id="swal-input-option${i}" class="swal2-input" value="${option}">`)
            .join('');
        return questionInput + optionsInputs;
    }

    getPollOptions(optionCount) {
        const options = [];
        for (let i = 0; i < optionCount; i++) {
            options.push(document.getElementById(`swal-input-option${i}`).value);
        }
        return options;
    }

    pollSaveResults() {
        const polls = document.querySelectorAll('.poll');
        const results = [];

        polls.forEach((poll, index) => {
            const question = poll.querySelector('.poll-question').textContent;
            const options = poll.querySelectorAll('.options div label');

            const optionsText = Array.from(options).reduce((acc, option, index) => {
                acc[index + 1] = option.textContent.trim();
                return acc;
            }, {});

            const votersList = poll.querySelector('ul');
            const voters = Array.from(votersList.querySelectorAll('li')).reduce((acc, li) => {
                const [name, vote] = li.textContent.split(':').map((item) => item.trim());
                acc[name] = vote;
                return acc;
            }, {});

            results.push({
                Poll: `${index + 1}`,
                question: question,
                options: optionsText,
                voters: voters,
            });
        });

        results.length > 0
            ? saveObjToJsonFile(results, 'Poll')
            : this.userLog('info', 'No polling data available to save', 'top-end');
    }

    getPollFileName() {
        const dateTime = getDataTimeStringFormat();
        const roomName = this.room_id.trim();
        return `Poll_${roomName}_${dateTime}.txt`;
    }

    // ####################################################
    // EDITOR
    // ####################################################

    toggleEditor() {
        editorRoom.classList.toggle('show');
        if (!this.isEditorOpen) {
            this.editorCenter();
            this.sound('open');
        }
        this.isEditorOpen = !this.isEditorOpen;
        if (this.isEditorPinned) this.editorUnpin();
    }

    toggleLockUnlockEditor() {
        this.isEditorLocked = !this.isEditorLocked;

        const btnToShow = this.isEditorLocked ? editorLockBtn : editorUnlockBtn;
        const btnToHide = this.isEditorLocked ? editorUnlockBtn : editorLockBtn;
        const btnColor = this.isEditorLocked ? 'red' : 'white';
        const action = this.isEditorLocked ? 'lock' : 'unlock';

        show(btnToShow);
        hide(btnToHide);
        setColor(editorLockBtn, btnColor);

        this.editorSendAction(action);

        if (this.isEditorLocked) {
            userLog('info', 'The Editor is locked. \n The participants cannot interact with it.', 'top-right');
            sound('locked');
        }
    }

    editorCenter() {
        editorRoom.style.position = 'fixed';
        editorRoom.style.transform = 'translate(-50%, -50%)';
        editorRoom.style.top = '50%';
        editorRoom.style.left = '50%';
    }

    toggleEditorPin() {
        if (transcription.isPin()) {
            return userLog('info', 'Please unpin the transcription that appears to be currently pinned', 'top-end');
        }
        if (this.isPollPinned) {
            return userLog('info', 'Please unpin the poll that appears to be currently pinned', 'top-end');
        }
        if (this.isChatPinned) {
            return userLog('info', 'Please unpin the chat that appears to be currently pinned', 'top-end');
        }
        this.isEditorPinned ? this.editorUnpin() : this.editorPin();
        this.sound('click');
    }

    editorPin() {
        if (!this.isVideoPinned) {
            this.videoMediaContainer.style.top = 0;
            this.videoMediaContainer.style.width = '70%';
            this.videoMediaContainer.style.height = '100%';
        }
        this.editorPinned();
        this.isEditorPinned = true;
        setColor(editorTogglePin, 'lime');
        this.resizeVideoMenuBar();
        resizeVideoMedia();
        document.documentElement.style.setProperty('--editor-height', '80vh');
        //if (!this.isMobileDevice) this.makeUnDraggable(editorRoom, editorHeader);
    }

    editorUnpin() {
        if (!this.isVideoPinned) {
            this.videoMediaContainerUnpin();
        }
        editorRoom.style.maxWidth = '100%';
        editorRoom.style.maxHeight = '100%';
        this.pollCenter();
        this.isEditorPinned = false;
        setColor(editorTogglePin, 'white');
        this.resizeVideoMenuBar();
        resizeVideoMedia();
        document.documentElement.style.setProperty('--editor-height', '85vh');
        //if (!this.isMobileDevice) this.makeDraggable(editorRoom, editorHeader);
    }

    editorPinned() {
        editorRoom.style.position = 'absolute';
        editorRoom.style.top = 0;
        editorRoom.style.right = 0;
        editorRoom.style.left = null;
        editorRoom.style.transform = null;
        editorRoom.style.maxWidth = '30%';
        editorRoom.style.maxHeight = '100%';
    }

    editorUpdate() {
        if (this.isEditorOpen && (!isRulesActive || isPresenter)) {
            console.log('IsPresenter: update editor content to the participants in the room');
            const content = quill.getContents(); // Get content in Delta format
            this.socket.emit('editorUpdate', content);
            const action = this.isEditorLocked ? 'lock' : 'unlock';
            this.editorSendAction(action);
        }
    }

    handleEditorUpdateData(data) {
        this.editorOpen();
        quill.setContents(data);
    }

    handleEditorData(data) {
        this.editorOpen();
        quill.updateContents(data);
    }

    editorOpen() {
        if (!this.isEditorOpen) {
            this.sound('open');
            this.toggleEditor();
        }
    }

    handleEditorActionsData(data) {
        const { peer_name, action } = data;
        switch (action) {
            case 'open':
                if (this.isEditorOpen) return;
                this.toggleEditor();
                this.userLog('info', `${icons.editor} ${peer_name} open editor`, 'top-end', 6000);
                break;
            case 'close':
                if (!this.isEditorOpen) return;
                this.toggleEditor();
                this.userLog('info', `${icons.editor} ${peer_name} close editor`, 'top-end', 6000);
                break;
            case 'clean':
                quill.setText('');
                this.userLog('info', `${icons.editor} ${peer_name} cleared editor`, 'top-end', 6000);
                break;
            case 'lock':
                this.isEditorLocked = true;
                quill.enable(false);
                this.userLog('info', `${icons.editor} ${peer_name} locked the editor`, 'top-end', 6000);
                break;
            case 'unlock':
                this.isEditorLocked = false;
                quill.enable(true);
                this.userLog('info', `${icons.editor} ${peer_name} unlocked the editor`, 'top-end', 6000);
                break;
            default:
                break;
        }
    }

    editorIsLocked() {
        return this.isEditorLocked;
    }

    editorUndo() {
        quill.history.undo();
    }

    editorRedo() {
        quill.history.redo();
    }

    editorCopy() {
        const content = quill.getText();
        if (content.trim().length === 0) {
            return this.userLog('info', 'Nothing to copy', 'top-end');
        }
        copyToClipboard(content, false);
    }

    editorClean() {
        if (!isPresenter && this.editorIsLocked()) {
            userLog('info', 'The Editor is locked. \n You cannot interact with it.', 'top-right');
            return;
        }
        const content = quill.getText();
        if (content.trim().length === 0) {
            return this.userLog('info', 'Nothing to clear', 'top-end');
        }
        Swal.fire({
            background: swalBackground,
            position: 'center',
            title: 'Clear the editor content?',
            imageUrl: image.delete,
            showDenyButton: true,
            confirmButtonText: `Yes`,
            denyButtonText: `No`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.isConfirmed) {
                quill.setText('');
                this.editorSendAction('clean');
                this.sound('delete');
            }
        });
    }

    editorSave() {
        Swal.fire({
            background: swalBackground,
            position: 'top',
            imageUrl: image.save,
            title: 'Editor save options',
            showDenyButton: true,
            showCancelButton: true,
            cancelButtonColor: 'red',
            denyButtonColor: 'green',
            confirmButtonText: `Text`,
            denyButtonText: `Html`,
            cancelButtonText: `Cancel`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            this.handleEditorSaveResult(result);
        });
    }

    handleEditorSaveResult(result) {
        if (result.isConfirmed) {
            this.saveEditorAsText();
        } else if (result.isDenied) {
            this.saveEditorAsHtml();
        }
    }

    saveEditorAsText() {
        const content = quill.getText().trim();
        if (content.length === 0) {
            return this.userLog('info', 'No data to save!', 'top-end');
        }
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const fileName = this.generateFileName('editor.txt');
        this.saveBlobToFile(blob, fileName);
        this.sound('download');
    }

    saveEditorAsHtml() {
        const content = quill.root.innerHTML.trim();
        if (content === '<p><br></p>') {
            return this.userLog('info', 'No data to save!', 'top-end');
        }
        const fileName = this.generateFileName('editor.html');
        this.saveAsHtml(content, fileName);
        this.sound('download');
    }

    generateFileName(extension) {
        return `Room_${this.room_id}_${getDataTimeString()}_${extension}`;
    }

    saveAsHtml(content, file) {
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    editorSendAction(action) {
        this.socket.emit('editorActions', { peer_name: this.peer_name, action: action });
    }

    // ####################################################
    // RECORDING
    // ####################################################

    handleRecordingError(error, popupLog = true) {
        console.error('Recording error', error);
        if (popupLog) this.userLog('error', error, 'top-end', 6000);
    }

    getSupportedMimeTypes() {
        const possibleTypes = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/mp4'];
        possibleTypes.splice(recPrioritizeH264 ? 0 : 2, 0, 'video/mp4;codecs=h264,aac', 'video/webm;codecs=h264,opus');
        console.log('POSSIBLE CODECS', possibleTypes);
        return possibleTypes.filter((mimeType) => {
            return MediaRecorder.isTypeSupported(mimeType);
        });
    }

    startRecording() {
        recordedBlobs = [];

        // Get supported MIME types and set options
        const supportedMimeTypes = this.getSupportedMimeTypes();
        console.log('MediaRecorder supported options', supportedMimeTypes);
        const options = { mimeType: supportedMimeTypes[0] };

        recCodecs = supportedMimeTypes[0];

        try {
            this.audioRecorder = new MixedAudioRecorder();
            const audioStreams = this.getAudioStreamFromAudioElements();
            console.log('Audio streams tracks --->', audioStreams.getTracks());

            const audioMixerStreams = this.audioRecorder.getMixedAudioStream(
                audioStreams
                    .getTracks()
                    .filter((track) => track.kind === 'audio')
                    .map((track) => new MediaStream([track])),
            );

            const audioMixerTracks = audioMixerStreams.getTracks();
            console.log('Audio mixer tracks --->', audioMixerTracks);

            this.isMobileDevice
                ? this.startMobileRecording(options, audioMixerTracks)
                : this.recordingOptions(options, audioMixerTracks);
        } catch (err) {
            this.handleRecordingError('Exception while creating MediaRecorder: ' + err);
        }
    }

    recordingOptions(options, audioMixerTracks) {
        Swal.fire({
            background: swalBackground,
            position: 'top',
            imageUrl: image.recording,
            title: 'Recording options',
            showDenyButton: true,
            showCancelButton: true,
            cancelButtonColor: 'red',
            denyButtonColor: 'green',
            confirmButtonText: `Camera`,
            denyButtonText: `Screen/Window`,
            cancelButtonText: `Cancel`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.isConfirmed) {
                this.startMobileRecording(options, audioMixerTracks);
            } else if (result.isDenied) {
                this.startDesktopRecording(options, audioMixerTracks);
            }
        });
    }

    startMobileRecording(options, audioMixerTracks) {
        try {
            // Combine audioMixerTracks and videoTracks into a single array
            const combinedTracks = [];

            if (Array.isArray(audioMixerTracks)) {
                combinedTracks.push(...audioMixerTracks);
            }

            if (this.localVideoStream !== null) {
                const videoTracks = this.localVideoStream.getVideoTracks();
                console.log('Cam video tracks --->', videoTracks);

                if (Array.isArray(videoTracks)) {
                    combinedTracks.push(...videoTracks);
                }
            }

            const recCamStream = new MediaStream(combinedTracks);
            console.log('New Cam Media Stream tracks  --->', recCamStream.getTracks());

            this.mediaRecorder = new MediaRecorder(recCamStream, options);
            console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);

            this.getId('swapCameraButton').className = 'hidden';

            this.initRecording();
        } catch (err) {
            this.handleRecordingError('Unable to record the camera + audio: ' + err, false);
        }
    }

    startDesktopRecording(options, audioMixerTracks) {
        // On desktop devices, record camera or screen/window... + all audio tracks
        const constraints = { video: true };
        navigator.mediaDevices
            .getDisplayMedia(constraints)
            .then((screenStream) => {
                const screenTracks = screenStream.getVideoTracks();
                console.log('Screen video tracks --->', screenTracks);

                const combinedTracks = [];

                if (Array.isArray(screenTracks)) {
                    combinedTracks.push(...screenTracks);
                }
                if (Array.isArray(audioMixerTracks)) {
                    combinedTracks.push(...audioMixerTracks);
                }

                const recScreenStream = new MediaStream(combinedTracks);
                console.log('New Screen/Window Media Stream tracks  --->', recScreenStream.getTracks());

                this.recScreenStream = recScreenStream;
                this.mediaRecorder = new MediaRecorder(recScreenStream, options);
                console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);

                this.initRecording();
            })
            .catch((err) => {
                this.handleRecordingError('Unable to record the screen + audio: ' + err, false);
            });
    }

    initRecording() {
        this._isRecording = true;
        this.handleMediaRecorder();
        this.event(_EVENTS.startRec);
        this.recordingAction(enums.recording.start);
        this.sound('recStart');
    }

    hasAudioTrack(mediaStream) {
        if (!mediaStream) return false;
        const audioTracks = mediaStream.getAudioTracks();
        return audioTracks.length > 0;
    }

    hasVideoTrack(mediaStream) {
        if (!mediaStream) return false;
        const videoTracks = mediaStream.getVideoTracks();
        return videoTracks.length > 0;
    }

    getAudioTracksFromAudioElements() {
        const audioElements = document.querySelectorAll('audio');
        const audioTracks = [];
        audioElements.forEach((audio) => {
            // Exclude avatar Preview Audio
            if (audio.id !== 'avatarPreviewAudio') {
                const audioTrack = audio.srcObject.getAudioTracks()[0];
                if (audioTrack) {
                    audioTracks.push(audioTrack);
                }
            }
        });
        return audioTracks;
    }

    getAudioStreamFromAudioElements() {
        const audioElements = document.querySelectorAll('audio');
        const audioStream = new MediaStream();
        audioElements.forEach((audio) => {
            // Exclude avatar Preview Audio
            if (audio.id !== 'avatarPreviewAudio') {
                const audioTrack = audio.srcObject.getAudioTracks()[0];
                if (audioTrack) {
                    audioStream.addTrack(audioTrack);
                }
            }
        });
        return audioStream;
    }

    handleMediaRecorder() {
        if (this.mediaRecorder) {
            this.recServerFileName = this.getServerRecFileName();
            rc.recording.recSyncServerRecording
                ? this.mediaRecorder.start(this.recSyncTime)
                : this.mediaRecorder.start();
            this.mediaRecorder.addEventListener('start', this.handleMediaRecorderStart);
            this.mediaRecorder.addEventListener('dataavailable', this.handleMediaRecorderData);
            this.mediaRecorder.addEventListener('stop', this.handleMediaRecorderStop);
        }
    }

    getServerRecFileName() {
        const dateTime = getDataTimeStringFormat();
        const roomName = this.room_id.trim();
        return `Rec_${roomName}_${dateTime}.webm`;
    }

    handleMediaRecorderStart(evt) {
        console.log('MediaRecorder started: ', evt);
        rc.cleanLastRecordingInfo();
        rc.disableRecordingOptions();
    }

    handleMediaRecorderData(evt) {
        // console.log('MediaRecorder data: ', evt);
        if (evt.data && evt.data.size > 0) {
            rc.recording.recSyncServerRecording ? rc.syncRecordingInCloud(evt.data) : recordedBlobs.push(evt.data);
        }
    }

    async syncRecordingInCloud(data) {
        const arrayBuffer = await data.arrayBuffer();
        const chunkSize = rc.recSyncChunkSize;
        const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const chunk = arrayBuffer.slice(chunkIndex * chunkSize, (chunkIndex + 1) * chunkSize);
            try {
                const response = await axios.post(
                    `${this.recording.recSyncServerEndpoint}/recSync?fileName=` + rc.recServerFileName,
                    chunk,
                    {
                        headers: {
                            'Content-Type': 'application/octet-stream',
                        },
                    },
                );
                console.log('Chunk synced successfully:', response.data);
            } catch (error) {
                let errorMessage = 'Recording stopped! ';
                if (error.response) {
                    errorMessage += error.response.data.message;
                    console.error('Error syncing chunk', {
                        status_code: error.response.status,
                        response_data: error.response.data,
                        response_headers: error.response.headers,
                    });
                } else if (error.request) {
                    console.error('Error syncing chunk: No response received', { request_details: error.request });
                } else {
                    errorMessage += error.message;
                    console.error('Error syncing chunk:', error.message);
                }
                userLog('warning', errorMessage, 'top-end', 3000);
                rc.stopRecording();
                rc.saveLastRecordingInfo('<br/><span class="red">' + errorMessage + '.</span>');
            }
        }
    }

    handleMediaRecorderStop(evt) {
        try {
            console.log('MediaRecorder stopped: ', evt);
            rc.recording.recSyncServerRecording ? rc.handleServerRecordingStop() : rc.handleLocalRecordingStop();
            rc.disableRecordingOptions(false);
        } catch (err) {
            console.error('Recording save failed', err);
        }
    }

    disableRecordingOptions(disabled = true) {
        switchH264Recording.disabled = disabled;
        switchServerRecording.disabled = disabled;
        switchHostOnlyRecording.disabled = disabled;
    }

    handleLocalRecordingStop() {
        console.log('MediaRecorder Blobs: ', recordedBlobs);

        const dateTime = getDataTimeString();
        const type = recordedBlobs[0].type.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(recordedBlobs, { type: 'video/' + type });
        const recFileName = `Rec_${dateTime}.${type}`;
        const currentDevice = DetectRTC.isMobileDevice ? 'MOBILE' : 'PC';
        const blobFileSize = bytesToSize(blob.size);
        const recTime = document.getElementById('recordingStatus');
        const recType = 'Locally';
        const recordingInfo = `
        <br/><br/>
        <ul>
            <li>Stored: ${recType}</li>
            <li>Time: ${recTime.innerText}</li>
            <li>File: ${recFileName}</li>
            <li>Codecs: ${recCodecs}</li>
            <li>Size: ${blobFileSize}</li>
        </ul>
        <br/>
        `;
        const recordingMsg = `Please wait to be processed, then will be downloaded to your ${currentDevice} device.`;

        this.saveLastRecordingInfo(recordingInfo);
        this.showRecordingInfo(recType, recordingInfo, recordingMsg);
        this.saveRecordingInLocalDevice(blob, recFileName, recTime);
    }

    handleServerRecordingStop() {
        console.log('MediaRecorder Stop');
        const recTime = document.getElementById('recordingStatus');
        const recType = 'Server';
        const recordingInfo = `
        <br/><br/>
        <ul>
            <li>Stored: ${recType}</li>
            <li>Time: ${recTime.innerText}</li>
            <li>File: ${this.recServerFileName}</li>
            <li>Codecs: ${recCodecs}</li>
        </ul>
        <br/>
        `;
        this.saveLastRecordingInfo(recordingInfo);
        this.showRecordingInfo(recType, recordingInfo);
    }

    saveLastRecordingInfo(recordingInfo) {
        const lastRecordingInfo = document.getElementById('lastRecordingInfo');
        lastRecordingInfo.style.color = '#FFFFFF';
        lastRecordingInfo.innerHTML = `Last Recording Info: ${recordingInfo}`;
        show(lastRecordingInfo);
    }

    cleanLastRecordingInfo() {
        const lastRecordingInfo = document.getElementById('lastRecordingInfo');
        lastRecordingInfo.innerHTML = '';
        hide(lastRecordingInfo);
    }

    showRecordingInfo(recType, recordingInfo, recordingMsg = '') {
        if (window.localStorage.isReconnected === 'false') {
            Swal.fire({
                background: swalBackground,
                position: 'center',
                icon: 'success',
                title: 'Recording',
                html: `<div style="text-align: left;">
                🔴 ${recType} Recording Info: 
                ${recordingInfo}
                ${recordingMsg}
                </div>`,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            });
        }
    }

    saveRecordingInLocalDevice(blob, recFileName, recTime) {
        console.log('MediaRecorder Download Blobs');
        const url = window.URL.createObjectURL(blob);

        const downloadLink = document.createElement('a');
        downloadLink.style.display = 'none';
        downloadLink.href = url;
        downloadLink.download = recFileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();

        setTimeout(() => {
            document.body.removeChild(downloadLink);
            window.URL.revokeObjectURL(url);
            console.log(`🔴 Recording FILE: ${recFileName} done 👍`);
            recordedBlobs = [];
            recTime.innerText = '0s';
        }, 100);
    }

    pauseRecording() {
        if (this.mediaRecorder) {
            this._isRecording = false;
            this.mediaRecorder.pause();
            this.event(_EVENTS.pauseRec);
            this.recordingAction('Pause recording');
        }
    }

    resumeRecording() {
        if (this.mediaRecorder) {
            this._isRecording = true;
            this.mediaRecorder.resume();
            this.event(_EVENTS.resumeRec);
            this.recordingAction('Resume recording');
        }
    }

    stopRecording() {
        if (this.mediaRecorder) {
            this._isRecording = false;
            this.mediaRecorder.stop();
            this.mediaRecorder = null;
            if (this.recScreenStream) {
                this.recScreenStream.getTracks().forEach((track) => {
                    if (track.kind === 'video') track.stop();
                });
            }
            if (this.isMobileDevice) this.getId('swapCameraButton').className = '';
            this.event(_EVENTS.stopRec);
            this.audioRecorder.stopMixedAudioStream();
            this.recordingAction(enums.recording.stop);
            this.sound('recStop');
        }
    }

    recordingAction(action) {
        if (!this.thereAreParticipants()) return;
        this.socket.emit('recordingAction', {
            peer_name: this.peer_name,
            peer_id: this.peer_id,
            action: action,
        });
    }

    handleRecordingAction(data) {
        console.log('Handle recording action', data);

        const { peer_name, peer_id, action } = data;

        const recAction = {
            side: 'left',
            img: this.leftMsgAvatar,
            peer_name: peer_name,
            peer_id: peer_id,
            peer_msg: `🔴 ${action}`,
            to_peer_id: 'all',
            to_peer_name: 'all',
        };
        this.showMessage(recAction);

        const recData = {
            type: 'recording',
            action: action,
            peer_name: peer_name,
        };

        this.msgHTML(
            recData,
            null,
            image.recording,
            null,
            `${icons.user} ${peer_name} 
            <br /><br /> 
            <span>🔴 ${action}</span>
            <br />`,
        );
    }

    saveRecording(reason) {
        if (this._isRecording || recordingStatus.innerText != '0s') {
            console.log(`Save recording: ${reason}`);
            this.stopRecording();
        }
    }

    // ####################################################
    // FILE SHARING
    // ####################################################

    handleSF(uid) {
        const words = uid.split('___');
        let peer_id = words[1];
        let btnSf = this.getId(uid);
        if (btnSf) {
            btnSf.addEventListener('click', () => {
                this.selectFileToShare(peer_id);
            });
        }
    }

    handleDD(uid, peer_id, itsMe = false) {
        let videoPlayer = this.getId(uid);
        if (videoPlayer) {
            videoPlayer.addEventListener('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.target.parentElement.style.outline = `2px dashed var(--dd-color)`;
            });

            videoPlayer.addEventListener('dragleave', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.target.parentElement.style.outline = 'none';
            });

            videoPlayer.addEventListener('drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.target.parentElement.style.outline = 'none';
                if (itsMe) {
                    return userLog('warning', 'You cannot send files to yourself.', 'top-end');
                }
                if (this.sendInProgress) {
                    return userLog('warning', 'Please wait for the previous file to be sent.', 'top-end');
                }
                if (e.dataTransfer.items && e.dataTransfer.items.length > 1) {
                    return userLog('warning', 'Please drag and drop a single file.', 'top-end');
                }
                if (e.dataTransfer.items) {
                    let item = e.dataTransfer.items[0].webkitGetAsEntry();
                    console.log('Drag and drop', item);
                    if (item.isDirectory) {
                        return userLog('warning', 'Please drag and drop a single file not a folder.', 'top-end');
                    }
                    var file = e.dataTransfer.items[0].getAsFile();
                    rc.sendFileInformations(file, peer_id);
                } else {
                    rc.sendFileInformations(e.dataTransfer.files[0], peer_id);
                }
            });
        }
    }

    selectFileToShare(peer_id, broadcast = false) {
        this.sound('open');

        Swal.fire({
            allowOutsideClick: false,
            background: swalBackground,
            imageAlt: 'mirotalksfu-file-sharing',
            imageUrl: image.share,
            position: 'center',
            title: 'Share file',
            input: 'file',
            html: `
            <div id="dropArea">
                <p>Drag and drop your file here</p>
            </div>
            `,
            inputAttributes: {
                accept: this.fileSharingInput,
                'aria-label': 'Select file',
            },
            didOpen: () => {
                const dropArea = document.getElementById('dropArea');
                dropArea.addEventListener('dragenter', handleDragEnter);
                dropArea.addEventListener('dragover', handleDragOver);
                dropArea.addEventListener('dragleave', handleDragLeave);
                dropArea.addEventListener('drop', handleDrop);
            },
            showDenyButton: true,
            confirmButtonText: `Send`,
            denyButtonText: `Cancel`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.isConfirmed) {
                this.sendFileInformations(result.value, peer_id, broadcast);
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
                rc.sendFileInformations(file, peer_id, broadcast);
            }
        }
    }

    sendFileInformations(file, peer_id, broadcast = false) {
        if (this.isFileReaderRunning()) {
            return this.userLog('warning', 'File transfer in progress. Please wait until it completes', 'top-end');
        }
        this.fileToSend = file;
        //
        if (this.fileToSend && this.fileToSend.size > 0) {
            if (!this.thereAreParticipants()) {
                return userLog('info', 'No participants detected', 'top-end');
            }
            // prevent XSS injection
            if (this.isHtml(this.fileToSend.name) || !this.isValidFileName(this.fileToSend.name))
                return userLog('warning', 'Invalid file name!', 'top-end', 5000);

            const fileInfo = {
                peer_id: peer_id,
                broadcast: broadcast,
                peer_name: this.peer_name,
                fileName: this.fileToSend.name,
                fileSize: this.fileToSend.size,
                fileType: this.fileToSend.type,
            };
            this.setMsgAvatar('left', this.peer_name);
            this.appendMessage(
                'left',
                this.leftMsgAvatar,
                this.peer_name,
                this.peer_id,
                `${icons.fileSend} File send: 
                <br/> 
                <ul>
                    <li>Name: ${this.fileToSend.name}</li>
                    <li>Size: ${this.bytesToSize(this.fileToSend.size)}</li>
                </ul>`,
                'all',
                'all',
            );
            // send some metadata about our file to peers in the room
            this.socket.emit('fileInfo', fileInfo);
            setTimeout(() => {
                this.sendFileData(peer_id, broadcast);
            }, 1000);
        } else {
            userLog('error', 'File not selected or empty.', 'top-end');
        }
    }

    handleFileInfo(data) {
        this.incomingFileInfo = data;
        this.incomingFileData = [];
        this.receiveBuffer = [];
        this.receivedSize = 0;
        let fileToReceiveInfo =
            ' From: ' +
            this.incomingFileInfo.peer_name +
            html.newline +
            ' Incoming file: ' +
            this.incomingFileInfo.fileName +
            html.newline +
            ' File type: ' +
            this.incomingFileInfo.fileType +
            html.newline +
            ' File size: ' +
            this.bytesToSize(this.incomingFileInfo.fileSize);
        this.setMsgAvatar('right', this.incomingFileInfo.peer_name);
        this.appendMessage(
            'right',
            this.rightMsgAvatar,
            this.incomingFileInfo.peer_name,
            this.incomingFileInfo.peer_id,
            `${icons.fileReceive} File receive: 
            <br/> 
            <ul>
                <li>From: ${this.incomingFileInfo.peer_name}</li>
                <li>Id: ${this.incomingFileInfo.peer_id}</li>
                <li>Name: ${this.incomingFileInfo.fileName}</li>
                <li>Size: ${this.bytesToSize(this.incomingFileInfo.fileSize)}</li>
            </ul>`,
            'all',
            'all',
        );
        receiveFileInfo.innerText = fileToReceiveInfo;
        receiveFileDiv.style.display = 'inline';
        receiveProgress.max = this.incomingFileInfo.fileSize;
        this.userLog('info', fileToReceiveInfo, 'top-end');
        this.receiveInProgress = true;
    }

    sendFileData(peer_id, broadcast) {
        console.log('Send file ', {
            name: this.fileToSend.name,
            size: this.bytesToSize(this.fileToSend.size),
            type: this.fileToSend.type,
        });

        this.sendInProgress = true;

        sendFileInfo.innerText =
            'File name: ' +
            this.fileToSend.name +
            html.newline +
            'File type: ' +
            this.fileToSend.type +
            html.newline +
            'File size: ' +
            this.bytesToSize(this.fileToSend.size) +
            html.newline;

        sendFileDiv.style.display = 'inline';
        sendProgress.max = this.fileToSend.size;

        this.fileReader = new FileReader();
        let offset = 0;

        this.fileReader.addEventListener('error', (err) => console.error('fileReader error', err));
        this.fileReader.addEventListener('abort', (e) => console.log('fileReader aborted', e));
        this.fileReader.addEventListener('load', (e) => {
            if (!this.sendInProgress) return;

            let data = {
                peer_id: peer_id,
                broadcast: broadcast,
                fileData: e.target.result,
            };
            this.sendFSData(data);
            offset += data.fileData.byteLength;

            sendProgress.value = offset;
            sendFilePercentage.innerText = 'Send progress: ' + ((offset / this.fileToSend.size) * 100).toFixed(2) + '%';

            // send file completed
            if (offset === this.fileToSend.size) {
                this.sendInProgress = false;
                sendFileDiv.style.display = 'none';
                userLog('success', 'The file ' + this.fileToSend.name + ' was sent successfully.', 'top-end');
            }

            if (offset < this.fileToSend.size) readSlice(offset);
        });
        const readSlice = (o) => {
            const slice = this.fileToSend.slice(offset, o + this.chunkSize);
            this.fileReader.readAsArrayBuffer(slice);
        };
        readSlice(0);
    }

    sendFSData(data) {
        if (data) this.socket.emit('file', data);
    }

    abortFileTransfer() {
        if (this.isFileReaderRunning()) {
            this.fileReader.abort();
            sendFileDiv.style.display = 'none';
            this.sendInProgress = false;
            this.socket.emit('fileAbort', {
                peer_name: this.peer_name,
            });
        }
    }

    abortReceiveFileTransfer() {
        const data = { peer_name: this.peer_name };
        this.socket.emit('receiveFileAbort', data);
        setTimeout(() => {
            this.handleFileAbort(data);
        }, 1000);
    }

    hideFileTransfer() {
        receiveFileDiv.style.display = 'none';
    }

    isFileReaderRunning() {
        return this.fileReader && this.fileReader.readyState === 1;
    }

    handleReceiveFileAbort(data) {
        if (this.isFileReaderRunning()) {
            this.userLog('info', data.peer_name + ' ⚠️ aborted file transfer', 'top-end');
            this.fileReader.abort();
            sendFileDiv.style.display = 'none';
            this.sendInProgress = false;
        } else {
            this.handleFileAbort(data);
        }
    }

    handleFileAbort(data) {
        this.receiveBuffer = [];
        this.incomingFileData = [];
        this.receivedSize = 0;
        this.receiveInProgress = false;
        receiveFileDiv.style.display = 'none';
        console.log(data.peer_name + ' aborted the file transfer');
        this.userLog('info', data.peer_name + ' ⚠️ aborted the file transfer', 'top-end');
    }

    handleFile(data) {
        if (!this.receiveInProgress) return;
        this.receiveBuffer.push(data.fileData);
        this.receivedSize += data.fileData.byteLength;
        receiveProgress.value = this.receivedSize;
        receiveFilePercentage.innerText =
            'Receive progress: ' + ((this.receivedSize / this.incomingFileInfo.fileSize) * 100).toFixed(2) + '%';
        if (this.receivedSize === this.incomingFileInfo.fileSize) {
            receiveFileDiv.style.display = 'none';
            this.incomingFileData = this.receiveBuffer;
            this.receiveBuffer = [];
            this.endFileDownload();
        }
    }

    endFileDownload() {
        this.sound('download');

        // save received file into Blob
        const blob = new Blob(this.incomingFileData);
        const file = this.incomingFileInfo.fileName;

        this.incomingFileData = [];

        // if file is image, show the preview
        if (isImageURL(this.incomingFileInfo.fileName)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                Swal.fire({
                    allowOutsideClick: false,
                    background: swalBackground,
                    position: 'center',
                    title: 'Received file',
                    text: this.incomingFileInfo.fileName + ' size ' + this.bytesToSize(this.incomingFileInfo.fileSize),
                    imageUrl: e.target.result,
                    imageAlt: 'mirotalksfu-file-img-download',
                    showDenyButton: true,
                    confirmButtonText: `Save`,
                    denyButtonText: `Cancel`,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                }).then((result) => {
                    if (result.isConfirmed) this.saveBlobToFile(blob, file);
                });
            };
            // blob where is stored downloaded file
            reader.readAsDataURL(blob);
        } else {
            // not img file
            Swal.fire({
                allowOutsideClick: false,
                background: swalBackground,
                position: 'center',
                title: 'Received file',
                text: this.incomingFileInfo.fileName + ' size ' + this.bytesToSize(this.incomingFileInfo.fileSize),
                showDenyButton: true,
                confirmButtonText: `Save`,
                denyButtonText: `Cancel`,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            }).then((result) => {
                if (result.isConfirmed) this.saveBlobToFile(blob, file);
            });
        }
    }

    saveBlobToFile(blob, file) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = file;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    bytesToSize(bytes) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    toHtmlJson(obj) {
        return '<pre>' + JSON.stringify(obj, null, 4) + '</pre>';
    }

    isValidFileName(fileName) {
        const invalidChars = /[\\\/\?\*\|:"<>]/;
        return !invalidChars.test(fileName);
    }

    // ####################################################
    // SHARE VIDEO YOUTUBE - MP4 - WEBM - OGG or AUDIO mp3
    // ####################################################

    handleSV(uid) {
        const words = uid.split('___');
        let peer_id = words[1];
        let btnSv = this.getId(uid);
        if (btnSv) {
            btnSv.addEventListener('click', () => {
                this.shareVideo(peer_id);
            });
        }
    }

    shareVideo(peer_id = 'all') {
        if (this._moderator.media_cant_sharing) {
            return userLog('warning', 'The moderator does not allow you to share any media', 'top-end', 6000);
        }

        this.sound('open');

        Swal.fire({
            background: swalBackground,
            position: 'center',
            imageUrl: image.videoShare,
            title: 'Share a Video or Audio',
            text: 'Paste a Video or Audio URL',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: `Share`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.value) {
                result.value = filterXSS(result.value);
                // if (!this.thereAreParticipants()) {
                //     return userLog('info', 'No participants detected', 'top-end');
                // }
                if (!this.isVideoTypeSupported(result.value)) {
                    return userLog('warning', 'Something wrong, try with another Video or audio URL');
                }
                /*
                    https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3
                */
                let is_youtube = this.getVideoType(result.value) == 'na' ? true : false;
                let video_url = is_youtube ? this.getYoutubeEmbed(result.value) : result.value;
                if (video_url) {
                    let data = {
                        peer_id: peer_id,
                        peer_name: this.peer_name,
                        video_url: video_url,
                        is_youtube: is_youtube,
                        action: 'open',
                    };
                    console.log('Video URL: ', video_url);
                    this.socket.emit('shareVideoAction', data);
                    this.openVideo(data);
                } else {
                    this.userLog('error', 'Not valid video URL', 'top-end', 6000);
                }
            }
        });

        // Take URL from clipboard ex:
        // https://www.youtube.com/watch?v=1ZYbU82GVz4

        navigator.clipboard
            .readText()
            .then((clipboardText) => {
                if (!clipboardText) return false;
                const sanitizedText = filterXSS(clipboardText);
                const inputElement = Swal.getInput();
                if (this.isVideoTypeSupported(sanitizedText) && inputElement) {
                    inputElement.value = sanitizedText;
                }
                return false;
            })
            .catch(() => {
                return false;
            });
    }

    getVideoType(url) {
        if (url.endsWith('.mp4')) return 'video/mp4';
        if (url.endsWith('.mp3')) return 'video/mp3';
        if (url.endsWith('.webm')) return 'video/webm';
        if (url.endsWith('.ogg')) return 'video/ogg';
        return 'na';
    }

    isVideoTypeSupported(url) {
        if (
            url.endsWith('.mp4') ||
            url.endsWith('.mp3') ||
            url.endsWith('.webm') ||
            url.endsWith('.ogg') ||
            url.includes('youtube.com')
        )
            return true;
        return false;
    }

    getYoutubeEmbed(url) {
        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        let match = url.match(regExp);
        return match && match[7].length == 11 ? 'https://www.youtube.com/embed/' + match[7] + '?autoplay=1' : false;
    }

    shareVideoAction(data) {
        const { peer_name, action } = data;

        switch (action) {
            case 'open':
                this.userLog('info', `${peer_name} <i class="fab fa-youtube"></i> opened the video`, 'top-end');
                this.openVideo(data);
                break;
            case 'close':
                this.userLog('info', `${peer_name} <i class="fab fa-youtube"></i> closed the video`, 'top-end');
                this.closeVideo();
                break;
            default:
                break;
        }
    }

    openVideo(data) {
        let d, vb, e, video, pn;
        let peer_name = data.peer_name;
        let video_url = data.video_url + (this.isMobileSafari ? '&enablejsapi=1&mute=1' : ''); // Safari need user interaction
        let is_youtube = data.is_youtube;
        let video_type = this.getVideoType(video_url);
        this.closeVideo();
        show(videoCloseBtn);
        d = document.createElement('div');
        d.className = 'Camera';
        d.id = '__shareVideo';
        vb = document.createElement('div');
        vb.setAttribute('id', '__videoBar');
        vb.className = 'videoMenuBarShare fadein';
        e = this.createButton('__videoExit', 'fas fa-times');
        pn = this.createButton('__pinUnpin', html.pin);
        if (is_youtube) {
            video = document.createElement('iframe');
            video.setAttribute('title', peer_name);
            video.setAttribute(
                'allow',
                'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
            );
            video.setAttribute('frameborder', '0');
            video.setAttribute('allowfullscreen', true);

            // Safari on Mobile needs user interaction to unmute video
            if (this.isMobileSafari) {
                Swal.fire({
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    background: swalBackground,
                    position: 'top',
                    // icon: 'info',
                    imageUrl: image.videoShare,
                    title: 'Unmute Video',
                    text: 'Tap the button below to unmute and play the video with sound.',
                    confirmButtonText: 'Unmute',
                    didOpen: () => {
                        // Focus on the button when the popup opens
                        const unmuteButton = Swal.getConfirmButton();
                        if (unmuteButton) unmuteButton.focus();
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (video && video.contentWindow) {
                            // Unmute the video and play
                            video.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                            video.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                        }
                    }
                });
            }
        } else {
            video = document.createElement('video');
            video.type = video_type;
            video.autoplay = true;
            video.controls = true;
            if (video_type == 'video/mp3') {
                video.poster = image.audio;
            }
        }
        video.setAttribute('id', '__videoShare');
        video.setAttribute('src', video_url);
        video.setAttribute('width', '100%');
        video.setAttribute('height', '100%');
        vb.appendChild(e);
        if (!this.isMobileDevice) vb.appendChild(pn);
        d.appendChild(video);
        d.appendChild(vb);
        this.videoMediaContainer.appendChild(d);
        handleAspectRatio();

        const exitVideoBtn = this.getId(e.id);
        exitVideoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this._moderator.media_cant_sharing) {
                return userLog('warning', 'The moderator does not allow you close this media', 'top-end', 6000);
            }
            this.closeVideo(true);
        });

        this.handlePN(video.id, pn.id, d.id);
        if (!this.isMobileDevice) {
            this.setTippy(pn.id, 'Toggle Pin video player', 'bottom');
            this.setTippy(e.id, 'Close video player', 'bottom');
        }
        console.log('[openVideo] Video-element-count', this.videoMediaContainer.childElementCount);
        this.sound('joined');
    }

    closeVideo(emit = false, peer_id = 'all') {
        if (emit) {
            let data = {
                peer_id: peer_id,
                peer_name: this.peer_name,
                action: 'close',
            };
            this.socket.emit('shareVideoAction', data);
        }
        let shareVideoDiv = this.getId('__shareVideo');
        if (shareVideoDiv) {
            hide(videoCloseBtn);
            shareVideoDiv.parentNode.removeChild(shareVideoDiv);
            //alert(this.isVideoPinned + ' - ' + this.pinnedVideoPlayerId);
            if (this.isVideoPinned && this.pinnedVideoPlayerId == '__videoShare') {
                this.removeVideoPinMediaContainer();
                console.log('Remove pin container due the Video player close');
            }
            handleAspectRatio();
            console.log('[closeVideo] Video-element-count', this.videoMediaContainer.childElementCount);
            this.sound('left');
        }
    }

    // ####################################################
    // ROOM ACTION
    // ####################################################

    roomAction(action, emit = true, popup = true) {
        const data = {
            room_broadcasting: isBroadcastingEnabled,
            room_id: this.room_id,
            peer_id: this.peer_id,
            peer_name: this.peer_name,
            peer_uuid: this.peer_uuid,
            action: action,
            password: null,
        };
        if (emit) {
            switch (action) {
                case 'broadcasting':
                    this.socket.emit('roomAction', data);
                    if (popup) this.roomStatus(action);
                    break;
                case 'lock':
                    if (room_password) {
                        this.socket
                            .request('getPeerCounts')
                            .then(async (res) => {
                                // Only the presenter can lock the room
                                if (isPresenter || res.peerCounts == 1) {
                                    isPresenter = true;
                                    this.peer_info.peer_presenter = isPresenter;
                                    this.getId('isUserPresenter').innerText = isPresenter;
                                    data.password = room_password;
                                    this.socket.emit('roomAction', data);
                                    if (popup) this.roomStatus(action);
                                }
                            })
                            .catch((err) => {
                                console.log('Get peer counts:', err);
                            });
                    } else {
                        Swal.fire({
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showDenyButton: true,
                            background: swalBackground,
                            imageUrl: image.locked,
                            input: 'text',
                            inputPlaceholder: 'Set Room password',
                            confirmButtonText: `OK`,
                            denyButtonText: `Cancel`,
                            showClass: { popup: 'animate__animated animate__fadeInDown' },
                            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                            inputValidator: (pwd) => {
                                if (!pwd) return 'Please enter the Room password';
                                this.RoomPassword = pwd;
                            },
                        }).then((result) => {
                            if (result.isConfirmed) {
                                data.password = this.RoomPassword;
                                this.socket.emit('roomAction', data);
                                this.roomStatus(action);
                            }
                        });
                    }
                    break;
                case 'unlock':
                    this.socket.emit('roomAction', data);
                    if (popup) this.roomStatus(action);
                    break;
                case 'lobbyOn':
                    this.socket.emit('roomAction', data);
                    if (popup) this.roomStatus(action);
                    break;
                case 'lobbyOff':
                    this.socket.emit('roomAction', data);
                    if (popup) this.roomStatus(action);
                    break;
                case 'hostOnlyRecordingOn':
                    this.socket.emit('roomAction', data);
                    if (popup) this.roomStatus(action);
                    break;
                case 'hostOnlyRecordingOff':
                    this.socket.emit('roomAction', data);
                    if (popup) this.roomStatus(action);
                    break;
                case 'isBanned':
                    this.socket.emit('roomAction', data);
                    this.isBanned();
                    break;
                default:
                    break;
            }
        } else {
            this.roomStatus(action);
        }
    }

    roomStatus(action) {
        switch (action) {
            case 'broadcasting':
                this.userLog('info', `${icons.room} BROADCASTING ${isBroadcastingEnabled ? 'On' : 'Off'}`, 'top-end');
                break;
            case 'lock':
                this.sound('locked');
                this.event(_EVENTS.roomLock);
                this.userLog('info', `${icons.lock} Room LOCKED and is invisible on Frontpage and API`, 'top-end');
                break;
            case 'unlock':
                this.event(_EVENTS.roomUnlock);
                this.userLog('info', `${icons.unlock} UNLOCKED the room`, 'top-end');
                break;
            case 'lobbyOn':
                this.event(_EVENTS.lobbyOn);
                this.userLog('info', `${icons.lobby} Lobby is enabled`, 'top-end');
                break;
            case 'lobbyOff':
                this.event(_EVENTS.lobbyOff);
                this.userLog('info', `${icons.lobby} Lobby is disabled`, 'top-end');
                break;
            case 'hostOnlyRecordingOn':
                this.event(_EVENTS.hostOnlyRecordingOn);
                this.userLog('info', `${icons.recording} Host only recording is enabled`, 'top-end');
                break;
            case 'hostOnlyRecordingOff':
                this.event(_EVENTS.hostOnlyRecordingOff);
                this.userLog('info', `${icons.recording} Host only recording is disabled`, 'top-end');
                break;
            default:
                break;
        }
    }

    roomMessage(action, active = false) {
        const status = active ? 'ON' : 'OFF';
        this.sound('switch');
        switch (action) {
            case 'toggleVideoMirror':
                this.userLog('info', `${icons.mirror} Video mirror ${status}`, 'top-end');
                break;
            case 'pitchBar':
                this.userLog('info', `${icons.pitchBar} Audio pitch bar ${status}`, 'top-end');
                break;
            case 'sounds':
                this.userLog('info', `${icons.sounds} Sounds notification ${status}`, 'top-end');
                break;
            case 'ptt':
                this.userLog('info', `${icons.ptt} Push to talk ${status}`, 'top-end');
                break;
            case 'notify':
                this.userLog('info', `${icons.share} Share room on join ${status}`, 'top-end');
                break;
            case 'hostOnlyRecording':
                this.userLog('info', `${icons.recording} Only host recording ${status}`, 'top-end');
                break;
            case 'showChat':
                active
                    ? this.userLog('info', `${icons.chat} Chat will be shown, when you receive a message`, 'top-end')
                    : this.userLog(
                          'info',
                          `${icons.chat} Chat not will be shown, when you receive a message`,
                          'top-end',
                      );
                break;
            case 'speechMessages':
                this.userLog('info', `${icons.speech} Speech incoming messages ${status}`, 'top-end');
                break;
            case 'transcriptShowOnMsg':
                active
                    ? this.userLog(
                          'info',
                          `${icons.transcript} Transcript will be shown, when you receive a message`,
                          'top-end',
                      )
                    : this.userLog(
                          'info',
                          `${icons.transcript} Transcript not will be shown, when you receive a message`,
                          'top-end',
                      );
                break;
            case 'video_start_privacy':
                this.userLog(
                    'info',
                    `${icons.moderator} Moderator: everyone starts in privacy mode ${status}`,
                    'top-end',
                );
                break;
            case 'audio_start_muted':
                this.userLog('info', `${icons.moderator} Moderator: everyone starts muted ${status}`, 'top-end');
                break;
            case 'video_start_hidden':
                this.userLog('info', `${icons.moderator} Moderator: everyone starts hidden ${status}`, 'top-end');
                break;
            case 'audio_cant_unmute':
                this.userLog(
                    'info',
                    `${icons.moderator} Moderator: everyone can't unmute themselves ${status}`,
                    'top-end',
                );
                break;
            case 'video_cant_unhide':
                this.userLog(
                    'info',
                    `${icons.moderator} Moderator: everyone can't unhide themselves ${status}`,
                    'top-end',
                );
                break;
            case 'screen_cant_share':
                this.userLog(
                    'info',
                    `${icons.moderator} Moderator: everyone can't share the screen ${status}`,
                    'top-end',
                );
                break;
            case 'chat_cant_privately':
                this.userLog(
                    'info',
                    `${icons.moderator} Moderator: everyone can't chat privately ${status}`,
                    'top-end',
                );
                break;
            case 'chat_cant_chatgpt':
                this.userLog(
                    'info',
                    `${icons.moderator} Moderator: everyone can't chat with ChatGPT ${status}`,
                    'top-end',
                );
                break;
            case 'media_cant_sharing':
                this.userLog('info', `${icons.moderator} Moderator: everyone can't share media ${status}`, 'top-end');
                break;
            case 'disconnect_all_on_leave':
                this.userLog('info', `${icons.moderator} Moderator: disconnect all on leave room ${status}`, 'top-end');
                break;
            case 'recPrioritizeH264':
                this.userLog('info', `${icons.codecs} Recording prioritize h.264  ${status}`, 'top-end');
                break;
            case 'recSyncServer':
                this.userLog('info', `${icons.recSync} Server Sync Recording ${status}`, 'top-end');
                break;
            case 'customThemeKeep':
                this.userLog('info', `${icons.theme} Custom theme keep ${status}`, 'top-end');
                break;
            default:
                break;
        }
    }

    roomPassword(data) {
        switch (data.password) {
            case 'OK':
                this.joinAllowed(data.room);
                break;
            case 'KO':
                this.roomIsLocked();
                break;
            default:
                break;
        }
    }

    // ####################################################
    // ROOM LOBBY
    // ####################################################

    async roomLobby(data) {
        console.log('LOBBY--->', data);
        switch (data.lobby_status) {
            case 'waiting':
                if (!isRulesActive || isPresenter) {
                    let lobbyTr = '';
                    let peer_id = data.peer_id;
                    let peer_name = data.peer_name;
                    // pass data.peer_info.peer_url to get avatar
                    let peer_url = '';
                    let avatarImg = '';
                    try {
                        peer_url = data.peer_info.peer_url;
                        avatarImg = peer_url;

                        if (!avatarImg) {
                            console.log(' in RoomLobby --> avatarImg: ', avatarImg);
                            isValidLightningAddress(peer_name).then((isValid) => {
                                if (isValid) {
                                    avatarImg = boltavatar;
                                } else {
                                    avatarImg = rc.isValidEmail(peer_name)
                                        ? this.genGravatar(peer_name)
                                        : this.genAvatarSvg(peer_name, 32);
                                }
                            });
                        }
                    } catch (error) {
                        console.log("No peer_url, that's ok", error);
                    }
                    console.log(' in RoomLobby --> avatarImg: ', avatarImg);

                    let lobbyTb = this.getId('lobbyTb');
                    let lobbyAccept = _PEER.acceptPeer;
                    let lobbyReject = _PEER.ejectPeer;
                    let lobbyAcceptId = `${peer_name}___${peer_id}___lobbyAccept`;
                    let lobbyRejectId = `${peer_name}___${peer_id}___lobbyReject`;

                    lobbyTr += `
                    <tr id='${peer_id}'>
                        <td><img src="${avatarImg}" /></td>
                        <td>${peer_name}</td>
                        <td><button id='${lobbyAcceptId}' onclick="rc.lobbyAction(this.id, 'accept')">${lobbyAccept}</button></td>
                        <td><button id='${lobbyRejectId}' onclick="rc.lobbyAction(this.id, 'reject')">${lobbyReject}</button></td>
                    </tr>
                    `;

                    lobbyTb.innerHTML += lobbyTr;
                    lobbyParticipantsCount++;
                    lobbyHeaderTitle.innerText = 'Lobby users (' + lobbyParticipantsCount + ')';
                    if (!isLobbyOpen) this.lobbyToggle();
                    if (!this.isMobileDevice) {
                        setTippy(lobbyAcceptId, 'Accept', 'top');
                        setTippy(lobbyRejectId, 'Reject', 'top');
                    }
                    this.userLog('info', peer_name + ' wants to join the meeting', 'top-end');
                }
                break;
            case 'accept':
                await this.joinAllowed(data.room);
                control.style.display = 'flex';
                bottomButtons.style.display = 'flex';
                this.msgPopup('info', 'Your join meeting was be accepted by moderator');
                break;
            case 'reject':
                this.sound('eject');
                Swal.fire({
                    icon: 'warning',
                    allowOutsideClick: false,
                    allowEscapeKey: true,
                    showDenyButton: false,
                    showConfirmButton: true,
                    background: swalBackground,
                    title: 'Rejected',
                    text: 'Your join meeting was be rejected by moderator',
                    confirmButtonText: `Ok`,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.exit();
                    }
                });
                break;
            default:
                break;
        }
    }

    lobbyAction(id, lobby_status) {
        const words = id.split('___');
        const peer_name = words[0];
        const peer_id = words[1];
        const data = {
            room_id: this.room_id,
            peer_id: peer_id,
            peer_name: peer_name,
            lobby_status: lobby_status,
            broadcast: false,
        };
        this.socket.emit('roomLobby', data);
        const trElem = this.getId(peer_id);
        trElem.parentNode.removeChild(trElem);
        lobbyParticipantsCount--;
        lobbyHeaderTitle.innerText = 'Lobby users (' + lobbyParticipantsCount + ')';
        if (lobbyParticipantsCount == 0) this.lobbyToggle();
    }

    lobbyAcceptAll() {
        if (lobbyParticipantsCount > 0) {
            const data = this.lobbyGetData('accept', this.lobbyGetPeerIds());
            this.socket.emit('roomLobby', data);
            this.lobbyRemoveAll();
        } else {
            this.userLog('info', 'No participants in lobby detected', 'top-end');
        }
    }

    lobbyRejectAll() {
        if (lobbyParticipantsCount > 0) {
            const data = this.lobbyGetData('reject', this.lobbyGetPeerIds());
            this.socket.emit('roomLobby', data);
            this.lobbyRemoveAll();
        } else {
            this.userLog('info', 'No participants in lobby detected', 'top-end');
        }
    }

    lobbyRemoveAll() {
        let tr = lobbyTb.getElementsByTagName('tr');
        for (let i = tr.length - 1; i >= 0; i--) {
            if (tr[i].id && tr[i].id != 'lobbyAll') {
                console.log('REMOVE LOBBY PEER ID ' + tr[i].id);
                if (tr[i] && tr[i].parentElement) {
                    tr[i].parentElement.removeChild(tr[i]);
                }
                lobbyParticipantsCount--;
            }
        }
        lobbyHeaderTitle.innerText = 'Lobby users (' + lobbyParticipantsCount + ')';
        if (lobbyParticipantsCount == 0) this.lobbyToggle();
    }

    lobbyRemoveMe(peer_id) {
        let tr = lobbyTb.getElementsByTagName('tr');
        for (let i = tr.length - 1; i >= 0; i--) {
            if (tr[i].id && tr[i].id == peer_id) {
                console.log('REMOVE LOBBY PEER ID ' + tr[i].id);
                if (tr[i] && tr[i].parentElement) {
                    tr[i].parentElement.removeChild(tr[i]);
                }
                lobbyParticipantsCount--;
            }
        }
        lobbyHeaderTitle.innerText = 'Lobby users (' + lobbyParticipantsCount + ')';
        if (lobbyParticipantsCount == 0) this.lobbyToggle();
    }

    lobbyGetPeerIds() {
        let peers_id = [];
        let tr = lobbyTb.getElementsByTagName('tr');
        for (let i = tr.length - 1; i >= 0; i--) {
            if (tr[i].id && tr[i].id != 'lobbyAll') {
                peers_id.push(tr[i].id);
            }
        }
        return peers_id;
    }

    lobbyGetData(status, peers_id = []) {
        return {
            room_id: this.room_id,
            peer_id: this.peer_id,
            peer_name: this.peer_name,
            peers_id: peers_id,
            lobby_status: status,
            broadcast: true,
        };
    }

    lobbyToggle() {
        if (lobbyParticipantsCount > 0 && !isLobbyOpen) {
            lobby.style.display = 'block';
            lobby.style.top = '50%';
            lobby.style.left = '50%';
            if (this.isMobileDevice) {
                lobby.style.width = '100%';
                lobby.style.height = '100%';
            }
            isLobbyOpen = true;
            this.sound('lobby');
        } else {
            lobby.style.display = 'none';
            isLobbyOpen = false;
        }
    }

    // ####################################################
    // HANDLE ROOM ACTION
    // ####################################################

    roomInvalid() {
        this.sound('alert');
        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: swalBackground,
            imageUrl: image.forbidden,
            title: 'Oops, Room not valid',
            text: 'Invalid Room name! Path traversal pattern detected!',
            confirmButtonText: `OK`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then(() => {
            openURL(`/`);
        });
    }

    userRoomNotAllowed() {
        this.sound('alert');
        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: swalBackground,
            imageUrl: image.forbidden,
            title: 'Oops, Room not allowed',
            text: 'This room is not allowed for this user',
            confirmButtonText: `OK`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then(() => {
            openURL(`/`); // Select the new allowed room name for this user and login to join
        });
    }

    userUnauthorized() {
        this.sound('alert');
        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: swalBackground,
            imageUrl: image.forbidden,
            title: 'Oops, Unauthorized',
            text: 'The host has user authentication enabled',
            confirmButtonText: `Login`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then(() => {
            // Login required to join room
            openURL(`/login/?room=${this.room_id}`);
        });
    }

    unlockTheRoom() {
        if (room_password) {
            this.RoomPassword = room_password;
            let data = {
                action: 'checkPassword',
                password: this.RoomPassword,
            };
            this.socket.emit('roomAction', data);
        } else {
            Swal.fire({
                allowOutsideClick: false,
                allowEscapeKey: false,
                background: swalBackground,
                imageUrl: image.locked,
                title: 'Oops, Room is Locked',
                input: 'text',
                inputPlaceholder: 'Enter the Room password',
                confirmButtonText: `OK`,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                inputValidator: (pwd) => {
                    if (!pwd) return 'Please enter the Room password';
                    this.RoomPassword = pwd;
                },
            }).then(() => {
                let data = {
                    action: 'checkPassword',
                    password: this.RoomPassword,
                };
                this.socket.emit('roomAction', data);
            });
        }
    }

    roomIsLocked() {
        this.sound('eject');
        this.event(_EVENTS.roomLock);
        console.log('Room is Locked, try with another one');
        Swal.fire({
            allowOutsideClick: false,
            background: swalBackground,
            position: 'center',
            imageUrl: image.locked,
            title: 'Oops, Wrong Room Password',
            text: 'The room is locked, try with another one.',
            showDenyButton: false,
            confirmButtonText: `Ok`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.isConfirmed) this.exit();
        });
    }

    waitJoinConfirm() {
        this.sound('lobby');
        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            showDenyButton: true,
            showConfirmButton: false,
            background: swalBackground,
            imageUrl: image.poster,
            title: 'Room has lobby enabled',
            text: 'Asking to join meeting...',
            confirmButtonText: `Ok`,
            denyButtonText: `Leave room`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.isConfirmed) {
                control.style.display = 'none';
                bottomButtons.style.display = 'none';
            } else {
                this.exit();
            }
        });
    }

    isBanned() {
        this.sound('alert');
        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            showDenyButton: false,
            showConfirmButton: true,
            background: swalBackground,
            imageUrl: image.forbidden,
            title: 'Banned',
            text: 'You are banned from this room!',
            confirmButtonText: `Ok`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then(() => {
            this.exit();
        });
    }

    // ####################################################
    // HANDLE AUDIO VOLUME
    // ####################################################

    handleAudioVolume(data) {
        //console.log('Active speaker', data);

        const { peer_id, peer_name, audioVolume } = data;
        const audioVolumeTmp = audioVolume * 10; //10-100

        let audioColorTmp = 'lime';
        if ([50, 60, 70].includes(audioVolumeTmp)) audioColorTmp = 'orange';
        if ([80, 90, 100].includes(audioVolumeTmp)) audioColorTmp = 'red';

        if (!isPitchBarEnabled) {
            const peerVideo = this.getName(peer_id);
            const peerAvatarImg = this.getId(peer_id + '__img');
            if (peerAvatarImg) {
                this.applyBoxShadowEffect(peerAvatarImg, audioColorTmp, 200);
            }
            if (peerVideo && peerVideo.classList.contains('videoCircle')) {
                this.applyBoxShadowEffect(peerVideo, audioColorTmp, 200);
            }
            return;
        }
        const producerAudioBtn = this.getId(peer_id + '_audio');
        const consumerAudioBtn = this.getId(peer_id + '__audio');
        const pbProducer = this.getId(peer_id + '_pitchBar');
        const pbConsumer = this.getId(peer_id + '__pitchBar');
        if (producerAudioBtn) producerAudioBtn.style.color = audioColorTmp;
        if (consumerAudioBtn) consumerAudioBtn.style.color = audioColorTmp;
        if (pbProducer) pbProducer.style.backgroundColor = audioColorTmp;
        if (pbConsumer) pbConsumer.style.backgroundColor = audioColorTmp;
        if (pbProducer) pbProducer.style.height = audioVolumeTmp + '%';
        if (pbConsumer) pbConsumer.style.height = audioVolumeTmp + '%';
        setTimeout(function () {
            audioColorTmp = 'white';
            if (producerAudioBtn) producerAudioBtn.style.color = audioColorTmp;
            if (consumerAudioBtn) consumerAudioBtn.style.color = audioColorTmp;
            if (pbProducer) pbProducer.style.height = '0%';
            if (pbConsumer) pbConsumer.style.height = '0%';
        }, 200);
    }

    applyBoxShadowEffect(element, color, delay = 200) {
        if (element) {
            element.style.boxShadow = `0 0 20px ${color}`;
            setTimeout(() => {
                element.style.boxShadow = 'none';
            }, delay);
        }
    }

    // ####################################################
    // HANDLE PEERS AUDIO VOLUME
    // ####################################################

    handleCV(uid) {
        this.handleVolumeControl(uid, true); // Consumer
    }

    handlePV(uid) {
        this.handleVolumeControl(uid, false); // Producer
    }

    setAV(audioElementId, volumeElementId, volumeValue, isConsumer = false) {
        const volumeInput = this.getId(volumeElementId);
        const audioPlayer = this.getId(audioElementId);
        const volume = volumeValue / 100;

        if (volumeInput && audioPlayer) {
            console.log('Setting audio volume:', volumeValue);
            volumeInput.value = volumeValue;
            if (isConsumer) {
                this.toggleVolumeInput(volumeInput, volumeValue);
            }
            this.setAudioVolume(audioPlayer, volume);
        }
    }

    toggleVolumeInput(volumeInput, volumeValue) {
        /* 
            If the producer has changed the volume from the default value of 100,
            disable the volume input control on the consumer side to prevent further adjustments.
            Otherwise, keep the input enabled if the volume is still at 100.
        */
        volumeInput.disabled = volumeValue < 100;
    }

    handleVolumeControl(uid, isConsumer = true) {
        const words = uid.split('___');
        const volumeInputId = `${words[1]}___pVolume`;
        const audioPlayer = this.getId(isConsumer ? this.audioConsumers.get(volumeInputId) : words[0]);
        const inputElement = this.getId(volumeInputId);

        if (inputElement && audioPlayer) {
            show(inputElement);
            inputElement.value = 100;

            let volumeUpdateTimeout;

            const updateVolume = () => {
                const volume = inputElement.value / 100;
                this.setAudioVolume(audioPlayer, volume);

                // Update producer audio volume
                if (!isConsumer) this.peer_info.peer_audio_volume = inputElement.value;

                // Clear any existing timeout to prevent sending too frequently
                if (volumeUpdateTimeout) {
                    clearTimeout(volumeUpdateTimeout);
                }

                // Set a timeout to send the update after 0.5 second
                volumeUpdateTimeout = setTimeout(() => {
                    // Prepare the command to update peer volume
                    const cmd = {
                        type: 'peerAudio',
                        peer_name: this.peer_name,
                        [isConsumer ? 'audioConsumerId' : 'audioProducerId']: isConsumer
                            ? this.audioConsumers.get(volumeInputId)
                            : this.audioProducerId,
                        volumeInputId: volumeInputId,
                        volume: volume,
                        broadcast: true,
                    };
                    this.emitCmd(cmd);
                }, 500); // 0.5 second delay
            };

            this.addVolumeEventListeners(inputElement, updateVolume);
        }
    }

    setAudioVolume(audioPlayer, volume) {
        if (audioPlayer) {
            if (this.isMobileDevice) {
                audioPlayer.muted = volume === 0;
                if (!audioPlayer.muted) {
                    // Adjust playback rate as volume on mobile devices
                    audioPlayer.playbackRate = Math.max(0.1, volume);
                }
            } else {
                // Set volume directly on desktop devices
                audioPlayer.volume = volume;
            }
        }
    }

    handlePeerAudio(cmd) {
        console.log('handlePeerAudio', { cmd });

        const { volumeInputId, audioProducerId, audioConsumerId, volume } = cmd;

        const volumeInput = this.getId(volumeInputId);

        if (!volumeInput) return;

        volumeInput.value = volume * 100;

        if (audioProducerId) {
            this.handleConsumerAudio(audioProducerId, volume);
            this.toggleVolumeInput(volumeInput, volumeInput.value);
        }

        if (audioConsumerId) this.handleProducerAudio(audioConsumerId, volume);
    }

    handleConsumerAudio(audioProducerId, volume) {
        const consumerAudioId = this.getConsumerIdByProducerId(audioProducerId);
        if (!consumerAudioId) return;

        const consumerAudioPlayer = this.getId(consumerAudioId);
        if (!consumerAudioPlayer) return;

        this.setAudioVolume(consumerAudioPlayer, volume);

        console.log('handleConsumerPeerAudio', { consumerAudioId, consumerAudioPlayer });
    }

    handleProducerAudio(audioConsumerId, volume) {
        const producerAudioId = this.getProducerIdByConsumerId(audioConsumerId);
        if (!producerAudioId) return;

        const producerAudioPlayer = this.getId(producerAudioId);
        if (!producerAudioPlayer) return;

        this.setAudioVolume(producerAudioPlayer, volume);

        console.log('handleProducerPeerAudio', { producerAudioId, producerAudioPlayer });
    }

    addVolumeEventListeners(inputElement, updateVolumeCallback) {
        inputElement.addEventListener('input', updateVolumeCallback);
        inputElement.addEventListener('change', updateVolumeCallback);

        if (this.isMobileDevice) {
            inputElement.addEventListener('touchstart', updateVolumeCallback);
            inputElement.addEventListener('touchmove', updateVolumeCallback);
        }
    }

    // ####################################################
    // HANDLE DOMINANT SPEAKER
    // ###################################################

    handleDominantSpeaker(data) {
        console.log('Dominant Speaker', data);
        const { peer_id } = data;
        const peerNameElement = this.getId(peer_id + '__name');
        if (peerNameElement) {
            peerNameElement.style.color = 'lime';
            setTimeout(function () {
                peerNameElement.style.color = '#FFFFFF';
            }, 5000);
        }
        //...
    }

    // ####################################################
    // HANDLE BAN
    // ###################################################

    handleGL(uid) {
        const words = uid.split('___');
        let peer_id = words[1] + '___pGeoLocation';
        let btnGl = this.getId(uid);
        if (btnGl) {
            btnGl.addEventListener('click', () => {
                isPresenter
                    ? this.askPeerGeoLocation(peer_id)
                    : this.userLog('warning', 'Only the presenter can ask geolocation to the participants', 'top-end');
            });
        }
    }

    // ####################################################
    // HANDLE BAN
    // ###################################################

    handleBAN(uid) {
        const words = uid.split('___');
        let peer_id = words[1] + '___pBan';
        let btnBan = this.getId(uid);
        if (btnBan) {
            btnBan.addEventListener('click', () => {
                isPresenter
                    ? this.peerAction('me', peer_id, 'ban')
                    : this.userLog('warning', 'Only the presenter can ban the participants', 'top-end');
            });
        }
    }

    // ####################################################
    // HANDLE KICK-OUT
    // ###################################################

    handleKO(uid) {
        const words = uid.split('___');
        let peer_id = words[1] + '___pEject';
        let btnKo = this.getId(uid);
        if (btnKo) {
            btnKo.addEventListener('click', () => {
                isPresenter
                    ? this.peerAction('me', peer_id, 'eject')
                    : this.userLog('warning', 'Only the presenter can eject the participants', 'top-end');
            });
        }
    }

    // ####################################################
    // HANDLE VIDEO
    // ###################################################

    handleHA(uid, videoContainerId) {
        let btnHa = this.getId(uid);
        if (btnHa) {
            btnHa.addEventListener('click', (e) => {
                if (isHideMeActive) {
                    return this.userLog(
                        'warning',
                        'To use this feature, please toggle Hide self view before',
                        'top-end',
                        6000,
                    );
                }
                const videoContainer = this.getId(videoContainerId);
                isHideALLVideosActive = !isHideALLVideosActive;
                e.target.style.color = isHideALLVideosActive ? 'lime' : 'white';
                if (isHideALLVideosActive) {
                    videoContainer.style.width = '100%';
                    videoContainer.style.height = '100%';
                    videoContainer.setAttribute('focus-mode', 'true');
                } else {
                    resizeVideoMedia();
                    videoContainer.removeAttribute('focus-mode');
                }
                const children = this.videoMediaContainer.children;
                for (let child of children) {
                    if (child.id != videoContainerId) {
                        child.style.display = isHideALLVideosActive ? 'none' : 'block';
                    }
                }
            });
        }
    }

    handleCM(uid) {
        const words = uid.split('___');
        let peer_id = words[1] + '___pVideo';
        let btnCm = this.getId(uid);
        if (btnCm) {
            btnCm.addEventListener('click', (e) => {
                if (e.target.className === html.videoOn) {
                    isPresenter
                        ? this.peerAction('me', peer_id, 'hide')
                        : this.userLog('warning', 'Only the presenter can hide the participants', 'top-end');
                } else {
                    isPresenter
                        ? this.peerAction('me', peer_id, 'unhide')
                        : this.userLog('warning', 'Only the presenter can unhide the participants', 'top-end');
                }
            });
        }
    }

    // ####################################################
    // HANDLE AUDIO
    // ###################################################

    handleAU(uid) {
        const words = uid.split('__');
        let peer_id = words[0] + '___pAudio';
        let btnAU = this.getId(uid);
        if (btnAU) {
            btnAU.addEventListener('click', (e) => {
                if (e.target.className === html.audioOn) {
                    isPresenter
                        ? this.peerAction('me', peer_id, 'mute')
                        : this.userLog('warning', 'Only the presenter can mute the participants', 'top-end');
                } else {
                    isPresenter
                        ? this.peerAction('me', peer_id, 'unmute')
                        : this.userLog('warning', 'Only the presenter can unmute the participants', 'top-end');
                }
            });
        }
    }

    // ####################################################
    // HANDLE COMMANDS
    // ####################################################

    emitCmd(cmd) {
        this.socket.emit('cmd', cmd);
    }

    handleCmd(cmd) {
        switch (cmd.type) {
            case 'privacy':
                this.setVideoPrivacyStatus(cmd.peer_id, cmd.active);
                break;
            case 'roomEmoji':
                this.handleRoomEmoji(cmd);
                break;
            case 'zapEmoji':
                this.handleZapEmoji(cmd);
                break;
            case 'transcript':
                this.transcription.handleTranscript(cmd);
                break;
            case 'geoLocation':
                this.confirmPeerGeoLocation(cmd);
                break;
            case 'geoLocationOK':
                this.handleGeoPeerLocation(cmd);
                break;
            case 'geoLocationKO':
                this.sound('alert');
                this.userLog('warning', cmd.data, 'top-end', 5000);
                break;
            case 'ejectAll':
                this.exit();
                break;
            case 'peerAudio':
                this.handlePeerAudio(cmd);
                break;
            default:
                break;
            //...
        }
    }

    handleZapEmoji(cmd, duration = 5000) {
        const userEmoji = document.getElementById(`userEmoji`);
        if (userEmoji) {
            const emojiDisplay = document.createElement('div');
            emojiDisplay.className = 'animate__animated animate__backInUp';
            emojiDisplay.style.padding = '10px';
            emojiDisplay.style.fontSize = '3vh';
            emojiDisplay.style.color = '#FFF';
            emojiDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
            emojiDisplay.style.borderRadius = '10px';
            emojiDisplay.innerText = `${cmd.peer_name} zapped ${cmd.emoji}!`;
            userEmoji.appendChild(emojiDisplay);
            setTimeout(() => {
                emojiDisplay.remove();
            }, duration);
        }
    }

    handleRoomEmoji(cmd, duration = 5000) {
        const userEmoji = document.getElementById(`userEmoji`);
        if (userEmoji) {
            const emojiDisplay = document.createElement('div');
            emojiDisplay.className = 'animate__animated animate__backInUp';
            emojiDisplay.style.padding = '10px';
            emojiDisplay.style.fontSize = '2vh';
            emojiDisplay.style.color = '#FFF';
            emojiDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
            emojiDisplay.style.borderRadius = '10px';
            emojiDisplay.style.marginBottom = '5px';
            emojiDisplay.innerText = `${cmd.emoji} ${cmd.peer_name}`;
            userEmoji.appendChild(emojiDisplay);
            setTimeout(() => {
                emojiDisplay.remove();
            }, duration);
        }
    }

    // ####################################################
    // PEER ACTION
    // ####################################################

    async peerAction(from_peer_name, id, action, emit = true, broadcast = false, info = true, msg = '') {
        const words = id.split('___');
        const peer_id = words[0];

        if (emit) {
            // send...
            const data = {
                from_peer_name: this.peer_name,
                from_peer_id: this.peer_id,
                from_peer_uuid: this.peer_uuid,
                to_peer_uuid: '',
                peer_id: peer_id,
                action: action,
                message: '',
                broadcast: broadcast,
            };
            console.log('peerAction', data);

            if (!this.thereAreParticipants()) {
                if (info) return this.userLog('info', 'No participants detected', 'top-end');
            }
            if (!broadcast) {
                switch (action) {
                    case 'mute':
                        const audioMessage =
                            'The participant has been muted, and only they have the ability to unmute themselves';
                        if (isBroadcastingEnabled) {
                            const peerAudioButton = this.getId(data.peer_id + '___pAudio');
                            if (peerAudioButton) {
                                const peerAudioIcon = peerAudioButton.querySelector('i');
                                if (peerAudioIcon && peerAudioIcon.classList.contains('red')) {
                                    if (isRulesActive && isPresenter) {
                                        data.action = 'unmute';
                                        return this.confirmPeerAction(data.action, data);
                                    }
                                    return this.userLog('info', audioMessage, 'top-end');
                                }
                            }
                        } else {
                            const peerAudioStatus = this.getId(data.peer_id + '__audio');
                            if (!peerAudioStatus || peerAudioStatus.className == html.audioOff) {
                                if (isRulesActive && isPresenter) {
                                    data.action = 'unmute';
                                    return this.confirmPeerAction(data.action, data);
                                }
                                return this.userLog('info', audioMessage, 'top-end');
                            }
                        }
                        break;
                    case 'hide':
                        const videoMessage =
                            'The participant is currently hidden, and only they have the option to unhide themselves';
                        if (isBroadcastingEnabled) {
                            const peerVideoButton = this.getId(data.peer_id + '___pVideo');
                            if (peerVideoButton) {
                                const peerVideoIcon = peerVideoButton.querySelector('i');
                                if (peerVideoIcon && peerVideoIcon.classList.contains('red')) {
                                    if (isRulesActive && isPresenter) {
                                        data.action = 'unhide';
                                        return this.confirmPeerAction(data.action, data);
                                    }
                                    return this.userLog('info', videoMessage, 'top-end');
                                }
                            }
                        } else {
                            const peerVideoOff = this.getId(data.peer_id + '__videoOff');
                            if (peerVideoOff) {
                                if (isRulesActive && isPresenter) {
                                    data.action = 'unhide';
                                    return this.confirmPeerAction(data.action, data);
                                }
                                return this.userLog('info', videoMessage, 'top-end');
                            }
                        }
                    case 'stop':
                        const screenMessage =
                            'The participant screen is not shared, only the participant can initiate sharing';
                        const peerScreenButton = this.getId(id);
                        if (peerScreenButton) {
                            const peerScreenStatus = peerScreenButton.querySelector('i');
                            if (peerScreenStatus && peerScreenStatus.classList.contains('red')) {
                                if (isRulesActive && isPresenter) {
                                    data.action = 'start';
                                    return this.confirmPeerAction(data.action, data);
                                }
                                return this.userLog('info', screenMessage, 'top-end');
                            }
                        }
                        break;
                    case 'ban':
                        if (!isRulesActive || isPresenter) {
                            const peer_info = await getRemotePeerInfo(peer_id);
                            console.log('BAN PEER', peer_info);
                            if (peer_info) {
                                data.to_peer_uuid = peer_info.peer_uuid;
                                return this.confirmPeerAction(data.action, data);
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
            this.confirmPeerAction(data.action, data);
        } else {
            // receive...
            const peerActionAllowed = peer_id === this.peer_id || broadcast;
            switch (action) {
                case 'ban':
                    if (peerActionAllowed) {
                        const message = `Will ban you from the room${
                            msg ? `<br><br><span class="red">Reason: ${msg}</span>` : ''
                        }`;
                        this.exit(true);
                        this.sound(action);
                        this.peerActionProgress(from_peer_name, message, 5000, action);
                    }
                    break;
                case 'eject':
                    if (peerActionAllowed) {
                        const message = `Will eject you from the room${
                            msg ? `<br><br><span class="red">Reason: ${msg}</span>` : ''
                        }`;
                        this.exit(true);
                        this.sound(action);
                        this.peerActionProgress(from_peer_name, message, 5000, action);
                    }
                    break;
                case 'mute':
                    if (peerActionAllowed) {
                        if (this.producerExist(mediaType.audio)) {
                            await this.pauseProducer(mediaType.audio);
                            this.updatePeerInfo(this.peer_name, this.peer_id, 'audio', false);
                            this.userLog(
                                'warning',
                                from_peer_name + '  ' + _PEER.audioOff + ' has closed yours audio',
                                'top-end',
                                10000,
                            );
                        }
                    }
                    break;
                case 'unmute':
                    if (peerActionAllowed) {
                        this.peerMediaStartConfirm(
                            mediaType.audio,
                            image.unmute,
                            'Enable Microphone',
                            'Allow the presenter to enable your microphone?',
                        );
                    }
                    break;
                case 'hide':
                    if (peerActionAllowed) {
                        this.closeProducer(mediaType.video);
                        this.userLog(
                            'warning',
                            from_peer_name + '  ' + _PEER.videoOff + ' has closed yours video',
                            'top-end',
                            10000,
                        );
                    }
                    break;
                case 'unhide':
                    if (peerActionAllowed) {
                        this.peerMediaStartConfirm(
                            mediaType.video,
                            image.unhide,
                            'Enable Camera',
                            'Allow the presenter to enable your camera?',
                        );
                    }
                    break;
                case 'stop':
                    if (this.isScreenShareSupported) {
                        if (peerActionAllowed) {
                            this.closeProducer(mediaType.screen);
                            this.userLog(
                                'warning',
                                from_peer_name + '  ' + _PEER.screenOff + ' has closed yours screen share',
                                'top-end',
                                10000,
                            );
                        }
                    }
                    break;
                case 'start':
                    if (peerActionAllowed) {
                        this.peerMediaStartConfirm(
                            mediaType.screen,
                            image.start,
                            'Start Screen share',
                            'Allow the presenter to start your screen share?',
                        );
                    }
                    break;
                default:
                    break;
                //...
            }
        }
    }

    peerMediaStartConfirm(type, imageUrl, title, text) {
        sound('notify');
        Swal.fire({
            background: swalBackground,
            position: 'center',
            imageUrl: imageUrl,
            title: title,
            text: text,
            showDenyButton: true,
            confirmButtonText: `Yes`,
            denyButtonText: `No`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then(async (result) => {
            if (result.isConfirmed) {
                switch (type) {
                    case mediaType.audio:
                        this.producerExist(mediaType.audio)
                            ? await this.resumeProducer(mediaType.audio)
                            : await this.produce(mediaType.audio, microphoneSelect.value);
                        this.updatePeerInfo(this.peer_name, this.peer_id, 'audio', true);
                        break;
                    case mediaType.video:
                        await this.produce(mediaType.video, videoSelect.value);
                        break;
                    case mediaType.screen:
                        await this.produce(mediaType.screen);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    peerActionProgress(tt, msg, time, action = 'na') {
        Swal.fire({
            allowOutsideClick: false,
            background: swalBackground,
            icon: action == 'eject' ? 'warning' : 'success',
            title: tt,
            html: msg,
            timer: time,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
        }).then(() => {
            switch (action) {
                case 'refresh':
                    getRoomParticipants();
                    break;
                case 'ban':
                case 'eject':
                    this.exit();
                    break;
                default:
                    break;
            }
        });
    }

    confirmPeerAction(action, data) {
        console.log('Confirm peer action', action);
        switch (action) {
            case 'ban':
                let banConfirmed = false;
                Swal.fire({
                    background: swalBackground,
                    position: 'center',
                    imageUrl: image.forbidden,
                    title: 'Ban current participant',
                    input: 'text',
                    inputPlaceholder: 'Ban reason',
                    showDenyButton: true,
                    confirmButtonText: `Yes`,
                    denyButtonText: `No`,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            banConfirmed = true;
                            const message = result.value;
                            if (message) data.message = message;
                            this.socket.emit('peerAction', data);
                            let peer = this.getId(data.peer_id);
                            if (peer) {
                                peer.parentNode.removeChild(peer);
                                participantsCount--;
                                refreshParticipantsCount(participantsCount);
                            }
                        }
                    })
                    .then(() => {
                        if (banConfirmed) this.peerActionProgress(action, 'In progress, wait...', 6000, 'refresh');
                    });
                break;
            case 'eject':
                let ejectConfirmed = false;
                let whoEject = data.broadcast ? 'All participants except yourself?' : 'current participant?';
                Swal.fire({
                    background: swalBackground,
                    position: 'center',
                    imageUrl: data.broadcast ? image.users : image.user,
                    title: 'Eject ' + whoEject,
                    input: 'text',
                    inputPlaceholder: 'Eject reason',
                    showDenyButton: true,
                    confirmButtonText: `Yes`,
                    denyButtonText: `No`,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            ejectConfirmed = true;
                            const message = result.value;
                            if (message) data.message = message;
                            if (!data.broadcast) {
                                this.socket.emit('peerAction', data);
                                let peer = this.getId(data.peer_id);
                                if (peer) {
                                    peer.parentNode.removeChild(peer);
                                    participantsCount--;
                                    refreshParticipantsCount(participantsCount);
                                }
                            } else {
                                this.socket.emit('peerAction', data);
                                let actionButton = this.getId(action + 'AllButton');
                                if (actionButton) actionButton.style.display = 'none';
                                participantsCount = 1;
                                refreshParticipantsCount(participantsCount);
                            }
                        }
                    })
                    .then(() => {
                        if (ejectConfirmed) this.peerActionProgress(action, 'In progress, wait...', 6000, 'refresh');
                    });
                break;
            case 'mute':
            case 'unmute':
            case 'hide':
            case 'unhide':
            case 'stop':
            case 'start':
                let muteHideStopConfirmed = false;
                let who = data.broadcast ? 'everyone except yourself?' : 'current participant?';
                let imageUrl, title, text;
                switch (action) {
                    case 'mute':
                        imageUrl = image.mute;
                        title = 'Mute ' + who;
                        text =
                            'Once muted, only the presenter will be able to unmute participants, but participants can unmute themselves at any time';
                        break;
                    case 'unmute':
                        imageUrl = image.unmute;
                        title = 'Unmute ' + who;
                        text = 'A pop-up message will appear to prompt and allow this action.';
                        break;
                    case 'hide':
                        title = 'Hide ' + who;
                        imageUrl = image.hide;
                        text =
                            'Once hidden, only the presenter will be able to unhide participants, but participants can unhide themselves at any time';
                        break;
                    case 'unhide':
                        title = 'Unhide ' + who;
                        imageUrl = image.unhide;
                        text = 'A pop-up message will appear to prompt and allow this action.';
                        break;
                    case 'stop':
                        imageUrl = image.stop;
                        title = 'Stop screen share to the ' + who;
                        text =
                            "Once stopped, only the presenter will be able to start the participants' screens, but participants can start their screens themselves at any time";
                        break;
                    case 'start':
                        imageUrl = image.start;
                        title = 'Start screen share to the ' + who;
                        text = 'A pop-up message will appear to prompt and allow this action.';
                        break;
                    default:
                        break;
                }
                Swal.fire({
                    background: swalBackground,
                    position: 'center',
                    imageUrl: imageUrl,
                    title: title,
                    text: text,
                    showDenyButton: true,
                    confirmButtonText: `Yes`,
                    denyButtonText: `No`,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            muteHideStopConfirmed = true;
                            if (!data.broadcast) {
                                switch (action) {
                                    case 'mute':
                                        let peerAudioButton = this.getId(data.peer_id + '___pAudio');
                                        if (peerAudioButton) peerAudioButton.innerHTML = _PEER.audioOff;
                                        break;
                                    case 'hide':
                                        let peerVideoButton = this.getId(data.peer_id + '___pVideo');
                                        if (peerVideoButton) peerVideoButton.innerHTML = _PEER.videoOff;
                                        break;
                                    case 'stop':
                                        let peerScreenButton = this.getId(data.peer_id + '___pScreen');
                                        if (peerScreenButton) peerScreenButton.innerHTML = _PEER.screenOff;
                                        break;
                                    default:
                                        break;
                                }
                                this.socket.emit('peerAction', data);
                            } else {
                                this.socket.emit('peerAction', data);
                                let actionButton = this.getId(action + 'AllButton');
                                if (actionButton) actionButton.style.display = 'none';
                            }
                        }
                    })
                    .then(() => {
                        if (muteHideStopConfirmed)
                            this.peerActionProgress(action, 'In progress, wait...', 2000, 'refresh');
                    });
                break;
            default:
                break;
            //...
        }
    }

    peerGuestNotAllowed(action) {
        console.log('peerGuestNotAllowed', action);
        switch (action) {
            case 'audio':
                this.userLog('warning', 'Only the presenter can mute/unmute participants', 'top-end');
                break;
            case 'video':
                this.userLog('warning', 'Only the presenter can hide/show participants', 'top-end');
                break;
            case 'screen':
                this.userLog('warning', 'Only the presenter can start/stop the screen of participants', 'top-end');
                break;
            default:
                break;
        }
    }

    // ####################################################
    // SEARCH PEER FILTER
    // ####################################################

    searchPeer() {
        const searchParticipantsFromList = this.getId('searchParticipantsFromList');
        const searchFilter = searchParticipantsFromList.value.toUpperCase();
        const participantsList = this.getId('participantsList');
        const participantsListItems = participantsList.getElementsByTagName('li');

        for (let i = 0; i < participantsListItems.length; i++) {
            const li = participantsListItems[i];
            const participantName = li.getAttribute('data-to-name').toUpperCase();
            const shouldDisplay = participantName.includes(searchFilter);
            li.style.display = shouldDisplay ? '' : 'none';
        }
    }

    // ####################################################
    // FILTER PEER WITH RAISE HAND
    // ####################################################

    toggleRaiseHands() {
        const participantsList = this.getId('participantsList');
        const participantsListItems = participantsList.getElementsByTagName('li');

        for (let i = 0; i < participantsListItems.length; i++) {
            const li = participantsListItems[i];
            const hasPulsateClass = li.querySelector('i.pulsate') !== null;
            const shouldDisplay = (hasPulsateClass && !this.isToggleRaiseHand) || this.isToggleRaiseHand;
            li.style.display = shouldDisplay ? '' : 'none';
        }
        this.isToggleRaiseHand = !this.isToggleRaiseHand;
        setColor(participantsRaiseHandBtn, this.isToggleRaiseHand ? 'lime' : 'white');
    }

    // ####################################################
    // FILTER PEER WITH UNREAD MESSAGES
    // ####################################################

    toggleUnreadMsg() {
        const participantsList = this.getId('participantsList');
        const participantsListItems = participantsList.getElementsByTagName('li');

        for (let i = 0; i < participantsListItems.length; i++) {
            const li = participantsListItems[i];
            const shouldDisplay =
                (li.classList.contains('pulsate') && !this.isToggleUnreadMsg) || this.isToggleUnreadMsg;
            li.style.display = shouldDisplay ? '' : 'none';
        }
        this.isToggleUnreadMsg = !this.isToggleUnreadMsg;
        setColor(participantsUnreadMessagesBtn, this.isToggleUnreadMsg ? 'lime' : 'white');
    }

    // ####################################################
    // SHOW PEER ABOUT AND MESSAGES
    // ####################################################

    showPeerAboutAndMessages(peer_id, peer_name, event = null) {
        this.hidePeerMessages();

        this.chatPeerId = peer_id;
        this.chatPeerName = peer_name;

        const chatAbout = this.getId('chatAbout');
        const participant = this.getId(peer_id);
        const participantsList = this.getId('participantsList');
        const chatPrivateMessages = this.getId('chatPrivateMessages');
        const messagePrivateListItems = chatPrivateMessages.getElementsByTagName('li');
        const participantsListItems = participantsList.getElementsByTagName('li');
        const avatarImg = getParticipantAvatar(peer_name);

        const generateChatAboutHTML = (imgSrc, title, status = 'online', participants = '') => {
            const isSensitiveChat = !['all', 'ChatGPT'].includes(peer_id) && title.length > 15;
            const truncatedTitle = isSensitiveChat ? `${title.substring(0, 10)}*****` : title;
            return `
                <img class="all-participants-img" 
                    style="border: var(--border); width: 43px; margin-right: 5px; cursor: pointer;"
                    id="chatShowParticipantsList" 
                    src="${image.users}"
                    alt="participants"
                    onclick="rc.toggleShowParticipants()" 
                />
                <a data-toggle="modal" data-target="#view_info">
                    <img src="${imgSrc}" alt="avatar" />
                </a>
                <div class="chat-about">
                    <h6 class="mb-0">${truncatedTitle}</h6>
                    <span class="status">
                        <i class="fa fa-circle ${status}"></i> ${status} ${participants}
                    </span>
                </div>
            `;
        };

        // CURRENT SELECTED PEER
        for (let i = 0; i < participantsListItems.length; i++) {
            participantsListItems[i].classList.remove('active');
            participantsListItems[i].classList.remove('pulsate'); // private new message to read
            if (!['all', 'ChatGPT'].includes(peer_id)) {
                // icon private new message to read
                this.getId(`${peer_id}-unread-msg`).classList.add('hidden');
            }
        }
        participant.classList.add('active');

        isChatGPTOn = false;
        console.log('Display messages', peer_id);

        switch (peer_id) {
            case 'ChatGPT':
                if (this._moderator.chat_cant_chatgpt) {
                    return userLog('warning', 'The moderator does not allow you to chat with ChatGPT', 'top-end', 6000);
                }
                isChatGPTOn = true;
                chatAbout.innerHTML = generateChatAboutHTML(image.chatgpt, 'ChatGPT');
                this.getId('chatGPTMessages').style.display = 'block';
                break;
            case 'all':
                chatAbout.innerHTML = generateChatAboutHTML(image.all, 'Public chat', 'online', participantsCount);
                this.getId('chatPublicMessages').style.display = 'block';
                break;
            default:
                if (this._moderator.chat_cant_privately) {
                    return userLog('warning', 'The moderator does not allow you to chat privately', 'top-end', 6000);
                }
                chatAbout.innerHTML = generateChatAboutHTML(avatarImg, peer_name);
                chatPrivateMessages.style.display = 'block';
                for (let i = 0; i < messagePrivateListItems.length; i++) {
                    const li = messagePrivateListItems[i];
                    const itemFromId = li.getAttribute('data-from-id');
                    const itemToId = li.getAttribute('data-to-id');
                    const shouldDisplay = itemFromId.includes(peer_id) || itemToId.includes(peer_id);
                    li.style.display = shouldDisplay ? '' : 'none';
                }
                break;
        }

        if (!this.isMobileDevice) setTippy('chatShowParticipantsList', 'Toggle participants list', 'bottom');

        const clickedElement = event ? event.target : null;
        if (!event || (clickedElement.tagName != 'BUTTON' && clickedElement.tagName != 'I')) {
            if ((this.isMobileDevice || this.isChatPinned) && (!plist || !plist.classList.contains('hidden'))) {
                this.toggleShowParticipants();
            }
        }
    }

    hidePeerMessages() {
        elemDisplay('chatGPTMessages', false);
        elemDisplay('chatPublicMessages', false);
        elemDisplay('chatPrivateMessages', false);
    }

    // ####################################################
    // UPDATE ROOM MODERATOR
    // ####################################################

    updateRoomModerator(data) {
        if (!isRulesActive || isPresenter) {
            const moderator = this.getModeratorData(data);
            this.socket.emit('updateRoomModerator', moderator);
        }
    }

    updateRoomModeratorALL(data) {
        if (!isRulesActive || isPresenter) {
            const moderator = this.getModeratorData(data);
            this.socket.emit('updateRoomModeratorALL', moderator);
        }
    }

    getModeratorData(data) {
        return {
            peer_name: this.peer_name,
            peer_uuid: this.peer_uuid,
            moderator: data,
        };
    }

    handleUpdateRoomModerator(data) {
        switch (data.type) {
            case 'audio_cant_unmute':
                this._moderator.audio_cant_unmute = data.status;
                this._moderator.audio_cant_unmute ? hide(tabAudioDevicesBtn) : show(tabAudioDevicesBtn);
                rc.roomMessage('audio_cant_unmute', data.status);
                break;
            case 'video_cant_unhide':
                this._moderator.video_cant_unhide = data.status;
                this._moderator.video_cant_unhide ? hide(tabVideoDevicesBtn) : show(tabVideoDevicesBtn);
                rc.roomMessage('video_cant_unhide', data.status);
                break;
            case 'screen_cant_share':
                this._moderator.screen_cant_share = data.status;
                rc.roomMessage('screen_cant_share', data.status);
                break;
            case 'chat_cant_privately':
                this._moderator.chat_cant_privately = data.status;
                rc.roomMessage('chat_cant_privately', data.status);
                break;
            case 'chat_cant_chatgpt':
                this._moderator.chat_cant_chatgpt = data.status;
                rc.roomMessage('chat_cant_chatgpt', data.status);
                break;
            case 'media_cant_sharing':
                this._moderator.media_cant_sharing = data.status;
                rc.roomMessage('media_cant_sharing', data.status);
                break;
            default:
                break;
        }
    }

    handleUpdateRoomModeratorALL(data) {
        this._moderator = data;
        console.log('Update Room Moderator data all', this._moderator);
    }

    getModerator() {
        console.log('Get Moderator', this._moderator);
        return this._moderator;
    }

    // ####################################################
    // UPDATE PEER INFO
    // ####################################################

    updatePeerInfo(peer_name, peer_id, type, status, emit = true, presenter = false) {
        if (emit) {
            switch (type) {
                case 'audio':
                    this.setIsAudio(peer_id, status);
                    break;
                case 'video':
                    this.setIsVideo(status);
                    break;
                case 'screen':
                    this.setIsScreen(status);
                    break;
                case 'hand':
                    this.peer_info.peer_hand = status;
                    let peer_hand = this.getPeerHandBtn(peer_id);
                    if (status) {
                        if (peer_hand) peer_hand.style.display = 'flex';
                        this.event(_EVENTS.raiseHand);
                        this.sound('raiseHand');
                    } else {
                        if (peer_hand) peer_hand.style.display = 'none';
                        this.event(_EVENTS.lowerHand);
                    }
                    break;
                default:
                    break;
            }
            const data = {
                room_id: this.room_id,
                peer_name: peer_name,
                peer_id: peer_id,
                type: type,
                status: status,
                broadcast: true,
            };
            this.socket.emit('updatePeerInfo', data);
        } else {
            const canUpdateMediaStatus = !isBroadcastingEnabled || (isBroadcastingEnabled && presenter);
            switch (type) {
                case 'audio':
                    if (canUpdateMediaStatus) this.setPeerAudio(peer_id, status);
                    break;
                case 'video':
                    break;
                case 'screen':
                    break;
                case 'hand':
                    let peer_hand = this.getPeerHandBtn(peer_id);
                    if (status) {
                        if (peer_hand) peer_hand.style.display = 'flex';
                        this.userLog(
                            'warning',
                            peer_name + '  ' + _PEER.raiseHand + ' has raised the hand',
                            'top-end',
                            10000,
                        );
                        this.sound('raiseHand');
                    } else {
                        if (peer_hand) peer_hand.style.display = 'none';
                    }
                    break;
                default:
                    break;
            }
        }
        if (isParticipantsListOpen) getRoomParticipants();
    }

    checkPeerInfoStatus(peer_info) {
        let peer_id = peer_info.peer_id;
        let peer_hand_status = peer_info.peer_hand;
        if (peer_hand_status) {
            let peer_hand = this.getPeerHandBtn(peer_id);
            if (peer_hand) peer_hand.style.display = 'flex';
        }
        //...
    }

    popupPeerInfo(id, peer_info) {
        if (this.showPeerInfo && !this.isMobileDevice) {
            //console.log('POPUP_PEER_INFO', peer_info);

            // Destructuring peer_info
            const {
                join_data_time,
                peer_name,
                peer_presenter,
                is_desktop_device,
                is_mobile_device,
                is_tablet_device,
                is_ipad_pro_device,
                os_name,
                os_version,
                browser_name,
                browser_version,
            } = peer_info;

            const emojiPeerInfo = [
                { label: 'Join Time', value: join_data_time, emoji: '⏰' },
                { label: 'Name', value: peer_name, emoji: '👤' },
                { label: 'Presenter', value: peer_presenter ? 'Yes' : 'No', emoji: peer_presenter ? '⭐' : '🎤' },
                { label: 'Desktop Device', value: is_desktop_device ? 'Yes' : 'No', emoji: '💻' },
                { label: 'Mobile Device', value: is_mobile_device ? 'Yes' : 'No', emoji: '📱' },
                { label: 'Tablet Device', value: is_tablet_device ? 'Yes' : 'No', emoji: '📲' },
                { label: 'iPad Pro', value: is_ipad_pro_device ? 'Yes' : 'No', emoji: '📱' },
                { label: 'OS', value: `${os_name} ${os_version}`, emoji: '🖥️' },
                { label: 'Browser', value: `${browser_name} ${browser_version}`, emoji: '🌐' },
            ];

            // Format the peer info into a structured string
            const peerInfoFormatted = emojiPeerInfo
                .map((item) => `${item.emoji} <b>${item.label}:</b> ${item.value}`)
                .join('<br/>');

            // Apply the improved Tippy.js tooltip
            this.setTippy(
                id,
                `<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">${peerInfoFormatted}</div>`,
                'top-start',
                true,
            );
        }
    }

    // ####################################################
    // HANDLE PEER GEOLOCATION
    // ####################################################

    askPeerGeoLocation(id) {
        const words = id.split('___');
        const peer_id = words[0];
        const cmd = {
            type: 'geoLocation',
            from_peer_name: this.peer_name,
            from_peer_id: this.peer_id,
            peer_id: peer_id,
            broadcast: false,
        };
        this.emitCmd(cmd);
        this.peerActionProgress(
            'Geolocation',
            'Geolocation requested. Please wait for confirmation...',
            6000,
            'geolocation',
        );
    }

    sendPeerGeoLocation(peer_id, type, data) {
        const cmd = {
            type: type,
            from_peer_name: this.peer_name,
            from_peer_id: this.peer_id,
            peer_id: peer_id,
            data: data,
            broadcast: false,
        };
        this.emitCmd(cmd);
    }

    confirmPeerGeoLocation(cmd) {
        this.sound('notify');
        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: swalBackground,
            imageUrl: image.geolocation,
            position: 'center',
            title: 'Geo Location',
            html: `Would you like to share your location to ${cmd.from_peer_name}?`,
            showDenyButton: true,
            confirmButtonText: `Yes`,
            denyButtonText: `No`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            result.isConfirmed ? this.getPeerGeoLocation(cmd.from_peer_id) : this.denyPeerGeoLocation(cmd.from_peer_id);
        });
    }

    getPeerGeoLocation(peer_id) {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const geoLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    console.log('GeoLocation --->', geoLocation);

                    rc.sendPeerGeoLocation(peer_id, 'geoLocationOK', geoLocation);
                    // openURL(`https://www.openstreetmap.org/?mlat=${geoLocation.latitude}&mlon=${geoLocation.longitude}`, true);
                    // openURL(`http://maps.apple.com/?ll=${geoLocation.latitude},${geoLocation.longitude}`, true);
                    // openURL(`https://www.google.com/maps/search/?api=1&query=${geoLocation.latitude},${geoLocation.longitude}`, true);
                },
                function (error) {
                    let geoError = error;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            geoError = 'User denied the request for Geolocation';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            geoError = 'Location information is unavailable';
                            break;
                        case error.TIMEOUT:
                            geoError = 'The request to get user location timed out';
                            break;
                        case error.UNKNOWN_ERROR:
                            geoError = 'An unknown error occurred';
                            break;
                        default:
                            break;
                    }
                    rc.sendPeerGeoLocation(peer_id, 'geoLocationKO', `${rc.peer_name}: ${geoError}`);
                    rc.userLog('warning', geoError, 'top-end', 5000);
                },
            );
        } else {
            rc.sendPeerGeoLocation(
                peer_id,
                'geoLocationKO',
                `${rc.peer_name}: Geolocation is not supported by this browser`,
            );
            rc.userLog('warning', 'Geolocation is not supported by this browser', 'top-end', 5000);
        }
    }

    denyPeerGeoLocation(peer_id) {
        rc.sendPeerGeoLocation(peer_id, 'geoLocationKO', `${rc.peer_name}: Has declined permission for geolocation`);
    }

    handleGeoPeerLocation(cmd) {
        const geoLocation = cmd.data;
        this.sound('notify');
        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: swalBackground,
            imageUrl: image.geolocation,
            position: 'center',
            title: 'Geo Location',
            html: `Would you like to open ${cmd.from_peer_name} geolocation?`,
            showDenyButton: true,
            confirmButtonText: `Yes`,
            denyButtonText: `No`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.isConfirmed) {
                // openURL(`https://www.openstreetmap.org/?mlat=${geoLocation.latitude}&mlon=${geoLocation.longitude}`, true);
                // openURL(`http://maps.apple.com/?ll=${geoLocation.latitude},${geoLocation.longitude}`, true);
                openURL(
                    `https://www.google.com/maps/search/?api=1&query=${geoLocation.latitude},${geoLocation.longitude}`,
                    true,
                );
            }
        });
    }

    // ##############################################
    // HeyGen Video AI
    // ##############################################

    getAvatarList() {
        this.msgPopup('toast', 'Please hold on, we are processing the avatar lists...', 10000);
        this.socket
            .request('getAvatarList')
            .then(function (completion) {
                const avatarVideoAIPreview = document.getElementById('avatarVideoAIPreview');
                const avatarVideoAIcontainer = document.getElementById('avatarVideoAIcontainer');
                avatarVideoAIcontainer.innerHTML = ''; // cleanup the avatar container

                const excludedIds = [
                    'josh_lite3_20230714',
                    'josh_lite_20230714',
                    'Lily_public_lite1_20230601',
                    'Brian_public_lite1_20230601',
                    'Brian_public_lite2_20230601',
                    'Eric_public_lite1_20230601',
                    'Mido-lite-20221128',
                ];

                const freeAvatars = [
                    'Kristin in Black Suit',
                    'Angela in Black Dress',
                    'Kayla in Casual Suit',
                    'Anna in Brown T-shirt',
                    'Anna in White T-shirt',
                    'Briana in Brown suit',
                    'Justin in White Shirt',
                    'Leah in Black Suit',
                    'Wade in Black Jacket',
                    'Tyler in Casual Suit',
                    'Tyler in Shirt',
                    'Tyler in Suit',
                    'Edward in Blue Shirt',
                    'Susan in Black Shirt',
                    'Monica in Sleeveless',
                ];

                //console.log('AVATARS LISTS', completion.response.avatars);
                completion.response.avatars.forEach((avatar) => {
                    avatar.avatar_states.forEach((avatarUi) => {
                        if (
                            !excludedIds.includes(avatarUi.id) &&
                            (showFreeAvatars ? freeAvatars.includes(avatarUi.pose_name) : true)
                        ) {
                            const div = document.createElement('div');
                            div.style.float = 'left';
                            div.style.padding = '5px';
                            div.style.width = '100px';
                            div.style.height = '200px';
                            const img = document.createElement('img');
                            const hr = document.createElement('hr');
                            const label = document.createElement('label');
                            const textContent = document.createTextNode(avatarUi.pose_name);
                            label.appendChild(textContent);
                            //label.style.fontSize = '12px';
                            img.setAttribute('id', avatarUi.id);
                            img.setAttribute('class', 'avatarImg');
                            img.setAttribute('src', avatarUi.normal_thumbnail_medium);
                            img.setAttribute('width', '100%');
                            img.setAttribute('height', 'auto');
                            img.setAttribute('alt', avatarUi.pose_name);
                            img.setAttribute('style', 'cursor:pointer; padding: 2px; border-radius: 5px;');
                            img.setAttribute(
                                'avatarData',
                                avatarUi.id +
                                    '|' +
                                    avatar.name +
                                    '|' +
                                    avatarUi.default_voice.free.voice_id +
                                    '|' +
                                    avatarUi.video_url.grey,
                            );
                            img.onclick = () => {
                                const avatarImages = document.querySelectorAll('.avatarImg');
                                avatarImages.forEach((image) => {
                                    image.style.border = 'none';
                                });
                                img.style.border = 'var(--border)';
                                const avatarData = img.getAttribute('avatarData');
                                const avatarDataArr = avatarData.split('|');
                                VideoAI.avatarId = avatarDataArr[0];
                                VideoAI.avatarName = avatarDataArr[1];
                                //VideoAI.avatarVoice = avatarDataArr[2] ? avatarDataArr[2] : ''; use the default one

                                avatarVideoAIPreview.setAttribute('src', avatarUi.video_url.grey);
                                avatarVideoAIPreview.play();

                                console.log('Avatar image click event', {
                                    avatar,
                                    avatarUi,
                                    avatarDataArr,
                                });
                            };
                            div.append(img);
                            div.append(hr);
                            div.append(label);
                            avatarVideoAIcontainer.append(div);

                            // Show the first available free avatar
                            if (showFreeAvatars && avatarUi.pose_name === 'Kristin in Black Suit') {
                                avatarVideoAIPreview.setAttribute('src', avatarUi.video_url.grey);
                                avatarVideoAIPreview.playsInline = true;
                                avatarVideoAIPreview.autoplay = true;
                                avatarVideoAIPreview.controls = true;
                                avatarVideoAIPreview.volume = 0.5;
                            }
                        }
                    });
                });
            })
            .catch((err) => {
                console.error('Video AI getAvatarList error:', err);
                this.userLog('warning', 'Video AI getAvatarList error:\n' + err, 'top-end', 6000);
                this.getId('tabVideoAI').style.display = 'none';
                this.getId('tabVideoAIBtn').style.display = 'none';
                this.getId('tabRoomBtn').click();
            });
    }

    getVoiceList() {
        this.socket
            .request('getVoiceList')
            .then(function (completion) {
                const selectElement = document.getElementById('avatarVoiceIDs');
                selectElement.innerHTML = '<option value="">Select Avatar Voice</option>'; // Reset options with default

                // Sort the list alphabetically by language
                const sortedList = completion.response.list.sort((a, b) => a.language.localeCompare(b.language));

                sortedList.forEach((flag) => {
                    // console.log('flag', flag);
                    const { is_paid, voice_id, language, display_name, gender } = flag;
                    if (showFreeAvatars ? is_paid == false : true) {
                        const option = document.createElement('option');
                        option.value = voice_id;
                        option.text = `${language}, ${display_name} (${gender})`; // You can customize the display text
                        selectElement.appendChild(option);
                    }
                });

                // Event listener for changes on select element
                selectElement.addEventListener('change', (event) => {
                    const selectedVoiceID = event.target.value;
                    const selectedPreviewURL = completion.response.list.find(
                        (flag) => flag.voice_id === selectedVoiceID,
                    )?.preview?.movio;
                    VideoAI.avatarVoice = selectedVoiceID ? selectedVoiceID : null;
                    if (selectedPreviewURL) {
                        const avatarPreviewAudio = document.getElementById('avatarPreviewAudio');
                        avatarPreviewAudio.src = selectedPreviewURL;
                        avatarPreviewAudio.play();
                    }
                });
            })
            .catch((err) => {
                console.error('Video AI getVoiceList error:', err);
            });
    }

    async handleVideoAI() {
        const vb = document.createElement('div');
        vb.setAttribute('id', 'avatar__vb');
        vb.className = 'videoAvatarMenuBar fadein';

        const interrupt = this.createButton('avatar__interrupt', html.stop);
        const fs = this.createButton('avatar__fs', html.fullScreen);
        const pin = this.createButton('avatar__pin', html.pin);
        const ss = this.createButton('avatar__stopSession', html.kickOut);

        const avatarName = document.createElement('div');
        const an = document.createElement('span');
        an.id = 'avatar__name';
        an.className = html.userName;
        an.innerText = VideoAI.avatarName;

        // Create video container element
        this.videoAIContainer = document.createElement('div');
        this.videoAIContainer.className = 'Camera';
        this.videoAIContainer.id = 'videoAIContainer';

        // Create canvas element for video rendering
        this.canvasAIElement = document.createElement('canvas');
        this.canvasAIElement.className = '';
        this.canvasAIElement.id = 'canvasAIElement';
        this.canvasAIElement.style.objectFit = this.isMobileDevice ? 'cover' : 'contain';

        // Create video element for avatar
        this.videoAIElement = document.createElement('video');
        this.videoAIElement.id = 'videoAIElement';
        this.videoAIElement.setAttribute('playsinline', true);
        this.videoAIElement.autoplay = true;
        this.videoAIElement.className = '';
        this.videoAIElement.poster = image.poster;
        this.videoAIElement.style.objectFit = this.isMobileDevice ? 'cover' : 'contain';

        // Append elements to video container
        vb.appendChild(ss);
        this.isVideoFullScreenSupported && vb.appendChild(fs);
        vb.appendChild(interrupt);
        !this.isMobileDevice && vb.appendChild(pin);
        avatarName.appendChild(an);

        this.videoAIContainer.appendChild(this.videoAIElement);
        VideoAI.virtualBackground && this.videoAIContainer.appendChild(this.canvasAIElement);
        this.videoAIContainer.appendChild(vb);
        this.videoAIContainer.appendChild(avatarName);
        this.videoMediaContainer.appendChild(this.videoAIContainer);

        // Hide canvas initially
        this.canvasAIElement.hidden = true;

        // Use video avatar virtual background
        if (VideoAI.virtualBackground) {
            this.isVideoFullScreenSupported && this.handleFS(this.canvasAIElement.id, fs.id);
            this.handlePN(this.canvasAIElement.id, pin.id, this.videoAIContainer.id, true, true);
        } else {
            this.isVideoFullScreenSupported && this.handleFS(this.videoAIElement.id, fs.id);
            this.handlePN(this.videoAIElement.id, pin.id, this.videoAIContainer.id, true, true);
        }

        interrupt.onclick = () => {
            this.streamingInterrupt();
        };

        ss.onclick = () => {
            this.stopSession();
        };

        if (!this.isMobileDevice) {
            this.setTippy(pin.id, 'Toggle Pin', 'bottom');
            this.setTippy(interrupt.id, 'Interrupt avatar speaking', 'bottom');
            this.setTippy(fs.id, 'Toggle full screen', 'bottom');
            this.setTippy(ss.id, 'Stop VideoAI session', 'bottom');
        }

        handleAspectRatio();

        await this.streamingNew();
    }

    async streamingNew() {
        try {
            const { quality, avatarId, avatarVoice } = VideoAI;

            const response = await this.socket.request('streamingNew', {
                quality: quality,
                avatar_id: avatarId,
                voice_id: avatarVoice,
            });

            if (!response || Object.keys(response).length === 0 || response.error) {
                this.userLog('error', 'Error to creating the avatar', 'top-end');
                this.stopSession();
                return;
            }

            if (response.response.code !== 100) {
                this.userLog('warning', response.response.message, 'top-end');
                this.stopSession();
                return;
            }

            VideoAI.info = response.response.data;

            console.log('Video AI streamingNew', VideoAI);

            const { sdp, ice_servers2 } = VideoAI.info;

            await this.setupPeerConnection(sdp, ice_servers2);

            await this.startSession();
        } catch (error) {
            this.userLog('error', error, 'top-end');
            console.error('Video AI streamingNew error:', error);
            this.stopSession();
        }
    }

    async setupPeerConnection(sdp, iceServers) {
        this.peerConnection = new RTCPeerConnection({ iceServers: iceServers });

        this.peerConnection.ontrack = (event) => {
            if (event.track.kind === 'audio' || event.track.kind === 'video') {
                this.videoAIElement.srcObject = event.streams[0];
            }
        };

        this.peerConnection.ondatachannel = (event) => {
            event.channel.onmessage = this.handleVideoAIMessage;
        };

        const remoteDescription = new RTCSessionDescription(sdp);
        this.peerConnection.setRemoteDescription(remoteDescription);
    }

    handleVideoAIMessage(event) {
        console.log('handleVideoAIMessage', event.data);
    }

    async startSession() {
        if (!VideoAI.info) {
            this.userLog('warning', 'Please create a connection first', 'top-end');
            return;
        }
        this.userLog('info', 'Starting session... please wait', 'top-end');
        try {
            const answer = await this.peerConnection.createAnswer();

            await this.peerConnection.setLocalDescription(answer);

            await this.streamingStart(VideoAI.info.session_id, answer);

            this.peerConnection.onicecandidate = async ({ candidate }) => {
                if (candidate) {
                    await this.streamingICE(candidate);
                }
            };
        } catch (error) {
            this.userLog('error', error, 'top-end');
            console.error('Video AI startSession error:', error);
        }
    }

    async streamingICE(candidate) {
        try {
            const response = await this.socket.request('streamingICE', {
                session_id: VideoAI.info.session_id,
                candidate: candidate.toJSON(),
            });

            if (response && !response.error) {
                return response.response;
            }
        } catch (error) {
            console.error('Video AI streamingICE error:', error);
        }
    }

    async streamingStart(sessionId, sdp) {
        try {
            const response = await this.socket.request('streamingStart', {
                session_id: sessionId,
                sdp: sdp,
            });

            if (!response || response.error) return;

            this.startRendering();

            this.isMobileDevice ? this.handleMobileVideoAiChat() : this.handleDesktopVideoAiChat();

            VideoAI.active = true;

            this.userLog('info', 'Video AI streaming started', 'top-end');
        } catch (error) {
            console.error('Video AI streamingStart error:', error);
        }
    }

    handleDesktopVideoAiChat() {
        if (!this.isChatOpen) {
            this.toggleChat();
        }
        this.sendMessageToVideoAi();
    }

    handleMobileVideoAiChat() {
        if (this.videoMediaContainer.childElementCount <= 2) {
            isHideMeActive = !isHideMeActive;
            this.handleHideMe();
        }
        setTimeout(() => {
            this.streamingTask(
                `Welcome to ${BRAND.app.name}! Please Open the Chat and navigate to the ChatGPT section. Feel free to ask me any questions you have.`,
            );
        }, 2000);
    }

    sendMessageToVideoAi() {
        const tasks = [
            { delay: 1000, action: () => this.chatPin() },
            { delay: 1200, action: () => this.toggleShowParticipants() },
            { delay: 1400, action: () => this.showPeerAboutAndMessages('ChatGPT', 'ChatGPT') },
            { delay: 1600, action: () => this.streamingTask(`Welcome to ${BRAND.app.name}!`) },
            {
                delay: 2000,
                action: () => {
                    chatMessage.value = 'Hello!';
                    this.sendMessage();
                },
            },
        ];
        this.executeTasksSequentially(tasks);
    }

    executeTasksSequentially(tasks) {
        tasks.reduce((promise, task) => {
            return promise.then(
                () =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            task.action();
                            resolve();
                        }, task.delay);
                    }),
            );
        }, Promise.resolve());
    }

    streamingTask(message) {
        if (VideoAI.enabled && VideoAI.active && message) {
            const response = this.socket.request('streamingTask', {
                session_id: VideoAI.info.session_id,
                text: message,
            });
            console.log('Video AI streamingTask', response);
        }
    }

    streamingInterrupt() {
        if (VideoAI.enabled && VideoAI.active && VideoAI.info.session_id) {
            const response = this.socket.request('streamingInterrupt', { session_id: VideoAI.info.session_id });
            console.log('Video AI streamingInterrupt', response);
        }
    }

    startRendering() {
        if (!VideoAI.virtualBackground) return;

        let frameCounter = 0;

        this.renderAIToken = Math.trunc(1e9 * Math.random());
        frameCounter = this.renderAIToken;

        this.videoAIElement.hidden = true;
        this.canvasAIElement.hidden = false;

        const context = this.canvasAIElement.getContext('2d', { willReadFrequently: true });

        const renderFrame = () => {
            if (this.renderAIToken !== frameCounter) return;

            if (this.videoAIElement.videoWidth === 0 || this.videoAIElement.videoHeight === 0) {
                requestAnimationFrame(renderFrame);
                return;
            }

            this.canvasAIElement.width = this.videoAIElement.videoWidth;
            this.canvasAIElement.height = this.videoAIElement.videoHeight;

            context.drawImage(this.videoAIElement, 0, 0, this.canvasAIElement.width, this.canvasAIElement.height);

            const imageData = context.getImageData(0, 0, this.canvasAIElement.width, this.canvasAIElement.height);
            const pixels = imageData.data;

            for (let i = 0; i < pixels.length; i += 4) {
                if (shouldHidePixel([pixels[i], pixels[i + 1], pixels[i + 2]])) {
                    pixels[i + 3] = 0; // Make pixel transparent
                }
            }

            function shouldHidePixel([r, g, b]) {
                const greenThreshold = 90;
                const redThreshold = 90;
                const blueThreshold = 90;
                return g > greenThreshold && r < redThreshold && b < blueThreshold;
            }

            context.putImageData(imageData, 0, 0);
            requestAnimationFrame(renderFrame);
        };

        // Ensure the video element is ready before starting rendering
        const startRenderingWhenReady = () => {
            if (this.videoAIElement.readyState >= 2) {
                // HAVE_CURRENT_DATA
                renderFrame();
            } else {
                this.videoAIElement.addEventListener('loadeddata', renderFrame, { once: true });
            }
        };

        // Set the background of the canvas' parent element to an image or color of your choice
        this.canvasAIElement.parentElement.style.background = `url("${VideoAI.background}") center / cover no-repeat`;

        setTimeout(startRenderingWhenReady, 1000);
    }

    stopRendering() {
        this.renderAIToken = null;
        if (isHideMeActive) {
            isHideMeActive = !isHideMeActive;
            this.handleHideMe();
        }
    }

    stopSession() {
        const videoAIElement = this.getId('videoAIElement');
        if (videoAIElement) {
            videoAIElement.parentNode.removeChild(videoAIElement);
        }
        const videoAIContainer = this.getId('videoAIContainer');
        if (videoAIContainer) {
            videoAIContainer.parentNode.removeChild(videoAIContainer);
            const removeVideoAI = ['videoAIElement', 'canvasAIElement'];
            if (this.isVideoPinned && removeVideoAI.includes(this.pinnedVideoPlayerId)) {
                this.removeVideoPinMediaContainer();
            }
        }

        handleAspectRatio();

        this.streamingStop();
    }

    streamingStop() {
        if (this.peerConnection) {
            console.info('Video AI streamingStop peerConnection close done!');
            this.peerConnection.close();
            this.peerConnection = null;
        }
        if (VideoAI.info && VideoAI.info.session_id) {
            const sessionId = VideoAI.info.session_id;
            this.socket
                .request('streamingStop', { session_id: sessionId })
                .then(() => {
                    console.info('Video AI streamingStop done!');
                })
                .catch((error) => {
                    console.error('Video AI streamingStop error:', error);
                });
        }

        this.stopRendering();

        VideoAI.active = false;
    }

    // ##############################################
    // RTMP from FILE
    // ##############################################

    getRTMP() {
        this.socket.request('getRTMP').then(function (filenames) {
            console.log('RTMP files', filenames);
            if (filenames.length === 0) {
                const fileNameDiv = rc.getId('file-name');
                fileNameDiv.textContent = 'No file found to stream';
                //elemDisplay('startRtmpButton', false);
            }

            //const f = Array.from({ length: 20 }, (_, index) => `My-file-video-to-stream-to-rtmp-server ${index + 1}`);

            const fileListTbody = rc.getId('file-list');
            fileListTbody.innerHTML = '';

            filenames.forEach((filename) => {
                const fileRow = document.createElement('tr');
                const fileCell = document.createElement('td');
                fileCell.textContent = filename;
                fileCell.className = 'file-item';
                fileCell.onclick = () => showFilename(fileCell, filename);
                fileRow.appendChild(fileCell);
                fileListTbody.appendChild(fileRow);
            });

            function showFilename(clickedItem, filename) {
                const fileNameDiv = rc.getId('file-name');
                fileNameDiv.textContent = `Selected file: ${filename}`;
                rc.selectedRtmpFilename = filename;
                const fileItems = document.querySelectorAll('.file-item');
                fileItems.forEach((item) => item.classList.remove('selected'));

                if (clickedItem) {
                    clickedItem.classList.add('selected');
                }
            }
        });
    }

    async startRTMP() {
        if (!this.isRTMPVideoSupported(filterXSS(this.selectedRtmpFilename))) {
            this.getId('file-name').textContent = '';
            return this.userLog(
                'warning',
                "The provided File is not valid. Please ensure it's .mp4, webm or ogg video file",
                'top-end',
            );
        }

        this.socket
            .request('startRTMP', {
                file: filterXSS(this.selectedRtmpFilename),
                peer_name: filterXSS(this.peer_name),
                peer_uuid: filterXSS(this.peer_uuid),
            })
            .then(function (rtmp) {
                rc.event(_EVENTS.startRTMP);
                rc.showRTMP(rtmp, 'file');
                rc.rtmpFileStreamer = true;
            });
    }

    stopRTMP() {
        if (this.rtmpFileStreamer) {
            this.socket.request('stopRTMP');
            this.rtmpFileStreamer = false;
            this.cleanRTMPUrl();
            console.log('RTMP STOP');
            this.event(_EVENTS.stopRTMP);
        }
    }

    endRTMP(data) {
        const rtmpMessage = `${data.rtmpUrl} processing finished!`;
        this.rtmpFileStreamer = false;
        this.userLog('info', rtmpMessage, 'top-end');
        console.log(rtmpMessage);
        this.cleanRTMPUrl();
        this.socket.request('endOrErrorRTMP');
        this.event(_EVENTS.endRTMP);
    }

    errorRTMP(data) {
        const rtmpError = `${data.message}`;
        this.rtmpFileStreamer = false;
        this.userLog('error', rtmpError, 'top-end');
        console.error(rtmpError);
        this.cleanRTMPUrl();
        this.socket.request('endOrErrorRTMP');
        this.event(_EVENTS.endRTMP);
    }

    // ##############################################
    // RTMP from URL
    // ##############################################

    startRTMPfromURL(inputVideoURL) {
        if (!this.isRTMPVideoSupported(filterXSS(inputVideoURL))) {
            this.getId('rtmpStreamURL').value = '';
            return this.userLog(
                'warning',
                'The provided URL is not valid. Please ensure it links to an .mp4 video file',
                'top-end',
            );
        }

        this.socket
            .request('startRTMPfromURL', {
                inputVideoURL: filterXSS(inputVideoURL),
                peer_name: filterXSS(this.peer_name),
                peer_uuid: filterXSS(this.peer_uuid),
            })
            .then(function (rtmp) {
                rc.event(_EVENTS.startRTMPfromURL);
                rc.showRTMP(rtmp, 'url');
                rc.rtmpUrlStreamer = true;
            });
    }

    stopRTMPfromURL() {
        if (this.rtmpUrlStreamer) {
            this.socket.request('stopRTMPfromURL');
            this.rtmpUrlStreamer = false;
            this.cleanRTMPUrl();
            console.log('RTMP from URL STOP');
            this.event(_EVENTS.stopRTMPfromURL);
        }
    }

    endRTMPfromURL(data) {
        const rtmpMessage = `${data.rtmpUrl} processing finished!`;
        this.rtmpUrlStreamer = false;
        this.userLog('info', rtmpMessage, 'top-end');
        console.log(rtmpMessage);
        this.cleanRTMPUrl();
        this.socket.request('endOrErrorRTMPfromURL');
        this.event(_EVENTS.endRTMPfromURL);
    }

    errorRTMPfromURL(data) {
        const rtmpError = `${data.message}`;
        this.rtmpUrlStreamer = false;
        this.userLog('error', rtmpError, 'top-end');
        console.error(rtmpError);
        this.cleanRTMPUrl();
        this.socket.request('endOrErrorRTMPfromURL');
        this.event(_EVENTS.endRTMPfromURL);
    }

    // ##############################################
    // RTMP common
    // ##############################################

    openRTMPStreamer() {
        const themeColor = encodeURIComponent(themeCustom.color);

        const options =
            `&vr=${videoQuality.value}` +
            `&vf=${videoFps.value}` +
            `&sf=${screenFps.value}` +
            `&ts=${selectTheme.value}` +
            (themeCustom.keep ? `&tc=${themeColor}` : '');

        const url = `/rtmp?v=${videoSelect.value}&a=${microphoneSelect.value}${options}`;

        openURL(url, true);
    }

    isRTMPVideoSupported(video) {
        if (video.endsWith('.mp4') || video.endsWith('.webm')) return true;
        return false;
    }

    copyRTMPUrl(url) {
        if (!url) return this.userLog('info', 'No RTMP URL detected', 'top-end');
        copyToClipboard(url);
    }

    cleanRTMPUrl() {
        const rtmpUrl = rc.getId('rtmpLiveUrl');
        rtmpUrl.value = '';
    }

    showRTMP(rtmp, type = 'file') {
        console.log('rtmp', rtmp);

        if (!rtmp) {
            switch (type) {
                case 'file':
                    this.event(_EVENTS.endRTMP);
                    break;
                case 'url':
                    this.event(_EVENTS.endRTMPfromURL);
                    break;
                default:
                    break;
            }
            return this.userLog(
                'warning',
                'Unable to start the RTMP stream. Please ensure the RTMP server is running. If the problem persists, contact the administrator',
                'top-end',
                6000,
            );
        }

        const rtmpUrl = rc.getId('rtmpLiveUrl');
        rtmpUrl.value = filterXSS(rtmp);

        Swal.fire({
            background: swalBackground,
            imageUrl: image.rtmp,
            position: 'center',
            title: 'LIVE',
            html: `
                <p style="background:transparent; color:rgb(8, 189, 89);">${rtmp}</p>
                `,
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: `Copy URL`,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        }).then((result) => {
            if (result.isConfirmed) {
                copyToClipboard(rtmp);
            }
        });
    }

    // ####################################################
    // ROOM SNAPSHOT WINDOW/SCREEN/TAB
    // ####################################################

    async snapshotRoom() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const video = document.createElement('video');

        try {
            const captureStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
            });

            video.srcObject = captureStream;
            video.onloadedmetadata = () => {
                video.play();
            };

            // Wait for the video to start playing
            video.onplay = async () => {
                this.sound('snapshot');

                // Sleep some ms
                await this.sleep(1000);

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Create a link element to download the image
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'Room_' + this.room_id + '_' + getDataTimeString() + '_snapshot.png';
                link.click();

                // Stop all video tracks to release the capture stream
                captureStream.getTracks().forEach((track) => track.stop());

                // Clean up: remove references to avoid memory leaks
                video.srcObject = null;
                canvas.width = 0;
                canvas.height = 0;
            };
        } catch (err) {
            console.error('Error: ' + err);
            this.userLog('error', 'Snapshot room error ' + err.message, 'top-end', 6000);
        }
    }

    toggleVideoMirror() {
        const peerVideo = this.getName(this.peer_id);
        if (peerVideo) peerVideo.classList.toggle('mirror');
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
} // End