import React, { Component } from 'react';

class App extends Component {

  state = { 
    colors: [] 
  }

  // Fetch passwords after first mount
  componentDidMount() {
    this.getFavorites();
  }

  getColors = () => {
    // Get the info from api and store in state
    fetch('/api/favorites')
      .then(res => res.json())
      .then(favorites => this.setState({ favorites }));
  }

  render() {
    const { favorites } = this.state;

    return (
      <div className="App">
        {/* Render the passwords if we have them */}
        {favorites.length ? (
          <div>
            <h1>6 favorites</h1>
            <ul className="favorites">
              {/*
                Generally it's bad to use "index" as a key.
                It's ok for this example because there will always
                be the same number of favorites, and they never
                change positions in the array.
              */}
              {favorites.map((favorite, index) =>
                <li key={index}>
                  {favorite}
                </li>
              )}
            </ul>
          </div>
        ) : (
          // Render a helpful message otherwise
          <div>
            <h1>No favorites :(</h1>
          </div>
        )}
      </div>
    );
  }
}

export default App;
