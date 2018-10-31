import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = ({ count }) => {

  const rootUrl = process.env.REACT_APP_ROOT_URL;

  return ( 
    <React.Fragment>
      <div className="nav-top">
        <div className="container">
          <nav className="navbar navbar-dark">

            <a className="navbar-brand" href="/">Twitter GIFs</a>

            <form className="form-inline my-lg-0 search">
              <input className="form-control mr-sm-2" type="search" placeholder="Search topic" aria-label="Search" />
            </form>
            
            <div>
              <i className="material-icons">person_outline</i>
              <a href={`${rootUrl}api/auth/login/twitter`} className="btn btn-primary">Login to Twitter</a>
            </div>

          </nav>
        </div>
      </div>

      <div className="nav-bottom">
        <div className="container">
          <ul className="nav d-flex">
            <li className="lead text-muted">The latest Twitter trends matched with GIFs</li>
            <li className="nav-item">
              <NavLink exact to="/trends" className="btn btn-outline-secondary">Today's Trending Topics</NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact to="/randomTopics" className="btn btn-outline-secondary">Random Topics</NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact to="/favorites" className="favorites btn btn-outline-secondary justify-content-between">
                My Favorite Topics 
                <span className="badge badge-secondary badge-pill">{count}</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </React.Fragment>
   );
}
 
export default Nav;