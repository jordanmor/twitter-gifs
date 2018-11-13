import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import Gallery from './Gallery';
import Profile from './profile';
import Tweet from './Tweet';
import Success from './success';

const Main = props => {

  const { trendsWithGif, topicWithGifs, randomWordsWithGif, favorites, user, message, location } = props;

  return ( 
    <main role="main">
      <Switch>
        <Route 
          exact path="/randomTopics"
          render={() => 
            <Gallery
              data={randomWordsWithGif}
              location={location}
              category={"randomWordsWithGif"}
              onTopicClick={props.onTopicClick}
              onPrepareTweet={props.onPrepareTweet}
              onClickFavorite={props.onClickFavorite}
            />
          }>
        </Route>
        <Route 
          path="/randomTopics/:topic"
          render={() => 
            <Gallery
              data={topicWithGifs}
              category={"topicWithGifs"}
              onPrepareTweet={props.onPrepareTweet}
              onClickFavorite={props.onClickFavorite}
            />
          }>
        </Route>
        <Route 
          exact path="/trends"
          render={() => 
            <Gallery
              data={trendsWithGif}
              location={location}
              category={"trendsWithGif"}
              onTopicClick={props.onTopicClick}
              onPrepareTweet={props.onPrepareTweet}
              onClickFavorite={props.onClickFavorite}
            />
          }>
        </Route>
        <Route 
          path="/trends/:topic"
          render={() => 
            <Gallery
              data={topicWithGifs}
              category={"topicWithGifs"}
              onPrepareTweet={props.onPrepareTweet}
              onClickFavorite={props.onClickFavorite}
            />
          }>
        </Route>
        <Route 
          path="/search/:id"
          render={() => 
            <Gallery
              data={topicWithGifs}
              category={"topicWithGifs"}
              onPrepareTweet={props.onPrepareTweet}
              onClickFavorite={props.onClickFavorite}
            />
          }>
        </Route>
        <Route 
          exact path="/tweet/success"
          render={() => 
            <Success
              message={message}
            />
          }>
        </Route>
        <Route 
          exact path="/tweet"
          render={() => 
            <Tweet
              userPhoto={user.photo}
              onPostTweet={props.onPostTweet}
            />
          }>
        </Route>
        <Route 
          path="/favorites"
          render={() => 
            <Gallery
              data={favorites}
              user={user}
              category={"favorites"}
              onPrepareTweet={props.onPrepareTweet}
              onClickFavorite={props.onClickFavorite}
            />
          }>
        </Route>
        <Route 
          exact path="/profile"
          render={() => 
            <Profile
              user={user}
            />
          }>
        </Route>
        <Route 
          exact path="/"
          render={() => <Redirect to="/trends" /> }
        >
        </Route>
      </Switch>
    </main>
   );
}
 
export default Main;