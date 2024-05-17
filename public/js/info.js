'use strict';

async function getMeetingInfo() {
    try {
      const HIVETALK_URL = "https://localhost:3010/api/v1/meetinfo";
  
      const response = await fetch(HIVETALK_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    
    //console.log("response", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("data", data)

      if (data.error) {
        console.log("Error:", data.error);

    } else {
        if (data && data.meetings) {
            console.log("data from meetings")
            console.log(data)

          const container = document.getElementById('meetingsContainer');
          container.innerHTML = '';  // Clear previous content if any
          data.meetings.forEach(meeting => {

            // <div class="feature text-center is-revealing">
            // <div class="feature-icon">

            const meetingDiv = document.createElement('div');
            meetingDiv.classList.add('feature', 'text-center');
  
            const roomIdDiv = document.createElement('h4');
            roomIdDiv.classList.add('room-id');
            roomIdDiv.textContent = `Room ID: ${meeting.roomId}`;

            const peersDiv = document.createElement('b');
            peersDiv.classList.add('peers');
            peersDiv.textContent = `Peers: ${meeting.peers}`;
  
            meetingDiv.appendChild(roomIdDiv);
            meetingDiv.appendChild(peersDiv);

            const a = document.createElement('a');
            const url = "/join/" + meeting.roomId;
            const linkText = document.createTextNode("Join Room");
            a.setAttribute('href', url);
            a.setAttribute('target', '_blank');
            a.appendChild(linkText);
            meetingDiv.appendChild(a);
    
            container.appendChild(meetingDiv);
          });

        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  
  document.addEventListener('DOMContentLoaded', getMeetingInfo);
