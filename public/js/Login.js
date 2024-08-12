'use strict';

console.log(window.location);

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginButton');

usernameInput.onkeyup = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        login();
    }
};
passwordInput.onkeyup = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        login();
    }
};

loginBtn.onclick = (e) => {
    login();
};

function login() {
    //const username = filterXSS(document.getElementById('username').value);
    //const password = filterXSS(document.getElementById('password').value);

    // http://localhost:3010/join/?room=test
    // http://localhost:3010/join/?room=test&roomPassword=0&name=mirotalksfu&audio=0&video=0&screen=0&notify=0
    // http://localhost:3010/join/?room=test&roomPassword=0&name=mirotalksfu&audio=0&video=0&screen=0&notify=0&username=username&password=password

    const qs = new URLSearchParams(window.location.search);
    const room = filterXSS(qs.get('room'));

    // http://localhost:3010/join/test
    const pathParts = window.location.pathname.split('/');
    const roomPath = pathParts[pathParts.length - 1];

    let event = null;
    let signedEvent = null;
    const asyncKeyWrangler = async () => {
        const publicKey = await window.nostr.getPublicKey();
        event = {
            kind: 27235,
            pubkey: publicKey,
            created_at: Math.floor(Date.now() / 1000),
            content: "hivelogin",
            tags: [],
        };
        // Request the nos2x extension to sign the event
        signedEvent = await window.nostr.signEvent(event);
        return signedEvent;
    }

    asyncKeyWrangler().then((signedEvent) => {

    if (signedEvent) {
        axios
            .post('/login', {
                id: signedEvent.id,
                kind: signedEvent.kind,
                pubkey: signedEvent.pubkey,
                content: signedEvent.content,
                created_at: signedEvent.created_at,
                sig: signedEvent.sig,
            })
            .then(function (response) {
                console.log(response);

                // Store in session
                const token = response.data.message;
                window.sessionStorage.peer_token = token;

                if (room) {
                    //return (window.location.href = '/join/' + window.location.search);
                    return (window.location.href = '/join/?room=' + room + '&token=' + token);
                }
                if (roomPath) {
                    //return (window.location.href = '/join/' + roomPath);
                    return (window.location.href ='/join/?room=' + roomPath + '&token=' + token);
                }

                return (window.location.href = '/logged');
            })
            .catch(function (error) {
                console.error(error);
                alert('Unauthorized');
            });
        return;
    }
});
    /*
    if (!username && !password) {
        alert('Username and Password required');
        return;
    }
    if (!username) {
        alert('Username required');
        return;
    }
    if (!password) {
        alert('Password required');
        return;
    }
        */
}
