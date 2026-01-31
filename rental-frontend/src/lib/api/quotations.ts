// src/lib/api/quotations.ts

import apiClient from './client';
import { Quotation } from '@/types/models';
import { CreateQuotationRequest } from '@/types/api';

export const quotationsApi = {
  getAll: async (): Promise<Quotation[]> => {
    const response = await apiClient.get<Quotation[]>('/quotations');
    return response.data;
  },

  getById: async (id: string): Promise<Quotation> => {
    const response = await apiClient.get<Quotation>(`/quotations/${id}`);
    return response.data;
  },

  create: async (data: CreateQuotationRequest): Promise<Quotation> => {
    const response = await apiClient.post<Quotation>('/quotations', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateQuotationRequest>): Promise<Quotation> => {
    const response = await apiClient.put<Quotation>(`/quotations/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/quotations/${id}`);
  },

  confirm: async (id: string): Promise<{ message: string; order: any }> => {
    const response = await apiClient.post<{ message: string; order: any }>(
      `/quotations/${id}/confirm`
    );
    return response.data;
  },
};

export default quotationsApi;