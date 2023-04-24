import axios from 'axios';

const get = (uri, params = {}) => {
  return axios.get(uri, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    params
  })
    .then((response) => response);
};

const getUnautorized = (uri, params = {}) => {
  axios.get(uri, {
    params
  }).then(response => {
    return response;
  });
};

const postUnauthorized = async (uri, payload = {}) => {
  await axios.post(uri,
    payload,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    });
};

const post = async (uri, payload = {}) => {
  return axios.post(uri,
    payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response);
};

const put = async (uri, payload = {}) => {
  return axios.put(uri,
    payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response);
};

const patch = async (uri, payload = {}) => {
  return axios.patch(uri,
    payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response);
};

const deleteRequest = async (uri) => {
  return axios.delete(uri,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response);
};

export {
  get,
  getUnautorized,
  post,
  postUnauthorized,
  put,
  patch,
  deleteRequest
};
