const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const users = [
    {id: 1, name: 'User1'},
    {id: 2, name: 'User2'},
    {id: 3, name: 'User3'},
    {id: 4, name: 'User4'}
  ];
  res.json(users);
});

module.exports = router;