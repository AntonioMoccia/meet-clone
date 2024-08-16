import React, { useEffect } from "react";
import SocketIO from "socket.io-client";
import { useRoomContext } from "./context/RoomContext";


function App() {
  const { ws } = useRoomContext();

  useEffect(()=>{
    ws.emit("room:create")
    ws.on("room:created",({roomId}:{roomId:string})=>{
      console.log(roomId)
    })
  },[])
  return <div>Hello world</div>;
}

export default App;
