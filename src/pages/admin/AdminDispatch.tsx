import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Loader2, X, MapPin, Truck, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useZones, useDrivers, type Zone, type Driver } from '@/hooks/useServices';

type Tab = 'zones' | 'drivers';

export default function AdminDispatch() {
  const [tab, setTab] = useState<Tab>('zones');
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Dispatch & Logistics</h2>
        <p className="text-muted-foreground text-xs md:text-sm">Manage delivery zones, fees, and dispatch drivers.</p>
      </div>
      <div className="inline-flex gap-1 rounded-lg bg-muted p-1">
        <button onClick={() => setTab('zones')} className={`px-3 py-1.5 rounded-md text-sm ${tab === 'zones' ? 'bg-background shadow font-medium' : 'text-muted-foreground'}`}>
          <MapPin className="w-3.5 h-3.5 inline mr-1" />Zones
        </button>
        <button onClick={() => setTab('drivers')} className={`px-3 py-1.5 rounded-md text-sm ${tab === 'drivers' ? 'bg-background shadow font-medium' : 'text-muted-foreground'}`}>
          <Truck className="w-3.5 h-3.5 inline mr-1" />Drivers
        </button>
      </div>
      {tab === 'zones' ? <ZonesPanel /> : <DriversPanel />}
    </div>
  );
}

// -------- Zones --------
type ZoneForm = Omit<Zone, 'id'> & { id?: string };
const emptyZone: ZoneForm = { name: '', area_description: '', pickup_fee: 0, delivery_fee: 0, eta_hours: 24, active: true, sort_order: 99 };

function ZonesPanel() {
  const { data: zones, isLoading } = useZones({ includeInactive: true });
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<ZoneForm | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ['delivery_zones'] });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      name: editing.name.trim(),
      area_description: editing.area_description,
      pickup_fee: Number(editing.pickup_fee) || 0,
      delivery_fee: Number(editing.delivery_fee) || 0,
      eta_hours: Number(editing.eta_hours) || 24,
      active: editing.active,
      sort_order: Number(editing.sort_order) || 0,
    };
    const res = editing.id
      ? await supabase.from('delivery_zones').update(payload).eq('id', editing.id)
      : await supabase.from('delivery_zones').insert(payload);
    setSaving(false);
    if (res.error) return toast({ title: 'Save failed', description: res.error.message, variant: 'destructive' });
    toast({ title: editing.id ? 'Zone updated' : 'Zone added' });
    setEditing(null); refresh();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete zone?')) return;
    const { error } = await supabase.from('delivery_zones').delete().eq('id', id);
    if (error) return toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    refresh();
  };

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button onClick={() => setEditing({ ...emptyZone })}><Plus className="w-4 h-4 mr-1" />New Zone</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {(zones ?? []).map((z) => (
          <div key={z.id} className="glass-card p-4 rounded-xl">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-semibold text-foreground">{z.name}</h4>
                <p className="text-xs text-muted-foreground">{z.area_description}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${z.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {z.active ? 'Live' : 'Off'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground my-2">
              <div><span className="block text-foreground font-medium">KES {Number(z.pickup_fee).toLocaleString()}</span>Pickup</div>
              <div><span className="block text-foreground font-medium">KES {Number(z.delivery_fee).toLocaleString()}</span>Delivery</div>
              <div><span className="block text-foreground font-medium">{z.eta_hours}h</span>ETA</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(z)}><Pencil className="w-3.5 h-3.5 mr-1" />Edit</Button>
              <Button size="sm" variant="ghost" className="text-destructive ml-auto" onClick={() => remove(z.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center sm:p-4 z-50" onClick={() => !saving && setEditing(null)}>
          <div className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editing.id ? 'Edit Zone' : 'New Zone'}</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div><Label>Zone name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Area description</Label><Textarea rows={2} value={editing.area_description} onChange={(e) => setEditing({ ...editing, area_description: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Pickup (KES)</Label><Input type="number" value={editing.pickup_fee} onChange={(e) => setEditing({ ...editing, pickup_fee: Number(e.target.value) })} /></div>
                <div><Label>Delivery (KES)</Label><Input type="number" value={editing.delivery_fee} onChange={(e) => setEditing({ ...editing, delivery_fee: Number(e.target.value) })} /></div>
                <div><Label>ETA (hours)</Label><Input type="number" value={editing.eta_hours} onChange={(e) => setEditing({ ...editing, eta_hours: Number(e.target.value) })} /></div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label>Active</Label>
                <Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button>
                <Button className="flex-1" onClick={save} disabled={saving || !editing.name}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------- Drivers --------
type DriverForm = Omit<Driver, 'id'> & { id?: string };
const emptyDriver: DriverForm = { name: '', phone: '', vehicle: '', zone_id: null, active: true, notes: '' };

function DriversPanel() {
  const { data: drivers, isLoading } = useDrivers({ includeInactive: true });
  const { data: zones } = useZones({ includeInactive: true });
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<DriverForm | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ['drivers'] });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      name: editing.name.trim(),
      phone: editing.phone.trim(),
      vehicle: editing.vehicle || null,
      zone_id: editing.zone_id || null,
      active: editing.active,
      notes: editing.notes || null,
    };
    const res = editing.id
      ? await supabase.from('drivers').update(payload).eq('id', editing.id)
      : await supabase.from('drivers').insert(payload);
    setSaving(false);
    if (res.error) return toast({ title: 'Save failed', description: res.error.message, variant: 'destructive' });
    toast({ title: editing.id ? 'Driver updated' : 'Driver added' });
    setEditing(null); refresh();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete driver?')) return;
    const { error } = await supabase.from('drivers').delete().eq('id', id);
    if (error) return toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    refresh();
  };

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button onClick={() => setEditing({ ...emptyDriver })}><Plus className="w-4 h-4 mr-1" />New Driver</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {(drivers ?? []).map((d) => {
          const zone = zones?.find(z => z.id === d.zone_id);
          return (
            <div key={d.id} className="glass-card p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><UserIcon className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{d.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{d.phone}</p>
                  <p className="text-xs text-muted-foreground truncate">{d.vehicle || '—'} {zone ? `• ${zone.name}` : ''}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${d.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {d.active ? 'On' : 'Off'}
                </span>
              </div>
              {d.notes && <p className="text-xs text-muted-foreground mt-2">{d.notes}</p>}
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => setEditing(d)}><Pencil className="w-3.5 h-3.5 mr-1" />Edit</Button>
                <Button size="sm" variant="ghost" className="text-destructive ml-auto" onClick={() => remove(d.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          );
        })}
        {(drivers ?? []).length === 0 && <p className="text-sm text-muted-foreground col-span-full text-center py-6">No drivers yet. Add your first dispatch driver.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center sm:p-4 z-50" onClick={() => !saving && setEditing(null)}>
          <div className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editing.id ? 'Edit Driver' : 'New Driver'}</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
              <div><Label>Vehicle</Label><Input value={editing.vehicle ?? ''} placeholder="e.g. Boda - KMEA 123A" onChange={(e) => setEditing({ ...editing, vehicle: e.target.value })} /></div>
              <div>
                <Label>Default zone</Label>
                <select value={editing.zone_id ?? ''} onChange={(e) => setEditing({ ...editing, zone_id: e.target.value || null })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">No zone</option>
                  {zones?.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
              </div>
              <div><Label>Notes</Label><Textarea rows={2} value={editing.notes ?? ''} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label>Active</Label>
                <Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button>
                <Button className="flex-1" onClick={save} disabled={saving || !editing.name || !editing.phone}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
