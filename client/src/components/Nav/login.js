import React from 'react';
import { Link } from 'react-router-dom';
const rootUrl = process.env.REACT_APP_ROOT_URL;

const Login = props => {
  if (props.user) {
    return ( 
      <div className="d-flex align-items-center">
        <Link to="/profile">
          <img className="user-photo" src={props.user.photo} alt=""/>
        </Link>
        <a href={`${rootUrl}api/auth/logout`} onClick={props.onLogout} className="btn btn-outline-primary ml-3">Logout</a>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center">
      <i className="fa fa-user"></i>
      <a href={`${rootUrl}api/auth/login/twitter`} onClick={props.onLogin} className="btn btn-outline-primary ml-3">Login to Twitter</a>
    </div>
  );
}
 
export default Login;