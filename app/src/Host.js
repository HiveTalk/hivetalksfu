'use strict';

module.exports = class Host {
    constructor() {
        this.authorizedIPs = new Map();
        this.roomActive = false;
    }

    /**
     * Get IP from req
     * @param {object} req
     * @returns string IP
     */
    getIP(req) {
        return req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'] || req.socket.remoteAddress || req.ip;
    }

    /**
     * Get authorized IPs
     * @returns object
     */
    getAuthorizedIPs() {
        return Object.fromEntries(this.authorizedIPs);
    }

    /**
     * Set authorized IP
     * @param {string} ip
     * @param {boolean} authorized
     */
    setAuthorizedIP(ip, authorized) {
        this.authorizedIPs.set(ip, authorized);
        this.setRoomActive();
    }

    /**
     * Check if IP is authorized
     * @param {string} ip
     * @returns boolean
     */
    isAuthorizedIP(ip) {
        return this.authorizedIPs.has(ip);
    }

    /**
     * Host room status
     * @returns boolean
     */
    isRoomActive() {
        return this.roomActive;
    }

    /**
     * Set host room activate
     */
    setRoomActive() {
        this.roomActive = true;
    }

    /**
     * Set host room deactivate
     */
    setRoomDeactivate() {
        this.roomActive = false;
    }

    /**
     * Delete ip from authorized IPs
     * @param {string} ip
     * @returns boolean
     */
    deleteIP(ip) {
        if (this.isAuthorizedIP(ip)) {
            this.setRoomDeactivate();
        }
        return this.authorizedIPs.delete(ip);
    }
};
