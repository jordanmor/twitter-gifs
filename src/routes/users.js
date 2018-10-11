const express = require('express');
const router = express.Router();

router.get('/api/users', (req, res) => {
  const users = ['User1', 'User2' ,'User3'];
  res.json(users);
});

module.exports = router;