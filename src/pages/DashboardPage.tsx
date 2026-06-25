import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Plus, Clock, CheckCircle2, Truck, 
  LogOut, User, Settings, ChevronRight, Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/layout/Navigation';
import { OrderTracker } from '@/components/orders/OrderTracker';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMembership, useMembershipPlans } from '@/hooks/useMembership';
import { serviceLabels, statusColors } from '@/lib/services';
import type { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const { data: membership } = useMembership(user?.id as any);
  const { data: membershipPlans } = useMembershipPlans();
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
      return;
    }
    if (!user) return;

    fetchOrders();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loading, navigate]);

  const fetchOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status));
  const completedOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.status));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-12 px-3 md:px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 md:mb-6">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">My Orders</h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Track and manage your laundry orders
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">Admin Panel</Link>
                </Button>
              )}
              <Button variant="hero" size="sm" asChild>
                <Link to="/order/new">
                  <Plus className="w-4 h-4 mr-1" />
                  New Order
                </Link>
              </Button>
            </div>
          </div>

          {/* User info card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-3 md:p-4 rounded-xl mb-5 md:mb-6 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm md:text-base truncate">{user?.email || 'Guest'}</p>
                  <p className="text-xs text-muted-foreground">{orders.length} total orders</p>
                  <p className="text-xs text-muted-foreground">Membership: {membershipPlans?.find(p => p.id === membership?.plan_id)?.name ?? (membership ? 'Member' : 'None')}</p>
                  <p className="text-xs text-muted-foreground">Points: {membership?.points_balance ?? 0}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="flex-shrink-0">
              <LogOut className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </motion.div>

          {/* Active Orders */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Active Orders ({activeOrders.length})
            </h2>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="glass-card p-4 rounded-xl animate-pulse">
                    <div className="h-20 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : activeOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-8 rounded-xl text-center"
              >
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No active orders</p>
                <Button variant="hero" asChild>
                  <Link to="/order/new">Place Your First Order</Link>
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-4 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {serviceLabels[order.service_type] || order.service_type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Order #{order.id.slice(0, 8)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${selectedOrder?.id === order.id ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {selectedOrder?.id === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-4 border-t border-border"
                      >
                        <OrderTracker
                          status={order.status}
                          createdAt={order.created_at}
                          pickedUpAt={order.picked_up_at}
                          completedAt={order.completed_at}
                        />

                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Return Date</p>
                            <p className="font-medium">{new Date(order.return_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Return Method</p>
                            <p className="font-medium">
                              {order.return_option === 'delivery_requested' ? 'Delivery' : 'Pickup'}
                            </p>
                          </div>
                        </div>

                        {order.store_photo_url && (
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground mb-2">Store Photo</p>
                            <img
                              src={order.store_photo_url}
                              alt="Laundry at store"
                              className="w-full max-w-xs rounded-lg"
                            />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Orders */}
          {completedOrders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Past Orders ({completedOrders.length})
              </h2>

              <div className="space-y-3">
                {completedOrders.slice(0, 5).map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-3 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {serviceLabels[order.service_type]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
