import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Favorites from './components/favorites';
import Users from './components/users';

class App extends Component {

  state = { 
    favorites: [],
    users: []
  }

  // Fetch passwords after first mount
  componentDidMount() {
    this.getFavorites();
    this.getUsers();
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
    const { favorites, users } = this.state;

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
