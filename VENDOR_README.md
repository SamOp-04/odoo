# 24-Hour Rental Management System - Vendor Portal

A complete, production-ready vendor-facing frontend for a 24-hour rental management system built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### Dashboard
- **Quick Stats**: Total revenue, active rentals, available products, rentals this month
- **Active Rentals Table**: Overview of current customer rentals with status
- **Recent Orders**: Latest orders with quick actions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Product Management
- **Product Listing**: Search, filter by category/status, bulk actions
- **Add Product**: Full form with validation, inventory tracking, pricing
- **Edit Product**: Pre-populated forms with product data
- **Rental Pricing**: Hourly, daily, and weekly rates
- **Publish/Unpublish**: Toggle product visibility to customers
- **Image Upload**: Product image management (UI ready, backend integration needed)

### Order Management
- **Order Listing**: Search by order ID/customer, filter by status
- **Order Details**: Customer info, rental details, payment summary, status timeline
- **Status Management**: Mark orders as Picked Up or Returned
- **Date Range Filter**: Filter orders by date range
- **Real-time Updates**: Optimistic UI updates for status changes

### Reports & Analytics
- **Revenue Overview**: Track total and monthly earnings
- **Order Analytics**: Completed, active, and confirmed orders breakdown
- **Performance Metrics**: This month's performance with progress bars
- **Chart Placeholders**: Ready for integration with chart libraries (Chart.js, Recharts)

### Notifications
- **All/Unread Tabs**: Filter notifications by read status
- **Type-Based Icons**: Visual indicators (info, warning, error, success)
- **Mark as Read**: Individual and bulk actions
- **Action Links**: Direct links to related orders

### Profile Management
- **View/Edit Mode**: Toggle between viewing and editing profile
- **Business Information**: Vendor name, company, email, phone, address
- **Password Change**: Secure password update with confirmation
- **Profile Summary Card**: Quick view of vendor information

### Settings
- **Business Information**: Company legal name, GSTIN
- **Rental Settings**: Default rental period unit, deposit type
- **Notification Preferences**: Email and in-app notification toggles
- **Form Validation**: All settings validated before saving

## 📁 Project Structure

```
app/
├── vendor/
│   ├── layout.tsx                 # Main vendor layout with sidebar & top nav
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard with stats and tables
│   ├── products/
│   │   ├── page.tsx              # Products listing
│   │   ├── new/
│   │   │   └── page.tsx          # Add new product form
│   │   └── [productId]/
│   │       └── edit/
│   │           └── page.tsx      # Edit product form
│   ├── orders/
│   │   ├── page.tsx              # Orders listing
│   │   └── [orderId]/
│   │       └── page.tsx          # Order detail view
│   ├── reports/
│   │   └── page.tsx              # Reports & analytics
│   ├── notifications/
│   │   └── page.tsx              # Notifications center
│   ├── profile/
│   │   └── page.tsx              # Vendor profile
│   └── settings/
│       └── page.tsx              # Settings & preferences

components/
└── vendor/
    ├── StatCard.tsx              # Reusable stat display card
    ├── StatusBadge.tsx           # Color-coded status badges
    └── PageHeader.tsx            # Page header with breadcrumbs

lib/
├── types/
│   └── vendor.ts                 # TypeScript interfaces
└── mock-data/
    └── vendor.ts                 # Mock data for development
```

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom-built with dark theme
- **State Management**: React useState (local state)
- **Routing**: File-based routing with dynamic routes

## 🎨 Design System

### Theme
- **Background**: Black (`#000000`)
- **Borders**: White (`#FFFFFF`)
- **Primary**: Purple (`#9333EA`)
- **Text**: White for primary, Gray-400 for secondary
- **Accents**: 
  - Success: Green-500
  - Warning: Orange-500
  - Error: Red-500
  - Info: Blue-500

### Components
- **Buttons**: Rounded-full with hover effects
- **Cards**: Black background with white borders
- **Forms**: Black inputs with white borders, purple focus rings
- **Tables**: Responsive with hover states
- **Badges**: Color-coded with status variants

## 🚦 Getting Started

### Prerequisites
```bash
Node.js 18+
npm or yarn or pnpm
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd odoo
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open in browser**
```
http://localhost:3000/vendor/dashboard
```

## 📝 Key Features Implementation

### Routing
- All vendor routes are under `/vendor/*`
- Dynamic routes for product editing and order details
- Protected layout with navigation sidebar
- Mobile-responsive hamburger menu

### Forms
- Client-side validation with real-time error display
- Required field indicators
- Optimistic updates for better UX
- Cancel confirmation dialogs
- Loading states during save operations

### Data Management
- Mock data system for development
- Type-safe interfaces with TypeScript
- Simulated API calls with delays
- Ready for backend integration

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Responsive grid layouts
- Touch-friendly buttons and inputs
- Optimized for all screen sizes

## 🔄 Next Steps for Production

### Backend Integration
1. Replace mock data with actual API calls
2. Implement authentication and authorization
3. Add JWT token management
4. Set up environment variables

### Features to Add
1. **Image Upload**: Integrate with cloud storage (AWS S3, Cloudinary)
2. **Charts**: Add Chart.js or Recharts for reports
3. **Real-time Updates**: WebSocket for live notifications
4. **Export Functionality**: PDF/CSV export for reports
5. **Advanced Filtering**: More filter options, saved filters
6. **Bulk Actions**: Multi-select and bulk operations
7. **Search**: Implement full-text search
8. **Pagination**: Add pagination for large datasets

### Performance Optimization
1. Implement React Server Components where applicable
2. Add image optimization with Next.js Image component
3. Code splitting and lazy loading
4. Implement caching strategies
5. Add loading skeletons

### Testing
1. Unit tests with Jest
2. Integration tests with React Testing Library
3. E2E tests with Cypress or Playwright
4. Performance testing

### Deployment
1. Set up CI/CD pipeline
2. Configure production environment variables
3. Deploy to Vercel, Netlify, or custom server
4. Set up monitoring and error tracking

## 📚 TypeScript Interfaces

### Product
```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  images: ProductImage[];
  sku: string;
  quantity: number;
  basePrice: number;
  deposit: number;
  hourlyRate?: number;
  dailyRate?: number;
  weeklyRate?: number;
  isRentable: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Order
```typescript
interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  products: OrderProduct[];
  status: OrderStatus;
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
    status: string;
    paidAt?: string;
  };
  statusHistory: StatusHistoryItem[];
  createdAt: string;
}
```

### VendorProfile
```typescript
interface VendorProfile {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- The open-source community

---

Built with ❤️ using Next.js 14 and TypeScript
