import React from 'react';
import { Link } from 'react-router-dom';

const Users = ({ users }) => {
  return ( 
    <div>
      <h1>{users.length} users</h1>
      <ul className="users">
        {users.map( user =>
          <li key={user.id}>
            {user.name}
          </li>
        )}
      </ul>
      <Link to="/favorites" className="btn btn-primary">Favorites</Link>
    </div>
   );
}
 
export default Users;