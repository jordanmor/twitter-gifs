import React from 'react';

const Success = props => {

  if(!props.message) return null;

  return ( 
    <div className="container mt-4">
      <div className="success mx-auto my-5">
        <h1 className="text-center">{props.message}</h1>
      </div>
    </div>
   );
}
 
export default Success;