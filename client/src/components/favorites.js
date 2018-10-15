import React from 'react';
import { Link } from 'react-router-dom';

const Favorites = ({ favorites, randomWords }) => {
  return ( 
    <div>
      <h1>{favorites.length} favorites</h1>
      <ul className="favorites">
        {favorites.map( favorite =>
          <li key={favorite._id}>
            {favorite.name}
          </li>
        )}
      </ul>
      <h1>{randomWords.length} randomWords</h1>
      <ul className="randomWords">
        {randomWords.map( randomWord =>
          <li key={randomWord.id}>
            {randomWord.word}
          </li>
        )}
      </ul>
      <Link to="/users" className="btn btn-primary">Users</Link>
    </div>
   );
}
 
export default Favorites;