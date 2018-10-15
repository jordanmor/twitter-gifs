import React from 'react';

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
    </div>
   );
}
 
export default Giphys;