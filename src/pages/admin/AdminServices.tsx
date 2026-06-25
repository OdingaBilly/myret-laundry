import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Loader2, X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useServices, useCategories } from '@/hooks/useServices';
import { iconOptions, gradientOptions, getIcon, type ServiceData } from '@/lib/services';

type FormState = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  full_description: string;
  base_price: number;
  price_label: string;
  turnaround: string;
  features: string;
  icon_key: string;
  gradient: string;
  category: string;
  active: boolean;
  sort_order: number;
};

const emptyForm: FormState = {
  slug: '', name: '', description: '', full_description: '',
  base_price: 0, price_label: '', turnaround: '24-48 hours',
  features: '', icon_key: 'sparkles', gradient: gradientOptions[0],
  category: '', active: true, sort_order: 99,
};

const toForm = (s: ServiceData): FormState => ({
  id: s.id, slug: s.slug, name: s.name, description: s.description,
  full_description: s.fullDescription, base_price: s.basePrice,
  price_label: s.price.startsWith('From KES') ? '' : s.price,
  turnaround: s.turnaround, features: s.features.join('\n'),
  icon_key: s.iconKey, gradient: s.gradient, category: s.category,
  active: s.active, sort_order: s.sortOrder,
});

export default function AdminServices() {
  const { services, isLoading } = useServices({ includeInactive: true });
  const qc = useQueryClient();
  const { toast } = useToast();
  const { categories } = useCategories() as any;
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ['services'] });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      slug: editing.slug.trim(),
      name: editing.name.trim(),
      description: editing.description,
      full_description: editing.full_description,
      base_price: Number(editing.base_price) || 0,
      price_label: editing.price_label.trim() || null,
      turnaround: editing.turnaround,
      features: editing.features.split('\n').map(f => f.trim()).filter(Boolean),
      icon_key: editing.icon_key,
      gradient: editing.gradient,
      category: editing.category,
      active: editing.active,
      sort_order: Number(editing.sort_order) || 0,
    };
    const res = editing.id
      ? await supabase.from('services').update(payload).eq('id', editing.id)
      : await supabase.from('services').insert(payload);
    setSaving(false);
    if (res.error) {
      toast({ title: 'Save failed', description: res.error.message, variant: 'destructive' });
      return;
    }
    toast({ title: editing.id ? 'Service updated' : 'Service added' });
    setEditing(null);
    refresh();
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (!confirm('Delete this service? Existing orders are unaffected.')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) return toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    toast({ title: 'Service removed' });
    refresh();
  };

  const toggleActive = async (s: ServiceData) => {
    const { error } = await supabase.from('services').update({ active: !s.active }).eq('id', s.id!);
    if (error) toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    refresh();
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Services & Pricing</h2>
          <p className="text-muted-foreground text-xs md:text-sm">Add, edit, price and toggle services across the site.</p>
        </div>
        <Button onClick={() => setEditing({ ...emptyForm, category: categories?.[0]?.id ?? '' })}>
          <Plus className="w-4 h-4 mr-1" /> New Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.slug} className="glass-card p-4 rounded-xl flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{s.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{s.slug}</p>
                  <p className="text-sm text-primary font-medium mt-0.5">{s.price}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {s.active ? 'Active' : 'Hidden'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{s.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <span>⏱ {s.turnaround}</span>
                <span>•</span>
                <span>{s.features.length} features</span>
                <span>•</span>
                <span className="capitalize">{categories?.find(c => c.id === s.category)?.name ?? s.category}</span>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <Button variant="outline" size="sm" onClick={() => setEditing(toForm(s))}>
                  <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleActive(s)}>
                  {s.active ? 'Hide' : 'Show'}
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive ml-auto" onClick={() => remove(s.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center sm:p-4 z-50" onClick={() => !saving && setEditing(null)}>
          <div className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl max-h-[90vh] overflow-y-auto p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editing.id ? 'Edit Service' : 'New Service'}</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="dry-cleaning" /></div>
              </div>
              <div><Label>Short description</Label><Textarea rows={2} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div><Label>Full description</Label><Textarea rows={3} value={editing.full_description} onChange={(e) => setEditing({ ...editing, full_description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Base price (KES)</Label><Input type="number" value={editing.base_price} onChange={(e) => setEditing({ ...editing, base_price: Number(e.target.value) })} /></div>
                <div><Label>Price label override</Label><Input value={editing.price_label} placeholder="From KES 350" onChange={(e) => setEditing({ ...editing, price_label: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Turnaround</Label><Input value={editing.turnaround} onChange={(e) => setEditing({ ...editing, turnaround: e.target.value })} /></div>
                <div><Label>Sort order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
              </div>
              <div><Label>Features (one per line)</Label><Textarea rows={4} value={editing.features} onChange={(e) => setEditing({ ...editing, features: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Icon</Label>
                  <select value={editing.icon_key} onChange={(e) => setEditing({ ...editing, icon_key: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {iconOptions.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Category</Label>
                  <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {(categories ?? []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Gradient</Label>
                  <select value={editing.gradient} onChange={(e) => setEditing({ ...editing, gradient: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {gradientOptions.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label>Visible to customers</Label>
                  <p className="text-xs text-muted-foreground">Hidden services won't appear on the site.</p>
                </div>
                <Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
                <Button className="flex-1" onClick={save} disabled={saving || !editing.name || !editing.slug}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Service'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
