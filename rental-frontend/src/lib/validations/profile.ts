// src/lib/validations/profile.ts

import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company_name: z.string().min(2, 'Company name is required').optional(),
  gstin: z.string().min(15).max(15).optional(),
  phone: z.string().min(10, 'Phone must be at least 10 digits').optional(),
  address: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
  }).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;