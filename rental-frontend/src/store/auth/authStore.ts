// src/store/auth/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/models';
import { AuthUser } from '@/types/auth';
import { authApi } from '@/lib/api/auth';

interface AuthState {
  /** JWT token */
  token: string | null;

  /** Lightweight user from login/signup */
  authUser: AuthUser | null;

  /** Full user profile from /auth/me */
  user: User | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (token: string, authUser: AuthUser) => void;
  setUser: (user: User) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      authUser: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      /** Called after login/signup */
      login: (token, authUser) => {
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('authUser', JSON.stringify(authUser));

        // IMPORTANT: Save to cookies for middleware to read
        document.cookie = `token=${token}; path=/; max-age=2592000; SameSite=Lax`;

        // Convert authUser to full User object for compatibility
        const fullUser: User = {
          _id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          role: authUser.role,
          company_name: (authUser as any).company_name,
          gstin: '', // Will be loaded via fetchUser if needed
          phone: (authUser as any).phone,
          address: (authUser as any).address,
          is_active: true,
          email_verified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({
          token,
          authUser,
          user: fullUser,
          isAuthenticated: true,
        });
      },

      /** Set full user after /auth/me */
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('authUser');
        localStorage.removeItem('auth-storage');

        // Clear cookies
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

        set({
          token: null,
          authUser: null,
          user: null,
          isAuthenticated: false,
        });

        authApi.logout();
      },

      /** Fetch full profile */
      fetchUser: async () => {
        const token = get().token;
        if (!token || get().user) return;

        try {
          set({ isLoading: true });
          const user = await authApi.getMe();
          set({ user, isAuthenticated: true });
        } catch {
          get().logout();
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        authUser: state.authUser,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, if we have authUser but no user, create the user object
        if (state && state.authUser && !state.user) {
          const authUser = state.authUser;
          const fullUser: User = {
            _id: authUser.id,
            name: authUser.name,
            email: authUser.email,
            role: authUser.role,
            company_name: (authUser as any).company_name,
            gstin: '',
            phone: (authUser as any).phone,
            address: (authUser as any).address,
            is_active: true,
            email_verified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          state.user = fullUser;
          state.isAuthenticated = true;
        }
      },
    }
  )
);

export default useAuthStore;