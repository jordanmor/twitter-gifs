const express = require('express');
const router = express.Router();

router.get('/api/favorites', (req, res) => {
  const favorites = ['Favorites1', 'Favorites2' ,'Favorites3'];
  res.json(favorites);
});

module.exports = router;