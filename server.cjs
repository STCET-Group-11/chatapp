const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
//const crypto = require('crypto'); // Import the crypto module
const crypto = require('crypto-js'); // Import the crypto-js library

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

const io = socketIo(server, {
  cors: corsOptions, // Use corsOptions for Socket.IO CORS configuration
});

const secretKey = 'qwerty'; // Replace with your secret key

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (encryptedMessage) => {
    // Decrypt the message
    const bytes = crypto.AES.decrypt(encryptedMessage.toString(), secretKey);
    const decryptedMessage = bytes.toString(crypto.enc.Utf8);

    // Broadcast the decrypted message to all clients
    io.emit('message', decryptedMessage);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});