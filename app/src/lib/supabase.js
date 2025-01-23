const { createClient } = require('@supabase/supabase-js');
const Logger = require('../Logger');
const log = new Logger('Supabase');

let supabaseClient = null;

function initSupabase() {
    if (supabaseClient) return supabaseClient;

    try {
        const url = process.env.SUPABASE_URL; 
        const key = process.env.SUPABASE_ANON_KEY;
        if (url && key) {
            supabaseClient = createClient(url, key);
            log.debug('Supabase client initialized successfully');
        } else {
            log.warn('Supabase configuration missing - room customization will be disabled');
        }
    } catch (err) {
        log.error('Failed to initialize Supabase client:', err);
    }

    return supabaseClient;
}

function getSupabaseClient() {
    if (!supabaseClient) {
        return initSupabase();
    }
    return supabaseClient;
}

module.exports = {
    initSupabase,
    getSupabaseClient,
};
