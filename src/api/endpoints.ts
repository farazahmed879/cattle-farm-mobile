export const ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    REFRESH: 'auth/refresh-token',
    LOGOUT: 'auth/logout',
  },
  ANIMALS: {
    GET_ALL: 'animals',
    GET_BY_ID: (id: string) => `animals/${id}`,
    CREATE: 'animals',
    UPDATE: (id: string) => `animals/${id}`,
    DELETE: (id: string) => `animals/${id}`,
    PURCHASE: (id: string) => `animals/${id}/purchase`,
    ASSIGN: (id: string) => `animals/${id}/assign`,
  },
  USERS: {
    GET_ALL: 'users',
    ME: 'users/me',
  },
  PAYMENTS: {
    VERIFY: (id: string) => `payments/${id}/verify`,
    GET_ALL: 'payments',
    MY_PURCHASES: 'payment/my-purchases',
    UPLOAD_PROOF: (id: string) => `payment/${id}/upload-proof`,
  },
};
