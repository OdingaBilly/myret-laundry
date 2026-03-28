import { useEffect, useState } from 'react';
import { CreditCard, Loader2, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];

export default function AdminPayments() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const paidOrders = orders.filter(o => o.final_price && o.final_price > 0);
  const pendingPayments = orders.filter(o => !o.final_price && !['cancelled'].includes(o.status));
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.final_price || 0), 0);
  const estimatedPending = pendingPayments.reduce((sum, o) => sum + (o.estimated_price || 0), 0);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Payments</h2>
        <p className="text-muted-foreground text-sm">Payment tracking and revenue overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-2">
            <CreditCard className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">KES {totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Revenue</p>
        </div>
        <div className="glass-card p-5 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center mb-2">
            <CreditCard className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">KES {estimatedPending.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Pending Payments</p>
        </div>
        <div className="glass-card p-5 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
            <Smartphone className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">{orders.length}</p>
          <p className="text-xs text-muted-foreground">Total Transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Stripe (Card Payments)</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Accept credit/debit card payments for orders and membership subscriptions.
          </p>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Setup Required</span>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-foreground">M-Pesa (Mobile Money)</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Accept M-Pesa payments via Safaricom Daraja API for local customers.
          </p>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Setup Required</span>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-foreground">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.slice(0, 20).map((order) => (
                <tr key={order.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">{order.customer_name}</td>
                  <td className="px-4 py-3">
                    {order.final_price ? `KES ${order.final_price}` : order.estimated_price ? `~KES ${order.estimated_price}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.final_price ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.final_price ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No transactions yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
