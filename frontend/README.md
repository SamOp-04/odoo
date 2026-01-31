# Rental Management System - Next.js Components

A dark-themed rental management system built with Next.js (App Router) and React components matching the Excalidraw design style.

## Components

### 1. Cart / Quotation Page (`cart-quotation-page.tsx`)

A comprehensive cart page featuring:

- **Header Bar**: Logo, navigation menu, search bar, and action icons (notification, cart, user avatar)
- **Page Title**: Centered "Cart / Quotation Page" heading
- **Status Indicator**: "Quotation: Draft" badge
- **Product Table**: 
  - Columns: Product (with thumbnail), Rental Duration, Quantity, Rental Price, Deposit, Total, Actions
  - Interactive quantity controls (+/- buttons)
  - "Update Dates" and "Remove Item" action buttons per row
  - Sample data for 3 products with realistic rental information
- **Summary Section**: 
  - Subtotal, Total Deposit, and Grand Total calculations
  - Prominent "Confirm Quotation" button
- **Bottom Notice**: Helper text for users

### 2. Variants Dialog (`variants-dialog.tsx`)

A modal dialog for product variant selection:

- **Header**: "Choose Variant" title with close (X) button
- **Variant Selection**: Radio button options for different configurations (8GB/256GB, 16GB/512GB, 32GB/1TB)
- **Add-ons Section**: Checkbox options for extras (Extra Monitor, Keyboard + Mouse, Extended Warranty)
- **Action Buttons**: "Cancel" (secondary) and "Add to Cart" (primary) buttons
- **State Management**: Tracks selected variant and add-ons

### 3. Example App (`rental-management-app.tsx`)

A demonstration component showing:

- Integration between product page and cart page
- Variants dialog triggered from "Add to Cart" button
- Navigation between different views
- Consistent header styling across pages

## Design Features

- **Dark Theme**: Gray-900 background with gray-800 cards and gray-700 secondary elements
- **Consistent Styling**: Matches existing Product Page and Configure dialog aesthetics
- **Interactive Elements**: Hover effects, focus states, and smooth transitions
- **Responsive Layout**: Grid-based layouts with proper spacing and alignment
- **Typography**: Clear hierarchy with appropriate font weights and colors
- **Icons**: SVG icons for better scalability and consistency

## Usage

```tsx
import CartQuotationPage from './cart-quotation-page';
import VariantsDialog from './variants-dialog';
import RentalManagementApp from './rental-management-app';

// Use individual components
<CartQuotationPage />

// Use variants dialog with state management
const [isOpen, setIsOpen] = useState(false);
<VariantsDialog 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  productName="MacBook Pro"
/>

// Use complete example app
<RentalManagementApp />
```

## Styling

Components use Tailwind CSS classes for:
- Dark theme colors (gray-900, gray-800, gray-700)
- Purple accent color (purple-600) for primary actions
- Consistent spacing and borders
- Responsive grid layouts
- Interactive states (hover, focus)

## State Management

The components include:
- Local state for form inputs and selections
- Props for dialog visibility and data
- Event handlers for user interactions
- Type safety with TypeScript interfaces