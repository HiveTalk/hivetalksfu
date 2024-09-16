import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MediaSettings = () => {
    const [autoPlayMedia, setAutoPlayMedia] = useState(false);

    useEffect(() => {
        // Fetch the current setting from the server
        axios.get('/api/room/autoPlayMedia')
            .then(response => setAutoPlayMedia(response.data.autoPlayMedia))
            .catch(error => console.error('Error fetching autoPlayMedia setting:', error));
    }, []);

    const handleToggle = () => {
        const newStatus = !autoPlayMedia;
        setAutoPlayMedia(newStatus);

        // Update the setting on the server
        axios.post('/api/room/autoPlayMedia', { autoPlayMedia: newStatus })
            .catch(error => console.error('Error updating autoPlayMedia setting:', error));
    };

    return (
        <div>
            <label>
                Auto-Play Media:
                <input
                    type="checkbox"
                    checked={autoPlayMedia}
                    onChange={handleToggle}
                />
            </label>
        </div>
    );
};

export default MediaSettings;
