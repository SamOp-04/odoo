// src/lib/api/products.ts

import apiClient, { createFormData } from './client';
import { Product } from '@/types/models';
import { CreateProductRequest } from '@/types/api';

export const productsApi = {
  // Get all products
  getAll: async (params?: {
    category?: string;
    is_published?: boolean;
  }): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products', { params });
    return response.data;
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Create product (vendor/admin only)
  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  // Update product
  update: async (id: string, data: Partial<CreateProductRequest>): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  // Toggle publish status
  togglePublish: async (id: string): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}/toggle-publish`);
    return response.data;
  },

  // Check availability
  checkAvailability: async (params: {
    productId: string;
    variantId?: string;
    quantity: number;
    startDate: string;
    endDate: string;
  }): Promise<{
    available: boolean;
    availableQuantity: number;
    totalQuantity: number;
    reservedQuantity: number;
  }> => {
    const response = await apiClient.post('/products/check-availability', params);
    return response.data;
  },

  // Upload product images
  uploadImages: async (productId: string, images: File[]): Promise<Product> => {
    const formData = createFormData({ images });
    const response = await apiClient.post<Product>(
      `/products/${productId}/images`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  // Delete product image
  deleteImage: async (productId: string, imageUrl: string): Promise<Product> => {
    const response = await apiClient.delete<Product>(`/products/${productId}/images`, {
      data: { imageUrl },
    });
    return response.data;
  },

  // Set primary image
  setPrimaryImage: async (productId: string, imageUrl: string): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${productId}/primary-image`, {
      imageUrl,
    });
    return response.data;
  },
};

export default productsApi;