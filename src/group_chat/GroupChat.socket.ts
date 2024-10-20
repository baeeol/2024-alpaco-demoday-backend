import { Server } from "socket.io";

function setGroupChatSocket(io: Server) {
  const groupChatSocket = io.of("/api/group-chat");

  groupChatSocket.on("connection", (socket) => {
    console.log("group chat namespace connect");

    socket.on("disconnect", () => {
      console.log("user disconnected");
      socket.leave(groupChatId as string);
    });

    const groupChatId = socket.handshake.query.groupChatId;
    socket.join(groupChatId as string);

    socket.on("send", (msg) => {
      socket.broadcast.to(groupChatId as string).emit("receive", msg);
      console.log("sdf");
    });
  });
}

export default setGroupChatSocket;
