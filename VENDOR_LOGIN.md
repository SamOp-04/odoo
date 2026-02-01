# Vendor Dashboard - Login Credentials

## Database Status
✅ Database seeded with vendor data

## Vendor Login Credentials

**Email:** `jane@vendor.com`  
**Password:** `password123`

## Vendor Dashboard Data
- **Total Products:** 4 (all published)
- **Total Orders:** 2
- **Active Rentals:** 1
- **Total Revenue:** ₹3,540.00

## How to Test

1. **Start Backend Server** (if not running):
   ```bash
   cd backend
   node server.js
   ```

2. **Start Frontend** (if not running):
   ```bash
   cd rental-frontend
   npm run dev
   ```

3. **Login as Vendor**:
   - Go to: http://localhost:3000/auth/login
   - Email: `jane@vendor.com`
   - Password: `password123`
   - You will be redirected to `/vendor/dashboard`

4. **Check Console**:
   - Open browser DevTools (F12)
   - Check Console tab for debug logs:
     - "Fetching vendor stats..."
     - "Vendor stats received: {...}"
   - Check Network tab for API calls to `/api/dashboard/vendor`

## Troubleshooting

### If dashboard shows "0" for all stats:

1. **Check if logged in as vendor**:
   - The debug info panel will show your role
   - Should see: "Role: vendor"

2. **Check API Response**:
   - Open Network tab in DevTools
   - Look for `/api/dashboard/vendor` request
   - Check the response data

3. **Verify Backend is Running**:
   ```bash
   curl http://localhost:5000/
   ```
   Should return: `{"message":"Rental Management API","status":"running"}`

4. **Re-seed Database** (if needed):
   ```bash
   cd backend
   node seed.js
   ```

5. **Check MongoDB Connection**:
   - Make sure `.env` has correct `MONGODB_URI`
   - Default: `mongodb://localhost:27017/rental-management`

### Common Issues:

1. **"Failed to load dashboard stats"**
   - Backend server not running
   - Wrong API URL in frontend
   - Authentication token invalid

2. **Empty stats (all zeros)**
   - Logged in with wrong account (customer instead of vendor)
   - vendor_id mismatch in database
   - Run `node check-vendor-data.js` to verify data

3. **Authentication Error**
   - Token expired - logout and login again
   - Wrong credentials used

## Other Test Accounts

**Customer Account:**
- Email: `john@customer.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@rental.com`
- Password: `admin123`

## API Endpoint

The vendor dashboard fetches data from:
```
GET /api/dashboard/vendor
Authorization: Bearer <token>
```

Response format:
```json
{
  "totalProducts": 4,
  "publishedProducts": 4,
  "totalOrders": 2,
  "activeRentals": 1,
  "totalRevenue": 3540,
  "recentOrders": [...]
}
```
