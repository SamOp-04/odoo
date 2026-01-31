// src/lib/api/invoices.ts

import apiClient from './client';
import { Invoice } from '@/types/models';

export const invoicesApi = {
  getAll: async (): Promise<Invoice[]> => {
    const response = await apiClient.get<Invoice[]>('/invoices');
    return response.data;
  },

  getById: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  download: async (id: string): Promise<{ pdf_url: string }> => {
    const response = await apiClient.get<{ pdf_url: string }>(`/invoices/${id}/download`);
    return response.data;
  },
};

export default invoicesApi;