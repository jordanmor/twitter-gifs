import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Favorites from './components/favorites';
import Users from './components/users';

class App extends Component {

  state = { 
    favorites: [],
    users: [],
    randomWords: []
  }

  // Fetch passwords after first mount
  componentDidMount() {
    this.getFavorites();
    this.getUsers();
    this.getRandomWords();
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
    const { favorites, users, randomWords } = this.state;

    return (
      <div className="App">
        <div className="container">
          <h1>Result: {process.env.REACT_APP_TEST}</h1>
          <Switch>
            <Route 
              path="/favorites"
              render={props => 
                <Favorites 
                  favorites={favorites}
                  randomWords={randomWords}
                />}
            />
            <Route 
              path="/users"
              render={props => 
                <Users 
                  users={users}
                />}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
