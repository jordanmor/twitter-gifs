import React, { Component } from 'react';
import { withRouter, Redirect, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Nav from './components/nav';
import Footer from './components/footer';
import Gallery from './components/gallery';
import Profile from './components/profile';
import Tweet from './components/Tweet';
import Success from './components/success';
import { getTrends, cleanName } from './services/trendsService';
import { getGifs } from './services/giphyService';
import { getRandomWords } from './services/wordnikService';
import { matchLikedStatusWithFavorites } from './services/likedStatus';
import uniqueString from 'unique-string';

class App extends Component {

  state = { 
    favorites: [],
    user: '',
    trendsWithGif: [],
    randomWordsWithGif: [],
    topicWithGifs: [],
    message: '',
    limit: {
      trends: 4,
      random: 4,
      topicWithGifs: 4
    }
  }

  componentDidMount() {
    this.getUser();
    this.getTrendsWithGif();
    this.getRandomWordsWithGif();
    this.cacheTopicWithGifsPage();
  }

  getTrendsWithGif = async () => {
    const trends = await getTrends(this.state.limit.trends);

    const trendsWithGif = await trends.reduce( async (result, trend) => {
      const collection = await result;
      const trendName = cleanName(trend.name);
      const gif = await getGifs(trendName, 1);
      if (gif[0]) {
        const twitterGif = {id: trend.id, topic: trend.name, gif: gif[0]};
        collection.push(matchLikedStatusWithFavorites(this.state.favorites, twitterGif));
      }
      return collection;
    }, Promise.resolve([]));

    this.setState({ trendsWithGif });
  }

  getRandomWordsWithGif = async () => {
    const wordsData = await getRandomWords(this.state.limit.random);

    const randomWordsWithGif = await wordsData.reduce( async (result, wordData) => {
      const collection = await result;
      const word = wordData.word;
      const gif = await getGifs(word, 1);
      if (gif[0]) {
        const twitterGif = {id: wordData.id, topic: word, gif: gif[0]};
        collection.push(matchLikedStatusWithFavorites(this.state.favorites, twitterGif));
      }
      return collection;
    }, Promise.resolve([]));

    this.setState({ randomWordsWithGif });
  }

  getTopicWithGifs = async topic => {
    const { limit } = this.state;
    const topicName = cleanName(topic);

    const gifs = await getGifs(topicName, limit.topicWithGifs);
    const topicWithGifs = gifs.map(gif => {
      const twitterGif = {id: gif.id, topic, gif};
      return matchLikedStatusWithFavorites(this.state.favorites, twitterGif);
    });

    this.setState({ topicWithGifs });
  }

  cacheTopicWithGifsPage = () => {
    const topic = sessionStorage.getItem('topic');
    if(topic) this.getTopicWithGifs(topic);
  }

  handleTopicClick = (topic, pathname) => {
    this.getTopicWithGifs(topic);
    const topicHashReplaced = topic.replace('#', 'hashtag_')
    const path = `${pathname}/${topicHashReplaced}`;
    sessionStorage.setItem('topic', topic);
    this.props.history.push(path);
  }

  handlePrepareTweet = (topic, gif) => {
    if(this.state.user) {
      sessionStorage.setItem('topic', topic);
      sessionStorage.setItem('gif', gif);
      this.props.history.push('/tweet');
    }
  }

  handlePostTweet = async (text, gif) => {
    this.setState({ message: "Sending tweet..." });
    this.props.history.push('/tweet/success');
    const { data: message } = await axios.post('/api/twitter/tweet', {text, gif})
    this.setState({ message });
    setTimeout(() => {
      this.props.history.push('/');
    }, 1000);
  }

  getFavorites = async () => {
    // Get favorites from api and store in state
    const { data } = await axios.get('/api/favorites');
    const favorites = data.map(favorite =>
      ({id: favorite._id, topic: favorite.topic, gif: favorite.gif, liked: true })
    );
    this.setState({ favorites });
  }

  changeLikedStatus = (id, category) => {
     // Find clicked card and change liked status in state
    const data = this.state[category].map(item => {
      if(item.id === id) {
        item.liked = !item.liked;
        item.id = uniqueString();
        return item;
      } else {
        return item;
      }
    });
    this.setState({ [category]: data })
  }

  handleClickFavorite = async data => {
    const { id: currentId, topic, gif, liked, category } = data;
    if(this.state.user) {
      if(liked) {
        if(category === 'favorites') {
          const categories = ['favorites', 'trendsWithGif', 'randomWordsWithGif', 'topicWithGifs'];
          categories.forEach(category => this.changeLikedStatus(currentId, category));
          await axios.delete(`/api/favorites/${currentId}`);
          this.getFavorites();
        } else {
          this.changeLikedStatus(currentId, category);
          await axios.delete(`/api/favorites/${currentId}`);
          await this.getFavorites();
          const twitterGifs = await this.state[category].map( twitterGif => {
            return matchLikedStatusWithFavorites(this.state.favorites, twitterGif);
          });
          this.setState({ [category]: twitterGifs });
        }
      } else {
        // Find clicked card and change status to liked in state
        this.changeLikedStatus(currentId, category);
        // Save clicked card to database as favorite
        await axios.post('/api/favorites', {topic, gif});
        // Retrieve updated list of favorites from database and save to state
        await this.getFavorites();
        // Update relevant category's state to reflect new liked card
        const twitterGifs = await this.state[category].map( twitterGif => {
          return matchLikedStatusWithFavorites(this.state.favorites, twitterGif);
        });
        this.setState({ [category]: twitterGifs });
      }
    }
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
    const { trendsWithGif, topicWithGifs, randomWordsWithGif, favorites, user, message } = this.state;

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
                  category={"randomWordsWithGif"}
                  onTopicClick={this.handleTopicClick}
                  onPrepareTweet={this.handlePrepareTweet}
                  onClickFavorite={this.handleClickFavorite}
                />
              }>
            </Route>
            <Route 
              path="/randomTopics/:topic"
              render={() => 
                <Gallery
                  data={topicWithGifs}
                  category={"topicWithGifs"}
                  onPrepareTweet={this.handlePrepareTweet}
                  onClickFavorite={this.handleClickFavorite}
                />
              }>
            </Route>
            <Route 
              exact path="/trends"
              render={props => 
                <Gallery
                  {...props}
                  data={trendsWithGif}
                  category={"trendsWithGif"}
                  onTopicClick={this.handleTopicClick}
                  onPrepareTweet={this.handlePrepareTweet}
                  onClickFavorite={this.handleClickFavorite}
                />
              }>
            </Route>
            <Route 
              path="/trends/:topic"
              render={() => 
                <Gallery
                  data={topicWithGifs}
                  category={"topicWithGifs"}
                  onPrepareTweet={this.handlePrepareTweet}
                  onClickFavorite={this.handleClickFavorite}
                />
              }>
            </Route>
            <Route 
              path="/search/:id"
              render={() => 
                <Gallery
                  data={topicWithGifs}
                  category={"topicWithGifs"}
                  onPrepareTweet={this.handlePrepareTweet}
                  onClickFavorite={this.handleClickFavorite}
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
                  category={"favorites"}
                  onPrepareTweet={this.handlePrepareTweet}
                  onClickFavorite={this.handleClickFavorite}
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
        <Footer />
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
