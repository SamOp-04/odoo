'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FileText, Calendar, User } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Quotation {
  _id: string;
  quotation_number: string;
  status: string;
  customer_id: {
    name: string;
    email: string;
  };
  total_amount: number;
  deposit_amount: number;
  createdAt: string;
  valid_until: string;
  lines: any[];
}

export default function VendorQuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setQuotations(data);
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-orange-100 text-orange-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          statusStyles[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredQuotations = quotations.filter((q) => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-foreground-secondary">Loading quotations...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quotations</h1>
            <p className="text-foreground-secondary mt-1">
              Manage customer quotations and requests
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2 flex-wrap">
              {['all', 'draft', 'sent', 'confirmed', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'primary' : 'outline'}
                  onClick={() => setFilter(status)}
                  size="sm"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status === 'all' && ` (${quotations.length})`}
                  {status !== 'all' &&
                    ` (${quotations.filter((q) => q.status === status).length})`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quotations List */}
        {filteredQuotations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText size={48} className="mx-auto text-foreground-secondary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No quotations found
              </h3>
              <p className="text-foreground-secondary">
                {filter === 'all'
                  ? 'You have no quotations yet.'
                  : `No ${filter} quotations found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredQuotations.map((quotation) => (
              <Card key={quotation._id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {quotation.quotation_number}
                        </h3>
                        {getStatusBadge(quotation.status)}
                      </div>

                      <div className="space-y-2 text-sm text-foreground-secondary">
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>
                            {quotation.customer_id.name} ({quotation.customer_id.email})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>Created: {formatDate(quotation.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>Valid Until: {formatDate(quotation.valid_until)}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-foreground-secondary/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-foreground-secondary">
                              {quotation.lines.length} item(s)
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-foreground-secondary">Total Amount</p>
                            <p className="text-xl font-bold text-foreground">
                              {formatCurrency(quotation.total_amount + quotation.deposit_amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
