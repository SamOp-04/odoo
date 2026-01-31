import {
  Vendor,
  AdminProduct,
  AdminOrder,
  AdminNotification,
  AdminStats,
  RevenueDataPoint,
  TopProduct,
  TopVendor,
  AdminProfile,
  SystemSettings,
  RentalPeriod,
  Attribute,
  User,
  RoleChangeHistory,
} from '../types/admin';

// Mock Vendors
export const mockVendors: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'Tech Rentals Pro',
    companyName: 'Tech Rentals Pro Ltd.',
    email: 'contact@techrentals.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra',
    gstin: '27AABCT1332L1ZZ',
    status: 'Active',
    totalRevenue: 2450000,
    totalOrders: 124,
    activeProducts: 15,
    joinedDate: '2025-01-15',
    lastActive: '2026-01-30',
  },
  {
    id: 'vendor-2',
    name: 'Camera Equipment Hub',
    companyName: 'CEH Private Limited',
    email: 'info@camerahub.com',
    phone: '+91 98765 43211',
    address: 'Bangalore, Karnataka',
    gstin: '29AABCT1332L1ZY',
    status: 'Active',
    totalRevenue: 1890000,
    totalOrders: 98,
    activeProducts: 22,
    joinedDate: '2025-02-10',
    lastActive: '2026-01-31',
  },
  {
    id: 'vendor-3',
    name: 'Event Gear Rentals',
    companyName: 'Event Gear Solutions',
    email: 'hello@eventgear.com',
    phone: '+91 98765 43212',
    address: 'Delhi, NCR',
    gstin: '07AABCT1332L1ZX',
    status: 'Inactive',
    totalRevenue: 567000,
    totalOrders: 34,
    activeProducts: 8,
    joinedDate: '2025-06-20',
    lastActive: '2026-01-15',
  },
];

// Mock Products
export const mockAdminProducts: AdminProduct[] = [
  {
    id: 'prod-1',
    name: 'Sony A7 III Camera',
    vendorId: 'vendor-2',
    vendorName: 'Camera Equipment Hub',
    category: 'Cameras',
    description: 'Professional full-frame mirrorless camera',
    sku: 'CAM-A7III-001',
    baseRentalPrice: 2500,
    securityDeposit: 15000,
    quantityAvailable: 3,
    images: [
      { id: 'img-1', url: '/images/sony-a7iii.jpg', isPrimary: true },
    ],
    status: 'Published',
    totalRentals: 45,
    totalRevenue: 112500,
    createdAt: '2025-03-01',
    updatedAt: '2026-01-20',
  },
  {
    id: 'prod-2',
    name: 'DJI Mavic 3 Drone',
    vendorId: 'vendor-1',
    vendorName: 'Tech Rentals Pro',
    category: 'Drones',
    description: 'High-performance drone with 4K camera',
    sku: 'DRONE-M3-001',
    baseRentalPrice: 3500,
    securityDeposit: 25000,
    quantityAvailable: 2,
    images: [
      { id: 'img-2', url: '/images/dji-mavic3.jpg', isPrimary: true },
    ],
    status: 'Published',
    totalRentals: 67,
    totalRevenue: 234500,
    createdAt: '2025-02-15',
    updatedAt: '2026-01-25',
  },
  {
    id: 'prod-3',
    name: 'Godox SL-60W LED Light',
    vendorId: 'vendor-3',
    vendorName: 'Event Gear Rentals',
    category: 'Lighting',
    description: 'Professional LED video light',
    sku: 'LIGHT-SL60-001',
    baseRentalPrice: 800,
    securityDeposit: 3000,
    quantityAvailable: 0,
    images: [
      { id: 'img-3', url: '/images/godox-sl60.jpg', isPrimary: true },
    ],
    status: 'Unpublished',
    totalRentals: 12,
    totalRevenue: 9600,
    createdAt: '2025-07-01',
    updatedAt: '2026-01-10',
  },
];

// Mock Orders
export const mockAdminOrders: AdminOrder[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-2026-0001',
    vendorId: 'vendor-2',
    vendorName: 'Camera Equipment Hub',
    customerId: 'cust-1',
    customerName: 'Rajesh Kumar',
    customerEmail: 'rajesh@example.com',
    customerPhone: '+91 98765 00001',
    products: [
      {
        productId: 'prod-1',
        productName: 'Sony A7 III Camera',
        quantity: 1,
        price: 2500,
        total: 2500,
      },
    ],
    status: 'Confirmed',
    rentalPeriod: {
      start: '2026-02-01 10:00',
      end: '2026-02-02 10:00',
      duration: '24 hours',
    },
    pricing: {
      subtotal: 2500,
      deposit: 15000,
      tax: 450,
      total: 17950,
    },
    payment: {
      method: 'UPI',
      status: 'Paid',
      paidAt: '2026-01-30 15:30',
    },
    statusHistory: [
      { status: 'Confirmed', timestamp: '2026-01-30 15:30' },
    ],
    createdAt: '2026-01-30 15:30',
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-2026-0002',
    vendorId: 'vendor-1',
    vendorName: 'Tech Rentals Pro',
    customerId: 'cust-2',
    customerName: 'Priya Sharma',
    customerEmail: 'priya@example.com',
    customerPhone: '+91 98765 00002',
    products: [
      {
        productId: 'prod-2',
        productName: 'DJI Mavic 3 Drone',
        quantity: 1,
        price: 3500,
        total: 3500,
      },
    ],
    status: 'With Customer',
    rentalPeriod: {
      start: '2026-01-30 09:00',
      end: '2026-01-31 09:00',
      duration: '24 hours',
    },
    pricing: {
      subtotal: 3500,
      deposit: 25000,
      tax: 630,
      total: 29130,
    },
    payment: {
      method: 'Credit Card',
      status: 'Paid',
      paidAt: '2026-01-29 18:45',
    },
    statusHistory: [
      { status: 'Confirmed', timestamp: '2026-01-29 18:45' },
      { status: 'With Customer', timestamp: '2026-01-30 09:15' },
    ],
    createdAt: '2026-01-29 18:45',
  },
  {
    id: 'order-3',
    orderNumber: 'ORD-2026-0003',
    vendorId: 'vendor-2',
    vendorName: 'Camera Equipment Hub',
    customerId: 'cust-3',
    customerName: 'Amit Patel',
    customerEmail: 'amit@example.com',
    customerPhone: '+91 98765 00003',
    products: [
      {
        productId: 'prod-1',
        productName: 'Sony A7 III Camera',
        quantity: 1,
        price: 2500,
        total: 2500,
      },
    ],
    status: 'Returned',
    rentalPeriod: {
      start: '2026-01-28 14:00',
      end: '2026-01-29 14:00',
      duration: '24 hours',
    },
    pricing: {
      subtotal: 2500,
      deposit: 15000,
      tax: 450,
      total: 17950,
    },
    payment: {
      method: 'Net Banking',
      status: 'Paid',
      paidAt: '2026-01-27 20:30',
    },
    statusHistory: [
      { status: 'Confirmed', timestamp: '2026-01-27 20:30' },
      { status: 'With Customer', timestamp: '2026-01-28 14:10' },
      { status: 'Returned', timestamp: '2026-01-29 14:20' },
    ],
    createdAt: '2026-01-27 20:30',
  },
];

// Mock Notifications
export const mockAdminNotifications: AdminNotification[] = [
  {
    id: 'notif-1',
    type: 'warning',
    title: 'High-value order',
    description: 'Order ORD-2026-0002 worth ₹29,130 needs review',
    relatedEntity: {
      type: 'order',
      id: 'order-2',
      name: 'ORD-2026-0002',
    },
    timestamp: '2026-01-30 09:15',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'info',
    title: 'New vendor registration',
    description: 'Event Gear Rentals has registered and awaits approval',
    relatedEntity: {
      type: 'vendor',
      id: 'vendor-3',
      name: 'Event Gear Rentals',
    },
    timestamp: '2026-01-29 16:20',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'success',
    title: 'Product approved',
    description: 'DJI Mavic 3 Drone has been published',
    relatedEntity: {
      type: 'product',
      id: 'prod-2',
      name: 'DJI Mavic 3 Drone',
    },
    timestamp: '2026-01-29 12:00',
    read: true,
  },
];

// Mock Stats
export const mockAdminStats: AdminStats = {
  totalRevenue: 4907000,
  totalOrders: 256,
  activeVendors: 2,
  activeProducts: 37,
  todayRevenue: 47080,
  todayOrders: 2,
  revenueChange: 15,
  ordersChange: 8,
};

// Mock Revenue Data (Last 7 days)
export const mockRevenueData: RevenueDataPoint[] = [
  { date: '2026-01-25', revenue: 45000, orders: 3 },
  { date: '2026-01-26', revenue: 52000, orders: 4 },
  { date: '2026-01-27', revenue: 38000, orders: 2 },
  { date: '2026-01-28', revenue: 61000, orders: 5 },
  { date: '2026-01-29', revenue: 49000, orders: 3 },
  { date: '2026-01-30', revenue: 54000, orders: 4 },
  { date: '2026-01-31', revenue: 47080, orders: 2 },
];

// Mock Top Products
export const mockTopProducts: TopProduct[] = [
  {
    productId: 'prod-2',
    productName: 'DJI Mavic 3 Drone',
    vendorName: 'Tech Rentals Pro',
    totalRentals: 67,
    totalRevenue: 234500,
  },
  {
    productId: 'prod-1',
    productName: 'Sony A7 III Camera',
    vendorName: 'Camera Equipment Hub',
    totalRentals: 45,
    totalRevenue: 112500,
  },
  {
    productId: 'prod-3',
    productName: 'Godox SL-60W LED Light',
    vendorName: 'Event Gear Rentals',
    totalRentals: 12,
    totalRevenue: 9600,
  },
];

// Mock Top Vendors
export const mockTopVendors: TopVendor[] = [
  {
    vendorId: 'vendor-1',
    vendorName: 'Tech Rentals Pro',
    totalRevenue: 2450000,
    totalOrders: 124,
    status: 'Active',
  },
  {
    vendorId: 'vendor-2',
    vendorName: 'Camera Equipment Hub',
    totalRevenue: 1890000,
    totalOrders: 98,
    status: 'Active',
  },
  {
    vendorId: 'vendor-3',
    vendorName: 'Event Gear Rentals',
    totalRevenue: 567000,
    totalOrders: 34,
    status: 'Inactive',
  },
];

// Mock Admin Profile
export const mockAdminProfile: AdminProfile = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'Super Admin',
  phone: '+91 98765 99999',
};

// Mock System Settings
export const mockSystemSettings: SystemSettings = {
  rentalPeriodType: 'hourly',
  gstPercentage: 18,
  lateReturnGracePeriod: 2,
  lateReturnFeeType: 'percentage',
  lateReturnFeeValue: 10,
  maintenanceMode: false,
  autoApproveVendors: false,
};

// Mock Rental Periods
export const mockRentalPeriods: RentalPeriod[] = [
  {
    id: 'period-1',
    name: 'Weekend Package',
    duration: 2,
    durationUnit: 'days',
    active: true,
    createdAt: '2025-11-15T10:00:00Z',
  },
  {
    id: 'period-2',
    name: 'Weekly Rental',
    duration: 7,
    durationUnit: 'days',
    active: true,
    createdAt: '2025-11-15T10:00:00Z',
  },
  {
    id: 'period-3',
    name: 'Half Day',
    duration: 12,
    durationUnit: 'hours',
    active: false,
    createdAt: '2025-12-01T10:00:00Z',
  },
];

// Mock Attributes
export const mockAttributes: Attribute[] = [
  {
    id: 'attr-1',
    name: 'Color',
    key: 'color',
    type: 'single-select',
    required: false,
    options: ['Black', 'White', 'Silver', 'Red', 'Blue'],
    status: 'Active',
    usageCount: 45,
    createdAt: '2025-10-01T10:00:00Z',
  },
  {
    id: 'attr-2',
    name: 'Condition',
    key: 'condition',
    type: 'single-select',
    required: true,
    options: ['New', 'Like New', 'Good', 'Fair'],
    status: 'Active',
    usageCount: 78,
    createdAt: '2025-10-01T10:00:00Z',
  },
  {
    id: 'attr-3',
    name: 'Sensor Size',
    key: 'sensor_size',
    type: 'text',
    required: false,
    status: 'Active',
    usageCount: 32,
    createdAt: '2025-10-15T10:00:00Z',
  },
  {
    id: 'attr-4',
    name: 'Weight (kg)',
    key: 'weight',
    type: 'number',
    required: false,
    status: 'Active',
    usageCount: 56,
    createdAt: '2025-10-20T10:00:00Z',
  },
  {
    id: 'attr-5',
    name: 'Accessories Included',
    key: 'accessories',
    type: 'multi-select',
    required: false,
    options: ['Charger', 'Battery', 'Memory Card', 'Bag', 'Manual', 'Cables'],
    status: 'Active',
    usageCount: 41,
    createdAt: '2025-11-01T10:00:00Z',
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@example.com',
    role: 'user',
    status: 'Active',
    phone: '+91 98765 11111',
    createdAt: '2025-08-15T10:00:00Z',
    lastActive: '2026-01-31T08:30:00Z',
    orderCount: 12,
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'user',
    status: 'Active',
    phone: '+91 98765 22222',
    createdAt: '2025-09-10T10:00:00Z',
    lastActive: '2026-01-30T15:20:00Z',
    orderCount: 8,
  },
  {
    id: 'user-3',
    name: 'Tech Rentals Pro',
    email: 'contact@techrentals.com',
    role: 'vendor',
    status: 'Active',
    phone: '+91 98765 43210',
    createdAt: '2025-01-15T10:00:00Z',
    lastActive: '2026-01-30T18:00:00Z',
    orderCount: 124,
    productCount: 15,
  },
  {
    id: 'user-4',
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    role: 'user',
    status: 'Inactive',
    phone: '+91 98765 33333',
    createdAt: '2025-07-20T10:00:00Z',
    lastActive: '2025-12-15T10:00:00Z',
    orderCount: 3,
  },
  {
    id: 'user-5',
    name: 'Neha Verma',
    email: 'neha.verma@example.com',
    role: 'user',
    status: 'Suspended',
    phone: '+91 98765 44444',
    createdAt: '2025-10-05T10:00:00Z',
    lastActive: '2026-01-20T12:00:00Z',
    orderCount: 5,
  },
  {
    id: 'user-6',
    name: 'Camera Equipment Hub',
    email: 'info@camerahub.com',
    role: 'vendor',
    status: 'Active',
    phone: '+91 98765 43211',
    createdAt: '2025-02-10T10:00:00Z',
    lastActive: '2026-01-31T16:00:00Z',
    orderCount: 98,
    productCount: 22,
  },
  {
    id: 'user-7',
    name: 'Admin User',
    email: 'admin@rentalplatform.com',
    role: 'admin',
    status: 'Active',
    phone: '+91 98765 99999',
    createdAt: '2025-01-01T10:00:00Z',
    lastActive: '2026-01-31T09:00:00Z',
  },
];

// Mock Role Change History
export const mockRoleChangeHistory: Record<string, RoleChangeHistory[]> = {
  'user-3': [
    {
      id: 'change-1',
      fromRole: 'user',
      toRole: 'vendor',
      changedBy: 'user-7',
      changedByName: 'Admin User',
      reason: 'Vendor registration approved',
      timestamp: '2025-01-20T10:00:00Z',
    },
  ],
  'user-6': [
    {
      id: 'change-2',
      fromRole: 'user',
      toRole: 'vendor',
      changedBy: 'user-7',
      changedByName: 'Admin User',
      reason: 'Vendor registration approved',
      timestamp: '2025-02-15T10:00:00Z',
    },
  ],
};
