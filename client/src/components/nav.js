import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => {

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
              <NavLink to="/" className="btn btn-outline-secondary">Today's Trending Topics</NavLink>
            </li>
            <li className="nav-item">
              <button type="button" className="btn btn-outline-secondary">Random Topics</button>
            </li>
            <li className="nav-item">
              <button type="button" className="favorites btn btn-outline-secondary justify-content-between">
                My Favorite Topics 
                <span className="badge badge-secondary badge-pill">2</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </React.Fragment>
   );
}
 
export default Nav;