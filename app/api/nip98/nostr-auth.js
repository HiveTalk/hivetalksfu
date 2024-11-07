// server side middleware example

import crypto from 'crypto';
import { verifyEvent } from 'nostr-tools';


export class NostrAuthMiddleware {
    constructor(options = {}) {
        this.timeWindow = options.timeWindow || 60; // seconds
    }

    // Middleware function for Express
    middleware() {
        return async (req, res, next) => {
            try {
                const isValid = await this.validateRequest(req);
                console.log("isValid : ", isValid)
                if (!isValid) {
                    return res.status(401).json({
                        error: 'Invalid Nostr authentication'
                    });
                }
                next();
            } catch (error) {
                console.error('Nostr auth error:', error);
                res.status(401).json({
                    error: 'Authentication failed'
                });
            }
        };
    }

    async validateRequest(req) {
        // Extract the Nostr event from Authorization header
        const authHeader = req.headers.authorization;
        console.log("validate request auth header: ", authHeader)

        if (!authHeader?.startsWith('Nostr ')) {
            return false;
        }

        try {
            // Decode the base64 event
            const eventStr = Buffer.from(authHeader.slice(6), 'base64').toString();
            const event = JSON.parse(eventStr);

            console.log("eventStr: ", eventStr)
            console.log('event decoded: ', event)

            // Validate the event
            return await this.validateEvent(event.sig, req);
        } catch (error) {
            console.error('Error parsing auth event:', error);
            return false;
        }
    }

    async validateEvent(event, req) {
        // 1. Check kind
        if (event.kind !== 27235) {
            return false;
        }
        console.log("check kind")

        // 2. Check timestamp
        const now = Math.floor(Date.now() / 1000);
        if (Math.abs(now - event.created_at) > this.timeWindow) {
            return false;
        }
        console.log("check timestamp")

        // 3. Check URL
        const urlTag = event.tags.find(tag => tag[0] === 'u');

        console.log('urltag: ', urlTag[1])
        console.log('full url: ', this.getFullUrl(req))

        if (!urlTag || urlTag[1] !== this.getFullUrl(req)) {
            return false;
        }
        console.log("check URL")

        // 4. Check method
        const methodTag = event.tags.find(tag => tag[0] === 'method');
        if (!methodTag || methodTag[1] !== req.method) {
            return false;
        }
        console.log("check method")

        // 5. Check payload hash if present
        if (req.body && Object.keys(req.body).length > 0) {
            const payloadTag = event.tags.find(tag => tag[0] === 'payload');
            if (payloadTag) {
                const bodyHash = await this.sha256(JSON.stringify(req.body));
                if (bodyHash !== payloadTag[1]) {
                    return false;
                }
            }
        }
        console.log("check payload hash if present")

        // 6. Verify event signature
        return await this.verifySignature(event);
    }

    // Utility functions
    getFullUrl(req) {
       // return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        return `https://${req.get('host')}${req.originalUrl}`;
    }

    async sha256(message) {
        return crypto
            .createHash('sha256')
            .update(message)
            .digest('hex');
    }

    async calculateEventId(event) {
        // Serialize the event data according to NIP-01
        const serialized = JSON.stringify([
            0, // Reserved for future use
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags,
            event.content
        ]);

        // Calculate SHA256 hash
        return await this.sha256(serialized);
    }

    async verifySignature(event) { 
        let isGood = verifyEvent(event)
        console.log("Verify Event", isGood)
        return isGood
    }

}
