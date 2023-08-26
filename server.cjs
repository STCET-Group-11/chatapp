const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

const connectionString = 'mongodb+srv://grp11:dbgrp11@cluster0.whralck.mongodb.net/?retryWrites=true&w=majority';

// Set up a connection to your MongoDB database using mongoose
mongoose.connect(connectionString, {
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

const io = socketIo(server, {
  cors: corsOptions, // Use corsOptions for Socket.IO CORS configuration
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (message) => {
    io.emit('message', message);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





