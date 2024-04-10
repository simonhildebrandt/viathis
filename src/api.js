import axios from 'axios';

let authToken = null;

const apiHost = API_HOST;

const api = axios.create({
  baseURL: apiHost + '/api',
  transformRequest: [
    function(data, headers) {
      headers['Authorization'] = authToken;
      return data;
    },
    ...axios.defaults.transformRequest
  ]
});

function setToken(token) {
  authToken = token;
}

export { api, setToken }
