const http = require('http')
const { WebSocketServer } = require('ws')
const url = require('url')
const uuidv4 = require("uuid").v4

const server = http.createServer()
const wsServer = new WebSocketServer({ server })
const port = 8000

const connections = {}
const users = {}

const broadcast = (message) => {
  Object.values(connections).forEach((connection) => {
    connection.send(JSON.stringify(message));
  });
};



const handleMessage = (bytes, uuid) => {

    const message = JSON.parse(bytes.toString())
    const user = users[uuid]

    switch (message.type) { 
        case 'join':
            user.username = message.username || user.username
            user.state.onlineStatus = "Online"
            broadcast({
                type: 'user_update',
                users: Object.values(users).map(({ username, state }) => ({ username, state })),
            })
            console.log(`${user.username} joined`)
            break
    
        case 'draw':
            user.state = { ...user.state, ...message.state }
            broadcast({
                type: 'draw',
                username: user.username,
                data: message.data,
            })
            console.log(`${user.username} is drawing: ${JSON.stringify(message.data)}`)
            break;
        
        default:
            console.warn("Unknown message type:", message.type)
            return;
    }

}

const handleClose = uuid => {
    const user = users[uuid];
    if (user) {
        console.log(`${user.username} disconnected`);
        user.state.onlineStatus = 'Offline';
        delete connections[uuid];
        delete users[uuid];
        broadcast({
        type: 'userUpdate',
        users: Object.values(users).map(({ username, state }) => ({ username, state })),
        });
    }
}

wsServer.on("connection", (connection, request) => {
    //ws://127.0.0.1:8000?username=Wilson
    const { username } = url.parse(request.url, true).query

    const uuid = uuidv4()
    console.log(`New connection: ${username} (${uuid})`);

    connections[uuid] = connection
    users[uuid] = {
        username: username.trim(),
        state: {
            x: 0,
            y: 0,
            onlineStatus: "Online"
        }
    }

    connection.on('message', (message) => handleMessage(message, uuid));
    connection.on('close', () => handleClose(uuid));
    connection.on('error', (error) => {
        console.error(`WebSocket error for ${uuid}:`, error);
        handleClose(uuid);
    })

    broadcast({
        type: 'userUpdate',
        users: Object.values(users).map(({ username, state }) => ({ username, state })),
    })
})

server.listen(port, () => {
    console.log(`WebSocket server is hosting on port ${port}`)
}) 