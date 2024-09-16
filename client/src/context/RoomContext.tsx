import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { ws } from "../ws";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";
import { peersReducer, PeerState } from "../reducers/peerReducer";
import {
  addAllPeersAction,
  addPeerNameAction,
  addPeerStreamAction,
  removePeerStreamAction,
} from "../reducers/peerActions";
import { useUserContext } from "./UserContext";
import { IPeer } from "../types/peer";

import { io } from "socket.io-client";

interface IRoomContext {
  stream?: MediaStream;
  peers: PeerState;
  me?: Peer;
  roomId: string;
  setRoomId: (id: string) => void;
  startScreenSharing: () => void;
  wsStream?: MediaStream;
}

const RoomContext = createContext<IRoomContext>({
  roomId: "",
  setRoomId: (id) => {},
  peers: {},
  startScreenSharing: () => {},
});

export const RoomProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [roomId, setRoomId] = useState<string>("");
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [wsStream, setWsStream] = useState<MediaStream>();
  const { userName, userId } = useUserContext();
  const navigate = useNavigate();

  const getUsers = ({
    participants,
  }: {
    participants: Record<string, IPeer>;
  }) => {
    dispatch(addAllPeersAction(participants));
  };
  const enterRoom = ({ roomId }: { roomId: string }) => {
    navigate(`/room/${roomId}`);
  };
  const removePeer = (peerId: string) => {
    dispatch(removePeerStreamAction(peerId));
  };
  const startScreenSharing = () => {
    try {
      navigator.mediaDevices.getDisplayMedia().then((chunk) => {
        setStream(chunk);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const ioStream = io('http://localhost:5001')

  

  useEffect(() => {
    const peer = new Peer(userId, {
      host: "localhost",
      port: 9000,
    });
    setMe(peer);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream)

          mediaRecorder.ondataavailable = (streaming)=>{
            console.log(streaming)
            ioStream.emit('audio',{data:streaming.data})
          }
          mediaRecorder.start(15)
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }

    ws.on("room:created", enterRoom);
    ws.on("room:users", getUsers);
    ws.on("room:user-disconnected", removePeer);
    ioStream.on('transcript',(data)=>{
      console.log(data)
    })
    return () => {
      ws.off("room:created");
      ws.off("room:users");
      ws.off("room:user-disconnected");

      me?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;

    ws.on("room:user-joined", ({ peerId, userName: name }) => {
      console.log("on event", peerId, me.id);
      const call = me.call(peerId, stream, {
        metadata: {
          userName,
        },
      });

      call.on("stream", (peerStream) => {
  
        dispatch(addPeerStreamAction(peerId, peerStream));
      });
      dispatch(addPeerNameAction(peerId, name));
    });

    me.on("call", (call) => {
      const { userName } = call.metadata;

      call.answer(stream);
      dispatch(addPeerNameAction(call.peer, userName));
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(call.peer, peerStream));
      });
    });

    return () => {
      ws.off("room:user-joined");
    };
  }, [me, stream, userName]);

  return (
    <RoomContext.Provider
      value={{
        stream,
        me,
        roomId,
        setRoomId,
        peers,
        startScreenSharing,
        wsStream,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const roomContext = useContext(RoomContext);

  return roomContext;
};
