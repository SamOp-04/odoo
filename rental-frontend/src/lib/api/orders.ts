// src/lib/api/orders.ts

import apiClient from './client';
import { RentalOrder } from '@/types/models';

export const ordersApi = {
  getAll: async (): Promise<RentalOrder[]> => {
    const response = await apiClient.get<RentalOrder[]>('/orders');
    return response.data;
  },

  getById: async (id: string): Promise<RentalOrder> => {
    const response = await apiClient.get<RentalOrder>(`/orders/${id}`);
    return response.data;
  },

  markAsPickedUp: async (id: string, images?: File[]): Promise<RentalOrder> => {
    const formData = new FormData();
    if (images) {
      images.forEach(image => formData.append('images', image));
    }
    
    const response = await apiClient.patch<RentalOrder>(
      `/orders/${id}/pickup`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  markAsReturned: async (
    id: string,
    data: {
      actualReturnDate?: string;
      conditionNotes?: string;
    },
    images?: File[]
  ): Promise<RentalOrder> => {
    const formData = new FormData();
    formData.append('actualReturnDate', data.actualReturnDate || new Date().toISOString());
    if (data.conditionNotes) formData.append('conditionNotes', data.conditionNotes);
    if (images) {
      images.forEach(image => formData.append('images', image));
    }
    
    const response = await apiClient.patch<RentalOrder>(
      `/orders/${id}/return`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  cancel: async (id: string): Promise<{ message: string; order: RentalOrder }> => {
    const response = await apiClient.post<{ message: string; order: RentalOrder }>(
      `/orders/${id}/cancel`
    );
    return response.data;
  },
};

export default ordersApi;