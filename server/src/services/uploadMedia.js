const fs = require('fs');
const download = require('download');
const del = require('del');
const { createTwitterClient } = require('../services/twitter-client.js');

async function uploadMedia(gif, token, tokenSecret) {

  const twitterClient = createTwitterClient(token, tokenSecret);

  const downloadDir = './src/temp';
  const filename = 'foo.gif';
  // Data folder created if one does not exist. If it does exist, the program does nothing.
  await fs.mkdir(downloadDir, err => err);
  // Download gif to temp folder
  await download(gif, downloadDir, {filename});

  const pathToGif = `${downloadDir}/${filename}`;
  const mediaData = fs.readFileSync(pathToGif);
  const mediaSize = fs.statSync(pathToGif).size;
  const mediaType   = 'image/gif';

  const mediaId = await initUpload() // Declare that you wish to upload some media
    .then(appendUpload) // Send the data for the media
    .then(finalizeUpload) // Declare that you are done uploading chunks

  await del([pathToGif]);

  // Step 1 of 3: Initialize a media upload
  function initUpload () {
    return makePost('media/upload', {
      command    : 'INIT',
      total_bytes: mediaSize,
      media_type : mediaType,
    }).then(data => data.media_id_string);
  }

  // Step 2 of 3: Append file chunk
  function appendUpload (mediaId) {
    return makePost('media/upload', {
      command      : 'APPEND',
      media_id     : mediaId,
      media        : mediaData,
      segment_index: 0
    }).then(data => mediaId);
  }

  // Step 3 of 3: Finalize upload
  function finalizeUpload (mediaId) {
    return makePost('media/upload', {
      command : 'FINALIZE',
      media_id: mediaId
    }).then(data => mediaId);
  }

  // (Utility function) Send a POST request to the Twitter API
  function makePost (endpoint, params) {
    return new Promise((resolve, reject) => {
      twitterClient.post(endpoint, params, (error, data, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  return mediaId;
}

module.exports.uploadMedia = uploadMedia;