/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { createContext, useEffect, useState, useRef } from 'react';

// ** Config
import getSocketClient from 'src/services/socket/config';

import { useAuth } from 'src/hooks/useAuth';

import { useDispatch } from 'react-redux';
import { pushMessage } from 'src/store/apps/message';

// ** Defaults
const initialState = {
  socket: null,
  sendMessage: () => null,
  broadcastMessage: () => null
};
const SocketContext = createContext(initialState);

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  // ** States
  const { user } = useAuth();
  const [socket, setSocket] = useState(initialState.socket);

  useEffect(() => {}, []);

  useEffect(() => {
    if (user) {
      setSocket(getSocketClient());
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('msgToClient', message => {
        dispatch(pushMessage(message));
      });
    }
  }, [socket]);

  const sendMessage = () => {
    socket.emit('msgToServer', {
      sender: socket.id,
      body: messageBody
    });
  };

  const broadcastMessage = () => {};

  const values = {
    socket,
    sendMessage,
    broadcastMessage
  };

  return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
};

export { SocketContext, SocketProvider };
