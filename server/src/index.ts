import express, { Application } from 'express'
import { createServer } from 'http'
import { Server} from 'socket.io'
import cors from 'cors'
import roomHandler from '@services/room-handler'


const app: Application = express()
const httpsServer = createServer(app)

app.use(cors)

const io = new Server(httpsServer, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})


io.on('connection', (socket) => {
    console.log('user connected')
    roomHandler(socket)

    socket.on('disconnect', () => {
        console.log('user disconncted')
    })
})


httpsServer.listen(5000, () => {
    console.log(`http://localhost:5000`);
})
