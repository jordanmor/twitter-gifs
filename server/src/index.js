const config = require('config');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const User = require('./models/user');
const users = require('./routes/users');
const favorites = require('./routes/favorites');
const twitter = require('./routes/twitter');
const auth = require('./routes/auth');
const port = process.env.PORT || 5000;
const app = express();

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
      return done(null, existingUser);
    }

    const user = await new User({
      twitterId: profile.id,
      name: profile.displayName,
      photo: profile.photos[0].value
    }).save();

    return done(null, user);
}));

passport.serializeUser(function(user, done){
  // console.log('Serialize', user);
	done(null, user._id);
});

passport.deserializeUser(function(userId, done){
  // console.log('Deserialize', userId);
	User.findById(userId, done);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// Serve static files from the React app
const staticFiles = express.static(path.join(__dirname, '../../client/build'));
app.use(staticFiles);

const mongodbUri = config.get('mongodbUri');
//Mongoose connection
mongoose.connect(mongodbUri, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', (err) => {
    console.error('connection error:', err);
});

db.once('open', () => {
    console.log('db connection successful');
});

// Session Configuration for Passport and MongoDB
var sessionOptions = {
	secret: "my secret",
	resave: true,
	saveUninitialized: true,
  store: new MongoStore({
  	mongooseConnection: db
 	})
};

app.use(session(sessionOptions));

//Initialize Passport.js
app.use(passport.initialize());

//Restore session
app.use(passport.session());

app.use('/api/users', users);
app.use('/api/favorites', favorites);
app.use('/api/twitter', twitter);
app.use('/api/auth', auth);

// send a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Twitter GIF API'
  });
});

app.use('/*', staticFiles);

// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error');
// });

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// start listening on our port
app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});