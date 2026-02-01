# Razorpay Payment Gateway Integration

## Overview
Complete Razorpay payment integration implemented across the application for all payment scenarios.

## Backend Integration

### 1. Environment Variables (.env)
```env
RAZORPAY_KEY_ID=rzp_test_DpoXZMrZsoUMtQ
RAZORPAY_KEY_SECRET=SyXyROX2G0WZJfIJaPRKT6qc
```

### 2. Payment Controller (`backend/src/controllers/paymentController.js`)
New endpoints added:
- **POST /payments/razorpay/create-order** - Creates a Razorpay order
  - Request: `{ amount, currency, order_id, invoice_id }`
  - Response: `{ order_id, amount, currency, key_id }`
  
- **POST /payments/razorpay/verify** - Verifies payment signature and records payment
  - Request: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id, invoice_id, amount }`
  - Response: `{ success, message, payment }`

### 3. Payment Routes (`backend/src/routes/payments.js`)
Routes configured with authentication:
```javascript
router.post('/razorpay/create-order', authenticateToken, createRazorpayOrder);
router.post('/razorpay/verify', authenticateToken, verifyRazorpayPayment);
```

## Frontend Integration

### 1. Razorpay Script
Added to `rental-frontend/src/app/layout.tsx`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 2. Custom Hook (`rental-frontend/src/lib/hooks/useRazorpay.ts`)
Reusable hook for Razorpay integration:
- `initiatePayment()` - Handles complete payment flow
- Automatic order creation
- Payment verification
- Success/error callbacks
- Loading states

### 3. Payment Integration Points

#### A. Checkout Page (`rental-frontend/src/app/customer/checkout/new/page.tsx`)
- Full checkout flow with delivery and payment steps
- Razorpay integration on "Pay Now" button
- Order creation before payment
- Cart clearing after successful payment
- Confirmation page after payment

**Usage:**
1. User adds items to cart
2. Proceeds to checkout
3. Selects delivery method
4. Clicks "Pay Now" → Razorpay modal opens
5. Completes payment
6. Order confirmed and cart cleared

#### B. Cart Express Checkout (`rental-frontend/src/app/customer/cart/page.tsx`)
- Quick checkout from cart
- "Pay with Save Card" button
- Express order creation
- Direct Razorpay payment
- Redirect to orders after success

**Usage:**
1. User clicks "Pay with Save Card"
2. Modal opens (can be customized with saved cards)
3. Clicks "Pay Now" → Razorpay opens
4. Payment processed
5. Redirected to orders page

#### C. Invoice Payment (`rental-frontend/src/app/customer/invoices/page.tsx`)
- "Pay Now" button for unpaid invoices
- Shows amount due
- Direct payment for specific invoice
- Auto-refresh after payment
- Updates invoice status

**Usage:**
1. User views invoices list
2. Clicks "Pay Now" on unpaid invoice
3. Razorpay opens with due amount
4. Payment processed
5. Invoice status updated to "paid"

## Payment Flow

### 1. Order Creation Flow
```
Frontend → Create Quotation → Confirm Quotation → Create Order
         → Create Razorpay Order → Open Razorpay Checkout
```

### 2. Payment Verification Flow
```
Razorpay Success → Frontend receives payment details
                → Send to backend for verification
                → Backend verifies signature
                → Update order/invoice status
                → Create notification
                → Return success to frontend
```

## Features Implemented

### Security
✅ Server-side signature verification
✅ JWT authentication on all endpoints
✅ Secure key storage in .env
✅ No keys exposed to frontend

### User Experience
✅ Real-time payment status
✅ Loading indicators
✅ Success/error notifications
✅ Payment cancellation handling
✅ Auto-redirect after success

### Payment Scenarios
✅ New order checkout
✅ Express checkout from cart
✅ Invoice payment
✅ Partial payments support
✅ Multiple payment methods

### Order Management
✅ Order status updates
✅ Payment status tracking (paid/partial/pending)
✅ Invoice generation
✅ Payment history
✅ Customer notifications

## Testing

### Test Cards (Razorpay Test Mode)
- **Success:** 4111 1111 1111 1111
- **Failure:** 4111 1111 1111 1234
- Any future expiry date
- Any CVV

### Test Flow
1. Add product to cart
2. Go to checkout
3. Complete delivery details
4. Click "Pay Now"
5. Use test card: 4111 1111 1111 1111
6. Complete payment
7. Verify order created and invoice generated

## Notifications
After successful payment:
- Customer receives "Payment Successful" notification
- Order status updated to "paid" or "partial"
- Invoice marked as paid
- Email notification (if configured)

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /payments/razorpay/create-order | Create Razorpay order |
| POST | /payments/razorpay/verify | Verify and record payment |
| GET | /invoices | List customer invoices |
| GET | /invoices/:id/download | Download invoice PDF |
| POST | /quotations/:id/confirm | Create order from quotation |

## Notes
- All amounts are in INR (₹)
- Razorpay expects amount in paise (multiply by 100)
- Signature verification is mandatory for security
- Payment method saved as "razorpay" in database
- Transaction ID from Razorpay stored for reference
