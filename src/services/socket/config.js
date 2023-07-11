import { io } from 'socket.io-client';

const getSocketClient = () => {
  const token = globalThis.localStorage.getItem('accessToken');

  const socketClient = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL, {
    path: '/message',
    extraHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return socketClient;
};

export default getSocketClient;
