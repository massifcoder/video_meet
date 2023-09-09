import React from 'react';
import io from 'socket.io-client';
import SocketContext from './socketContext';

const URL = 'wss://kinjo-meet.onrender.com:10000';
const ios = io(URL);
console.log('Connection established with status ',ios);

const SocketProvider = ({ children }) => {
  return <SocketContext.Provider value={ios}>{children}</SocketContext.Provider>;
};

export default SocketProvider;