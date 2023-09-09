const express = require('express');
const cors = require('cors')
const http = require('http');
const path = require("path");
const socketIO = require('socket.io');

const port = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);
const io = socketIO(server, {
  cors:{
    origin: 'http://kinjo-meet.onrender.com',
    methods: ['GET', 'POST'],
    credentials: true
  }
});


const onlineUsers = {};
const onCallUsers = {};

// Sockets management.
io.on('connection', (socket) => {
  console.log('Connection Established');
  socket.on("infoExchange",(mail)=>{
    onlineUsers[mail] = {id:socket.id};
  })

  socket.on("checkUser",(mail,name,caller)=>{
    const recvId = onlineUsers[mail];
    if(recvId==undefined){
      socket.emit("userInfo",'false','true','null');
    }
    else if(onCallUsers[mail] || recvId.id == socket.id){
      socket.emit("userInfo",'true','true','null');
    }
    else{
      socket.emit("userInfo",'true','false',recvId.id);
      io.to(recvId.id).emit('getCall',socket.id,name,caller);
    }
  })

  socket.on('cancelCall',(otherId)=>{
    io.to(otherId).emit('reject','true');
  })

  socket.on('leaveRoom',(room)=>{
    socket.leave(room);
    io.to(room).emit('leftRoom');
  });

  socket.on('present',()=>{
  })

  socket.on('joinRoom',(room)=>{
    socket.join(room);
    
  })

  socket.on('giveId',()=>{
    io.to(socket.id).emit('returnId');
  })

  socket.on('gettingId',(id,room)=>{
    io.to(room).emit('getId',id);
  })

  socket.on('answerCall',(callerId)=>{
    socket.join(callerId)
    io.to(callerId).emit('accept',callerId);
  })

  socket.on('disconnect', () => {
  });

  socket.on('log-out',(mail)=>{
    delete onlineUsers[mail];
  })

  socket.on('chat',(room,msg)=>{
    io.to(room).emit('msg',msg);
  })

  socket.on('send-signal',(data,room)=>{
    io.to(room).emit('receive-signal',data);
  })


});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/../client/dist/index.html"));
  });
}

server.listen(port, () => {
  console.log('Server listening over port ',port);
});
