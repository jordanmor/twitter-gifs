import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Nav from './components/nav';
import Gallery from './components/gallery';
import { getTrends, cleanName } from './services/trendsService';
import { getGifs } from './services/giphyService';

class App extends Component {

  state = { 
    favorites: [],
    user: null,
    trendsWithGif: [],
    trendWithGifs: [],
    randomWordsWithGif: [],
    randomWordWithGifs: []
  }

  // Fetch passwords after first mount
  componentDidMount() {
    this.getUser();
    this.getRandomWordsWithGif();
    this.getTrendsWithGif();
  }

  getRandomWordsWithGif = () => {
    const wordnikApiKey = process.env.REACT_APP_WORDNIK_APIKEY;
    // Get random words from Wordnik API
    fetch(`https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=20&api_key=${wordnikApiKey}`)
    .then(res => res.json())
    .then(data => {
      const randomWordsWithGif = data.map(item => ({ id: item.id, word: item.word }));
      this.setState({ randomWordsWithGif });
    })
  }

  getTrendsWithGif = async () => {
    const trends = await getTrends(8);
    const data = trends.map(async trend => {
      const trendName = cleanName(trend.name);
      const gif = await getGifs(trendName, 1);
      if (gif) {
        return {id: trend.id, trend: trend.name, gif: gif[0]};
      } else {
        return '';
      }
    });
    const trendsWithGif = await Promise.all(data);
    this.setState({ trendsWithGif });
  }

  getFavorites = () => {
    // Get favorites from api and store in state
    fetch('/api/favorites')
    .then(res => res.json())
    .then(favorites => this.setState({ favorites }));
  }

  getUser = async() => {
    let user;
    // Get user from api and store in state
    const response = await fetch('/api/auth/current_user');

    if (response.status === 200 ) {
      user = await response.json();
      this.setState({ user });
      this.getFavorites();
    }
  }

  render() {
    const { trendsWithGif } = this.state;

    return (
      <React.Fragment>
        <header>
          <Nav />
        </header>
        <main role="main">
          <Switch>
            <Route 
              path="/"
              render={() => 
                <Gallery
                  data={trendsWithGif}
                />
              }>
            </Route>
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
