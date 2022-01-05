import React, {useState} from 'react';
import axios from 'axios';
import './LoginForm.css';
import {API_BASE_URL, LOGIN_ACCESS_TOKEN, LOGIN_ACCESS_USERNAME} from '../../constants/consts';
import {withRouter} from "react-router-dom";

function LoginForm(props) {
  const [state, setState] = useState({
    username: "",
    password: "",
    successMessage: null
  });

  const handleChange = (e) => {
    const {id, value} = e.target
    setState(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    const payload = {
      "username": state.username,
      "password": state.password,
    };
    axios.post(API_BASE_URL + '/user/login', payload)
      .then(function (response) {
        if (response.status === 200) {
          const code = response.data.errorCode;
          if (code === 0) {
            setState(prevState => ({
              ...prevState,
              'successMessage': 'Login successful. Redirecting to detail page..'
            }));
            localStorage.setItem(LOGIN_ACCESS_TOKEN, response.data.data.token);
            localStorage.setItem(LOGIN_ACCESS_USERNAME, response.data.data.username);
            props.showError(null);
            redirectToDetail();
          } else {
            props.showError(response.data.errorMessage);
          }
        } else {
          props.showError("login error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const redirectToDetail = () => {
    props.updateTitle('Detail')
    props.history.push('/detail');
  };

  return (
    <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
      <form>
        <div className="form-group text-left">
          <label htmlFor="exampleInputEmail1">Username</label>
          <input type="text"
                 className="form-control"
                 id="username"
                 placeholder="Enter username"
                 value={state.username}
                 onChange={handleChange}
          />

        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password"
                 className="form-control"
                 id="password"
                 placeholder="Password"
                 value={state.password}
                 onChange={handleChange}
          />
        </div>
        <div className="form-check">
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >LOGIN
        </button>
      </form>
      <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none'}} role="alert">
        {state.successMessage}
      </div>
      <div className="helpMessage">
        <span>Dont have an account? go to the console to get it</span>
      </div>
    </div>
  );
}

export default withRouter(LoginForm);
