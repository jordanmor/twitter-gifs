import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Tweet extends Component {

  state = {
    textAreaText: '',
    gif: ''
  }

  componentDidMount() {
    this.populateTextArea();
  }

  onTextInputChange = e => {
    const textAreaText = e.target.value.toLowerCase();
    this.setState({ textAreaText });
  }

  populateTextArea = () => {
    const topic = localStorage.getItem('topic');
    const gif = localStorage.getItem('gif');
    this.setState({ 
      textAreaText: `${topic}`,
      gif
    });
  }

  render() { 

    const { userPhoto } = this.props;

    return ( 
      <div className="container mt-4">
        <div className="tweet-container m-auto">

          <div className="tweet-header mb-3">
            <h3>Compose new Tweet</h3>
            <Link to="/"><span>x</span></Link>
          </div>

          <div className="tweet-body d-flex justify-content-start align-items-start mb-3">
            <img className="tweet-photo" src={userPhoto} alt=""/>
            <form className="tweet-form d-flex flex-column" action="post" onSubmit={() => this.props.onTweet()}>
              <div className="form-group">
                <textarea 
                  className="form-control" 
                  id="tweetTextArea" 
                  maxLength="280" 
                  rows="5"
                  value={this.state.textAreaText}
                  onChange={this.onTextInputChange}
                >
                </textarea>
                <div className="tweet-gif">
                  <img src={this.state.gif} alt=""/>
                </div>
              </div>
              <button type="submit" className="tweet-btn btn btn-primary align-self-end">Tweet</button>
            </form>
          </div>

        </div>

      </div> 
    );
  }
}
 
export default Tweet;