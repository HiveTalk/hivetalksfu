'use strict';

const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const config = require('./config');
const { v4: uuidV4 } = require('uuid');

const JWT_KEY = (config.jwt && config.jwt.key) || 'mirotalksfu_jwt_secret';
const JWT_EXP = (config.jwt && config.jwt.exp) || '1h';

module.exports = class ServerApi {
    constructor(host = null, authorization = null) {
        this._host = host;
        this._authorization = authorization;
        this._api_key_secret = config.api.keySecret;
    }

    isAuthorized() {
        if (this._authorization != this._api_key_secret) return false;
        return true;
    }

    getMeetingCount(roomList) {
        // include count of all rooms including locked rooms.
        return roomList.size;
    }

    getMeetings(roomList) {
        // Check if roomList exists
        if (!roomList || roomList.size === 0) {
            return [];
        }

        try {
            const meetings = Array.from(roomList.entries())
                .map(([id, room]) => {
                    // Skip if room is locked or invalid
                    if (!room || room._isLocked) {
                        return null;
                    }

                    try {
                        // Ensure room.peers exists and is valid
                        const peers = Array.from(room.peers?.values() || [])
                            .map((peer) => {
                                try {
                                    const {
                                        peer_info: {
                                            peer_name = '',
                                            peer_presenter = false,
                                            peer_npub = '',
                                            peer_pubkey = '',
                                            peer_lnaddress = '',
                                        } = {},
                                    } = peer || {};

                                    return {
                                        name: peer_name,
                                        presenter: peer_presenter,
                                        npub: peer_npub,
                                        pubkey: peer_pubkey,
                                        lnaddress: peer_lnaddress,
                                    };
                                } catch (peerError) {
                                    console.error('Error processing peer:', peerError);
                                    return null;
                                }
                            })
                            .filter((peer) => peer !== null); // Remove any failed peer entries

                        return {
                            roomId: id,
                            peers: peers,
                        };
                    } catch (roomError) {
                        console.error('Error processing room:', roomError);
                        return null;
                    }
                })
                .filter((meeting) => {
                    // Remove null entries and ensure meeting has required properties
                    return meeting !== null && meeting.roomId !== undefined && Array.isArray(meeting.peers);
                });

            return meetings;
        } catch (error) {
            console.error('Error in getMeetings:', error);
            return [];
        }
    }

    getMeetingURL(name) {
        if (name) {
            return 'https://' + this._host + '/join/' + encodeURIComponent(name); // name;
        }
        return 'https://' + this._host + '/join/' + uuidV4();
    }

    getJoinURL(data) {
        // Get data
        const { room, roomPassword, name, audio, video, screen, hide, notify, token } = data;

        const roomValue = room || uuidV4();
        const nameValue = name || 'User-' + this.getRandomNumber();
        const roomPasswordValue = roomPassword || false;
        const audioValue = audio || false;
        const videoValue = video || false;
        const screenValue = screen || false;
        const hideValue = hide || false;
        const notifyValue = notify || false;
        const jwtToken = token ? '&token=' + this.getToken(token) : '';

        const joinURL =
            'https://' +
            this._host +
            '/join?' +
            `room=${roomValue}` +
            `&roomPassword=${roomPasswordValue}` +
            `&name=${encodeURIComponent(nameValue)}` +
            `&audio=${audioValue}` +
            `&video=${videoValue}` +
            `&screen=${screenValue}` +
            `&hide=${hideValue}` +
            `&notify=${notifyValue}` +
            jwtToken;

        return joinURL;
    }

    getToken(token) {
        if (!token) return '';

        const { username = 'username', password = 'password', presenter = false, expire } = token;

        const expireValue = expire || JWT_EXP;

        // Constructing payload
        const payload = {
            username: String(username),
            password: String(password),
            presenter: String(presenter),
        };

        // Encrypt payload using AES encryption
        const payloadString = JSON.stringify(payload);
        const encryptedPayload = CryptoJS.AES.encrypt(payloadString, JWT_KEY).toString();

        // Constructing JWT token
        const jwtToken = jwt.sign({ data: encryptedPayload }, JWT_KEY, { expiresIn: expireValue });

        return jwtToken;
    }

    getRandomNumber() {
        return Math.floor(Math.random() * 999999);
    }
};
