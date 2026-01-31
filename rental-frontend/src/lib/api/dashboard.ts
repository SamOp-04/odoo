// src/lib/api/dashboard.ts

import apiClient from './client';
import { CustomerDashboardStats, VendorDashboardStats, AdminDashboardStats } from '@/types/models';

export const dashboardApi = {
  getCustomerStats: async (): Promise<CustomerDashboardStats> => {
    const response = await apiClient.get<CustomerDashboardStats>('/dashboard/customer');
    return response.data;
  },

  getVendorStats: async (): Promise<VendorDashboardStats> => {
    const response = await apiClient.get<VendorDashboardStats>('/dashboard/vendor');
    return response.data;
  },

  getAdminStats: async (): Promise<AdminDashboardStats> => {
    const response = await apiClient.get<AdminDashboardStats>('/dashboard/admin');
    return response.data;
  },
};

export default dashboardApi;