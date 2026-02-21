'use strict';

/**
 * LockStore — lightweight file-based persistence for room lock state.
 *
 * Stores a JSON file at app/data/roomLocks.json.
 * Each entry: { password, lockedAt, lockedByUuid, chargeId }
 *
 * Why a JSON file?
 * - No extra dependencies — uses Node's built-in `fs`
 * - Survives server restarts so a locked room stays locked
 * - Simple to inspect and debug
 */

const fs = require('fs');
const path = require('path');
const Logger = require('./Logger');

const log = new Logger('LockStore');

// Store file lives in app/data/ (auto-created if missing)
const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'roomLocks.json');

// How long a lock record is valid. Configurable via ROOM_LOCK_TTL_HOURS in .env.
// Falls back to 24 hours if the variable is missing or invalid.
const TTL_HOURS = Math.max(1, parseInt(process.env.ROOM_LOCK_TTL_HOURS || 24, 10) || 24);
const MAX_LOCK_AGE_MS = TTL_HOURS * 60 * 60 * 1000;

// ─── Internal helpers ────────────────────────────────────────────────────────

/**
 * Read the full store from disk.
 * Returns an empty object on any read/parse error.
 */
function readAll() {
    try {
        const raw = fs.readFileSync(STORE_FILE, 'utf8');
        return JSON.parse(raw);
    } catch {
        // File doesn't exist yet or is corrupt — start fresh
        return {};
    }
}

/**
 * Write the full store to disk.
 * Creates the data directory if it doesn't exist.
 */
function writeAll(data) {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        log.error('LockStore write failed', { message: err.message });
    }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Save a lock record for the given room.
 * @param {string} roomId
 * @param {{ password: string, lockedByUuid: string, chargeId: string }} lockData
 */
function save(roomId, lockData) {
    const all = readAll();
    all[roomId] = {
        password: lockData.password,
        lockedByUuid: lockData.lockedByUuid,
        chargeId: lockData.chargeId,
        lockedAt: Date.now(),
    };
    writeAll(all);
    log.debug('LockStore: saved', { roomId });
}

/**
 * Load the lock record for a room.
 * Returns null if none exists or if the record has expired (> 24h).
 * @param {string} roomId
 * @returns {{ password: string, lockedByUuid: string, chargeId: string, lockedAt: number } | null}
 */
function load(roomId) {
    const all = readAll();
    const record = all[roomId];
    if (!record) return null;

    // Treat records older than MAX_LOCK_AGE_MS as expired
    if (Date.now() - record.lockedAt > MAX_LOCK_AGE_MS) {
        log.debug('LockStore: record expired, removing', { roomId });
        remove(roomId);
        return null;
    }

    return record;
}

/**
 * Remove the lock record for a room (called on unlock).
 * @param {string} roomId
 */
function remove(roomId) {
    const all = readAll();
    if (all[roomId]) {
        delete all[roomId];
        writeAll(all);
        log.debug('LockStore: removed', { roomId });
    }
}

/**
 * Remove all records older than MAX_LOCK_AGE_MS.
 * Called once at startup to keep the file clean.
 */
function cleanup() {
    const all = readAll();
    const now = Date.now();
    let removed = 0;

    for (const [roomId, record] of Object.entries(all)) {
        if (now - record.lockedAt > MAX_LOCK_AGE_MS) {
            delete all[roomId];
            removed++;
        }
    }

    if (removed > 0) {
        writeAll(all);
        log.info(`LockStore: cleanup removed ${removed} expired record(s)`);
    }
}

module.exports = { save, load, remove, cleanup };
