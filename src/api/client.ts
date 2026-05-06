import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '@env';

const BASE_URL = API_URL;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to headers
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration (optional for now)
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle logout or refresh token here
    }
    return Promise.reject(error);
  }
);

export default client;
