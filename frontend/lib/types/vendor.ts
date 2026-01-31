export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  sku?: string;
  quantityAvailable: number;
  baseRentalPrice: number;
  securityDeposit: number;
  images: ProductImage[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export type OrderStatus = 'Confirmed' | 'With Customer' | 'Returned' | 'Canceled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: OrderProduct[];
  rentalStartDate: string;
  rentalEndDate: string;
  status: OrderStatus;
  rentalTotal: number;
  securityDeposit: number;
  tax: number;
  grandTotal: number;
  amountPaid: number;
  createdAt: string;
  statusHistory: StatusHistoryItem[];
}

export interface OrderProduct {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  pricePerUnit: number;
  lineTotal: number;
}

export interface StatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionLink?: string;
}

export interface VendorStats {
  totalRentals: number;
  totalEarnings: number;
  activeRentals: number;
  rentalsThisMonth: number;
  earningsThisMonth: number;
}

export interface VendorProfile {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
}
