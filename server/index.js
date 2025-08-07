const http = require('http')
const { WebSocketServer } = require('ws')

const url = require('url')
const uuidv4 = require("uuid").v4

const server = http.createServer()
const wsServer = new WebSocketServer({ server })
const port = 8000

const connections = {}
const users = {}

const boardcast = () => {
    Object.keys(connections).forEach(uuid => {
        const connection = connections[uuid]
        const message = JSON.stringify(users)
        connection.send(message)
    })
}


//message = state
const handleMessage = (bytes, uuid) => {
    // message = { "x": 0, "y": 100}

    //user
    const message = JSON.parse(bytes.toString())
    const user = users[uuid]

    user.state = message

    boardcast()


    console.log(`${users[uuid].username} updated their state: ${JSON.stringify(user.state)}`)
    //user.state.x = message.x
    //user.state.y = message.y
    //user.state = message

}

const handleClose = uuid => {

    console.log(`${users[uuid].username} diconnected`)
    delete connections[uuid]
    delete users[uuid]

    boardcast()

}

wsServer.on("connection", (connection, request) => {
    //ws://127.0.0.1:8000?username=Wilson
    const { username } = url.parse(request.url, true).query
    const uuid = uuidv4()
    console.log(username)
    console.log(uuid)

    connections[uuid] = connection

    users[uuid] = {
        username: username,
        state: {
            x: 0,
            y: 0,
            // presence
            onlineStatus: "Offline"
        }
    }

    connection.on("message", message => handleMessage(message, uuid))
    connection.on("close", () => handleClose(uuid))

    //JSON.stringify(user)




})
server.listen(port, () => {
    console.log(`WebSocket server is hosting on port ${port}`)
}) 