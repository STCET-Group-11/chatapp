import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import crypto from 'crypto-js';

const socket = io('http://localhost:3001/');
const secretKey = 'qwerty';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('message', (encryptedMessage) => {
      const decryptedBytes = crypto.AES.decrypt(encryptedMessage, secretKey);
      const decryptedMessage = decryptedBytes.toString(crypto.enc.Utf8);
      console.log('Decrypted message :', decryptedMessage);
      setMessages((prevMessages) => [...prevMessages, decryptedMessage]);
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      const encryptedMessage = crypto.AES.encrypt(inputMessage, secretKey).toString();
      console.log('Encrypted message :', encryptedMessage);
      socket.emit('message', encryptedMessage);
      setInputMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-interface">
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <span>{index}: </span>
            {message}
          </div>
        ))}
        <div ref={messagesEndRef}>&nbsp;</div>
      </div>
      <div className="input-container">
        <input
          type="text"
          id="messageInput"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatInterface;
