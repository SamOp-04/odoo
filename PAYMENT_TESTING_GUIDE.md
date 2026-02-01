# Razorpay Payment Testing Guide

## Setup Complete ✅
- Backend running on: http://localhost:5000
- Frontend running on: http://localhost:3000
- Razorpay integration: ACTIVE

## How to Test Payment Gateway

### 1. Checkout Payment (Main Flow)

**Steps:**
1. Login as a customer
2. Browse products: http://localhost:3000/customer/products
3. Add a product to cart
4. Click "View Cart" or go to: http://localhost:3000/customer/cart
5. Click "Checkout" button
6. Fill delivery details
7. Click "Confirmed >"
8. Click "Pay Now" button
9. **Razorpay modal will open**

**Test Card Details:**
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)
- Name: Any name

**Expected Result:**
- Payment successful toast notification
- Redirected to confirmation page
- Order created in database
- Invoice generated
- Notification sent to customer

### 2. Express Checkout (Quick Payment)

**Steps:**
1. Go to cart: http://localhost:3000/customer/cart
2. Click "Pay with Save Card" button
3. Modal opens
4. Click "Pay Now"
5. **Razorpay modal opens**
6. Complete payment with test card

**Expected Result:**
- Payment processed
- Order created
- Redirected to orders page
- Cart cleared

### 3. Invoice Payment

**Steps:**
1. Go to invoices: http://localhost:3000/customer/invoices
2. Find an unpaid invoice (status: "sent" or "overdue")
3. Click "Pay Now" button next to the invoice
4. **Razorpay modal opens**
5. Complete payment with test card

**Expected Result:**
- Payment recorded
- Invoice status updated to "paid"
- Invoice list refreshes
- Amount due becomes 0

## Test Credentials

### Customer Account
- Email: `customer@test.com`
- Password: `password123`

### Vendor Account
- Email: `vendor@test.com`
- Password: `password123`

### Admin Account
- Email: `admin@test.com`
- Password: `password123`

## Razorpay Test Cards

### Successful Payments
- **Visa**: 4111 1111 1111 1111
- **Mastercard**: 5555 5555 5555 4444
- **Rupay**: 6522 2222 2222 2222

### Failed Payments (for testing error handling)
- **Card Declined**: 4111 1111 1111 1234

### OTP for Test Mode
- Use any 6-digit OTP when prompted

## What to Verify

### ✅ Frontend Checks
- [ ] Razorpay modal opens correctly
- [ ] Payment form displays properly
- [ ] Loading states show during payment
- [ ] Success notification appears after payment
- [ ] Error handling works for failed payments
- [ ] Page redirects after successful payment

### ✅ Backend Checks
- [ ] Razorpay order created successfully
- [ ] Payment signature verified
- [ ] Payment record saved to database
- [ ] Order status updated to "paid"
- [ ] Invoice status updated
- [ ] Notification created for customer

### ✅ Database Checks
Open MongoDB and verify:
- [ ] Payment document created with transaction_id
- [ ] Order payment_status = "paid"
- [ ] Invoice amount_paid updated
- [ ] Notification created

## Troubleshooting

### Issue: Razorpay modal doesn't open
**Solution:**
- Check browser console for errors
- Ensure Razorpay script loaded: View Source → Look for checkout.razorpay.com
- Clear cache and reload

### Issue: Payment verification fails
**Solution:**
- Check backend console for error messages
- Verify Razorpay keys in backend/.env
- Ensure keys don't have extra spaces or quotes

### Issue: "Payment failed" message
**Solution:**
- Check if using correct test card number
- Verify backend is running on port 5000
- Check network tab for API call failures

### Issue: Order created but payment not recorded
**Solution:**
- Check backend logs for verification errors
- Ensure JWT token is valid
- Verify user is authenticated

## API Testing with Postman

### Create Razorpay Order
```
POST http://localhost:5000/payments/razorpay/create-order
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json
Body:
{
  "amount": 1000,
  "order_id": "ORDER_ID_HERE",
  "invoice_id": "INVOICE_ID_HERE"
}
```

### Verify Payment
```
POST http://localhost:5000/payments/razorpay/verify
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json
Body:
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "order_id": "ORDER_ID_HERE",
  "invoice_id": "INVOICE_ID_HERE",
  "amount": 1000
}
```

## Production Checklist

Before going live:
- [ ] Replace test keys with live keys in .env
- [ ] Test with real card (small amount)
- [ ] Enable webhooks for payment status updates
- [ ] Set up proper error logging
- [ ] Configure email notifications
- [ ] Add payment receipt generation
- [ ] Implement refund functionality
- [ ] Add payment history page
- [ ] Set up payment analytics

## Support

For Razorpay documentation:
- Dashboard: https://dashboard.razorpay.com
- Docs: https://razorpay.com/docs/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/

## Notes
- All payments in TEST MODE - No real money charged
- Test payments auto-captured
- Use Razorpay dashboard to view test payments
- Signature verification is mandatory for security
