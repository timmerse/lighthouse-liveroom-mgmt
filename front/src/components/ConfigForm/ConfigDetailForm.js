import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './ConfigForm.css';
import {API_BASE_URL, LOGIN_ACCESS_TOKEN, LOGIN_ACCESS_USERNAME} from '../../constants/consts';
import {withRouter} from "react-router-dom";
import CustomTable from '../List/CustomTable';

function ConfigForm(props) {
  const [items, setItems] = useState({});

  const getDetailsFromServer = () => {
    props.showError(null);
    const username = localStorage.getItem(LOGIN_ACCESS_USERNAME)
    const token = localStorage.getItem(LOGIN_ACCESS_TOKEN);
    if (!token || !username) redirectToLogin();

    const payload = {
      "username": username,
      "token": token,
    };

    axios.post(API_BASE_URL + '/service/detail_config', payload)
      .then(function (response) {
        if (response.status === 200) {
          // if token invalid
          if (response.data.errorCode !== 0) redirectToLogin();
          setItems(response.data.data);
          props.showError(null);
        } else {
          props.showError("we got some error!");
        }
      }).catch(function (error) {
      console.log(error);
    });
  };

  /*
  * 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），
  * 可以传递一个空数组（[]）作为第二个参数。
  * 这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，
  * 所以它永远都不需要重复执行
  * @see https://zh-hans.reactjs.org/docs/hooks-effect.html
  */

  useEffect(() => {
    getDetailsFromServer();
    // eslint-disable-next-line
  }, []);

  const redirectToLogin = () => {
    props.updateTitle('Login')
    props.history.push('/login');
  };

  const redirectToUpdate = () => {
    props.updateTitle('Config');
    props.history.push('/config');
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    redirectToUpdate();
  };

  return (
    <div className>
      <form>
        <CustomTable items={items}/>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >
          EDIT
        </button>
      </form>
    </div>
  );
}

export default withRouter(ConfigForm);
