import React from 'react';
import { Link } from 'react-router-dom';

const Favorites = ({ favorites }) => {
  return ( 
    <div>
      <h1>{favorites.length} favorites</h1>
      <ul className="favorites">
        {favorites.map( favorite =>
          <li key={favorite.id}>
            {favorite.name}
          </li>
        )}
      </ul>
      <Link to="/users" className="btn btn-primary">Users</Link>
    </div>
   );
}
 
export default Favorites;