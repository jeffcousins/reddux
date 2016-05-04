import axios from 'axios';
import { browserHistory } from 'react-router';
import { API_URL, IS_SIGNED_IN, SIGN_IN_ERROR } from '../constants';

export function showThread (activePost) {
  console.log('SHOW_THREAD action fired', activePost);
  return {
    type: 'SHOW_THREAD',
    activePost
  };
}

export function fetchBrewContent (brewPath) {
  let brewId;
  if (brewPath[0] === '/') {
    brewId = brewPath.slice(3);
  } else {
    brewId = brewPath;
  }

  console.log('FETCH_BREW_CONTENT action fired', brewId);
  const getUrl = `${API_URL}/b/${brewId}`;

  return function (dispatch) {
    return axios({
      url: getUrl,
      timeout: 3000,
      method: 'get',
      responseType: 'json'
    })
      .then(function (response) {
        dispatch(receivedData(response.data));
      })
      .catch(function (response) {
        console.log('error trying to GET data from server:');
        console.log(response);
      });
  };
}

export function receivedData (data) {
  console.log('inside receivedData action creator: data is:');
  console.log(data);
  return {
    type: 'RECEIVED',
    payload: data
  };
}

export function userSignIn ({ username, password }) {
  console.log('inside userSignIn action creator.');
  const postUrl = `${API_URL}/signin`;

  return (dispatch) => {
    axios.post(postUrl, { username, password })
      .then((response) => {
        dispatch({ type: IS_SIGNED_IN });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/');
      })
      .catch(() => {
        dispatch(signInError('Incorrect username or password.'));
      });
  };
}

export function signInError (err) {
  return {
    type: SIGN_IN_ERROR,
    payload: err
  };
}
