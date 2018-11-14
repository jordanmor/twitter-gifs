const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const requireLogin = require('../middleware/requireLogin');

// GET /api/favorites - get all favorites that have authorized user's id
router.get('/', requireLogin, async (req, res) => {
  const favorites = await Favorite.find()
    .where('user').equals(req.user._id);
  res.send(favorites);
});

// POST /api/favorites - create a new favorite
router.post('/', requireLogin, (req, res, next) => {
  // Add current authorized user's id to request body
  req.body.user = req.user._id;
  const favorite = new Favorite({
    user: req.user._id,
    topic: req.body.topic,
    gif: {
      id: req.body.gif.id,
      image: req.body.gif.image, // used for displaying GIF
      uploadUrl: req.body.gif.uploadUrl, // for posting tweets - file size under 2MB
      title: req.body.gif.title
    }
  });
  favorite.save((err) => {
    if (err) {
      err.status = 400;
      return next(err);
    }
    res.location('/').status(201).end();
  });
});

// DELETE /api/favorites/:id - delete a favorite
router.delete('/:id', requireLogin, async (req, res) => {
  
  const favorite = await Favorite.findByIdAndRemove(req.params.id);

  if (!favorite) {
    return res
      .status(404)
      .send('The favorite with the given ID was not found.');
  }
  res.send(favorite);
});

module.exports = router;