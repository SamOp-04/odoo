import { Product, Order, Notification, VendorStats, VendorProfile } from '../types/vendor';

export const mockVendorStats: VendorStats = {
  totalRentals: 156,
  totalEarnings: 567890,
  activeRentals: 24,
  rentalsThisMonth: 45,
  earningsThisMonth: 125000,
};

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Professional Camera Kit',
    category: 'Electronics',
    description: 'High-end DSLR camera with lenses and accessories',
    sku: 'CAM-001',
    quantityAvailable: 5,
    baseRentalPrice: 500,
    securityDeposit: 5000,
    images: [
      { id: 'img-1', url: '/placeholder-camera.jpg', isPrimary: true }
    ],
    published: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Drone Equipment Set',
    category: 'Electronics',
    description: 'Professional drone with 4K camera and extra batteries',
    sku: 'DRN-002',
    quantityAvailable: 3,
    baseRentalPrice: 800,
    securityDeposit: 10000,
    images: [
      { id: 'img-2', url: '/placeholder-drone.jpg', isPrimary: true }
    ],
    published: false,
    createdAt: '2025-01-20T14:30:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
  },
  {
    id: 'prod-3',
    name: 'Studio Lighting Kit',
    category: 'Equipment',
    description: 'Complete studio lighting setup with stands',
    sku: 'LGT-003',
    quantityAvailable: 0,
    baseRentalPrice: 300,
    securityDeposit: 2000,
    images: [
      { id: 'img-3', url: '/placeholder-lights.jpg', isPrimary: true }
    ],
    published: true,
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-10T09:00:00Z',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'cust-1',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    customerPhone: '+91-9876543210',
    products: [
      {
        productId: 'prod-1',
        productName: 'Professional Camera Kit',
        productImage: '/placeholder-camera.jpg',
        quantity: 1,
        pricePerUnit: 500,
        lineTotal: 1500,
      },
    ],
    rentalStartDate: '2025-02-01T10:00:00Z',
    rentalEndDate: '2025-02-04T10:00:00Z',
    status: 'Confirmed',
    rentalTotal: 1500,
    securityDeposit: 5000,
    tax: 270,
    grandTotal: 6770,
    amountPaid: 6770,
    createdAt: '2025-01-31T08:00:00Z',
    statusHistory: [
      { status: 'Confirmed', timestamp: '2025-01-31T08:00:00Z', note: 'Order confirmed' },
    ],
  },
  {
    id: 'ORD-002',
    customerId: 'cust-2',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    customerPhone: '+91-9876543211',
    products: [
      {
        productId: 'prod-2',
        productName: 'Drone Equipment Set',
        productImage: '/placeholder-drone.jpg',
        quantity: 1,
        pricePerUnit: 800,
        lineTotal: 5600,
      },
    ],
    rentalStartDate: '2025-01-28T14:00:00Z',
    rentalEndDate: '2025-02-04T14:00:00Z',
    status: 'With Customer',
    rentalTotal: 5600,
    securityDeposit: 10000,
    tax: 1008,
    grandTotal: 16608,
    amountPaid: 16608,
    createdAt: '2025-01-27T10:00:00Z',
    statusHistory: [
      { status: 'Confirmed', timestamp: '2025-01-27T10:00:00Z' },
      { status: 'With Customer', timestamp: '2025-01-28T14:15:00Z', note: 'Picked up by customer' },
    ],
  },
  {
    id: 'ORD-003',
    customerId: 'cust-3',
    customerName: 'Mike Wilson',
    customerEmail: 'mike@example.com',
    customerPhone: '+91-9876543212',
    products: [
      {
        productId: 'prod-3',
        productName: 'Studio Lighting Kit',
        productImage: '/placeholder-lights.jpg',
        quantity: 1,
        pricePerUnit: 300,
        lineTotal: 600,
      },
    ],
    rentalStartDate: '2025-01-20T09:00:00Z',
    rentalEndDate: '2025-01-22T09:00:00Z',
    status: 'Returned',
    rentalTotal: 600,
    securityDeposit: 2000,
    tax: 108,
    grandTotal: 2708,
    amountPaid: 2708,
    createdAt: '2025-01-19T15:00:00Z',
    statusHistory: [
      { status: 'Confirmed', timestamp: '2025-01-19T15:00:00Z' },
      { status: 'With Customer', timestamp: '2025-01-20T09:30:00Z' },
      { status: 'Returned', timestamp: '2025-01-22T10:00:00Z', note: 'Returned in good condition' },
    ],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'info',
    title: 'Pickup Reminder',
    description: 'Order #ORD-001 pickup scheduled for 10:00 AM today',
    timestamp: '2025-02-01T08:00:00Z',
    read: false,
    actionLink: '/vendor/orders/ORD-001',
  },
  {
    id: 'notif-2',
    type: 'warning',
    title: 'Return Due Soon',
    description: 'Order #ORD-002 return due in 3 days',
    timestamp: '2025-02-01T09:00:00Z',
    read: false,
    actionLink: '/vendor/orders/ORD-002',
  },
  {
    id: 'notif-3',
    type: 'success',
    title: 'Order Completed',
    description: 'Order #ORD-003 has been returned successfully',
    timestamp: '2025-01-22T10:15:00Z',
    read: true,
    actionLink: '/vendor/orders/ORD-003',
  },
];

export const mockVendorProfile: VendorProfile = {
  id: 'vendor-1',
  name: 'Vendor Name',
  companyName: 'Company Name',
  email: 'vendor@example.com',
  phone: '+91-9876543210',
  address: '123 Business Street, City, State 400001',
  gstin: '27AABCU9603R1ZM',
};
