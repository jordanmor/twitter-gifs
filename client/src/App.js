import React, { Component } from 'react';
import { withRouter, Redirect, Switch, Route } from 'react-router-dom';
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
    randomWordsWithGif: [],
    topicWithGifs: []
  }

  // Fetch passwords after first mount
  componentDidMount() {
    this.getTrendsWithGif();
    this.getRandomWordsWithGif();
    this.persistTopicWithGifsPage();
    this.getUser();
  }

  getTrendsWithGif = async () => {
    const trends = await getTrends(4);
    const data = trends.map(async trend => {
      const trendName = cleanName(trend.name);
      const gif = await getGifs(trendName, 1);
      if (gif) {
        return {id: trend.id, topic: trend.name, gif: gif[0]};
      } else {
        return '';
      }
    });
    const trendsWithGif = await Promise.all(data);
    this.setState({ trendsWithGif });
  }

  getRandomWordsWithGif = async () => {
    const wordsData = await getRandomWords(1);
    const data = wordsData.map( async wordData => {
      const word = wordData.word;
      const gif = await getGifs(word, 1);
      if (gif) {
        return {id: wordData.id, topic: word, gif: gif[0]};
      } else {
        return '';
      }
    });
    const randomWordsWithGif = await Promise.all(data);
    this.setState({ randomWordsWithGif });
  }

  getTopicWithGifs = async topic => {
    const topicName = cleanName(topic);
    const gifs = await getGifs(topicName, 12);
    const topicWithGifs = gifs.map(gif => {
      if (gif) {
        return {id: gif.id, topic, gif};
      } else {
        return '';
      }
    });
    this.setState({ topicWithGifs });
  }

  persistTopicWithGifsPage = () => {
    const topic = localStorage.getItem('topic');
    if(topic) {
      const topicHashReplaced = topic.replace('#', 'hashtag_');
      if(this.props.location.pathname === `/${topicHashReplaced}`) {
        this.getTopicWithGifs(topic);
      }
    }
  }

  handleTopicClick = (topic, pathname) => {
    this.getTopicWithGifs(topic);
    const topicHashReplaced = topic.replace('#', 'hashtag_')
    const path = `${pathname}/${topicHashReplaced}`;
    localStorage.setItem('topic', topic);
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
    const { trendsWithGif, topicWithGifs, randomWordsWithGif } = this.state;

    return (
      <React.Fragment>
        <header>
          <Nav />
        </header>
        <main role="main">
          <Switch>
            <Route 
              exact path="/randomTopics"
              render={props => 
                <Gallery
                  {...props}
                  data={randomWordsWithGif}
                  onTopicClick={this.handleTopicClick}
                />
              }>
            </Route>
            <Route 
              path="/randomTopics/:topic"
              render={() => 
                <Gallery
                  data={topicWithGifs}
                />
              }>
            </Route>
            <Route 
              exact path="/trends"
              render={props => 
                <Gallery
                  {...props}
                  data={trendsWithGif}
                  onTopicClick={this.handleTopicClick}
                />
              }>
            </Route>
            <Route 
              path="/trends/:topic"
              render={() => 
                <Gallery
                  data={topicWithGifs}
                />
              }>
            </Route>
            <Route 
              exact path="/"
              render={() => <Redirect to="/trends" /> }>
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
