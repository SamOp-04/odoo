# Vendor System Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Run Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 3. Access Vendor Portal
Open your browser and navigate to:
```
http://localhost:3000/vendor/dashboard
```

## 📱 Available Pages

### Navigation Routes
All vendor pages are accessible via the sidebar navigation:

1. **Dashboard** - `/vendor/dashboard`
   - Overview stats and active rentals
   - Recent orders table
   
2. **Products** - `/vendor/products`
   - List all products with search/filter
   - Click "Add New Product" to create products
   - Click edit icon to modify existing products
   
3. **Add Product** - `/vendor/products/new`
   - Form to add new products
   - Includes inventory, pricing, and rental rates
   
4. **Edit Product** - `/vendor/products/[productId]/edit`
   - Pre-populated form to edit products
   - Access via edit button in products list
   
5. **Orders** - `/vendor/orders`
   - List all orders with filtering
   - Mark orders as Picked Up or Returned
   
6. **Order Detail** - `/vendor/orders/[orderId]`
   - Detailed order view with timeline
   - Customer information and payment summary
   
7. **Reports** - `/vendor/reports`
   - Analytics and performance metrics
   - Revenue breakdown and order statistics
   
8. **Notifications** - `/vendor/notifications`
   - All/Unread tabs
   - Mark as read functionality
   
9. **Profile** - `/vendor/profile`
   - View/edit vendor profile
   - Change password
   
10. **Settings** - `/vendor/settings`
    - Business information
    - Rental settings
    - Notification preferences

## 🎨 Design Features

- **Dark Theme**: Black background with white borders
- **Purple Accents**: Primary action buttons in purple
- **Color-Coded Status**: 
  - Green: Success/Returned
  - Orange: Warning/With Customer
  - Blue: Info/Confirmed
  - Red: Error/Canceled
- **Responsive**: Works on desktop, tablet, and mobile
- **Mobile Menu**: Hamburger menu for mobile navigation

## 🧪 Testing Features

### Mock Data Available
- 3 Sample Products (Camera, Drone, Lighting)
- 3 Sample Orders (Different statuses)
- 3 Sample Notifications
- Vendor Profile Data
- Statistics Data

### Interactive Features to Test
1. **Products Page**:
   - Search by product name
   - Filter by category (Cameras, Drones, Lighting)
   - Filter by status (Published/Unpublished)
   - Toggle publish/unpublish
   - Click "Add New Product"
   - Click edit icon on any product

2. **Orders Page**:
   - Search by order number or customer name
   - Filter by status (All/Confirmed/With Customer/Returned)
   - Click "Mark Picked Up" on Confirmed orders
   - Click "Mark Returned" on With Customer orders
   - Click order row to view details

3. **Dashboard**:
   - View stat cards with trends
   - Click "View All" links to navigate to filtered views
   - See active rentals and recent orders

4. **Forms**:
   - Try submitting with empty fields (validation)
   - Toggle "Enable Rentals" checkbox
   - Toggle "Publish" checkbox
   - Click Cancel to see confirmation dialog

5. **Notifications**:
   - Switch between All/Unread tabs
   - Click "Mark as read" on individual notifications
   - Click "Mark all as read"

6. **Profile**:
   - Click "Edit Profile" to enable editing
   - Update fields and click "Save Changes"
   - Try changing password

7. **Settings**:
   - Change business information
   - Update rental settings (period unit, deposit type)
   - Toggle notification preferences

## 📦 File Structure

```
app/vendor/              # All vendor pages
components/vendor/       # Reusable vendor components
lib/types/vendor.ts      # TypeScript interfaces
lib/mock-data/vendor.ts  # Mock data for development
```

## 🔧 Customization

### Change Colors
Edit Tailwind classes in components:
- Primary: `bg-purple-600` → Change to desired color
- Borders: `border-white` → Change border color
- Background: `bg-black` → Change background

### Add New Pages
1. Create file in `app/vendor/[page-name]/page.tsx`
2. Add navigation item in `app/vendor/layout.tsx`
3. Create icon component if needed

### Modify Mock Data
Edit `lib/mock-data/vendor.ts` to:
- Add more products
- Change order statuses
- Update vendor profile
- Modify statistics

## 🌐 Backend Integration Checklist

When ready to connect to a real backend:

- [ ] Replace mock data imports with API calls
- [ ] Add authentication (JWT/OAuth)
- [ ] Implement protected routes
- [ ] Add loading states for API calls
- [ ] Handle API errors
- [ ] Add toast notifications for success/error
- [ ] Implement real-time updates (WebSockets)
- [ ] Add pagination for large datasets
- [ ] Implement image upload to cloud storage
- [ ] Add form submission to API endpoints

## 💡 Tips

1. **Hot Reload**: Changes auto-refresh in development
2. **TypeScript**: All components are fully typed
3. **Responsive Testing**: Use browser dev tools to test mobile views
4. **Navigation**: Use sidebar on desktop, hamburger menu on mobile
5. **Forms**: All forms have client-side validation
6. **Status Changes**: Orders have optimistic updates

## ❓ Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

### Dependencies Issue
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
Check TypeScript errors:
```bash
npm run build
```

### Styling Issues
Rebuild Tailwind:
```bash
npm run dev
# Restart the dev server
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Happy coding! 🎉
