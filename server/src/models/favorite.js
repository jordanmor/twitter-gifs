const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, 
    ref: 'User'  
  },
  topic: {
    type: String,
    required: [true, 'A favorite is required']
  },
  gif: {
    id: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    uploadUrl: {
      type: String,
      required: true
    },
    title: String
  }
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);

module.exports = Favorite;