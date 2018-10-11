const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const users = require('./routes/users');
const favorites = require('./routes/favorites');
const app = express();

// set our port
app.set('port', process.env.PORT || 5000);

//Mongoose connection
mongoose.connect('mongodb://localhost/twitter-gif', { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('connection error:', err);
});

db.once('open', () => {
    console.log('db connection successful');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api/users', users);
app.use('/api/favorites', favorites);

// send a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Twitter GIF API'
  });
});

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
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});