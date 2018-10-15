import React from 'react';

const Users = ({ users }) => {
  return ( 
    <div>
      <h1>{users.length} users</h1>
      <ul className="users">
        {users.map( user =>
          <li key={user._id}>
            {user.name}
          </li>
        )}
      </ul>
    </div>
   );
}
 
export default Users;