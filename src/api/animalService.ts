import client from './client';
import { ENDPOINTS } from './endpoints';

export interface AnimalFilters {
  status?: string;
  breed?: string;
  search?: string;
}

export const animalService = {
  getAll: (filters?: AnimalFilters) => {
    return client.get(ENDPOINTS.ANIMALS.GET_ALL, { params: filters });
  },

  getById: (id: string) => {
    return client.get(ENDPOINTS.ANIMALS.GET_BY_ID(id));
  },

  create: (formData: FormData) => {
    return client.post(ENDPOINTS.ANIMALS.CREATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update: (id: string, formData: FormData) => {
    return client.patch(ENDPOINTS.ANIMALS.UPDATE(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: (id: string) => {
    return client.delete(ENDPOINTS.ANIMALS.DELETE(id));
  },

  purchase: (id: string, installments: number) => {
    return client.post(ENDPOINTS.ANIMALS.PURCHASE(id), { installments });
  },

  assign: (id: string, userId: string, installments: number) => {
    return client.post(ENDPOINTS.ANIMALS.ASSIGN(id), { userId, installments });
  },
};
