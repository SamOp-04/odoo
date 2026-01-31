'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { useRequireAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/store/auth/authStore';
import { profileSchema, ProfileFormData } from '@/lib/validations/profile';
import { changePasswordSchema, ChangePasswordFormData } from '@/lib/validations/auth';
import apiClient from '@/lib/api/client';
import { toast } from 'react-hot-toast';
import { User, Lock } from 'lucide-react';

export default function ProfilePage() {
  useRequireAuth();
  const { user, setUser } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      company_name: user?.company_name || '',
      gstin: user?.gstin || '',
      phone: user?.phone || '',
      address: {
        line1: user?.address?.line1 || '',
        line2: user?.address?.line2 || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || '',
      },
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onUpdateProfile = async (data: ProfileFormData) => {
    try {
      setIsUpdating(true);
      const response = await apiClient.put('/users/profile', data);
      setUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const onChangePassword = async (data: ChangePasswordFormData) => {
    try {
      setIsChangingPassword(true);
      await apiClient.put('/users/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordModal(false);
      resetPassword();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Profile</h1>

        <div className="max-w-3xl">
          {/* Profile Form */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <User className="text-primary" size={24} />
                <CardTitle>Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
                <Input
                  label="Full Name"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  label="Email"
                  value={user?.email}
                  disabled
                  helperText="Email cannot be changed"
                />

                <Input
                  label="Phone"
                  error={errors.phone?.message}
                  {...register('phone')}
                />

                <Input
                  label="Company Name"
                  error={errors.company_name?.message}
                  {...register('company_name')}
                />

                <Input
                  label="GSTIN"
                  maxLength={15}
                  error={errors.gstin?.message}
                  {...register('gstin')}
                />

                <div className="pt-4">
                  <h3 className="font-semibold text-foreground mb-4">Address</h3>
                  <div className="space-y-4">
                    <Input
                      label="Address Line 1"
                      error={errors.address?.line1?.message}
                      {...register('address.line1')}
                    />
                    <Input
                      label="Address Line 2"
                      error={errors.address?.line2?.message}
                      {...register('address.line2')}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        error={errors.address?.city?.message}
                        {...register('address.city')}
                      />
                      <Input
                        label="State"
                        error={errors.address?.state?.message}
                        {...register('address.state')}
                      />
                    </div>
                    <Input
                      label="Pincode"
                      maxLength={6}
                      error={errors.address?.pincode?.message}
                      {...register('address.pincode')}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={isUpdating}
                  disabled={isUpdating}
                >
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Lock className="text-primary" size={24} />
                <CardTitle>Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground-secondary mb-4">
                Keep your account secure by using a strong password
              </p>
              <Button
                variant="outline"
                onClick={() => setPasswordModal(true)}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Change Password Modal */}
      <Modal
        isOpen={passwordModal}
        onClose={() => {
          setPasswordModal(false);
          resetPassword();
        }}
        title="Change Password"
        description="Enter your current password and choose a new one"
      >
        <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4 mt-4">
          <Input
            label="Current Password"
            type="password"
            error={passwordErrors.currentPassword?.message}
            {...registerPassword('currentPassword')}
          />
          <Input
            label="New Password"
            type="password"
            error={passwordErrors.newPassword?.message}
            {...registerPassword('newPassword')}
          />
          <Input
            label="Confirm New Password"
            type="password"
            error={passwordErrors.confirmPassword?.message}
            {...registerPassword('confirmPassword')}
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => {
                setPasswordModal(false);
                resetPassword();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              isLoading={isChangingPassword}
              disabled={isChangingPassword}
            >
              Change Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}