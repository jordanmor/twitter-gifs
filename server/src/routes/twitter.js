const express = require('express');
const router = express.Router();
const { uploadMedia } = require('../services/uploadMedia');
const twitterClient = require('../services/twitter-client.js');
const requireLogin = require('../middleware/requireLogin');

router.get('/trends', (req, res) => {
  const woeid = '23424977'; // Yahoo! WOEID for United States
  // Gets the lastest twitter trends in the United States
  twitterClient.get('trends/place', {id: woeid})
    .then( tweet => {
      const trends = tweet[0].trends.map((trend, index) => ({id: index, name: trend.name}));
      res.send(trends);
    })
    .catch( error => {
      throw error;
    });
});

router.get('/tweet', requireLogin, async (req, res) => {
  const tweet = await Tweet.find()
  .where('user').equals(req.user._id);
  res.send(tweet);
});

router.post('/tweet', async (req, res) => {

  const mediaId = await uploadMedia(req.body.gif);
  const status = {
    status: req.body.text,
    media_ids: mediaId
  }

  twitterClient.post('statuses/update', status, function(error, tweet, response) {
    if (error) {
      console.log("Error posting tweet");
      res.status(400).send(error);
    } else {
      res.status(201).end();
    }
  });

});

module.exports = router;