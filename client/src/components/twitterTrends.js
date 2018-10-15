import React from 'react';

const TwitterTrends = ({ twitterTrends }) => {
  return ( 
    <div>
      <h1>{twitterTrends.length} twitterTrends</h1>
      <ul className="twitterTrends">
        {twitterTrends.map( twitterTrend =>
          <li key={twitterTrend.id}>
            {twitterTrend.word}
          </li>
        )}
      </ul>
    </div>
   );
}
 
export default TwitterTrends;