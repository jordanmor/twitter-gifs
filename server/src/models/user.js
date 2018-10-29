const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  twitterId: {
    type: String,
    required: [true, 'TwitterId required']
  },
  name: {
    type: String,
    required: [true, 'Name required'],
    trim: true
  },
  photo: {
    type: String,
    required: true,
    trim: true
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Favorite'
  }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;