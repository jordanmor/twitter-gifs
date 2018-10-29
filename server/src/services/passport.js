const config = require('config');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');

const twitterConsumerKey = config.get('twitter.consumer_key');
const twitterConsumerSecret = config.get('twitter.consumer_secret');

passport.use(new TwitterStrategy({
	consumerKey: twitterConsumerKey,
	consumerSecret: twitterConsumerSecret,
  callbackURL: "http://localhost:5000/api/auth/twitter/return"
  }, 
  async function(token, tokenSecret, profile, done){
    const existingUser = await User.findOne({twitterId: profile.id});
    if (existingUser) {
      done(null, existingUser);
    } else {
      const user = await new User({
        twitterId: profile.id,
        name: profile.displayName,
        photo: profile.photos[0].value
      }).save();
  
      done(null, user);
    }
}));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then(user => {
      done(null, user);
    });
});