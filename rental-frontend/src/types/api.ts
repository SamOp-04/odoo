// src/types/api.ts

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  company_name: string;
  gstin: string;
  role?: 'customer' | 'vendor';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'vendor' | 'admin';
  };
}

export interface CreateQuotationRequest {
  lines: Array<{
    product_id: string;
    variant_id?: string;
    quantity: number;
    rental_start_date: string;
    rental_end_date: string;
    rental_duration_type: 'hourly' | 'daily' | 'weekly' | 'custom';
  }>;
  notes?: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  category?: string;
  quantity_on_hand: number;
  cost_price?: number;
  sale_price?: number;
  rental_pricing: {
    hourly?: number;
    daily?: number;
    weekly?: number;
    custom?: {
      price: number;
      period_days: number;
    };
  };
  security_deposit: number;
  attributes?: Array<{ name: string; value: string }>;
  variants?: Array<{
    sku?: string;
    name: string;
    quantity: number;
    price_adjustment: number;
    attributes?: Array<{ name: string; value: string }>;
  }>;
}

export interface UpdateProfileRequest {
  name?: string;
  company_name?: string;
  gstin?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RecordPaymentRequest {
  invoice_id: string;
  order_id: string;
  amount: number;
  payment_method?: 'cash' | 'card' | 'upi' | 'netbanking';
}