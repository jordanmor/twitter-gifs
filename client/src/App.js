import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Favorites from './components/favorites';
import Users from './components/users';
import Giphys from './components/giphys';

class App extends Component {

  state = { 
    favorites: [],
    users: [],
    randomWords: [],
    giphys: []
  }

  // Fetch passwords after first mount
  componentDidMount() {
    this.getFavorites();
    this.getUsers();
    this.getRandomWords();
    this.getGiphys();
  }

  getRandomWords = () => {
    const wordnikApiKey = process.env.REACT_APP_WORDNIK_APIKEY;
    // Get random words from Wordnik API
    fetch(`https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=20&api_key=${wordnikApiKey}`)
    .then(res => res.json())
    .then(data => {
      const randomWords = data.map(item => ({ id: item.id, word: item.word }));
      this.setState({ randomWords });
    })
  }

  getGiphys = () => {
    const giphyApiKey = process.env.REACT_APP_GIPHY_APIKEY;
    const searchTopic = 'cats';
    // Get giphys from GIPHY API
    fetch(`https://api.giphy.com/v1/gifs/search?q=${searchTopic}&limit=5&api_key=${giphyApiKey}`)
    .then(res => res.json())
    .then(data => {
      console.log(data.data);
      const giphys = data.data.map(giphy => ({ id: giphy.id, image: giphy.images.fixed_height.url, title: giphy.title }));
      this.setState({ giphys });
    })
  }

  getFavorites = () => {
    // Get favorites from api and store in state
    fetch('/api/favorites')
      .then(res => res.json())
      .then(favorites => this.setState({ favorites }));
  }

  getUsers = () => {
    // Get users from api and store in state
    fetch('/api/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
  }

  render() {
    const { favorites, users, randomWords, giphys } = this.state;

    return (
      <div className="App">
        <div className="container">
          <h1>Result: {process.env.REACT_APP_HOST}</h1>
          <Switch>
            <Route 
              path="/favorites"
              render={() => 
                <Favorites 
                  favorites={favorites}
                  randomWords={randomWords}
                />}
            />
            <Route 
              path="/users"
              render={() => 
                <Users 
                  users={users}
                />}
            />
            <Route 
              path="/giphys"
              render={() => 
                <Giphys 
                  giphys={giphys}
                />}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
