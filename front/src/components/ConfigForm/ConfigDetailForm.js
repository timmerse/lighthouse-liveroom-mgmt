import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {API_BASE_URL, LOGIN_ACCESS_TOKEN, LOGIN_ACCESS_USERNAME} from '../../constants/consts';
import {withRouter} from "react-router-dom";
import CustomTable from '../List/CustomTable';
import AlertDialog from "../Dialog/AlertDialog";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

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

  const handleEditClick = (e) => {
    e.preventDefault();
    redirectToUpdate();
  };


  const sendRestartServiceToServer = () => {
    const username = localStorage.getItem(LOGIN_ACCESS_USERNAME)
    const token = localStorage.getItem(LOGIN_ACCESS_TOKEN);
    if (!token || !username) redirectToLogin();

    const payload = {
      "username": username,
      "token": token,
    };

    axios.post(API_BASE_URL + '/service/restart_service', payload)
      .then(function (response) {
        if (response.status === 200) {
          // if token invalid
          if (response.data.errorCode !== 0) props.showError(response.data.errorMessage);
        } else {
          props.showError("we got some error!");
        }
      }).catch(function (error) {
      console.log(error);
    });
  };

  const handleRestart = () => {
    sendRestartServiceToServer();
  };

  return (
    <div>
      <CustomTable items={items}/>

      <ButtonGroup variant="outlined" aria-label="outlined primary button group" style={{margin : '20px'}}>
        <Button variant="outlined" onClick={handleEditClick}>
          Edit
        </Button>
        <AlertDialog
          onConfirm={handleRestart}
          title='Notice!'
          context='continue restart service? the service will be restart now!'
          text='Restart'
        />
      </ButtonGroup>
    </div>
  );
}

export default withRouter(ConfigForm);
