// src/components/orders/OrderCard.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { RentalOrder } from '@/types/models';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Calendar, Package } from 'lucide-react';

interface OrderCardProps {
  order: RentalOrder;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <Link href={`/orders/${order._id}`}>
      <Card hover>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-base">
              Order #{order.order_number}
            </CardTitle>
            <Badge status={order.status}>
              {order.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Date */}
          <div className="flex items-center space-x-2 text-sm text-foreground-secondary">
            <Calendar size={16} />
            <span>
              {formatDate(order.createdAt)} - {formatDate(order.return_date)}
            </span>
          </div>

          {/* Items */}
          <div className="flex items-center space-x-2 text-sm text-foreground-secondary">
            <Package size={16} />
            <span>
              {order.lines.length} item{order.lines.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Amount */}
          <div className="pt-3 border-t border-foreground-secondary/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-secondary">Total Amount</span>
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(order.total_amount)}
              </span>
            </div>

            {order.deposit_paid > 0 && (
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-foreground-secondary">Deposit Paid</span>
                <span className="text-sm text-success">
                  {formatCurrency(order.deposit_paid)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default OrderCard;