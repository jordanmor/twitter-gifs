import React from 'react';
import 'emoji-mart/css/emoji-mart.css';
import emojiData from 'emoji-mart/data/twitter.json'
import { NimblePicker } from 'emoji-mart'

const EmojiPicker = ({ showEmojiPicker, onSelect }) => {

  if (!showEmojiPicker) return null;

  return ( 
    <React.Fragment>
      <NimblePicker 
      className="emoji"
      set='twitter' 
      data={emojiData} 
      title='Pick your emoji…' emoji='point_up'
      onSelect={onSelect}
      emojiSize={18}
      />
    </React.Fragment>
   );
}
 
export default EmojiPicker;