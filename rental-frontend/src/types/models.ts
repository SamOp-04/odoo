/* ===========================
   ENUM / UNION TYPES
=========================== */

export type UserRole = 'customer' | 'vendor' | 'admin';

export type OrderStatus =
  | 'confirmed'
  | 'picked_up'
  | 'with_customer'
  | 'returned'
  | 'cancelled';

export type QuotationStatus =
  | 'draft'
  | 'sent'
  | 'confirmed'
  | 'expired';

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'netbanking';

export type RentalDurationType = 'hourly' | 'daily' | 'weekly' | 'custom';

export type NotificationType =
  | 'pickup_reminder'
  | 'return_due'
  | 'late_return'
  | 'payment_success'
  | 'order_confirmed';

/* ===========================
   CORE MODELS
=========================== */

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  company_name?: string;
  gstin: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  is_active: boolean;
  email_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ===========================
   PRODUCT & VARIANTS
=========================== */

export interface ProductVariant {
  _id?: string;
  sku?: string;
  name: string;
  quantity: number;
  price_adjustment: number;
  attributes?: Array<{
    name: string;
    value: string;
  }>;
  images?: string[];
}

export interface Product {
  _id: string;
  vendor_id: string | User;
  name: string;
  description?: string;
  category?: string;
  is_rentable: boolean;
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
  is_published: boolean;
  images: string[];
  attributes?: Array<{
    name: string;
    value: string;
  }>;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

/* ===========================
   QUOTATIONS
=========================== */

export interface QuotationLine {
  product_id: string | Product;
  variant_id?: string;
  quantity: number;
  rental_start_date: string;
  rental_end_date: string;
  rental_duration_type: RentalDurationType;
  rental_duration_value: number;
  unit_price: number;
  subtotal: number;
}

export interface Quotation {
  _id: string;
  customer_id: string | User;
  quotation_number: string;
  status: QuotationStatus;
  lines: QuotationLine[];
  total_amount: number;
  deposit_amount: number;
  notes?: string;
  valid_until: string;
  createdAt: string;
  updatedAt: string;
}

/* ===========================
   ORDERS
=========================== */

export interface OrderLine {
  product_id: string | Product;
  product_name?: string;
  variant_id?: string;
  quantity: number;
  rental_start_date: string;
  rental_end_date: string;
  unit_price: number;
  subtotal: number;
  product_image?: string;
  product_images?: string[];
}

export interface RentalOrder {
  _id: string;
  quotation_id?: string | Quotation;
  customer_id: string | User;
  vendor_id: string | User;
  order_number: string;
  status: OrderStatus;
  lines: OrderLine[];
  total_amount: number;
  deposit_paid: number;
  full_payment_made: boolean;
  payment_status: PaymentStatus;
  pickup_date?: string;
  return_date: string;
  actual_return_date?: string;
  late_fee: number;
  pickup_images?: string[];
  return_images?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/* ===========================
   INVOICES & PAYMENTS
=========================== */

export interface InvoiceLine {
  description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
}

export interface Invoice {
  _id: string;
  order_id: string | RentalOrder;
  invoice_number: string;
  customer_id: string | User;
  vendor_id: string | User;
  invoice_date: string;
  due_date?: string;
  lines: InvoiceLine[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  status: InvoiceStatus;
  payment_method?: string;
  gstin_customer?: string;
  gstin_vendor?: string;
  pdf_url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  invoice_id: string | Invoice;
  order_id: string | RentalOrder;
  customer_id: string | User;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: 'pending' | 'success' | 'failed';
  transaction_id?: string;
  payment_date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/* ===========================
   NOTIFICATIONS
=========================== */

export interface Notification {
  _id: string;
  user_id: string | User;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  related_order?: string | RentalOrder;
  createdAt: string;
  updatedAt: string;
}

/* ===========================
   SETTINGS & ATTRIBUTES
=========================== */

export interface ProductAttribute {
  _id: string;
  name: string;
  values: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  _id: string;
  key: string;
  value: any;
  data_type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/* ===========================
   DASHBOARD STATS
=========================== */

export interface CustomerDashboardStats {
  totalOrders: number;
  activeOrders: number;
  totalSpent: number;
  recentOrders: RentalOrder[];
  recentInvoices: Invoice[];
}

export interface VendorDashboardStats {
  totalProducts: number;
  publishedProducts: number;
  totalOrders: number;
  activeRentals: number;
  totalRevenue: number;
  recentOrders: RentalOrder[];
}

export interface AdminDashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Array<{ _id: string; count: number }>;
  recentOrders: RentalOrder[];
}

/* ===========================
   AVAILABILITY & CART
=========================== */

export interface AvailabilityCheck {
  productId: string;
  variantId?: string;
  quantity: number;
  startDate: string;
  endDate: string;
}

export interface AvailabilityResponse {
  available: boolean;
  availableQuantity: number;
  totalQuantity: number;
  reservedQuantity: number;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  startDate: Date;
  endDate: Date;
  durationType: RentalDurationType;
  pricing: {
    unitPrice: number;
    subtotal: number;
    deposit: number;
    duration: number;
  };
}
