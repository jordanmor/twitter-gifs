var express = require('express');
var router = express.Router();
var passport = require('passport');

//GET api/auth/current_user
router.get('/current_user', function(req, res){
  res.send(req.user);
});

//GET api/auth/login/twitter
router.get('/login/twitter',
  passport.authenticate('twitter'));

//GET api/auth/twitter/return
router.get('/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('http://localhost:3000');
});

//GET api/auth/logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('http://localhost:3000');
});

module.exports = router;