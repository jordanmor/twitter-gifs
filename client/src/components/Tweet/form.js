import React from 'react';
import Textarea from './textarea';

const Form = props => {

  const { textAreaText, gif, onPostTweet } = props;

  return ( 
    <form className="tweet-form d-flex flex-column">

      <div className="form-group">

        <Textarea 
          textAreaText={textAreaText}
          onTextInputChange={props.onTextInputChange}
          hideEmojiPicker={props.hideEmojiPicker}
          toggleEmojiPicker={props.toggleEmojiPicker}
          showEmojiPicker={props.showEmojiPicker}
          onAddEmoji={props.addEmoji}
        />

        <div className="tweet-gif">
          <img src={gif} alt=""/>
        </div>

      </div>

      <button 
        onClick={() => onPostTweet(textAreaText, gif)}
        type="button" 
        className="tweet-btn btn btn-primary align-self-end"
      >Tweet
      </button>

    </form>
   );
}
 
export default Form;