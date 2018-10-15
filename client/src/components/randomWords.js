import React from 'react';

const RandomWords = ({ randomWords }) => {
  return ( 
    <div>
      <h1>{randomWords.length} randomWords</h1>
      <ul className="randomWords">
        {randomWords.map( randomWord =>
          <li key={randomWord.id}>
            {randomWord.word}
          </li>
        )}
      </ul>
    </div>
   );
}
 
export default RandomWords;