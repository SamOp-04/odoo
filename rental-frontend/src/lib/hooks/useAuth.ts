// src/lib/hooks/useAuth.ts

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth/authStore';
import { UserRole } from '@/types/models';

export function useRequireAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return { user, isAuthenticated, isLoading };
}

export function useRequireRole(allowedRoles: UserRole[]) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (user && !allowedRoles.includes(user.role)) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  return { user, isAuthenticated, isLoading };
}

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout, setUser } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser,
  };
}