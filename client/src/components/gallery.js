import React from 'react';
import Card from './card';

const Gallery = ({ data, onPickTrend }) => {
  // console.log(data);
  return ( 
    <div className="gallery bg-light">
      <div className="container">
        <div className="card-columns">
          {data.map( item => {
            if(item.gif) {
              return (
                <Card 
                  key={item.id} 
                  trend={item.trend}
                  gif={item.gif}
                  onPickTrend={onPickTrend}
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