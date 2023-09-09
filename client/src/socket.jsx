import React from 'react';
import io from 'socket.io-client';
import SocketContext from './socketContext';
const baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;

console.log(baseUrl);
const URL = 'ws://localhost:5000';
const ios = io(URL);

const SocketProvider = ({ children }) => {
  return <SocketContext.Provider value={ios}>{children}</SocketContext.Provider>;
};

export default SocketProvider;