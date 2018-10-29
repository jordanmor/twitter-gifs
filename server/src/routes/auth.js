const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('config');
const rootUrl = config.get('root_url');

//GET api/auth/current_user
router.get('/current_user', function(req, res){
  // User will only be attached to request if passport authenticates login
  if (req.user) {
    res.status(200).send(req.user);
  } else {
    res.status(401).end();
  }
});

//GET api/auth/login/twitter
router.get('/login/twitter',
  passport.authenticate('twitter'));

//GET api/auth/twitter/return
router.get('/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect(rootUrl);
});

//GET api/auth/logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect(rootUrl);
});

module.exports = router;