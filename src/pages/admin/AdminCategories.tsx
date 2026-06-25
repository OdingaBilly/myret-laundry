import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Loader2, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCategories } from '@/hooks/useServices';

type CategoryForm = {
  id?: string;
  name: string;
  sort_order: number;
};

const emptyForm: CategoryForm = { name: '', sort_order: 99 };

export default function AdminCategories() {
  const { categories, isLoading } = useCategories() as any;
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<CategoryForm | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ['service_categories'] });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      id: editing.id?.trim() || undefined,
      name: editing.name.trim(),
      sort_order: Number(editing.sort_order) || 0,
    } as any;

    let res;
    if (editing.id) {
      res = await supabase.from('service_categories').update({ name: payload.name, sort_order: payload.sort_order }).eq('id', editing.id);
    } else {
      // generate simple id from name
      const id = editing.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      res = await supabase.from('service_categories').insert({ id, name: payload.name, sort_order: payload.sort_order });
    }

    setSaving(false);
    if (res.error) {
      toast({ title: 'Save failed', description: res.error.message, variant: 'destructive' });
      return;
    }

    toast({ title: editing.id ? 'Category updated' : 'Category added' });
    setEditing(null);
    refresh();
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (!confirm('Delete this category? Services referencing it will keep the value.')) return;
    const { error } = await supabase.from('service_categories').delete().eq('id', id);
    if (error) return toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    toast({ title: 'Category removed' });
    refresh();
  };

  const swapOrder = async (a: any, b: any) => {
    const { error: e1 } = await supabase.from('service_categories').update({ sort_order: b.sort_order }).eq('id', a.id);
    const { error: e2 } = await supabase.from('service_categories').update({ sort_order: a.sort_order }).eq('id', b.id);
    if (e1 || e2) return toast({ title: 'Reorder failed', description: (e1 || e2)?.message, variant: 'destructive' });
    refresh();
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Service Categories</h2>
          <p className="text-muted-foreground text-xs md:text-sm">Manage categories used to classify services.</p>
        </div>
        <Button onClick={() => setEditing({ ...emptyForm })}><Plus className="w-4 h-4 mr-1" /> New Category</Button>
      </div>

      <div className="grid gap-2">
        {(categories ?? []).map((c: any, idx: number) => (
          <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border bg-background">
            <div className="flex-1">
              <div className="font-medium text-foreground">{c.name}</div>
              <div className="text-xs text-muted-foreground">id: {c.id} • order: {c.sort_order}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing({ id: c.id, name: c.name, sort_order: c.sort_order })}><Pencil className="w-3.5 h-3.5 mr-1" />Edit</Button>
              <Button variant="ghost" size="sm" onClick={() => remove(c.id)} className="text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="sm" onClick={() => idx > 0 && swapOrder(c, categories[idx-1])}><ArrowUp className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => idx < (categories?.length ?? 0) -1 && swapOrder(c, categories[idx+1])}><ArrowDown className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center sm:p-4 z-50" onClick={() => !saving && setEditing(null)}>
          <div className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editing.id ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Sort order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
                <Button className="flex-1" onClick={save} disabled={saving || !editing.name}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
