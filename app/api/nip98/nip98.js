//  <script src="https://unpkg.com/nostr-tools/lib/nostr.bundle.js"></script>

const { signEvent } = NostrTools;

var loggedIn = false;
let pubkey = "";

function loadUser() {
  if (window.nostr) {
      window.nostr.getPublicKey().then(function (pubkey) {
          if (pubkey) {
              loggedIn = true
              console.log("fetched pubkey", pubkey)
          }
      }).catch((err) => {
          console.log("LoadUser Err", err);
          console.log("logoff section")
          loggedIn = false
      });
  }
}

class NostrAuthClient {
  /**
   * Construct a new NostrAuthClient instance.
   * @param {string} pubkey - Nostr public key of the user.
   */
  constructor(pubkey) {
    this.publicKey = pubkey;
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
      pubkey: this.publicKey
    };

    // Calculate event ID
    event.id = await this.calculateId(event);

    // Sign the event
    event.sig = await signEvent(event.id, this.publicKey);

    return event;
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
}


// Make an authenticated request
async function fetchWithNostrAuth(url, options = {}) {
  const method = options.method || 'GET';
  const payload = options.body || null;

  const client = new NostrAuthClient(pubkey);
  const authEvent = await client.createAuthEvent(url, method, payload);

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

// Usage example:
const MIROTALK_URL = 'http://localhost:3010/api/v1/nip98';

loadUser();

// returns a jwt token which is appended to the url for the room authentication
// the returned url + jwt then becomes a redirect for the user to enter the room
fetchWithNostrAuth(MIROTALK_URL, {
  method: 'POST',
  body: JSON.stringify({ foo: 'bar' })
})
.then(response => {
    console.log('Raw response:', response);
    return response.json()
})
.then(data => console.log('JSON data:', data));

