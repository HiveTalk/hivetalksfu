//  <script src="https://unpkg.com/nostr-tools/lib/nostr.bundle.js"></script>

const { signEvent } = NostrTools;

var loggedIn = false;
let pubkey = "";
let username = "";
let avatarURL = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

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
    console.log('event: ', event)

    // Calculate event ID
    event.id = await this.calculateId(event);

    // Sign the event
    event.sig = await window.nostr.signEvent(event);
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

// Helper function to get base domain/host with port if needed
function getBaseUrl() {
  // Get the full host (includes port if it exists)
  const host = window.location.host;
  // Get the protocol (http: or https:)
  const protocol = window.location.protocol;
  // Combine them
  return `${protocol}//${host}`;
}

async function authNIP98() {

  const roomName = "TestRoom";
  const preferredRelays = ['wss://hivetalk.nostr1.com']
  const isModerator = true;

  try {
      const baseUrl = getBaseUrl();
      fetchWithNostrAuth(`${baseUrl}/api/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            room: roomName,
            username: username,
            avatarURL: avatarURL,
            relays: preferredRelays,
            isPresenter: isModerator,
          }),
      }).then(response => { 
        console.log('response', response.status)
        if (response.status === 302) {
            console.log("response status is 302") // Get the redirect URL from the response
            const data = response.json();
            window.location.href = data.redirectUrl;
          } else if (response.ok) {
            console.log("response.ok", response.ok)
            return response.json();
          } else {
            console.error('Login failed');
          }
      }).then(data => {
        console.log('auth success: ', data);
        document.getElementById('protected').innerHTML = data['message'];
      })

    } catch (error) {
      console.error('Error:', error);
      document.getElementById('protected').innerHTML = error;
    }
}


loadUser();
authNIP98();