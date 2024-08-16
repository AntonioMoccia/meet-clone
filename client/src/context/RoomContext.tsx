import { createContext, PropsWithChildren, useContext } from "react";
import SocketIO, { Socket } from "socket.io-client";

interface IRoomContext{
    ws:Socket
}

const WS = "http://localhost:5000";
const ws = SocketIO(WS);

const RoomContext = createContext<any | null>(null);


export const RoomProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <RoomContext.Provider value={{ws}}>{children}</RoomContext.Provider>;
};

export const useRoomContext = () => {
  const roomContext = useContext(RoomContext);

  return roomContext;
};
