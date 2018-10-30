import React from 'react';

const Card = ({ trend, gif }) => {
  return ( 
    <div className="card mb-4 shadow-sm">
      <div className="card-header d-flex align-items-center justify-content-between">
        <i className="fa fa-twitter"></i>
        <i className="fa fa-heart ml-auto"></i>
      </div>
      <img className="card-img-top" src={gif.image} alt={gif.title} />
      <div className="card-body text-center">
        <button type="button" className="btn btn-outline-secondary">{trend}</button>
      </div>
    </div>
   );
}
 
export default Card;