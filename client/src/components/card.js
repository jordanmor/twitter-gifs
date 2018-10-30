import React from 'react';

const Card = props => {

  const {trend, gif } = props;

  return ( 
    <div className="card mb-4 shadow-sm">
      <div className="card-header d-flex align-items-center justify-content-between">
        <i className="fa fa-twitter"></i>
        <i className="fa fa-heart ml-auto"></i>
      </div>
      <img className="card-img-top" src={gif.image} alt={gif.title} />
      <div className="card-body text-center">
        {
          props.onPickTrend 
            ?
              <button onClick={() => props.onPickTrend(trend)} type="button" className="btn btn-outline-secondary">{trend}</button>
            :
              <p className="">{trend}</p>  
        }
      </div>
    </div>
   );
}
 
export default Card;