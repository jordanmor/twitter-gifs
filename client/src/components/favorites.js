import React from 'react';

const Favorites = ({ favorites }) => {
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
    </div>
   );
}
 
export default Favorites;