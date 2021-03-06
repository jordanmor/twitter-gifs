import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { getTrends } from './services/trendsService';
import { getGifs } from './services/giphyService';
import { getRandomWords } from './services/wordnikService';
import { formatText } from './services/formatText';
import { matchLikedStatusWithFavorites } from './services/likedStatus';
import { toast } from 'react-toastify';
import axios from 'axios';
import uniqueString from 'unique-string';

import Main from './components/main';
import Nav from './components/Nav';
import Footer from './components/footer';
import Loader from './components/common/loader';

class App extends Component {

  state = { 
    favorites: [],
    user: '',
    trendsWithGif: [],
    randomWordsWithGif: [],
    topicWithGifs: [],
    message: '',
    loading: false,
    limit: {
      trends: 8,
      random: 4,
      topicWithGifs: 8
    }
  }

  componentDidMount() {
    this.getUser();
    this.getTrendsWithGif();
    this.getRandomWordsWithGif();
    this.cacheTopicWithGifsPage();
  }

  getTrendsWithGif = async () => {
    this.setState({ loading: true });
    const trends = await getTrends(this.state.limit.trends);

    // Pair each twitter trend with a GIF and save into an array
    // If no GIF is found for a given topic, that topic is not included in the array
    const trendsWithGif = await trends.reduce( async (result, trend) => {
      const collection = await result;
      const trendName = formatText(trend.name);
      const gif = await getGifs(trendName, 1);
      if (gif[0]) {
        const twitterGif = {id: trend.id, topic: trend.name, gif: gif[0]};
        /* If twitterGif is matched with a favorite, it's liked status is changed to true 
           and it's id is changed to the favorite's id */
        collection.push(matchLikedStatusWithFavorites(this.state.favorites, twitterGif));
      }
      return collection;
    }, Promise.resolve([]));

    this.setState({ trendsWithGif, loading: false });
  }

  getRandomWordsWithGif = async () => {
    this.setState({ loading: true });
    const randomWords = await getRandomWords(this.state.limit.random);

    // Pair each random word with a GIF and save into an array
    // If no GIF is found for a given topic, that topic is not included in the array
    const randomWordsWithGif = await randomWords.reduce( async (result, randomWord) => {
      const collection = await result;
      const { id, word: topic } = randomWord;
      const gif = await getGifs(topic, 1);
      if (gif[0]) {
        const twitterGif = {id, topic, gif: gif[0]};
        /* If twitterGif is matched with a favorite, it's liked status is changed to true 
           and it's id is changed to the favorite's id */
        collection.push(matchLikedStatusWithFavorites(this.state.favorites, twitterGif));
      }
      return collection;
    }, Promise.resolve([]));

    this.setState({ randomWordsWithGif, loading: false });
  }

  getTopicWithGifs = async topic => {
    this.setState({ loading: true });
    const topicName = formatText(topic);

    // Pair mulitple instances of a chosen topic with a GIF and save into an array
    const gifs = await getGifs(topicName, this.state.limit.topicWithGifs);
    const topicWithGifs = gifs.map(gif => {
      const twitterGif = {id: gif.id, topic, gif};
      /* If twitterGif is matched with a favorite, it's liked status is changed to true 
           and it's id is changed to the favorite's id */
      return matchLikedStatusWithFavorites(this.state.favorites, twitterGif);
    });

    this.setState({ topicWithGifs, loading: false });
  }

  // Preserve page with a chosen topic after a page refresh
  cacheTopicWithGifsPage = () => {
    const topic = sessionStorage.getItem('topic');
    if(topic) this.getTopicWithGifs(topic);
  }

  handleTopicClick = (topic, pathname) => {
    this.getTopicWithGifs(topic);
    const topicHashReplaced = topic.replace('#', 'hashtag_');
    pathname = pathname.replace(/\/$/, '');
    const path = `${pathname}/${topicHashReplaced}`;
    sessionStorage.setItem('topic', topic);
    this.props.history.push(path);
  }

  handlePrepareTweet = (topic, gif) => {
    if(this.state.user) {
      sessionStorage.setItem('topic', topic);
      sessionStorage.setItem('gif', gif);
      this.props.history.push('/tweet');
    } else {
        toast("Please log in with your Twitter account to post tweets.");
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
    // Get favorites from api, add a liked status of true and store in state
    const { data } = await axios.get('/api/favorites');
    const favorites = data.map(favorite =>
      ({id: favorite._id, topic: favorite.topic, gif: favorite.gif, liked: true })
    );
    this.setState({ favorites });
  }

  deleteFavorite = async id => {
    await axios.delete(`/api/favorites/${id}`);
    await this.getFavorites();
  }

  saveFavorite = async (topic, gif) => {
    await axios.post('/api/favorites', {topic, gif});
    await this.getFavorites();
  }

  handleClickFavorite = async data => {
    const { id: currentId, topic, gif, liked, category } = data;
    let categories = [];
    if(this.state.user) {
      if(liked) {
        categories = ['favorites', 'topicWithGifs', 'trendsWithGif', 'randomWordsWithGif'];
        // Changes liked status of all cards that match the deleted favorite's id
        categories.forEach(category => this.changeLikedStatus(currentId, category));
        await this.deleteFavorite(currentId);
      } else {
          this.changeLikedStatus(currentId, category);
          await this.saveFavorite(topic, gif);
          categories = ['topicWithGifs', 'trendsWithGif', 'randomWordsWithGif'];
          // Matches id of liked cards to the saved favorite's id
          categories.forEach(category => this.updateLikedStatus(category));
        }
    } else {
        toast("Please log in with your Twitter account to save your favorite Twitter GIFs.");
    }
  }

  changeLikedStatus = (id, category) => {
    // Find clicked card (twitterGif) and change liked status in state
   const twitterGifs = this.state[category].map(twitterGif => {
     if(twitterGif.id === id) {
       twitterGif.liked = !twitterGif.liked;
       /* When a favorite is deleted, any twitterGif's that matched that favorite
       will also have that favorite's id. To avoid more than one twitterGif from 
       having the same id, each twitterGif with the deleted favorite's id will be 
       assigned a new unique id */
       twitterGif.id = uniqueString();
       return twitterGif;
     } else {
       return twitterGif;
     }
   });
   this.setState({ [category]: twitterGifs });
  }

  updateLikedStatus = category => {
    // Update relevant category's state to reflect new liked card (twitterGif)
    const twitterGifs = this.state[category].map( twitterGif =>
      matchLikedStatusWithFavorites(this.state.favorites, twitterGif));

    this.setState({ [category]: twitterGifs });
  }

  handleLogin = () => {
    sessionStorage.setItem('user', 'true');
  }

  handleLogout = () => {
    sessionStorage.removeItem('user');
  }

  getUser = async() => {
    const loggedIn = sessionStorage.getItem('user');
    let user;
    if(loggedIn) {
      // Get user from api and store in state
      const response = await axios.get('/api/auth/current_user');
      if (response.status === 200 ) {
        user = response.data;
        this.setState({ user });
        this.getFavorites(); // only load favorites when user logs in
      } else {
        this.setState({ user: '' });
      }
    } else {
      this.setState({ user: '' });
    }
  }

  render() {
    const { trendsWithGif, topicWithGifs, randomWordsWithGif, favorites, user, message, loading } = this.state;

    return (
      <React.Fragment>
        <header>
          <Nav 
            onSearch={this.handleTopicClick}
            count={favorites.length}
            user={user}
            onLogin={this.handleLogin}
            onLogout={this.handleLogout}
          />
        </header>
        { loading
          ? 
            <Loader />
          : 
            <Main 
              trendsWithGif={trendsWithGif}
              topicWithGifs={topicWithGifs}
              randomWordsWithGif={randomWordsWithGif}
              favorites={favorites}
              user={user}
              message={message}
              location={this.props.location.pathname}
              onTopicClick={this.handleTopicClick}
              onPrepareTweet={this.handlePrepareTweet}
              onClickFavorite={this.handleClickFavorite}
              onPostTweet={this.handlePostTweet}
            />
        }
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
