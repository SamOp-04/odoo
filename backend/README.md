# Rental Management System - Backend

A comprehensive backend API for managing rental products, orders, invoicing, and customer interactions. Built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Models Overview](#models-overview)
- [Core Business Logic](#core-business-logic)
- [Development Guide](#development-guide)

## ✨ Features

### Core Functionality
- ✅ **User Management**: Multi-role system (Customer, Vendor, Admin)
- ✅ **Product Catalog**: Rentable products with variants and pricing
- ✅ **Quotation System**: Price proposals before order confirmation
- ✅ **Order Management**: Complete rental lifecycle tracking
- ✅ **Inventory Reservation**: Prevents double-booking
- ✅ **GST-Compliant Invoicing**: Auto-generated invoices with tax
- ✅ **Payment Tracking**: Multiple payment methods
- ✅ **Pickup & Return**: Document-based workflow
- ✅ **Notifications**: In-app notification system
- ✅ **Reports & Analytics**: Dashboard and exportable reports

### Business Features
- Flexible rental pricing (hourly, daily, weekly, custom)
- Security deposit management
- Late fee calculation
- Damage charge tracking
- Coupon/discount system
- Product attributes and variants
- Configurable system settings

## 🛠 Tech Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **PDF Generation**: PDFKit
- **File Storage**: AWS S3 (for invoices)
- **Validation**: express-validator

## 📁 Project Structure

```
rental-backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── index.js             # Model exports
│   ├── User.js
│   ├── Product.js
│   ├── Quotation.js
│   ├── RentalOrder.js
│   ├── Reservation.js       # ⚠️ Critical for preventing double-booking
│   ├── Invoice.js
│   ├── Payment.js
│   ├── PickupDocument.js
│   ├── ReturnDocument.js
│   ├── Notification.js
│   ├── Settings.js
│   ├── ProductAttribute.js
│   ├── Coupon.js
│   └── README.md
├── routes/                  # API route handlers (to be implemented)
├── controllers/             # Business logic controllers (to be implemented)
├── middleware/              # Custom middleware (to be implemented)
├── services/                # Business logic services (to be implemented)
├── scripts/
│   └── seed.js              # Database seeding (to be implemented)
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── server.js                # Application entry point
└── README.md
```

## 🚀 Installation

### Prerequisites

1. **Node.js** (v16 or higher)
   ```bash
   node --version
   ```

2. **MongoDB** (local or Atlas)
   - Local: [Download MongoDB](https://www.mongodb.com/try/download/community)
   - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

3. **AWS Account** (for S3 PDF storage)
   - Create S3 bucket
   - Get IAM credentials with S3 access

### Step-by-Step Setup

1. **Clone the repository** (or create new directory)
   ```bash
   mkdir rental-backend
   cd rental-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rental-management
   JWT_SECRET=your_super_secret_key_minimum_32_characters
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET_NAME=rental-invoices
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   # macOS/Linux
   mongod
   
   # Windows
   "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/rental-management` |
| `JWT_SECRET` | Secret key for JWT (min 32 chars) | `your_secret_key_here` |
| `JWT_EXPIRY` | Token expiration time | `7d` |
| `AWS_ACCESS_KEY_ID` | AWS access key | Your AWS key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Your AWS secret |
| `AWS_REGION` | AWS region | `ap-south-1` |
| `AWS_S3_BUCKET_NAME` | S3 bucket name | `rental-invoices` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `GST_RATE` | Default GST rate | `18` |
| `LATE_FEE_PER_DAY` | Late fee per day | `100` |

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add your IP to whitelist (or allow from anywhere: `0.0.0.0/0`)
4. Create database user
5. Get connection string and update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rental-management
   ```

### AWS S3 Setup

1. Create S3 bucket:
   - Go to AWS S3 Console
   - Create bucket (e.g., `rental-invoices`)
   - Set region (e.g., `ap-south-1`)
   - Configure permissions

2. Create IAM user:
   - Go to IAM Console
   - Create user with programmatic access
   - Attach policy: `AmazonS3FullAccess`
   - Save Access Key ID and Secret Access Key

3. Update `.env` with credentials

## 🎯 Running the Application

### Development Mode
```bash
npm run dev
```
Uses nodemon for auto-restart on file changes.

### Production Mode
```bash
npm start
```

### Seed Database (Optional)
```bash
npm run seed
```
Populates database with demo data.

### Server Output
```
╔════════════════════════════════════════════════╗
║   🚀 Rental Management System API Server      ║
║                                                ║
║   Environment: development                     ║
║   Port: 5000                                   ║
║   URL: http://localhost:5000                   ║
║                                                ║
║   Status: ✅ Running                            ║
╚════════════════════════════════════════════════╝

✅ MongoDB Connected: localhost
📊 Database: rental-management
```

### Test API
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-01-31T10:30:00.000Z"
}
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

### Planned API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

#### Products
- `GET /api/products` - List all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (vendor/admin)
- `PUT /api/products/:id` - Update product (vendor/admin)
- `DELETE /api/products/:id` - Delete product (vendor/admin)
- `PATCH /api/products/:id/publish` - Publish/unpublish product
- `POST /api/products/check-availability` - Check product availability

#### Quotations
- `GET /api/quotations` - List user quotations
- `GET /api/quotations/:id` - Get quotation details
- `POST /api/quotations` - Create quotation
- `PUT /api/quotations/:id` - Update quotation (draft only)
- `DELETE /api/quotations/:id` - Delete quotation
- `POST /api/quotations/:id/confirm` - Convert to order

#### Orders
- `GET /api/orders` - List orders (role-based)
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/pickup` - Mark as picked up
- `PATCH /api/orders/:id/return` - Mark as returned
- `POST /api/orders/:id/cancel` - Cancel order

#### Invoices
- `GET /api/invoices` - List invoices
- `GET /api/invoices/:id` - Get invoice details
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id/download` - Download PDF

#### Payments
- `POST /api/payments` - Record payment
- `GET /api/payments/order/:orderId` - Get order payments

#### Dashboard
- `GET /api/dashboard/customer` - Customer stats
- `GET /api/dashboard/vendor` - Vendor stats
- `GET /api/dashboard/admin` - Admin stats

#### Reports
- `GET /api/reports/revenue` - Revenue report
- `GET /api/reports/products` - Product performance
- `GET /api/reports/orders` - Orders report

## 🗂 Models Overview

### Critical Models

#### 1. Reservation Model ⚠️
**Most Important** - Prevents inventory conflicts and double-booking.

```javascript
{
  product_id: ObjectId,
  order_id: ObjectId,
  quantity_reserved: Number,
  start_date: Date,
  end_date: Date,
  status: 'active' | 'completed' | 'cancelled'
}
```

**How it works:**
1. When order is confirmed → Create reservation
2. Before creating quotation → Check overlapping reservations
3. When order is returned → Mark reservation as completed

#### 2. RentalOrder Model
Tracks the complete rental lifecycle.

**Status Flow:**
```
confirmed → picked_up → with_customer → returned
                                     ↘ cancelled
```

#### 3. Invoice Model
GST-compliant invoicing with tax calculation.

**Features:**
- Automatic tax calculation (default 18% GST)
- Partial payment support
- PDF generation and S3 upload
- GSTIN validation

### Model Relationships

```
User ──┬── Product
       ├── Quotation
       ├── RentalOrder
       └── Notification

Product ──┬── Quotation Lines
          ├── Order Lines
          └── Reservations

Quotation ──→ RentalOrder (on confirmation)

RentalOrder ──┬── Invoice
              ├── Payment
              ├── PickupDocument
              ├── ReturnDocument
              └── Reservation
```

## 🔧 Core Business Logic

### 1. Availability Checking

```javascript
// Check if product is available for rental period
async function checkAvailability(productId, quantity, startDate, endDate) {
  const overlapping = await Reservation.find({
    product_id: productId,
    status: 'active',
    $or: [
      { start_date: { $lte: startDate }, end_date: { $gte: startDate } },
      { start_date: { $lte: endDate }, end_date: { $gte: endDate } },
      { start_date: { $gte: startDate }, end_date: { $lte: endDate } }
    ]
  });
  
  const reserved = overlapping.reduce((sum, r) => sum + r.quantity_reserved, 0);
  const product = await Product.findById(productId);
  const available = product.quantity_on_hand - reserved;
  
  return available >= quantity;
}
```

### 2. Price Calculation

```javascript
function calculateRentalPrice(product, startDate, endDate, durationType) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let duration, unitPrice;
  
  switch(durationType) {
    case 'hourly':
      duration = Math.ceil((end - start) / (1000 * 60 * 60));
      unitPrice = product.rental_pricing.hourly;
      break;
    case 'daily':
      duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      unitPrice = product.rental_pricing.daily;
      break;
    // ... other cases
  }
  
  return {
    subtotal: unitPrice * duration,
    deposit: product.security_deposit,
    duration,
    unitPrice
  };
}
```

### 3. Late Fee Calculation

```javascript
function calculateLateFee(order) {
  const expected = new Date(order.return_date);
  const actual = new Date(order.actual_return_date || Date.now());
  
  if (actual <= expected) return 0;
  
  const lateDays = Math.ceil((actual - expected) / (1000 * 60 * 60 * 24));
  const feePerDay = await Settings.getValue('late_fee_per_day', 100);
  
  return lateDays * feePerDay;
}
```

### 4. Quotation to Order Conversion

```javascript
async function confirmQuotation(quotationId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // 1. Get quotation
    const quotation = await Quotation.findById(quotationId);
    
    // 2. Check availability for all items
    for (const line of quotation.lines) {
      const available = await checkAvailability(
        line.product_id,
        line.quantity,
        line.rental_start_date,
        line.rental_end_date
      );
      if (!available) throw new Error('Product not available');
    }
    
    // 3. Create order
    const order = await RentalOrder.create([orderData], { session });
    
    // 4. Create reservations
    await Reservation.insertMany(reservationData, { session });
    
    // 5. Update quotation status
    quotation.status = 'confirmed';
    await quotation.save({ session });
    
    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
```

## 👨‍💻 Development Guide

### Adding New Routes

1. Create route file in `routes/`
2. Create controller in `controllers/`
3. Add middleware if needed
4. Register in `server.js`

Example:
```javascript
// routes/products.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const productController = require('../controllers/productController');

router.get('/', productController.getAll);
router.post('/', authenticateToken, productController.create);

module.exports = router;
```

### Database Seeding

Create seed script in `scripts/seed.js`:
```javascript
const { User, Product, Settings } = require('../models');

async function seed() {
  // Create demo users
  const admin = await User.create({...});
  
  // Create demo products
  const product = await Product.create({...});
  
  // Create settings
  await Settings.setValue('gst_rate', 18, 'number');
}
```

### Testing

Use Postman or similar tool:
1. Import API collection
2. Set environment variables
3. Test each endpoint
4. Verify database changes

## 📝 Best Practices

### Security
- ✅ Hash passwords with bcrypt
- ✅ Validate all inputs
- ✅ Use JWT for authentication
- ✅ Implement rate limiting
- ✅ Sanitize user inputs

### Performance
- ✅ Use indexes on frequently queried fields
- ✅ Use `.lean()` for read-only operations
- ✅ Implement pagination for large datasets
- ✅ Cache frequently accessed data

### Code Quality
- ✅ Use consistent naming conventions
- ✅ Add JSDoc comments
- ✅ Handle errors properly
- ✅ Use async/await instead of callbacks
- ✅ Implement proper logging

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
ps aux | grep mongo  # Linux/Mac
tasklist | findstr mongo  # Windows

# Start MongoDB
mongod  # or systemctl start mongod
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📧 Support

For issues and questions, please open an issue in the repository.

---

**Built for:** Rental Management System Hackathon  
**Last Updated:** January 2025