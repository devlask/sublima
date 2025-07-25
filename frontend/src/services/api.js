import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // ajuste se sua porta for diferente
});

export default api;
