// nostr-auth-client.js

class NostrAuthClient {
    constructor(privateKey) {
        this.privateKey = privateKey;
    }

    // Generate a Nostr event for HTTP authentication
    async createAuthEvent(url, method, payload = null) {
        const tags = [
            ['u', url],
            ['method', method.toUpperCase()]
        ];

        // If payload exists, add its SHA256 hash
        if (payload) {
            const payloadHash = await this.sha256(payload);
            tags.push(['payload', payloadHash]);
        }

        const event = {
            kind: 27235,
            created_at: Math.floor(Date.now() / 1000),
            tags: tags,
            content: '',
            pubkey: this.getPublicKey(this.privateKey)
        };

        // Calculate event ID
        event.id = await this.calculateId(event);
        
        // Sign the event
        event.sig = await this.signEvent(event.id, this.privateKey);

        return event;
    }

    // Make an authenticated request
    async fetch(url, options = {}) {
        const method = options.method || 'GET';
        const payload = options.body || null;

        // Create auth event
        const authEvent = await this.createAuthEvent(url, method, payload);
        
        // Convert event to base64
        const authHeader = 'Nostr ' + btoa(JSON.stringify(authEvent));

        // Add auth header to request
        const headers = new Headers(options.headers || {});
        headers.set('Authorization', authHeader);

        // Make the request
        return fetch(url, {
            ...options,
            headers
        });
    }

    // Utility functions for cryptographic operations
    async sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async calculateId(event) {
        const eventData = JSON.stringify([
            0,
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags,
            event.content
        ]);
        return await this.sha256(eventData);
    }

    // Note: These are placeholder implementations
    // You should use actual Nostr cryptographic functions
    getPublicKey(privateKey) {
        // Implementation needed: Convert private key to public key
        throw new Error('Implementation needed');
    }

    async signEvent(eventId, privateKey) {
        // Implementation needed: Sign event with private key
        throw new Error('Implementation needed');
    }
}

// Usage example:
/*
const client = new NostrAuthClient('your-private-key');

// Making a GET request
client.fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data));

// Making a POST request with payload
client.fetch('https://api.example.com/data', {
    method: 'POST',
    body: JSON.stringify({ foo: 'bar' })
})
    .then(response => response.json())
    .then(data => console.log(data));
*/