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

interface IRoomContext {
  stream?: MediaStream;
  peers: PeerState;
  me?: Peer;
  roomId: string;
  setRoomId: (id: string) => void;
}

const RoomContext = createContext<IRoomContext>({
  roomId: "",
  setRoomId: (id) => {},
  peers: {},
});

export const RoomProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [roomId, setRoomId] = useState<string>("");
  const [peers, dispatch] = useReducer(peersReducer, {});
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

  useEffect(() => {

    const peer = new Peer(userId);
    setMe(peer);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }

    ws.on("room:created", enterRoom);
    ws.on("room:users", getUsers);
    ws.on("room:user-disconnected", removePeer);

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

      console.log("on event",peerId,me.id)

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
        console.log(peerStream)
        dispatch(addPeerStreamAction(call.peer, peerStream));
      });
    });

    return () => {

    };
  }, [me, stream, userName]);

  return (
    <RoomContext.Provider value={{ stream, me, roomId, setRoomId, peers }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const roomContext = useContext(RoomContext);

  return roomContext;
};
