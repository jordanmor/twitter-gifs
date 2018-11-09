import React from 'react';
import EmojiPicker from '../common/emojiPicker';

const Textarea = props => {

  const { textAreaText, totalChars } = props;

  return ( 
    <div className="textarea-container d-flex">

      <div className="textarea-main">
        <textarea 
          className="form-control textArea1" 
          id="tweetTextArea"
          required
          minLength="1"
          rows="6"
          name="tweet-text"
          value={textAreaText}
          onChange={props.onTextInputChange}
          onClick={props.hideEmojiPicker}
          autoFocus
        >
        </textarea>
      </div>

      <div className="textarea-side d-flex flex-column justify-content-between align-items-center">
        <div className="emoji-container">
          <span onClick={props.toggleEmojiPicker} className="emojiImage" role="img" aria-label="Happy Face">😊</span>
          <EmojiPicker 
            onSelect={props.onAddEmoji}
            showEmojiPicker={props.showEmojiPicker}
          />
        </div>
        <span className={totalChars < 0 ? 'text-danger' : ''}>{totalChars}</span>
      </div>

    </div>
   );
}
 
export default Textarea;