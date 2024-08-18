import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";


interface IRoomParams {
  peerId:string,
  roomId:string
}
interface IUser {
  peerId: string;
  userName: string;
}
let rooms : Record<string,Record<string, IUser>> = {}

const roomHandler = (socket: Socket) => {


  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = {}
    socket.emit("room:created", { roomId });
  };
  const leaveRoom = ({ peerId, roomId }: IRoomParams) => {
    //rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);

   if(rooms[roomId][peerId]) delete rooms[roomId][peerId]

    socket.to(roomId).emit("room:user-disconnected", peerId);
};

  const joinRoom = ({roomId,peerId,userName}:{roomId:string,peerId:string,userName:string}) => {

    if (!rooms[roomId]) rooms[roomId] = {};
    console.log(peerId)
    //console.log("user joined the room", roomId, peerId, userName);
    rooms[roomId][peerId] = { peerId, userName };
    socket.join(roomId);
    socket.to(roomId).emit("room:user-joined", { peerId , userName});
    socket.emit("room:users", {
        roomId,
        participants: rooms[roomId],
    });

    socket.on("disconnect", () => {
      leaveRoom({ roomId, peerId });
  });
  };

  socket.on("room:create", createRoom);
  socket.on("room:join",joinRoom);
};

export default roomHandler;
