const config = require('config');
const Twitter = require('twitter');

const consumer_key = config.get('twitter.consumer_key');
const consumer_secret = config.get('twitter.consumer_secret');

function createTwitterClient(access_token_key, access_token_secret) {

  return new Twitter({
    consumer_key,
    consumer_secret,
    access_token_key,
    access_token_secret
  });
}

module.exports.createTwitterClient = createTwitterClient;