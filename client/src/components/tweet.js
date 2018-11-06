import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'emoji-mart/css/emoji-mart.css';
import emojiData from 'emoji-mart/data/twitter.json'
import { NimblePicker } from 'emoji-mart'
 
class Tweet extends Component {

  state = {
    textAreaText: '',
    gif: '',
    showEmojiPicker: false
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

  hideEmojiPicker = () => {
    if(this.state.showEmojiPicker === true) {
      this.setState({ showEmojiPicker: false });
    }
  }

  toggleEmojiPicker = () => {
    const showEmojiPicker = !this.state.showEmojiPicker;
    this.setState({ showEmojiPicker });
  }

  addEmoji = emoji => {
    const textAreaText = this.state.textAreaText + emoji.native;
    this.setState({ textAreaText });
  }

  render() { 

    const { userPhoto, onPostTweet } = this.props;
    const { textAreaText, gif } = this.state;

    const textAreaMaxLength = 280;
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
                      onClick={this.hideEmojiPicker}
                      autoFocus
                    >
                    </textarea>
                  </div>
                  <div className="textarea-side d-flex flex-column justify-content-between align-items-center">
                    <div className="emoji-container">
                      <span onClick={this.toggleEmojiPicker} className="emojiImage" role="img" aria-label="Happy Face">😊</span>
                      {this.state.showEmojiPicker 
                        ?
                          <NimblePicker 
                            className="emoji"
                            set='twitter' 
                            data={emojiData} 
                            title='Pick your emoji…' emoji='point_up'
                            onSelect={this.addEmoji}
                            emojiSize={18}
                          />
                        : null
                      }
                    </div>
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

      </div> 
    );
  }
}
 
export default Tweet;