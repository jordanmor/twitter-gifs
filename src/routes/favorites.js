const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const favorites = [
    {id: 1, name: 'Favorite1'},
    {id: 2, name: 'Favorite2'},
    {id: 3, name: 'Favorite3'},
    {id: 4, name: 'Favorite4'}
  ];
  res.json(favorites);
});

module.exports = router;