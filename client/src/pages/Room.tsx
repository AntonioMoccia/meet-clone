import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRoomContext } from "../context/RoomContext";
import { ws } from "../ws";
import { useUserContext } from "../context/UserContext";
import VideoPlayer from "../components/VideoPlayer";
function Room() {
  const { id } = useParams();
  const { setRoomId, stream, peers, me, wsStream} = useRoomContext();
  const { userName, userId } = useUserContext();
  useEffect(() => {
    if (stream && me)
      ws.emit("room:join", { roomId: id, peerId: me.id, userName });
  }, [id, me, stream, userName]);

  useEffect(() => {
    setRoomId(id || "");
  }, [id, setRoomId]);

  useEffect(()=>{
    console.log(wsStream)
  },[wsStream])

  return (
    <div className=" bg-[rgb(30,30,30)] h-screen w-screen">
      {/* <button onClick={startScreenSharing}>Screen Sharing</button> */}
{/*     <div className=" h-40">
      <VideoPlayer userName="websocket" stream={wsStream} />
    </div> */}
      <div className=" w-full p-10 grid grid-cols-3 gap-2">
        {Object.values(peers).map((peer, index) => {
          if (userId == peer.peerId)
            return (
              <div >
                <VideoPlayer userName={userName} stream={stream} />
              </div>
            );

          return (
            <div key={index} >
              {peer.stream && <VideoPlayer userName={peer.userName as string} stream={peer.stream} />}{" "}
           
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Room;
