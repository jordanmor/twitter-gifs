var express = require('express');
var router = express.Router();
var passport = require('passport');

//GET api/auth/login/twitter
router.get('/login/twitter',
  passport.authenticate('twitter'));

//GET api/auth/twitter/return
router.get('/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('http://localhost:3000');
});

//GET /auth/logout
router.get('/logout', function(req, res, next){
  req.logout();
  console.log(req.session);
  res.redirect('/');
});


module.exports = router;