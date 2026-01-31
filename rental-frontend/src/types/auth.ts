/**
 * Lightweight user object returned by auth endpoints
 * (/auth/login, /auth/signup)
 *
 * This is NOT the full User model.
 */
export interface AuthUser {
  id: string; // backend sends `id`, not `_id`
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
}
