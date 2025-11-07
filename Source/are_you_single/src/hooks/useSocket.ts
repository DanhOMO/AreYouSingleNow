import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { IP } from "src/types/type";

const SOCKET_URL = IP;

const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const useSocket = (matchId: string) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => setIsConnected(true));

    if (matchId) {
      socket.emit("joinRoom", { matchId });
    }

    return () => {
      socket.off("connect");
      socket.disconnect();
      setIsConnected(false);
    };
  }, [matchId]);

  return socket;
};
