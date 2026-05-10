import client from './client';
import { ENDPOINTS } from './endpoints';

export const paymentService = {
  getMyPurchases: () => {
    return client.get(ENDPOINTS.PAYMENTS.MY_PURCHASES);
  },
  uploadProof: (purchaseId: string, formData: FormData) => {
    return client.post(ENDPOINTS.PAYMENTS.UPLOAD_PROOF(purchaseId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: () => {
    return client.get(ENDPOINTS.PAYMENTS.GET_ALL);
  },
  verify: (id: string, status: string, remarks?: string) => {
    return client.post(ENDPOINTS.PAYMENTS.VERIFY(id), { status, remarks });
  },
};
