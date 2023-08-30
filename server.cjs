const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto-js');
const Message = require('./models/Message.cjs');
const app = express();
const PORT = process.env.PORT || 3001;
const secretKey = 'qwerty';
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

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

app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

app.post('/messages', async (req, res) => {
  const { content } = req.body;

  console.log('Content before encryption:', content);
  const encryptedContent = crypto.AES.encrypt(content, secretKey).toString();

  const decryptedContent = crypto.AES.decrypt(content, secretKey).toString(crypto.enc.Utf8);
  console.log('Decrypted Content:', decryptedContent);

  try {
    const newMessage = await Message.create({ content: decryptedContent });
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Error saving message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
