import axios from 'axios';

let authToken = null;

const api = axios.create({
  baseURL: 'http://127.0.0.1:5001/viathis-8e25b/us-central1/api',
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
