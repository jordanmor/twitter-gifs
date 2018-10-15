const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A favorite is required']
  }
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);

module.exports.Favorite = Favorite;