import axios from "axios";

export const BASE_URL = 'http://localhost:1337';

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 5000, // Aumenta o tempo limite para 5 segundos para garantir que as requisições não falhem por timeout
  headers: {
  }
});
