import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { serviceLabels } from '@/lib/services';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];

const COLORS = ['hsl(var(--primary))', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#14b8a6', '#3b82f6', '#8b5cf6'];

export default function AdminAnalytics() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setOrders(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const serviceBreakdown = Object.entries(
    orders.reduce((acc, o) => { acc[o.service_type] = (acc[o.service_type] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: serviceLabels[name] || name, value }));

  const statusBreakdown = Object.entries(
    orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace('_', ' '), value }));

  const last30 = new Date(); last30.setDate(last30.getDate() - 30);
  const dailyOrders = orders
    .filter(o => new Date(o.created_at) >= last30)
    .reduce((acc, o) => {
      const day = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  const dailyData = Object.entries(dailyOrders).map(([date, count]) => ({ date, orders: count })).reverse();

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-muted-foreground text-xs md:text-sm">Business insights and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="glass-card rounded-xl p-4 md:p-5 overflow-hidden">
          <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Orders by Service</h3>
          {serviceBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={isMobile ? 280 : 250}>
              <PieChart>
                <Pie data={serviceBreakdown} cx="50%" cy="50%" outerRadius={isMobile ? 60 : 80} dataKey="value" label={isMobile ? false : ({ value }) => value}>
                  {serviceBreakdown.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                {isMobile && <Legend wrapperStyle={{ fontSize: 11 }} />}
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-muted-foreground text-sm py-10 text-center">No data yet</p>}
        </div>

        <div className="glass-card rounded-xl p-4 md:p-5 overflow-hidden">
          <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Orders by Status</h3>
          {statusBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusBreakdown} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={isMobile ? -30 : 0} textAnchor={isMobile ? 'end' : 'middle'} height={isMobile ? 60 : 30} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-muted-foreground text-sm py-10 text-center">No data yet</p>}
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 md:p-5 overflow-hidden">
        <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Daily Orders (Last 30 Days)</h3>
        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
            <BarChart data={dailyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={isMobile ? 3 : 0} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-muted-foreground text-sm py-10 text-center">No data in the last 30 days</p>}
      </div>
    </div>
  );
}
