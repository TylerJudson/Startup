const { WebSocketServer, WebSocket } = require('ws');
const DB = require('./database.js');

// EVERY GROUP CODE HAS ITS OWN LIST OF OPEN CONNECTIONS SO UPDATES ONLY GO TO THAT GROUP
const groupSockets = {};

function peerProxy(httpServer) {
    const socketServer = new WebSocketServer({ server: httpServer });

    socketServer.on('connection', (socket, req) => {
        socket.isAlive = true;

        // THE PAGE SENDS ITS GROUP CODE RIGHT AFTER IT CONNECTS
        socket.on('message', async (data) => {
            let message;
            try {
                message = JSON.parse(data);
            } catch {
                return;
            }
            if (message.type === 'subscribe') {
                await subscribe(socket, req, message.code);
            }
        });

        socket.on('close', () => {
            if (socket.code && groupSockets[socket.code]) {
                groupSockets[socket.code].delete(socket);
            }
        });

        socket.on('pong', () => {
            socket.isAlive = true;
        });
    });

    // PINGS EVERYONE SO DEAD CONNECTIONS GET CLEANED UP
    setInterval(() => {
        socketServer.clients.forEach((client) => {
            if (client.isAlive === false) return client.terminate();

            client.isAlive = false;
            client.ping();
        });
    }, 10000);
}

// SAME RULE AS THE ENDPOINTS, YOU HAVE TO BE LOGGED IN AND IN THE GROUP
async function subscribe(socket, req, code) {
    const token = getToken(req);
    const user = token ? await DB.getUserByToken(token) : null;
    const group = code ? await DB.getGroup(code) : null;
    if (!user || !group || !group.members.includes(user.email)) {
        socket.send(JSON.stringify({ type: 'error', msg: 'You are not in this group' }));
        return;
    }

    socket.code = code;
    if (!groupSockets[code]) {
        groupSockets[code] = new Set();
    }
    groupSockets[code].add(socket);
    socket.send(JSON.stringify({ type: 'subscribed', code: code }));
}

// THE BROWSER SENDS THE LOGIN COOKIE WITH THE WEBSOCKET REQUEST TOO
function getToken(req) {
    const cookies = req.headers.cookie || '';
    const tokenCookie = cookies.split('; ').find((cookie) => cookie.startsWith('token='));
    return tokenCookie ? tokenCookie.slice('token='.length) : null;
}

// THE ENDPOINTS CALL THIS TO PUSH AN UPDATE TO EVERYONE IN A GROUP
function sendToGroup(code, message) {
    if (!groupSockets[code]) return;

    groupSockets[code].forEach((socket) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    });
}

module.exports = { peerProxy, sendToGroup };
