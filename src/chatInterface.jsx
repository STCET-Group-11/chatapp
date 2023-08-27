import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import crypto from 'crypto-js'; // Import the crypto-js library

const socket = io('http://localhost:3001'); // Replace with your server URL
const secretKey = 'qwerty'; // Replace with the same secret key used on the server

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    socket.on('message', (encryptedMessage) => {
      const decryptedMessage = crypto.AES.decrypt(encryptedMessage, secretKey).toString(crypto.enc.Utf8);
      console.log('Decrypted message:', decryptedMessage);
      setMessages((prevMessages) => [...prevMessages, decryptedMessage]);
    });
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      const encryptedMessage = crypto.AES.encrypt(inputMessage, secretKey).toString();
      socket.emit('message', encryptedMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="chat-interface">
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          id="messageInput" // Add the id attribute here
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatInterface;
