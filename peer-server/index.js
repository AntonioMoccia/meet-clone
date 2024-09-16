const {PeerServer} = require('peer')

 const peerServer = PeerServer({
    port:9000
 })

peerServer.on('stream',(stream)=>{
   console.log(stream)
})
