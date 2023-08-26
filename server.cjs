//Import the required modules at the top of the server.js file:
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

//Initialize Express and create an HTTP server:
const app = express();
const server = http.createServer(app);

//Define a port for your server to listen on:
const PORT = process.env.PORT || 3001;

//Set up a connection to your MongoDB database using mongoose
mongoose.connect('mongodb://localhost:27017/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

//Set up socket.io to work with your Express server
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Implement socket event handlers here
  socket.on('message', (message) => {
    // Save the message to MongoDB
    // Emit the message to all connected clients
    io.emit('message', message);
  });
  
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
});



