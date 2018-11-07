import React from 'react';
import Like from '../common/like';

const Card = props => {

  const { id, topic, gif, liked, category, location } = props;
  const data = {id, topic, gif, liked, category};

  return ( 
    <div className="card mb-4 shadow-sm">
      <div className="card-header d-flex align-items-center justify-content-between">
        <i className="fa fa-twitter" onClick={() => props.onPrepareTweet(topic, gif.image)}></i>
        <Like liked={liked} onClick={() => props.onClickFavorite(data)} />
      </div>
      <img className="card-img-top" src={gif.image} alt={gif.title} />
      <div className="card-body text-center">
        {
          props.onTopicClick 
            ?
              <button onClick={() => props.onTopicClick(topic, location)} type="button" className="btn btn-outline-secondary">{topic}</button>
            :
              <p className="">{topic}</p>
        }
      </div>
    </div>
   );
}
 
export default Card;