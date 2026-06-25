import { useEffect, useState } from 'react';
import { Package, Users, CreditCard, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { serviceLabels, statusColors } from '@/lib/services';
import type { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];

export default function AdminOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [ordersRes, profilesRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]);
    setOrders(ordersRes.data || []);
    setCustomerCount(profilesRes.count || 0);
    setLoading(false);
  };

  const stats = {
    totalOrders: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => ['confirmed', 'picked_up', 'at_store', 'in_progress'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.final_price || o.estimated_price || 0), 0),
    customers: customerCount,
  };

  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-muted rounded-xl" />)}</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground text-xs md:text-sm">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        {[
          { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'bg-blue-100 text-blue-600' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
          { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
          { label: 'Customers', value: stats.customers, icon: Users, color: 'bg-pink-100 text-pink-600' },
          { label: 'Revenue', value: `KES ${stats.totalRevenue.toLocaleString()}`, icon: CreditCard, color: 'bg-emerald-100 text-emerald-600' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-3 md:p-4 rounded-xl">
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
              <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <p className="text-base md:text-xl font-bold text-foreground break-words">{stat.value}</p>
            <p className="text-[10px] md:text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Recent Orders</h3>

        {/* Mobile list */}
        <div className="md:hidden divide-y divide-border -mx-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="px-4 py-3 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{order.customer_name}</p>
                <p className="text-xs text-muted-foreground truncate">#{order.id.slice(0, 8)} · {serviceLabels[order.service_type] || order.service_type}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${statusColors[order.status] || 'bg-muted'}`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>
          ))}
          {recentOrders.length === 0 && <div className="py-8 text-center text-muted-foreground text-sm">No orders yet</div>}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-muted-foreground font-medium">Order</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Customer</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Service</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">#{order.id.slice(0, 8)}</td>
                  <td className="py-2">{order.customer_name}</td>
                  <td className="py-2">{serviceLabels[order.service_type] || order.service_type}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-muted'}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
