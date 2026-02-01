// src/lib/hooks/useRazorpay.ts

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface RazorpayOptions {
  amount: number;
  orderId?: string;
  invoiceId?: string;
  onSuccess: (paymentDetails: any) => void;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async ({
    amount,
    orderId,
    invoiceId,
    onSuccess,
    onError
  }: RazorpayOptions) => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        return;
      }

      // Create Razorpay order
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/razorpay/create-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            amount,
            order_id: orderId,
            invoice_id: invoiceId
          })
        }
      );

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.error || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'RentalHub',
        description: 'Rental Payment',
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/payments/razorpay/verify`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: orderId,
                  invoice_id: invoiceId,
                  amount
                })
              }
            );

            if (!verifyResponse.ok) {
              const error = await verifyResponse.json();
              throw new Error(error.error || 'Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            toast.success('Payment successful!');
            onSuccess({
              ...response,
              ...verifyData
            });
          } catch (error: any) {
            console.error('Payment verification error:', error);
            toast.error(error.message || 'Payment verification failed');
            if (onError) onError(error);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error('Payment cancelled');
            if (onError) onError(new Error('Payment cancelled by user'));
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      toast.error(error.message || 'Failed to initiate payment');
      setLoading(false);
      if (onError) onError(error);
    }
  };

  return { initiatePayment, loading };
};
