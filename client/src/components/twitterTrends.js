import React from 'react';

const TwitterTrends = ({ trends }) => {
  return ( 
    <div>
      <h1>{trends.length} twitterTrends</h1>
      <ul className="trends">
        {trends.map( trend =>
          <li key={trend.id}>
            {trend.name}
          </li>
        )}
      </ul>
    </div>
   );
}
 
export default TwitterTrends;