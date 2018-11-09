import React from 'react';
import Textarea from './textarea';

const Form = props => {

  const { textAreaText, gif, onSubmit } = props;

  const textAreaMaxLength = 280;
  const totalChars = textAreaMaxLength - textAreaText.length;

  return ( 
    <form className="tweet-form d-flex flex-column" onSubmit={onSubmit}>

      <div className="form-group">

        <Textarea 
          textAreaText={textAreaText}
          onTextInputChange={props.onTextInputChange}
          hideEmojiPicker={props.hideEmojiPicker}
          toggleEmojiPicker={props.toggleEmojiPicker}
          showEmojiPicker={props.showEmojiPicker}
          onAddEmoji={props.addEmoji}
          totalChars={totalChars}
        />

        <div className="tweet-gif">
          <img src={gif} alt=""/>
        </div>

      </div>

      <button
        disabled={totalChars < 0}
        type="submit" 
        className="tweet-btn btn btn-primary align-self-end"
      >Tweet
      </button>

    </form>
   );
}
 
export default Form;