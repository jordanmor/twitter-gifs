import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './form';
 
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

  handleSubmit = e => {
    const { textAreaText, gif } = this.state; 
    e.preventDefault();
    this.props.onPostTweet(textAreaText, gif)
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

    const { userPhoto } = this.props;
    const { textAreaText, gif, showEmojiPicker } = this.state;

    return ( 
      <div className="container mt-4">
        <div className="tweet-container mx-auto mb-5">

          <div className="tweet-header mb-3">
            <h3>Compose new Tweet</h3>
            <Link to="/"><span>x</span></Link>
          </div>

          <div className="tweet-body d-flex justify-content-start align-items-start mb-3">
            <img className="tweet-photo" src={userPhoto} alt=""/>
            <Form
              onSubmit={this.handleSubmit}
              textAreaText={textAreaText}
              gif={gif}
              showEmojiPicker={showEmojiPicker}
              toggleEmojiPicker={this.toggleEmojiPicker}
              hideEmojiPicker={this.hideEmojiPicker}
              onTextInputChange={this.onTextInputChange}
              addEmoji={this.addEmoji}
            />
          </div>

        </div>

      </div> 
    );
  }
}
 
export default Tweet;