// src/lib/validations/product.ts

import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().optional(),
  quantity_on_hand: z.number().min(0, 'Quantity must be positive'),
  cost_price: z.number().min(0).optional(),
  sale_price: z.number().min(0).optional(),
  rental_pricing: z.object({
    hourly: z.number().min(0).optional(),
    daily: z.number().min(0).optional(),
    weekly: z.number().min(0).optional(),
    custom: z.object({
      price: z.number().min(0),
      period_days: z.number().min(1),
    }).optional(),
  }),
  security_deposit: z.number().min(0, 'Security deposit must be positive'),
  attributes: z.array(z.object({
    name: z.string(),
    value: z.string(),
  })).optional(),
  variants: z.array(z.object({
    sku: z.string().optional(),
    name: z.string().min(1, 'Variant name is required'),
    quantity: z.number().min(0),
    price_adjustment: z.number(),
    attributes: z.array(z.object({
      name: z.string(),
      value: z.string(),
    })).optional(),
  })).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;