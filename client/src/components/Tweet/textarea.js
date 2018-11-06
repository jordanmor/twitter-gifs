import React from 'react';
import EmojiPicker from '../common/emojiPicker';

const Textarea = props => {

  const { textAreaText } = props;

  const textAreaMaxLength = 280;
  const totalChars = textAreaMaxLength - textAreaText.length;

  return ( 
    <div className="textarea-container d-flex">

      <div className="textarea-main">
        <textarea 
          className="form-control textArea1" 
          id="tweetTextArea" 
          maxLength={props.textAreaMaxLength} 
          rows="5"
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
        <span>{totalChars}</span>
      </div>

    </div>
   );
}
 
export default Textarea;