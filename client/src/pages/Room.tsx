import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRoomContext } from "../context/RoomContext";
import { ws } from "../ws";
import { useUserContext } from "../context/UserContext";
import VideoPlayer from "../components/VideoPlayer";
function Room() {
  const { id } = useParams();
  const { setRoomId, stream, peers,me } = useRoomContext();
  const { userName } = useUserContext();
  useEffect(() => {

    if (stream && me) ws.emit("room:join", { roomId: id, peerId: me.id, userName });
  }, [id, me, stream, userName]);

  useEffect(() => {
    setRoomId(id || "");
  }, [id, setRoomId]);



  return (
    <div>
      <div className=" w-72">
      {<VideoPlayer stream={stream} />}
      </div>
      {Object.values(peers).map((peer,index) => {
        return <div key={index} className=" w-52">{peer.stream && <VideoPlayer stream={peer.stream} />} {peer.userName}</div>;
      })}
    </div>
  );
}

export default Room;
