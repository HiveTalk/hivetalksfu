
//import { SimplePool} from 'nostr-tools';
//import { nip19 } from 'nostr-tools';
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools/pure'

export const HIVE_RELAYS = ['wss://honey.nostr1.com'] // for testing only, no kind 1s

// Initialize nostr-tools
export function initNostrTools() {
  // Any global initialization can go here
  // Currently empty as modern nostr-tools doesn't require explicit initialization
}

export function generateIdentifier(length = 10) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function sendNostrEvent(event, relays) {
  try {
      initNostrTools();
      let sk = generateSecretKey() // use random private key
      // replace with consistent key
      const signedEvent = await finalizeEvent(event, sk)

      const { pool, cleanup } = createPool();
      try {
          const pubs = pool.publish(relays, signedEvent);
          await Promise.any(pubs);
          const event = await pool.get(relays, {
            ids: [signedEvent.id],
          })
          if (event && typeof event === 'object' && 'content' in event) {
            console.log("Found event with content:", event.content);
          } else {
            console.log("No event found with this ID");
          }
        } finally {
          cleanup();
        }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
}


async function sendRoomEvent(pubkey, room_name, room_description, room_picture_url) {

    const KIND = 30312; // rooms 
    const identifier = generateIdentifier(); // identifier

    const eventParams = {
      kind: KIND,
      pubkey: pubkey,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['d', identifier],
        ["room", room_name],
        ["summary", room_description],
        ["image", room_picture_url],
        ['status', 'open'],
        ['service','https://hivetalk.org/join/'+ room_name], // temporary for testing
        ['p', pubkey, "wss://hivetalk.nostr1.com", "owner"],
        ['t', 'hivetalk'],
        ['t', 'interactive'],
        ['relays', "wss://hivetalk.nostr1.com"]
      ],
      content: "",
    };

    await sendNostrEvent(eventParams, HIVE_RELAYS)

}
