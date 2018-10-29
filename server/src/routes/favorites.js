const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const requireLogin = require('../middleware/requireLogin');

router.get('/', requireLogin, async (req, res, next) => {
  const favorites = await Favorite.find()
  .where('user').equals(req.user._id);
  res.json(favorites);
});

// POST / - create a new favorite
router.post('/', requireLogin, (req, res, next) => {
  // Add current authorized user's id to request body
  req.body.user = req.user._id;
  const favorite = new Favorite(req.body);
  favorite.save((err, favorite) => {
    if (err) {
      err.status = 400;
      return next(err);
    }
    res.location('/').status(201).end();
  });
});

// DELETE / - delete a favorite
router.delete('/:id', requireLogin, async (req, res, next) => {
  console.log(req.params.id);
  const favorite = await Favorite.findByIdAndRemove(req.params.id);

  if (!favorite) {
    return res
      .status(404)
      .send("The favorite with the given ID was not found.");
  }
  res.send(favorite);
});

module.exports = router;