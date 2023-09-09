import React from 'react';
import io from 'socket.io-client';
import SocketContext from './socketContext';

const URL = 'ws://kinjo-meet.onrender.com:10000';
const ios = io(URL);

const SocketProvider = ({ children }) => {
  return <SocketContext.Provider value={ios}>{children}</SocketContext.Provider>;
};

export default SocketProvider;