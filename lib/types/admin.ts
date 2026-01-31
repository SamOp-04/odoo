// Admin-specific type definitions for the 24-hour Rental Management System

export interface Vendor {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Pending';
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  joinedDate: string;
  lastActive: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  vendorId: string;
  vendorName: string;
  category: string;
  description: string;
  sku?: string;
  baseRentalPrice: number;
  securityDeposit: number;
  quantityAvailable: number;
  images: ProductImage[];
  status: 'Published' | 'Unpublished';
  totalRentals: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
  moderationHistory?: ModerationAction[];
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ModerationAction {
  id: string;
  adminId: string;
  adminName: string;
  action: 'Published' | 'Unpublished' | 'Flagged';
  reason?: string;
  timestamp: string;
}

export type AdminOrderStatus = 'Confirmed' | 'With Customer' | 'Returned' | 'Canceled';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: AdminOrderProduct[];
  status: AdminOrderStatus;
  rentalPeriod: {
    start: string;
    end: string;
    duration: string;
  };
  pricing: {
    subtotal: number;
    deposit: number;
    tax: number;
    total: number;
  };
  payment: {
    method: string;
    status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
    paidAt?: string;
  };
  statusHistory: StatusHistoryItem[];
  createdAt: string;
}

export interface AdminOrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface StatusHistoryItem {
  status: AdminOrderStatus;
  timestamp: string;
  note?: string;
}

export interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  relatedEntity?: {
    type: 'vendor' | 'order' | 'product';
    id: string;
    name: string;
  };
  timestamp: string;
  read: boolean;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  activeVendors: number;
  activeProducts: number;
  todayRevenue: number;
  todayOrders: number;
  revenueChange: number; // percentage
  ordersChange: number; // percentage
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  vendorName: string;
  totalRentals: number;
  totalRevenue: number;
}

export interface TopVendor {
  vendorId: string;
  vendorName: string;
  totalRevenue: number;
  totalOrders: number;
  status: 'Active' | 'Inactive';
}

export interface RentalPeriod {
  id: string;
  name: string;
  duration: number;
  durationUnit: 'hours' | 'days';
  active: boolean;
  createdAt: string;
}

export interface Attribute {
  id: string;
  name: string;
  key: string;
  type: 'text' | 'number' | 'boolean' | 'single-select' | 'multi-select';
  required: boolean;
  options?: string[];
  status: 'Active' | 'Inactive';
  usageCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
  status: 'Active' | 'Inactive' | 'Suspended';
  phone?: string;
  createdAt: string;
  lastActive: string;
  orderCount?: number;
  productCount?: number;
}

export interface RoleChangeHistory {
  id: string;
  fromRole: 'user' | 'vendor' | 'admin';
  toRole: 'user' | 'vendor' | 'admin';
  changedBy: string;
  changedByName: string;
  reason?: string;
  timestamp: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export interface SystemSettings {
  rentalPeriodType: 'hourly' | 'daily';
  gstPercentage: number;
  lateReturnGracePeriod: number; // hours
  lateReturnFeeType: 'percentage' | 'flat';
  lateReturnFeeValue: number;
  maintenanceMode: boolean;
  autoApproveVendors: boolean;
}
