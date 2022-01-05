import React, {useState} from 'react';
import axios from 'axios';
import './ConfigForm.css';
import {API_BASE_URL, LOGIN_ACCESS_TOKEN, LOGIN_ACCESS_USERNAME} from '../../constants/consts';
import {withRouter} from "react-router-dom";

function ConfigUpdateForm(props) {
  const [state, setState] = useState({
    appid: "",
    secret: "",
    successMessage: null
  });

  const handleChange = (e) => {
    const {id, value} = e.target;
    setState(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const redirectToLogin = () => {
    props.updateTitle('Login')
    props.history.push('/login');
  };

  const sendDetailsToServer = () => {
    if (state.appid.length && state.secret.length) {
      props.showError(null);
      const username = localStorage.getItem(LOGIN_ACCESS_USERNAME)
      const token = localStorage.getItem(LOGIN_ACCESS_TOKEN);
      if (!token || !username) redirectToLogin();

      const payload = {
        "username": username,
        'token': token,
        "sdkAppId": state.appid,
        "sdkSecret": state.secret,
      };

      axios.post(API_BASE_URL + '/service/update_config', payload)
        .then(function (response) {
          if (response.status === 200) {
            const code = response.data.errorCode;
            // if req error notice
            if (code !== 0) props.showError(response.data.errorMessage);

            setState(prevState => ({
              ...prevState,
              'successMessage': 'update conf successful. redirecting to detail page..'
            }));
            props.showError(null);
            redirectToDetail();
          } else {
            props.showError("we got some error!");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      props.showError('Please enter valid TRTC/IM sdk AppId and Secret');
    }
  };

  const redirectToDetail = () => {
    props.updateTitle('Detail')
    props.history.push('/detail');
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!state.appid) {
      props.showError('TRTC/IM sdk appId invalid');
    }
    if (!state.secret) {
      props.showError('TRTC/IM sdk secret invalid');
    } else {
      sendDetailsToServer();
    }
  };

  const handleBackClick = (e) => {
    redirectToDetail();
  };

  return (
    <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
      <form>
        <div className="form-group text-left">
          <label htmlFor="exampleSdkAppId">TRTC/IM sdk appId</label>
          <input type="text"
                 className="form-control"
                 id="appid"
                 aria-describedby="sdkAppIdHelp"
                 placeholder="Enter TRTC/IM sdk appId"
                 value={state.appid}
                 onChange={handleChange}
          />
          <small id="sdkAppIdHelp" className="form-text text-muted">you can get TRTC/IM sdk appId in tencent
            console</small>
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleInputSdkSecret">TRTC/IM sdk secret</label>
          <input type="password"
                 className="form-control"
                 id="secret"
                 placeholder="SdkSecret"
                 value={state.secret}
                 onChange={handleChange}
          />
        </div>
        <div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmitClick}
          >
            Update
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleBackClick}
          >
            Back
          </button>
        </div>

      </form>
      <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none'}} role="alert">
        {state.successMessage}
      </div>
    </div>
  );
}

export default withRouter(ConfigUpdateForm);
