import React, { Component } from 'react';

class App extends Component {

  state = { 
    colors: [] 
  }

  // Fetch passwords after first mount
  componentDidMount() {
    this.getColors();
  }

  getColors = () => {
    // Get the info from api and store in state
    fetch('/api/colors')
      .then(res => res.json())
      .then(colors => this.setState({ colors }));
  }

  render() {
    const { colors } = this.state;

    return (
      <div className="App">
        {/* Render the passwords if we have them */}
        {colors.length ? (
          <div>
            <h1>6 colors</h1>
            <ul className="colors">
              {/*
                Generally it's bad to use "index" as a key.
                It's ok for this example because there will always
                be the same number of colors, and they never
                change positions in the array.
              */}
              {colors.map((color, index) =>
                <li key={index}>
                  {color}
                </li>
              )}
            </ul>
          </div>
        ) : (
          // Render a helpful message otherwise
          <div>
            <h1>No colors :(</h1>
          </div>
        )}
      </div>
    );
  }
}

export default App;
