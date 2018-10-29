import React from 'react';

const Users = ({ user }) => {
  if (user) {
    return ( 
      <div>
        <div className="d-flex align-items-center mb-2">
          <img src={user.photo} alt={user.name} />
          <h1 className="ml-2">{user.name}</h1>
        </div>
        <p>User Id: {user._id}</p>
        <p>Twitter Id: {user.twitterId}</p>
      </div>
     );
  } else {
    return null;
  }

}
 
export default Users;