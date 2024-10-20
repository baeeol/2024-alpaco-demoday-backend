import { Server } from "socket.io";
import setGroupChatSocket from "src/group_chat/GroupChat.socket";

function appSocket(io: Server) {
  setGroupChatSocket(io);
}

export default appSocket;
