// src/lib/api/payments.ts

import apiClient from './client';
import { Payment } from '@/types/models';
import { RecordPaymentRequest } from '@/types/api';

export const paymentsApi = {
  record: async (data: RecordPaymentRequest): Promise<Payment> => {
    const response = await apiClient.post<Payment>('/payments', data);
    return response.data;
  },

  getByOrder: async (orderId: string): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/payments/order/${orderId}`);
    return response.data;
  },
};

export default paymentsApi;