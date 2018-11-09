const config = require('config');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');
const { encrypt } = require('./encryption');
const callbackRootUrl = config.get('callback_root_url');

const twitterConsumerKey = config.get('twitter.consumer_key');
const twitterConsumerSecret = config.get('twitter.consumer_secret');

passport.use(new TwitterStrategy({
	consumerKey: twitterConsumerKey,
	consumerSecret: twitterConsumerSecret,
  callbackURL: `${callbackRootUrl}api/auth/twitter/return`
  }, 
  async function(token, tokenSecret, profile, done){
    
    const existingUser = await User.findOne({ twitter: { id: profile.id }});

    if (existingUser) {
      done(null, existingUser);
    } else {
      const user = await new User({
        name: profile.displayName,
        username: profile.username,
        photo: profile.photos[0].value,
        twitter: {
          id: profile.id,
          token: encrypt(token),
          tokenSecret: encrypt(tokenSecret)
        }
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