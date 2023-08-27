const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser'); // Add bodyParser for parsing POST requests
const Message = require('./models/Message.cjs'); // Assuming you have a Message model defined

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json()); // Use bodyParser to parse JSON

const connectionString = 'mongodb+srv://grp11:dbgrp11@cluster0.whralck.mongodb.net/?retryWrites=true&w=majority';

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
  cors: corsOptions,
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', async (message) => {
    try {
      const savedMessage = await Message.create({ content: message }); // Save the message to the database
      io.emit('message', savedMessage.content); // Broadcast the message to all connected clients
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
