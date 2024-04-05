/* eslint-disable react/prop-types */
import io from 'socket.io-client';
import SocketContext from './socketContext';
const URL = 'ws://localhost:5000';
const ios = io(URL);

const SocketProvider = ({ children }) => {
  return <SocketContext.Provider value={ios}>{children}</SocketContext.Provider>;
};

export default SocketProvider;