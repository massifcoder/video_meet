import React from 'react'
import ReactDOM from 'react-dom/client'
import SocketProvider from './socket'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <App/>
  </SocketProvider>
)
