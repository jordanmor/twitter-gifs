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
    const textAreaText = e.target.value;
    this.setState({ textAreaText });
  }

  populateTextArea = () => {
    const textAreaText = sessionStorage.getItem('topic');
    const gif = sessionStorage.getItem('gif');
    this.setState({ textAreaText, gif });
  }

  render() { 

    const { userPhoto, onPostTweet } = this.props;
    const { textAreaText, gif } = this.state;

    // Twitter limit = 280. Subract an extra char for space separating tweet text and gif url.
    const textAreaMaxLength = 280 - gif.length - 1;
    const totalChars = textAreaMaxLength - textAreaText.length;

    return ( 
      <div className="container mt-4">
        <div className="tweet-container mx-auto mb-5">

          <div className="tweet-header mb-3">
            <h3>Compose new Tweet</h3>
            <Link to="/"><span>x</span></Link>
          </div>

          <div className="tweet-body d-flex justify-content-start align-items-start mb-3">
            <img className="tweet-photo" src={userPhoto} alt=""/>
            <form className="tweet-form d-flex flex-column">

              <div className="form-group">
                <div className="textarea-container d-flex">
                  <div className="textarea-main">
                    <textarea 
                      className="form-control textArea1" 
                      id="tweetTextArea" 
                      maxLength={textAreaMaxLength} 
                      rows="5"
                      name="tweet-text"
                      value={textAreaText}
                      onChange={this.onTextInputChange}
                      autoFocus
                    >
                    </textarea>
                    <textarea 
                      className="form-control textArea2" 
                      id="gifLinkTextArea"
                      rows="1"
                      name="tweet-text"
                      value={gif}
                      readOnly
                    >
                    </textarea>
                  </div>
                  <div className="textarea-side d-flex flex-column justify-content-between align-items-center">
                    <span role="img" aria-label="Happy Face">😊</span>
                    <span>{totalChars}</span>
                  </div>
                </div>

                <div className="tweet-gif">
                  <img src={gif} alt=""/>
                </div>
              </div>
              <button onClick={() => onPostTweet(textAreaText, gif)} type="button" className="tweet-btn btn btn-primary align-self-end">Tweet</button>
            </form>
          </div>

        </div>
        <div className="tweet-note mx-auto">
          <p>Note: Tweet character limit is effected by the number of characters in the GIF link.</p>
        </div>

      </div> 
    );
  }
}
 
export default Tweet;