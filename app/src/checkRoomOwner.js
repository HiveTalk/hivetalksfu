'use strict';

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'http://127.0.0.1:54321',
  process.env.SUPABASE_ANON_KEY || ''
)

export async function invokeCheckRoomOwner(roomName) {
  try {
    const { data } = await supabase.functions.invoke('check-room-owner', {
      body: { p_room_name: roomName }
    })
    //console.log('Room Owner Data:', data)
    return data
  } catch (error) {
    console.error('Error:', error.message)
    throw error
  }
}

// Test the check-room-owner function
// console.log('Testing check-room-owner function with room: KarrotRoom')
// invokeCheckRoomOwner('KarrotRoom')
//   .then(result => console.log('Check Room Owner Result:', result))
//   .catch(error => console.error('Check Room Owner Error:', error))

module.exports = {
  invokeCheckRoomOwner
};
