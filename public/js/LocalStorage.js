'use strict';

class LocalStorage {
    constructor() {
        this.MEDIA_TYPE = {
            audio: 'audio',
            video: 'video',
            audioVideo: 'audioVideo',
            speaker: 'speaker',
        };

        this.INIT_CONFIG = {
            audio: true,
            video: true,
            audioVideo: true,
        };

        this.SFU_SETTINGS = {
            share_on_join: true, // popup message on join
            show_chat_on_msg: true, // show chat on new message
            transcript_persistent_mode: false, // Prevent stop transcript in case of no-speech
            transcript_show_on_msg: true, // show transcript on new message
            speech_in_msg: false, // speech incoming message
            moderator_audio_start_muted: false, // Everyone starts muted in the room
            moderator_video_start_hidden: false, // Everyone starts hidden in the room
            moderator_audio_cant_unmute: false, // Everyone can't unmute themselves
            moderator_video_cant_unhide: false, // Everyone can't unhide themselves
            moderator_screen_cant_share: false, // Everyone can't share screen
            moderator_chat_cant_privately: false, // Everyone can't chat privately, only Public chat allowed
            moderator_chat_cant_chatgpt: false, // Everyone can't chat with ChatGPT
            moderator_disconnect_all_on_leave: false, // Disconnect all participants on leave room
            mic_auto_gain_control: false,
            mic_echo_cancellations: true,
            mic_noise_suppression: true,
            mic_sample_rate: 0, // 0: 48000 Hz 1: 44100 Hz
            mic_sample_size: 0, // 0: 16 bits 1: 32 bits
            mic_channel_count: 0, // 0: 1(mono) 1: 2 (stereo)
            mic_latency: 50, // ms
            mic_volume: 100, // %
            video_fps: 0, // default 1280x768 30fps
            screen_fps: 3, // default 5fps
            broadcasting: false, // default false (one to many a/v streaming)
            lobby: false, // default false
            pitch_bar: true, // volume indicator
            sounds: true, // room notify sounds
            host_only_recording: false, // presenter
            rec_prioritize_h264: false, // Prioritize h.264 with AAC or h.264 with Opus codecs over VP8 with Opus or VP9 with Opus codecs
            rec_server: false, // The recording will be stored on the server rather than locally
            video_obj_fit: 2, // cover
            video_controls: 0, // off
            theme: 0, // dark
            theme_color: '#000000', // custom theme color
            theme_custom: false, // keep custom theme
            buttons_bar: 0, // vertical
            pin_grid: 0, // vertical
        };

        this.DEVICES_COUNT = {
            audio: 0,
            speaker: 0,
            video: 0,
        };

        this.LOCAL_STORAGE_DEVICES = {
            audio: {
                count: 0,
                index: 0,
                select: null,
            },
            speaker: {
                count: 0,
                index: 0,
                select: null,
            },
            video: {
                count: 0,
                index: 0,
                select: null,
            },
        };
    }

    // ####################################################
    // SET LOCAL STORAGE
    // ####################################################

    setItemLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }

    setObjectLocalStorage(name, object) {
        localStorage.setItem(name, JSON.stringify(object));
    }

    setSettings(settings) {
        this.SFU_SETTINGS = settings;
        this.setObjectLocalStorage('SFU_SETTINGS', this.SFU_SETTINGS);
    }

    setInitConfig(type, status) {
        switch (type) {
            case this.MEDIA_TYPE.audio:
                this.INIT_CONFIG.audio = status;
                break;
            case this.MEDIA_TYPE.video:
                this.INIT_CONFIG.video = status;
                break;
            case this.MEDIA_TYPE.audioVideo:
                this.INIT_CONFIG.audioVideo = status;
                break;
            default:
                break;
        }
        this.setObjectLocalStorage('INIT_CONFIG', this.INIT_CONFIG);
    }

    setLocalStorageDevices(type, index, select) {
        switch (type) {
            case this.MEDIA_TYPE.audio:
                this.LOCAL_STORAGE_DEVICES.audio.count = this.DEVICES_COUNT.audio;
                this.LOCAL_STORAGE_DEVICES.audio.index = index;
                this.LOCAL_STORAGE_DEVICES.audio.select = select;
                break;
            case this.MEDIA_TYPE.video:
                this.LOCAL_STORAGE_DEVICES.video.count = this.DEVICES_COUNT.video;
                this.LOCAL_STORAGE_DEVICES.video.index = index;
                this.LOCAL_STORAGE_DEVICES.video.select = select;
                break;
            case this.MEDIA_TYPE.speaker:
                this.LOCAL_STORAGE_DEVICES.speaker.count = this.DEVICES_COUNT.speaker;
                this.LOCAL_STORAGE_DEVICES.speaker.index = index;
                this.LOCAL_STORAGE_DEVICES.speaker.select = select;
                break;
            default:
                break;
        }
        this.setObjectLocalStorage('LOCAL_STORAGE_DEVICES', this.LOCAL_STORAGE_DEVICES);
    }

    // ####################################################
    // GET LOCAL STORAGE
    // ####################################################

    getLocalStorageSettings() {
        return this.getObjectLocalStorage('SFU_SETTINGS');
    }

    getLocalStorageInitConfig() {
        return this.getObjectLocalStorage('INIT_CONFIG');
    }

    getLocalStorageDevices() {
        return this.getObjectLocalStorage('LOCAL_STORAGE_DEVICES');
    }

    getItemLocalStorage(key) {
        localStorage.getItem(key);
    }

    getObjectLocalStorage(name) {
        return JSON.parse(localStorage.getItem(name));
    }
}
