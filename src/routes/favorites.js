const express = require('express');
const router = express.Router();
const { Favorite } = require('../models/favorite');

router.get('/', async (req, res) => {
  const favorites = await Favorite.find();
  res.json(favorites);
});

module.exports = router;