const express = require('express');
const router = express.Router();
const config = require('config');
const { uploadMedia } = require('../services/uploadMedia');
const { createTwitterClient } = require('../services/twitter-client.js');
const { decrypt } = require('../services/encryption');
const requireLogin = require('../middleware/requireLogin');

//GET /api/twitter/trends
router.get('/trends', (req, res, next) => {
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
      if(error) {
        const err = new Error('Error getting twitter trends.');
        err.status = 400;
        return next(err);
      }
    });
});

//POST /api/twitter/tweet
router.post('/tweet', requireLogin, async (req, res, next) => {

  // Current authorized user's twitter token and token secret
  const token = decrypt(req.user.twitter.token);
  const tokenSecret = decrypt(req.user.twitter.tokenSecret);

  const twitterClient = createTwitterClient(token, tokenSecret);

  let mediaId;
  try {
    // Media (GIF) is uploaded to Twitter before posting tweet's text
    mediaId = await uploadMedia(req.body.gif, token, tokenSecret);
  } 
  catch (err) {
    if(err) {
      const err = new Error('There was an error uploading this GIF');
      err.status = 400;
      next(err);
    }
  }

  const status = {
    status: req.body.text,
    media_ids: mediaId
  };

  twitterClient.post('statuses/update', status, function(error) {
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