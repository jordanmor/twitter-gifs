const express = require('express');
const router = express.Router();
const twitterClient = require('../helpers/twitter-client.js');

router.get('/trends', function(req, res) {
  const woeid = '23424977'; // Yahoo! WOEID for United States
  // Gets the lastest twitter trends in the United States
  twitterClient.get('trends/place', {id: woeid})
    .then( tweet => {
      const trends = tweet[0].trends.slice(0, 20).map(trend => trend.name);
      res.json(trends);
    })
    .catch( error => {
      throw error;
    });
});

module.exports = router;