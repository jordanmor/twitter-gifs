import React from 'react';
import Card from './card';

const Gallery = ({ data, onTopicClick, location, favorites, user }) => {

  if (favorites && !user) return <div className="container favorites-page">Please log in to your Twitter account to see your favorites</div>

  return ( 
    <div className="gallery bg-light">
      <div className="container">
        <div className="card-columns">
          {data.map( item => {
            if(item.gif) {
              return (
                <Card 
                  key={item.id} 
                  topic={item.topic}
                  gif={item.gif}
                  onTopicClick={onTopicClick}
                  location={location}
                />
              );
            } else {
              return null;
            }
          }
        )}
        </div>
      </div>
    </div>
   );
}
 
export default Gallery;