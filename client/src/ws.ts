import socketIO from 'socket.io-client'

const server = 'http://localhost:5000'
export const ws = socketIO(server)