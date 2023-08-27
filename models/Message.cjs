const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  // Other fields you might need
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
