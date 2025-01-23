'use strict';

const { getSupabaseClient } = require('./lib/supabase');
require('dotenv').config();

async function invokeCheckRoomOwner(roomName) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return false;
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
