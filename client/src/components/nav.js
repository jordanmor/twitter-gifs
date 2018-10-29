import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return ( 
    <ul className="nav my-4">
      <li className="nav-item">
        <Link to="/favorites" className="btn btn-primary">Favorites</Link>
      </li>
      <li className="nav-item ml-2">
        <Link to="/user" className="btn btn-primary">Current User</Link>
      </li>
      <li className="nav-item ml-2">
        <Link to="/giphys" className="btn btn-primary">Giphys</Link>
      </li>
      <li className="nav-item ml-2">
        <Link to="/randomWords" className="btn btn-primary">Random Words</Link>
      </li>
      <li className="nav-item ml-2">
        <Link to="/twitterTrends" className="btn btn-primary">Twitter Trends</Link>
      </li>
      <li className="nav-item ml-2">
        <a href="http://localhost:5000/api/auth/login/twitter" className="btn btn-primary">Login to Twitter</a>
      </li>
      <li className="nav-item ml-2">
        <a href="http://localhost:5000/api/auth/logout" className="btn btn-primary">Logout</a>
      </li>
    </ul>
   );
}
 
export default Nav;