## Twitter GIFs

The latest Twitter trends matched with GIFs

Treehouse Full Stack JavaScript Techdegree - Project 12 (Capstone Project)

## Main Project Goals
- Build all aspects of the site, including an interactive front end
- Use a responsive front end framework to style your app, adding your own CSS to give your app a unique look
- On the backend, manage data with a database and connect to at least two APIs
- Manage your app's data with a database
- Make your application available at a public URL

**Project Completed:** 11/14/2018  
**Grade:** Exceeds Expectations

**Public URL:** https://twittergifs.herokuapp.com/

---
## Installation Instructions:
1. You will need API keys from the **Twitter**, **GIPHY** and **Worknik** developer sites. If you need to apply for any API keys, links to those API sites can be found listed below under [APIs](#APIs).

2. git clone https://github.com/jordanmor/twitter-gifs.git

3. npm install

4. Locate the file named `development.json` in the `starter files` folder at the root of the project. Move the `development.json` file to the `config` folder found in the `server` folder. 
    - Ex. `/server/config/development.json`

5. Add the link to your remote database, a cookie key, an encryption key and your twitter developer keys to the `development.json` file
    - Your encryption key must be 256 bytes (32 characters)
```
  // -- This file will be ignored in subsequent git commits -- //

  {
    "mongodbRemote": "Add the link to your remote database, e.g., mLab here"
    "cookieKey": "Add a string as a secret used to sign & verify cookie values",
    "encryptionKey": "Add a string. Must be 256 bytes (32 characters)",
    "twitter": {
      "consumer_key": "Add your Twitter Developer Consumer Key",
      "consumer_secret": "Add your Twitter Developer Consumer Secret",
      "access_token_key": "Add your Twitter Developer Access Token Key",
      "access_token_secret": "Add your Twitter Developer Access Token Secret"
    },
    "root_url": "http://localhost:3000/",
    "callback_root_url": "http://localhost:5000/"
  }
```
6. Locate the `env.local` file in the `starter files` folder. Move the `env.local` file to the root of the `client` folder.
    - Ex. `/client/env.local`

7. Add your GIPHY and Wordnik API keys to the `env.local` file

```
  // -- This file will be ignored in subsequent git commits -- //
  
  REACT_APP_ROOT_URL=http://localhost:5000/
  REACT_APP_GIPHY_APIKEY=
  REACT_APP_WORDNIK_APIKEY=
```
8. If you have not already done so, you will need to apply for a Twitter developer account. Create an app for the developement phase of this project.
    - https://developer.twitter.com/en.html

9. In the App details section of your Twitter Developer App (for development) make sure the **callback URL** is set to `http://localhost:5000/api/auth/twitter/return` and that your permissions are set to **read and write**.

10. Make sure MongoDB is installed

---

## Usage Instructions:
1. In your terminal, start MongoDB with the command: `mongod`

2. Open up a new tab in your terminal

3. Run the program using the command: `npm start`. 
    - This will run the server (Node) and the client (React) in the same tab.

---

## Heroku Deployment:

There are two ways to set the config vars for Heroku
  1. Using the Heroku CLI in the terminal
  ```
    heroku config:set GITHUB_USERNAME=joesmith
  ```
  2. Using the Heroku Dashboard
  
      - Refer to Heroku's Dev Center: https://devcenter.heroku.com/articles/config-vars

  3. Add the following config vars to your Heroku site with the same keys used in the `development.json` and `env.local`files:
   
```
  MONGODB_URI=
  COOKIE_KEY=
  ENCRYPTION_KEY=
  TWITTER_CONSUMER_KEY=
  TWITTER_CONSUMER_SECRET=
  TWITTER_ACCESS_TOKEN_KEY=
  TWITTER_ACCESS_TOKEN_SECRET=
  REACT_APP_GIPHY_APIKEY=
  REACT_APP_WORDNIK_APIKEY=
  REACT_APP_ROOT_URL=/  ( This final config var should already be set to the root folder / )
```
4. Add the root URL of your Twitter callback URL in the file named `production.json`, which is found in `/server/config`.
```
{
  "callback_root_url": "https://name-of-your-heroku-app.herokuapp.com/"
}
```
5. Go to your Twitter developer account and create an app for the production phase of this project.

6. In the App details section of your Twitter Developer App, (for production), make sure the **callback URL** is set to `https://name-of-your-heroku-app.herokuapp.com/api/auth/twitter/return` and that your permissions are set to **read and write**.
---

## Unit Testing with Mocha and Chai Instructions:
1. Make sure MongoDB is running in your terminal. If not, start MongoDB with the command: `mongod`

2. Open up a new tab in your terminal

3. Run unit tests using the command: `npm test`

--- 

## Built With
- Node.js
- Express
- React
- MongoDB
- Bootstrap 4

## APIs
- [Twitter](https://developer.twitter.com/content/developer-twitter/en.html)
- [Giphy](https://developers.giphy.com/)
- [Wordnik](https://developer.wordnik.com)

## Links
- [Public URL](https://twittergifs.herokuapp.com/)