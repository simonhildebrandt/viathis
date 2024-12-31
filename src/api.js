import axios from 'axios';
import useSWR from 'swr'

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

const fetcher = url => api.get(url).then(res => res.data)

function useAPISWR(path) {
  return useSWR(path, fetcher);
}

export { api, useAPISWR, setToken }
