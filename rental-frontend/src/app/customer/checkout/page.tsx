'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface QuotationLine {
  product_id: {
    name: string;
  };
  quantity: number;
  subtotal: number;
}

interface Quotation {
  _id: string;
  quotation_number: string;
  status: string;
  total_amount: number;
  deposit_amount: number;
  lines: QuotationLine[];
}

export default function CheckoutPage() {
  const params = useSearchParams();
  const router = useRouter();
  const quotationId = params.get('quotationId');

  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!quotationId) {
      setError('Invalid checkout session');
      setLoading(false);
      return;
    }

    const fetchQuotation = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Unauthorized');
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quotations/${quotationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error('Failed to load quotation');
        }

        const data = await res.json();
        setQuotation(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [quotationId]);

  /* ------------------ */
  /* CONFIRM QUOTATION */
  /* ------------------ */
  const confirmOrder = async () => {
    if (!quotationId) return;

    try {
      setConfirming(true);
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quotations/${quotationId}/confirm`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Order confirmation failed');
      }

      // Order + invoice created
      router.push('/customer/orders');
    } catch (err: any) {
      alert(err.message || 'Checkout failed');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading checkout…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!quotation) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-xl font-semibold">Checkout</h1>

      {/* QUOTATION SUMMARY */}
      <div className="rounded bg-white p-4 shadow">
        <p className="text-sm text-gray-500">
          Quotation #{quotation.quotation_number}
        </p>

        <div className="mt-4 space-y-3">
          {quotation.lines.map((line, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {line.product_id.name}
                </p>
                <p className="text-xs text-gray-500">
                  Qty: {line.quantity}
                </p>
              </div>

              <p>₹{line.subtotal.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t pt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Rental Total</span>
            <span>
              ₹{quotation.total_amount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Security Deposit</span>
            <span>
              ₹{quotation.deposit_amount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between font-semibold pt-2">
            <span>Total Payable</span>
            <span>
              ₹
              {(
                quotation.total_amount +
                quotation.deposit_amount
              ).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ACTION */}
      <button
        onClick={confirmOrder}
        disabled={confirming || quotation.status !== 'draft'}
        className="w-full rounded bg-black py-3 text-white"
      >
        {confirming ? 'Confirming…' : 'Confirm & Place Order'}
      </button>
    </div>
  );
}
