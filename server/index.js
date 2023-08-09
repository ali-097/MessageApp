const express = require("express")
const app = express()
const http = require("http")
const {Server} = require("socket.io")
const cors = require("cors")

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors : {
        origin: 'http://localhost:5173',
    }
})

io.on("connection", socket => {
    console.log(`${socket.id} User Connected`)
    socket.on("send-message", data => {
        socket.broadcast.emit("recieve-message", data)
    })
})

server.listen(5174, () => {
    console.log("Server is running")
})