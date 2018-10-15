import React from 'react';
import { Link } from 'react-router-dom';

const Giphys = ({ giphys }) => {
  return ( 
    <div>
      <h1>{giphys.length} giphys</h1>
      <ul className="giphys">
        {giphys.map( giphy =>
          <li key={giphy.id}>
            <img src={giphy.image} alt={giphy.title} className="img-fluid" />
          </li>
        )}
      </ul>
      <Link to="/favorites" className="btn btn-primary">Favorites</Link>
    </div>
   );
}
 
export default Giphys;