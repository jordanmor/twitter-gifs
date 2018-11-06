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
      random: 1,
      topicWithGifs: 4
    }
  }

  componentDidMount() {
    this.getTrendsWithGif();
    this.getRandomWordsWithGif();
    this.cacheTopicWithGifsPage();
    this.getUser();
  }

  getTrendsWithGif = async () => {
    const { limit } = this.state;
    const trends = await getTrends(limit.trends);
    const data = trends.map(async trend => {
      const trendName = cleanName(trend.name);
      const gif = await getGifs(trendName, 1);
      if (gif[0].id) {
        return matchLikedStatusWithFavorites(this.state.favorites, trend.id, trend.name, gif[0]);
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
      if (gif[0]) {
        return matchLikedStatusWithFavorites(this.state.favorites, wordData.id, word, gif[0]);
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
      if (gif.id) {
        return matchLikedStatusWithFavorites(this.state.favorites, gif.id, topic, gif);
      } else {
        return '';
      }
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

  handlePostTweet = async (text, gif) => {
    this.setState({ message: "Sending tweet..." });
    this.props.history.push('/tweet/success');
    const { data: message } = await axios.post('/api/twitter/tweet', {text, gif})
    this.setState({ message });
    setTimeout(() => {
      this.props.history.push('/');
    }, 1000);
  }

  handlePrepareTweet = (topic, gif) => {
    if(this.state.user) {
      sessionStorage.setItem('topic', topic);
      sessionStorage.setItem('gif', gif);
      this.props.history.push('/tweet');
    }
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
        this.changeLikedStatus(currentId, category);
        await axios.delete(`/api/favorites/${currentId}`);
        await this.getFavorites();
      } else {
        // Find clicked card and change status to liked in state
        this.changeLikedStatus(currentId, category);
        // Save clicked card to database as favorite
        await axios.post('/api/favorites', {topic, gif});
        // Retrieve updated list of favorites from database and save to state
        await this.getFavorites();
        const { favorites } = this.state;
        // Update relevant category's state to reflect new liked card
        const dataLiked = await this.state[category].map( item => {
          return matchLikedStatusWithFavorites(favorites, item.id, item.topic, item.gif);
        });
        this.setState({ [category]: dataLiked });
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
