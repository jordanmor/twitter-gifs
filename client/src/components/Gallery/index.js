import React from 'react';
import Card from './card';
import { ToastContainer } from 'react-toastify';

const Gallery = props => {

  const { data, category, location, onTopicClick, onPrepareTweet, onClickFavorite } = props;
 
  if (category === "favorites" && !props.user) {
    return (
      <div className="container favorites-page">
        Please log in with your Twitter account to see your favorites Twitter Gifs
      </div>
    );
  }

  return ( 
    <div className="gallery bg-light">
      <div className="container">
        <div className="card-columns">
          {data.map( item => {
            if(item.gif) {
              return (
                <Card 
                  key={item.id}
                  id={item.id}
                  topic={item.topic}
                  gif={item.gif}
                  category={category}
                  liked={item.liked}
                  location={location}
                  onTopicClick={onTopicClick}
                  onPrepareTweet={onPrepareTweet}
                  onClickFavorite={onClickFavorite}
                />
              );
            } else {
              return null;
            }
          }
        )}
        </div>
      </div>
      <ToastContainer
        autoClose={3500}
        hideProgressBar
      />
    </div>
   );
}
 
export default Gallery;