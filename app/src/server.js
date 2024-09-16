const express = require('express');
const app = express();
const Room = require('./Room'); // Adjust the path as necessary

app.use(express.json());

let roomInstance; // Assuming a single room instance for simplicity

// Endpoint to get the current auto-play setting
app.get('/api/room/autoPlayMedia', (req, res) => {
    res.json({ autoPlayMedia: roomInstance.getAutoPlayMedia() });
});

// Endpoint to update the auto-play setting
app.post('/api/room/autoPlayMedia', (req, res) => {
    const { autoPlayMedia } = req.body;
    roomInstance.setAutoPlayMedia(autoPlayMedia);
    res.sendStatus(200);
});

// Initialize roomInstance somewhere in your code
// roomInstance = new Room(...);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});