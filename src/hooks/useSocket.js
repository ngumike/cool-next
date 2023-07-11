import { useContext } from 'react';
import { SocketContext } from 'src/context/SocketContext';

export const useSocket = () => useContext(SocketContext);
