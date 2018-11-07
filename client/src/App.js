import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Main from './components/main';
import Nav from './components/Nav';
import Footer from './components/footer';
import { getTrends, cleanName } from './services/trendsService';
import { getGifs } from './services/giphyService';
import { getRandomWords } from './services/wordnikService';
import { matchLikedStatusWithFavorites } from './services/likedStatus';
import axios from 'axios';
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
      trends: 2,
      random: 2,
      topicWithGifs: 2
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
    const randomWords = await getRandomWords(this.state.limit.random);

    const randomWordsWithGif = await randomWords.reduce( async (result, randomWord) => {
      const collection = await result;
      const { id, word: topic } = randomWord;
      const gif = await getGifs(topic, 1);
      if (gif[0]) {
        const twitterGif = {id, topic, gif: gif[0]};
        collection.push(matchLikedStatusWithFavorites(this.state.favorites, twitterGif));
      }
      return collection;
    }, Promise.resolve([]));

    this.setState({ randomWordsWithGif });
  }

  getTopicWithGifs = async topic => {
    const topicName = cleanName(topic);

    const gifs = await getGifs(topicName, this.state.limit.topicWithGifs);
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

  changeLikedStatus = (id, category) => {
    // Find clicked card and change liked status in state
   const twitterGifs = this.state[category].map(twitterGif => {
     if(twitterGif.id === id) {
       twitterGif.liked = !twitterGif.liked;
       twitterGif.id = uniqueString();
       return twitterGif;
     } else {
       return twitterGif;
     }
   });
   this.setState({ [category]: twitterGifs })
 }

  getFavorites = async () => {
    // Get favorites from api and store in state
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

  updateLikedStatus = category => {
    // Update relevant category's state to reflect new liked card
    const twitterGifs = this.state[category].map( twitterGif =>
      matchLikedStatusWithFavorites(this.state.favorites, twitterGif));

    this.setState({ [category]: twitterGifs });
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
    }
  }

  getUser = async() => {
    let user;
    // Get user from api and store in state
    const response = await axios.get('/api/auth/current_user');

    if (response.status === 200 ) {
      user = response.data;
      this.setState({ user });
      this.getFavorites(); // only load favorites when user logs in
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
