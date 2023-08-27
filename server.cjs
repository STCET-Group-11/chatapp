const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const crypto = require('crypto-js');

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

const secretKey = 'qwerty';

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (encryptedMessage) => {
    const bytes = crypto.AES.decrypt(encryptedMessage.toString(), secretKey);
    const decryptedMessage = bytes.toString(crypto.enc.Utf8);

    io.emit('message', decryptedMessage);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
