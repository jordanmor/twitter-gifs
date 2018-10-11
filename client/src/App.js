import React, { Component } from 'react';

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
          <div>
            <h1>{favorites.length} favorites</h1>
            <ul className="favorites">
              {favorites.map( favorite =>
                <li key={favorite.id}>
                  {favorite.name}
                </li>
              )}
            </ul>
          </div>
          <div>
            <h1>{users.length} users</h1>
            <ul className="users">
              {users.map( user =>
                <li key={user.id}>
                  {user.name}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
