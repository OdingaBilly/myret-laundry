import { useEffect, useState } from 'react';
import { Search, Filter, Camera, Loader2, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { serviceLabels, statusColors, statusOptions } from '@/lib/services';
import type { Database } from '@/integrations/supabase/types';
import { motion } from 'framer-motion';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderStatus = Database['public']['Enums']['order_status'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchOrders())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data || []);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(orderId);
    const updateData: any = { status: newStatus };
    if (newStatus === 'picked_up') updateData.picked_up_at = new Date().toISOString();
    if (newStatus === 'completed' || newStatus === 'delivered') updateData.completed_at = new Date().toISOString();

    const { error } = await supabase.from('orders').update(updateData).eq('id', orderId);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    } else {
      toast({ title: 'Status Updated', description: `Order status changed to ${newStatus.replace('_', ' ')}` });
      fetchOrders();
    }
    setUpdatingStatus(null);
  };

  const handlePhotoUpload = async (orderId: string, file: File) => {
    setUploadingPhoto(orderId);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `store/${orderId}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('laundry-photos').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('laundry-photos').getPublicUrl(filePath);
      const { error: updateError } = await supabase.from('orders').update({ store_photo_url: urlData.publicUrl }).eq('id', orderId);
      if (updateError) throw updateError;
      toast({ title: 'Photo Uploaded', description: 'Store photo added to the order' });
      fetchOrders();
    } catch (error: any) {
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
    }
    setUploadingPhoto(null);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.includes(searchTerm) || order.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Orders Management</h2>
        <p className="text-muted-foreground text-sm">Manage all laundry orders</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, phone, or order ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 pl-10 pr-8 rounded-md border border-input bg-background text-sm appearance-none">
            <option value="all">All Status</option>
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Return Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Photo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                  </td>
                  <td className="px-4 py-3"><p className="text-sm">{serviceLabels[order.service_type] || order.service_type}</p></td>
                  <td className="px-4 py-3">
                    <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)} disabled={updatingStatus === order.id} className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${statusColors[order.status]}`}>
                      {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3"><p className="text-sm">{new Date(order.return_date).toLocaleDateString()}</p></td>
                  <td className="px-4 py-3">
                    {order.store_photo_url ? (
                      <img src={order.store_photo_url} alt="Store" className="w-10 h-10 rounded object-cover cursor-pointer" onClick={() => window.open(order.store_photo_url!, '_blank')} />
                    ) : (
                      <label className="cursor-pointer">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                          {uploadingPhoto === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handlePhotoUpload(order.id, file); }} disabled={uploadingPhoto === order.id} />
                      </label>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && <div className="p-8 text-center text-muted-foreground">No orders found</div>}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-background rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Order ID</p><p className="font-medium">{selectedOrder.id}</p></div>
                <div><p className="text-xs text-muted-foreground">Service</p><p className="font-medium">{serviceLabels[selectedOrder.service_type]}</p></div>
              </div>
              <div><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium">{selectedOrder.customer_name} — {selectedOrder.customer_phone}</p></div>
              <div><p className="text-xs text-muted-foreground">Address</p><p>{selectedOrder.customer_address}</p></div>
              {selectedOrder.laundry_notes && <div><p className="text-xs text-muted-foreground">Notes</p><p>{selectedOrder.laundry_notes}</p></div>}
              {selectedOrder.special_instructions && <div><p className="text-xs text-muted-foreground">Special Instructions</p><p>{selectedOrder.special_instructions}</p></div>}
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Delivery</p><p>{selectedOrder.delivery_option.replace('_', ' ')}</p></div>
                <div><p className="text-xs text-muted-foreground">Return</p><p>{selectedOrder.return_option.replace('_', ' ')}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Return Date</p><p>{new Date(selectedOrder.return_date).toLocaleDateString()}</p></div>
                <div><p className="text-xs text-muted-foreground">Estimated Price</p><p>{selectedOrder.estimated_price ? `KES ${selectedOrder.estimated_price}` : '—'}</p></div>
              </div>
              {(selectedOrder.customer_photo_url || selectedOrder.store_photo_url) && (
                <div className="flex gap-4">
                  {selectedOrder.customer_photo_url && <div><p className="text-xs text-muted-foreground mb-1">Customer Photo</p><img src={selectedOrder.customer_photo_url} alt="Customer" className="w-24 h-24 rounded-lg object-cover" /></div>}
                  {selectedOrder.store_photo_url && <div><p className="text-xs text-muted-foreground mb-1">Store Photo</p><img src={selectedOrder.store_photo_url} alt="Store" className="w-24 h-24 rounded-lg object-cover" /></div>}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
