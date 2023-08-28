import React, { useState, useEffect, useRef } from 'react';
import crypto from 'crypto-js';
import axios from 'axios';

const secretKey = 'qwerty';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:3001/messages');
      const fetchedMessages = response.data.map((message) => {
        try {
          const bytes = crypto.AES.decrypt(message.content, secretKey);
          const decryptedMessage = bytes.toString(crypto.enc.Utf8);
          return decryptedMessage;
        } catch (error) {
          console.error('Error decrypting message:', error);
          return ''; // Return an empty string if decryption fails
        }
      });
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (inputMessage.trim() !== '') {
      const encryptedMessage = crypto.AES.encrypt(inputMessage, secretKey).toString();
      try {
        await axios.post('http://localhost:3001/messages', { content: encryptedMessage });
        setInputMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
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
