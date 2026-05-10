import client from './client';
import { ENDPOINTS } from './endpoints';

export const authService = {
  login: (data: any) => {
    return client.post(ENDPOINTS.AUTH.LOGIN, data);
  },
  register: (data: any) => {
    return client.post(ENDPOINTS.AUTH.REGISTER, data);
  },
  refresh: (refreshToken: string) => {
    return client.post(ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },
  logout: () => {
    return client.post(ENDPOINTS.AUTH.LOGOUT);
  },
};
