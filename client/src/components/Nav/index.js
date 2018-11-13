import React from 'react';
import { NavLink } from 'react-router-dom';
import Login from './login';
import SearchForm from './searchForm';

const Nav = props => {

  const { count, user, onSearch, onLogout, onLogin } = props;

  return ( 
    <React.Fragment>
      <div className="nav-top">
        <div className="container">
          <nav className="navbar navbar-dark">

            <a className="navbar-brand" href="/">Twitter GIFs</a>

            <SearchForm onSearch={onSearch} />
            
            <Login user={user} onLogin={onLogin} onLogout={onLogout}/>
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