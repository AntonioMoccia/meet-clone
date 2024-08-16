import express, { Application, Request, Response } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { v4 as uuidV4 } from 'uuid'
import { Socket } from 'dgram'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

const app: Application = express()
const httpsServer = createServer(app)

app.use(cors)

const io = new Server(httpsServer, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})

const roomHandler = (socket:any)=>{
    socket.on("room:create", () => {
        const roomId = uuidV4()
        socket.emit("room:created", {
            roomId
        })

    })
}

io.on('connection', (socket) => {
    console.log('socket')
    roomHandler(socket)

    socket.on('disconnect', () => {
        console.log('user disconncted')
    })
})

/* app.get('/', (req: Request, res: Response) => {
    res.send('hello world')
}) */

httpsServer.listen(5000, () => {
    console.log(`http://localhost:5000`);
})
