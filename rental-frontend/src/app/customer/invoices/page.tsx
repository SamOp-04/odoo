'use client';

import { useEffect, useState } from 'react';
import { useRazorpay } from '@/lib/hooks/useRazorpay';
import { toast } from 'react-hot-toast';

interface Invoice {
  _id: string;
  invoice_number: string;
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  status: string;
  createdAt: string;
  order_id: string;
}

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null);
  const { initiatePayment, loading: paymentLoading } = useRazorpay();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Unauthorized');
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/invoices`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch invoices');
        }

        const data = await res.json();
        setInvoices(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  /* ------------------ */
  /* DOWNLOAD INVOICE */
  /* ------------------ */
  const downloadInvoice = async (invoiceId: string) => {
    try {
      setDownloading(invoiceId);
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${invoiceId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Download failed');
      }

      const { pdf_url } = await res.json();

      window.open(pdf_url, '_blank');
    } catch (err: any) {
      toast.error(err.message || 'Download failed');
    } finally {
      setDownloading(null);
    }
  };

  /* ------------------ */
  /* PAY INVOICE */
  /* ------------------ */
  const handlePayInvoice = async (invoice: Invoice) => {
    setPayingInvoice(invoice._id);
    try {
      await initiatePayment({
        amount: invoice.amount_due,
        invoiceId: invoice._id,
        orderId: invoice.order_id,
        onSuccess: async (paymentDetails) => {
          toast.success('Payment successful!');
          // Refresh invoices list
          const token = localStorage.getItem('token');
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/invoices`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            setInvoices(data);
          }
          setPayingInvoice(null);
        },
        onError: (error) => {
          console.error('Payment error:', error);
          setPayingInvoice(null);
        }
      });
    } catch (err: any) {
      toast.error(err.message || 'Payment failed');
      setPayingInvoice(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading invoices…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Invoices</h1>

      <div className="rounded bg-white p-4 shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Invoice</th>
              <th>Status</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Date</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id} className="border-b">
                <td className="py-2 font-medium">
                  {invoice.invoice_number}
                </td>

                <td>
                  <StatusBadge status={invoice.status} />
                </td>

                <td>
                  ₹{invoice.total_amount.toLocaleString()}
                </td>

                <td>
                  ₹{invoice.amount_paid.toLocaleString()}
                </td>

                <td>
                  ₹{invoice.amount_due.toLocaleString()}
                </td>

                <td>
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </td>

                <td className="text-right space-x-2">
                  {invoice.status !== 'paid' && invoice.amount_due > 0 && (
                    <button
                      onClick={() => handlePayInvoice(invoice)}
                      disabled={payingInvoice === invoice._id || paymentLoading}
                      className="rounded bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs disabled:opacity-50"
                    >
                      {payingInvoice === invoice._id ? 'Processing...' : 'Pay Now'}
                    </button>
                  )}
                  <button
                    onClick={() => downloadInvoice(invoice._id)}
                    disabled={downloading === invoice._id}
                    className="rounded border px-3 py-1 text-xs"
                  >
                    {downloading === invoice._id
                      ? 'Downloading…'
                      : 'Download'}
                  </button>
                </td>
              </tr>
            ))}

            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 text-center text-gray-500"
                >
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------ */
/* Status Badge */
/* ------------------ */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    sent: 'bg-blue-100 text-blue-700',
    overdue: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-600',
  };

  return (
    <span
      className={`inline-block rounded px-2 py-1 text-xs font-medium ${
        styles[status] || styles.draft
      }`}
    >
      {status}
    </span>
  );
}
