// src/lib/validations/quotation.ts

import { z } from 'zod';

export const quotationLineSchema = z.object({
  product_id: z.string().min(1, 'Product is required'),
  variant_id: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  rental_start_date: z.string().or(z.date()),
  rental_end_date: z.string().or(z.date()),
  rental_duration_type: z.enum(['hourly', 'daily', 'weekly', 'custom']),
});

export const quotationSchema = z.object({
  lines: z.array(quotationLineSchema).min(1, 'At least one product is required'),
  notes: z.string().optional(),
});

export const checkoutSchema = z.object({
  // Delivery address
  delivery_address: z.object({
    line1: z.string().min(5, 'Address line 1 is required'),
    line2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().min(6, 'Pincode must be 6 digits').max(6),
    country: z.string().default('India'),
  }),
  
  // Billing address (optional, can use delivery address)
  use_different_billing: z.boolean().default(false),
  billing_address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string(),
  }).optional(),
  
  // Payment method
  payment_method: z.enum(['cash', 'card', 'upi', 'netbanking']),
  
  // Notes
  notes: z.string().optional(),
});

export type QuotationLineFormData = z.infer<typeof quotationLineSchema>;
export type QuotationFormData = z.infer<typeof quotationSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;