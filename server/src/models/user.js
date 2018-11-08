const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    required: true,
    trim: true
  },
  twitter: {
    id: {
      type: String,
      required: [true, 'TwitterId required']
    },
    token: {
      type: String,
      required: true
    },
    tokenSecret: {
      type: String,
      required: true 
    } 
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;