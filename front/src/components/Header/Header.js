import React from 'react';
import {withRouter} from "react-router-dom";
import {LOGIN_ACCESS_TOKEN} from '../../constants/consts';

function Header(props) {
  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  let title = capitalize(props.location.pathname.substring(1, props.location.pathname.length));

  function renderLogout() {
    if (props.location.pathname !== '/login' && props.location.pathname !== '/') {
      return (
        <div className="ml-auto">
          <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
        </div>
      )
    }
  }

  function handleLogout() {
    localStorage.removeItem(LOGIN_ACCESS_TOKEN)
    props.history.push('/login')
  }

  return (
    <nav className="navbar navbar-dark bg-primary">
      <div className="row col-12 d-flex justify-content-center text-white">
        <span className="h3">{props.title || title}</span>
        {renderLogout()}
      </div>
    </nav>
  );
}

export default withRouter(Header);
