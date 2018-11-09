const express = require('express');
const router = express.Router();
const config = require('config');
const { uploadMedia } = require('../services/uploadMedia');
const { createTwitterClient } = require('../services/twitter-client.js');
const { decrypt } = require('../services/encryption');
const requireLogin = require('../middleware/requireLogin');

router.get('/trends', (req, res) => {
  // Gets the lastest twitter trends in the United States
  const woeid = '23424977'; // Yahoo! WOEID for United States

  const token = config.get('twitter.access_token_key');
  const tokenSecret = config.get('twitter.access_token_secret');

  const twitterClient = createTwitterClient(token, tokenSecret);

  twitterClient.get('trends/place', {id: woeid})
    .then( tweet => {
      const trends = tweet[0].trends.map((trend, index) => ({id: index, name: trend.name}));
      res.send(trends);
    })
    .catch( error => {
      throw error;
    });
});

router.post('/tweet', requireLogin, async (req, res, next) => {

  const token = decrypt(req.user.twitter.token);
  const tokenSecret = decrypt(req.user.twitter.tokenSecret);
  const twitterClient = createTwitterClient(token, tokenSecret);

  const mediaId = await uploadMedia(req.body.gif, token, tokenSecret);
  const status = {
    status: req.body.text,
    media_ids: mediaId
  };

  twitterClient.post('statuses/update', status, function(error, tweet, response) {
    if (error) {
      const err = new Error('Error posting tweet.');
      err.status = 400;
      return next(err);
    } else {
      res.status(201).send('Tweet Posted!');
    }
  });

});

module.exports = router;