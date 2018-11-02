import React from 'react';

const Card = props => {

  const {topic, gif, location } = props;

  return ( 
    <div className="card mb-4 shadow-sm">
      <div className="card-header d-flex align-items-center justify-content-between">
        <i className="fa fa-twitter" onClick={() => props.onPrepareTweet(topic, gif.image)}></i>
        <i className="fa fa-heart-o ml-auto"></i>
      </div>
      <img className="card-img-top" src={gif.image} alt={gif.title} />
      <div className="card-body text-center">
        {
          props.onTopicClick 
            ?
              <button onClick={() => props.onTopicClick(topic, location.pathname)} type="button" className="btn btn-outline-secondary">{topic}</button>
            :
              <p className="">{topic}</p>
        }
      </div>
    </div>
   );
}
 
export default Card;