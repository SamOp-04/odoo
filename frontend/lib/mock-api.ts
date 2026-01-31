// Mock API functions for authentication
// Simulates backend API calls with 400ms delay

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    role: 'user' | 'vendor' | 'admin';
    name: string;
  };
}

interface SignupResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database
const mockUsers = [
  { id: '1', email: 'admin@rental.com', password: 'admin123', role: 'admin' as const, name: 'Admin User' },
  { id: '2', email: 'vendor@rental.com', password: 'vendor123', role: 'vendor' as const, name: 'Tech Rentals Pro' },
  { id: '3', email: 'user321@rental.com', password: 'userisg123', role: 'user' as const, name: 'John Doe' },
  { id: '4', email: 'existing@existing.com', password: 'test123', role: 'user' as const, name: 'Existing User' },
];

export async function login(loginId: string, password: string): Promise<LoginResponse> {
  await delay(400);

  // Find user by email or username
  const user = mockUsers.find((u) => u.email === loginId.toLowerCase());

  if (!user) {
    return {
      success: false,
      message: 'Invalid login credentials',
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      message: 'Invalid login credentials',
    };
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  };
}

export async function signup(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<SignupResponse> {
  await delay(400);

  // Check if email already exists
  if (mockUsers.some((u) => u.email === data.email.toLowerCase())) {
    return {
      success: false,
      message: 'Email already exists',
    };
  }

  // Validate password match
  if (data.password !== data.confirmPassword) {
    return {
      success: false,
      message: 'Passwords do not match',
    };
  }

  // Validate password length
  if (data.password.length < 8) {
    return {
      success: false,
      message: 'Password must be at least 8 characters',
    };
  }

  // Mock successful signup
  return {
    success: true,
    message: 'Account created successfully! Please login.',
    user: {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
    },
  };
}

export async function signupVendor(data: {
  firstName: string;
  lastName: string;
  email: string;
  gstin: string;
  password: string;
  confirmPassword: string;
  couponCode?: string;
}): Promise<SignupResponse> {
  await delay(400);

  // Check if email already exists
  if (mockUsers.some((u) => u.email === data.email.toLowerCase())) {
    return {
      success: false,
      message: 'Email already exists',
    };
  }

  // Validate GSTIN (must be exactly 15 characters)
  if (data.gstin.length !== 15) {
    return {
      success: false,
      message: 'GSTIN must be exactly 15 characters',
    };
  }

  // Validate password match
  if (data.password !== data.confirmPassword) {
    return {
      success: false,
      message: 'Passwords do not match',
    };
  }

  // Validate password length
  if (data.password.length < 8) {
    return {
      success: false,
      message: 'Password must be at least 8 characters',
    };
  }

  // Mock successful vendor signup
  return {
    success: true,
    message: 'Vendor account created successfully! Your account is pending approval.',
    user: {
      id: `vendor-${Date.now()}`,
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
    },
  };
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  await delay(400);

  // Check if email exists
  const user = mockUsers.find((u) => u.email === email.toLowerCase());

  if (!user) {
    return {
      success: false,
      message: 'Email not found',
    };
  }

  return {
    success: true,
    message: 'Password reset link sent to your email',
  };
}

export async function resetPassword(token: string, password: string, confirmPassword: string): Promise<ResetPasswordResponse> {
  await delay(400);

  // Validate password match
  if (password !== confirmPassword) {
    return {
      success: false,
      message: 'Passwords do not match',
    };
  }

  // Validate password length
  if (password.length < 8) {
    return {
      success: false,
      message: 'Password must be at least 8 characters',
    };
  }

  // Mock token validation (in real app, verify token with backend)
  if (token === 'invalid') {
    return {
      success: false,
      message: 'Invalid or expired reset token',
    };
  }

  return {
    success: true,
    message: 'Password updated successfully! You can now login with your new password.',
  };
}

export function validateCouponCode(code: string): { valid: boolean; discount?: number } {
  // Mock coupon validation
  if (code.toLowerCase() === 'xxx10') {
    return { valid: true, discount: 10 };
  }
  return { valid: false };
}
