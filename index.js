
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./helpers/formatDate')
const {
  getActiveUser,
  exitRoom,
  newUser,
  getIndividualRoomUsers
} = require('./helpers/userHelper');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join(__dirname, 'public')));

// this part will run when the user connects--------------------------------------------------------
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = newUser(socket.id, username, room);

    socket.join(user.room);

// Grreting From WeMonk--------------------------------------------------------------------------------------
    socket.emit('message', formatMessage("WeMonk", 'Welcome, Monks! Your presence is valued for creating a peaceful environment.\n\nRegards,\nTeam WeMonk'));

// It will run everytime when users join WeMonk------------------------------------------------------------------
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage("WeMonk", `${user.username} has joined the room`)
      );


// Active users and room name----------------------------------------------------------------------
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getIndividualRoomUsers(user.room)
    });
  });


// Listen for user message----------------------------------------------------------------------------------
  socket.on('chatMessage', msg => {
    const user = getActiveUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

// Runs when user will disconnects------------------------------------------------------------------------
  socket.on('disconnect', () => {
    const user = exitRoom(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage("WeMonk", `${user.username} has left the room`)
      );
      
       io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getIndividualRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));