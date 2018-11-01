import React, { Component } from 'react';
import { withRouter, Redirect, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Nav from './components/nav';
import Gallery from './components/gallery';
import Profile from './components/profile';
import Tweet from './components/tweet';
import { getTrends, cleanName } from './services/trendsService';
import { getGifs } from './services/giphyService';
import { getRandomWords } from './services/wordnikService';

class App extends Component {

  state = { 
    favorites: [],
    user: '',
    trendsWithGif: [],
    randomWordsWithGif: [],
    topicWithGifs: [],
    limit: {
      trends: 4,
      random: 1,
      topicWithGifs: 4
    }
  }

  componentDidMount() {
    this.getTrendsWithGif();
    this.getRandomWordsWithGif();
    this.persistTopicWithGifsPage();
    this.getUser();
  }

  getTrendsWithGif = async () => {
    const { limit } = this.state;
    const trends = await getTrends(limit.trends);
    const data = trends.map(async trend => {
      const trendName = cleanName(trend.name);
      const gif = await getGifs(trendName, 1);
      if (gif) {
        return {id: trend.id, topic: trend.name, gif: gif[0]};
      } else {
        return '';
      }
    });
    const trendsWithGif = await Promise.all(data);
    this.setState({ trendsWithGif });
  }

  getRandomWordsWithGif = async () => {
    const { limit } = this.state;
    const wordsData = await getRandomWords(limit.random);
    const data = wordsData.map( async wordData => {
      const word = wordData.word;
      const gif = await getGifs(word, 1);
      if (gif) {
        return {id: wordData.id, topic: word, gif: gif[0]};
      } else {
        return '';
      }
    });
    const randomWordsWithGif = await Promise.all(data);
    this.setState({ randomWordsWithGif });
  }

  getTopicWithGifs = async topic => {
    const { limit } = this.state;
    const topicName = cleanName(topic);
    const gifs = await getGifs(topicName, limit.topicWithGifs);
    const topicWithGifs = gifs.map(gif => {
      if (gif) {
        return {id: gif.id, topic, gif};
      } else {
        return '';
      }
    });
    this.setState({ topicWithGifs });
  }

  persistTopicWithGifsPage = () => {
    const topic = localStorage.getItem('topic');
    if(topic) {
      // const topicHashReplaced = topic.replace('#', 'hashtag_');
      // if(this.props.location.pathname.indexOf(topicHashReplaced) !== -1) {

      // }
      this.getTopicWithGifs(topic);
    }
  }

  handleTopicClick = (topic, pathname) => {
    this.getTopicWithGifs(topic);
    const topicHashReplaced = topic.replace('#', 'hashtag_')
    const path = `${pathname}/${topicHashReplaced}`;
    localStorage.setItem('topic', topic);
    this.props.history.push(path);
  }


  handlePostTweet = async (tweet) => {
    await axios.post('/api/twitter/tweet', tweet);
  }

  handlePrepareTweet = (topic, gif) => {
    if(this.state.user) {
      localStorage.setItem('topic', topic);
      localStorage.setItem('gif', gif);
      this.props.history.push('/tweet');
    }
  }

  getFavorites = async () => {
    // Get favorites from api and store in state
    const { data } = await axios.get('/api/favorites');
    const favorites = data.map(favorite =>
      ({id: favorite._id, topic: favorite.topic, gif: favorite.gif})
    );
    this.setState({ favorites });
  }

  getUser = async() => {
    let user;
    // Get user from api and store in state
    const response = await axios.get('/api/auth/current_user');

    if (response.status === 200 ) {
      user = response.data;
      this.setState({ user });
      this.getFavorites();
    } else {
      this.setState({ user: '' });
    }
  }

  render() {
    const { trendsWithGif, topicWithGifs, randomWordsWithGif, favorites, user } = this.state;

    return (
      <React.Fragment>
        <header>
          <Nav 
            onSearch={this.handleTopicClick}
            count={favorites.length}
            user={user}
          />
        </header>
        <main role="main">
          <Switch>
            <Route 
              exact path="/randomTopics"
              render={props => 
                <Gallery
                  {...props}
                  data={randomWordsWithGif}
                  onTopicClick={this.handleTopicClick}
                  onPrepareTweet={this.handlePrepareTweet}
                />
              }>
            </Route>
            <Route 
              path="/randomTopics/:topic"
              render={() => 
                <Gallery
                  data={topicWithGifs}
                  onPrepareTweet={this.handlePrepareTweet}
                />
              }>
            </Route>
            <Route 
              exact path="/trends"
              render={props => 
                <Gallery
                  {...props}
                  data={trendsWithGif}
                  onTopicClick={this.handleTopicClick}
                  onPrepareTweet={this.handlePrepareTweet}
                />
              }>
            </Route>
            <Route 
              path="/trends/:topic"
              render={() => 
                <Gallery
                  data={topicWithGifs}
                  onPrepareTweet={this.handlePrepareTweet}
                />
              }>
            </Route>
            <Route 
              path="/search/:id"
              render={() => 
                <Gallery
                  data={topicWithGifs}
                  onPrepareTweet={this.handlePrepareTweet}
                />
              }>
            </Route>
            <Route 
              path="/tweet"
              render={() => 
                <Tweet
                  userPhoto={user.photo}
                  onPostTweet={this.handlePostTweet}
                />
              }>
            </Route>
            <Route 
              path="/favorites"
              render={() => 
                <Gallery
                  data={favorites}
                  user={user}
                  favorites={true}
                  onPrepareTweet={this.handlePrepareTweet}
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
              render={() => <Redirect to="/trends" /> }>
            </Route>
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

/* withRouter will pass updated match, location, and history props 
to the wrapped component whenever it renders. It gives access to the 
history object’s properties and the closest <Route>'s match. This is necessary
because this component is not nested inside a <Route />, which can pass the 
match, location, and history props to it's nested child component */
export default withRouter(App);
