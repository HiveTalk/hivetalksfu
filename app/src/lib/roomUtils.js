const Logger = require('../Logger');
const log = new Logger('RoomUtils');
// const { getSupabaseClient } = require('./supabase');

// // Function to get room info from Supabase
// async function getRoomInfo(roomId) {
//     const supabase = getSupabaseClient();
//     if (!supabase) {
//         log.debug("No supabase client present");
//         return null;
//     }
//     try {
//         log.debug('Fetching room info for roomId:', roomId);
//         const { data, error } = await supabase
//             .from('room_info')
//             .select('*')
//             .eq('room_name', roomId)
//             .single();
//         if (error) {
//             log.error('Supabase error:', error);
//             return null;
//         }
//         log.debug('Room data:', { data, error });
//         return data;
//     } catch (err) {
//         log.error('Error fetching room info:', err);
//         return null;
//     }
// }

// // Function to inject OG tags

function injectOGTags(html, roomInfo, roomId) {
    const defaultOG = {
        title: `${roomId} on Hivetalk Now Open`,
        description: 'HiveTalk Vanilla calling provides real-time video calls, messaging and screen sharing.',
        image: 'https://vanilla.hivetalk.org/images/hivetalk.png',
        url: `https://vanilla.hivetalk.org/join/${roomId}`,
    };

    log.debug('Processing room info:', roomInfo);

    //    const ogTitle = roomInfo?.room_name ? `Join ${roomInfo.room_name} on HiveTalk` : defaultOG.title;
    const ogTitle = roomInfo?.room_name || `Join ${defaultOG.title} room on HiveTalk`;
    const ogDescription = roomInfo?.room_description || defaultOG.description;
    const ogImage = roomInfo?.room_picture_url || defaultOG.image;
    const ogUrl = `https://vanilla.hivetalk.org/join/${roomId}`;

    log.debug('Injecting OG Tags:', {
        ogTitle,
        ogDescription,
        ogImage,
        ogUrl,
    });

    const safeTitle = escapeHtml(ogTitle);
    const safeDescription = escapeHtml(ogDescription);
    const safeImage = escapeHtml(ogImage);
    const safeUrl = escapeHtml(ogUrl);

    // Create OG tags
    const ogTags = `
        <meta property="og:title" content="${safeTitle}" />
        <meta property="og:description" content="${safeDescription}" />
        <meta property="og:image" content="${safeImage}" />
        <meta property="og:url" content="${safeUrl}" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HiveTalk" />
    `;

    // Replace the existing OG tags section and title
    html = html.replace(
        /<!-- https:\/\/ogp\.me -->[\s\S]*?<meta property="og:site_name"[^>]*>/,
        `<!-- https://ogp.me -->${ogTags}`,
    );

    html = html.replace(/<title[^>]*>.*?<\/title>/i, `<title>${safeTitle}</title>`);

    return html;
}

// Function to escape HTML special characters
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

module.exports = {
    //    getRoomInfo,
    injectOGTags,
    escapeHtml,
};
