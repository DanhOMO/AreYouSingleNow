
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.20:3000';

const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, 
});

export const useSocket = (matchId: string ) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {

    socket.connect();
    socket.on('connect', () => setIsConnected(true));

    if (matchId) {
      socket.emit('joinRoom', { matchId });
    }

    return () => {
      socket.off('connect');
      socket.disconnect();
      setIsConnected(false);
    };
  }, [matchId]);

  return socket;
};