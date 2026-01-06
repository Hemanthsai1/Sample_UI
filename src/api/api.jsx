import axios from 'axios';

const API = axios.create({
  baseURL: 'https://veritascribeapi.azurewebsites.net/',
  // baseURL: 'http://127.0.0.1:8000',
});

export default API;
