import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5001/viathis-8e25b/us-central1/api'
});

export { api }
