import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import Nav from './components/nav';
import Gallery from './components/gallery';
import { getTrends, cleanName } from './services/trendsService';
import { getGifs } from './services/giphyService';
import { getRandomWords } from './services/wordnikService';

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
    // this.getRandomWordWithGif();
    this.getTrendsWithGif();
    this.persistTrendWithGifsPage();
  }

  persistTrendWithGifsPage = () => {
    const trend = localStorage.getItem('trend');
    if(trend) {
      const trendHashReplaced = trend.replace('#', 'hashtag_');
      if(this.props.location.pathname === `/${trendHashReplaced}`) {
        this.getTrendWithGifs(trend);
      }
    }
  }

  getRandomWordsWithGif = async () => {
    const wordsData = await getRandomWords(1);
    const data = wordsData.map( async wordData => {
      const word = wordData.word;
      const gif = await getGifs(word, 1);
      if (gif) {
        return {id: wordData.id, word, gif: gif[0]};
      } else {
        return '';
      }
    });
    const randomWordsWithGif = await Promise.all(data);
    console.log(randomWordsWithGif);
    this.setState({ randomWordsWithGif });
  }

  getTrendsWithGif = async () => {
    const trends = await getTrends(12);
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

  getTrendWithGifs = async trend => {
    const trendName = cleanName(trend);
    const gifs = await getGifs(trendName, 12);
    const trendWithGifs = gifs.map(gif => {
      if (gif) {
        return {id: gif.id, trend, gif};
      } else {
        return '';
      }
    });
    this.setState({ trendWithGifs });
  }

  handlePickTrend = trend => {
    this.getTrendWithGifs(trend);
    const trendHashReplaced = trend.replace('#', 'hashtag_')
    const path = `/${trendHashReplaced}`;
    localStorage.setItem('trend', trend);
    this.props.history.push(path);
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
    const { trendsWithGif, trendWithGifs } = this.state;

    return (
      <React.Fragment>
        <header>
          <Nav />
        </header>
        <main role="main">
          <Switch>
            <Route 
              path="/:trend"
              render={() => 
                <Gallery
                  data={trendWithGifs}
                />
              }>
            </Route>
            <Route 
              exact path="/"
              render={() => 
                <Gallery
                  data={trendsWithGif}
                  onPickTrend={this.handlePickTrend}
                />
              }>
            </Route>
          </Switch>
        </main>
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
