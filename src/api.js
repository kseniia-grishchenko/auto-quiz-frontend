import axios from 'axios';

const get = (uri, params = {}) => {
  axios.get(uri, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    params
  }).then(response => {
    return response;
  });
};

const getUnautorized = (uri, params = {}) => {
  axios.get(uri, {
    params
  }).then(response => {
    return response;
  });
};

const postUnauthorized = async (uri, params = {}) => {
  await axios.post(uri,
    params,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

export {
  get,
  getUnautorized,
  postUnauthorized
};
