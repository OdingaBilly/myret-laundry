import { Crown, Users } from 'lucide-react';
import { useMembershipPlans } from '@/hooks/useMembership';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { format } from 'date-fns';

export default function AdminMemberships() {
  const { data: plans, isLoading } = useMembershipPlans();
  const { toast } = useToast();

  // subscriber counts (simple aggregated query)
  const { data: counts } = useQuery({
    queryKey: ['membership_counts'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('membership_subscriber_counts');
      if (error) {
        toast({ title: 'Error', description: 'Failed to fetch subscriber counts', variant: 'destructive' });
        return [];
      }
      return data ?? [];
    },
    enabled: true,
    staleTime: 60_000,
  });

  const [memberships, setMemberships] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newMembership, setNewMembership] = useState({ user_id: '', plan_id: '', expires_at: '' });
  const [crediting, setCrediting] = useState<{ membershipId: string | null; points: number; reason: string } | null>(null);

  useEffect(() => {
    fetchMemberships();
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('id,user_id,full_name,phone');
    setProfiles(data ?? []);
  };

  const fetchMemberships = async () => {
    setLoadingMembers(true);
    const { data, error } = await supabase.from('memberships').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch memberships', variant: 'destructive' });
    } else {
      setMemberships(data ?? []);
    }
    setLoadingMembers(false);
  };

  const openCreate = () => {
    setNewMembership({ user_id: profiles?.[0]?.user_id ?? '', plan_id: plans?.[0]?.id ?? '', expires_at: '' });
    setShowCreate(true);
  };

  const createMembership = async () => {
    if (!newMembership.user_id || !newMembership.plan_id) return toast({ title: 'Missing', description: 'Select user and plan', variant: 'destructive' });
    const { error } = await supabase.from('memberships').insert({ user_id: newMembership.user_id, plan_id: newMembership.plan_id, expires_at: newMembership.expires_at || null });
    if (error) return toast({ title: 'Create failed', description: error.message, variant: 'destructive' });
    toast({ title: 'Membership created' });
    setShowCreate(false);
    fetchMemberships();
  };

  const cancelMembership = async (id: string) => {
    if (!confirm('Cancel membership?')) return;
    const { error } = await supabase.from('memberships').update({ active: false }).eq('id', id);
    if (error) return toast({ title: 'Cancel failed', description: error.message, variant: 'destructive' });
    toast({ title: 'Membership cancelled' });
    fetchMemberships();
  };

  const extendMembership = async (id: string) => {
    const days = prompt('Add how many days to extend? (e.g., 30)');
    if (!days) return;
    const add = Number(days);
    if (!add || add <= 0) return toast({ title: 'Invalid', description: 'Enter valid days', variant: 'destructive' });
    const m = memberships.find((x) => x.id === id);
    const current = m?.expires_at ? new Date(m.expires_at) : new Date();
    current.setDate(current.getDate() + add);
    const { error } = await supabase.from('memberships').update({ expires_at: current.toISOString() }).eq('id', id);
    if (error) return toast({ title: 'Extend failed', description: error.message, variant: 'destructive' });
    toast({ title: 'Membership extended' });
    fetchMemberships();
  };

  const startCredit = (membershipId: string) => setCrediting({ membershipId, points: 0, reason: '' });

  const doCredit = async () => {
    if (!crediting || !crediting.membershipId) return;
    const m = memberships.find((x) => x.id === crediting.membershipId);
    const userId = m.user_id;
    const pts = Number(crediting.points) || 0;
    if (pts <= 0) return toast({ title: 'Invalid', description: 'Points must be positive', variant: 'destructive' });
    const { error } = await supabase.from('loyalty_points').insert({ user_id: userId, membership_id: crediting.membershipId, points: pts, reason: crediting.reason || 'Admin credit' });
    if (error) return toast({ title: 'Credit failed', description: error.message, variant: 'destructive' });
    // update membership balance
    const { error: upd } = await supabase.from('memberships').update({ points_balance: (m.points_balance || 0) + pts }).eq('id', crediting.membershipId);
    if (upd) console.warn('Failed updating balance', upd.message);
    toast({ title: 'Points credited' });
    setCrediting(null);
    fetchMemberships();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Membership Management</h2>
        <p className="text-muted-foreground text-sm">Manage membership tiers and subscribers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {(plans ?? []).map((plan: any) => (
          <div key={plan.id} className="glass-card p-5 rounded-xl">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4`}>
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
            <p className="text-primary font-semibold text-sm mb-3">{plan.price ? `KES ${Number(plan.price).toLocaleString()}/mo` : 'Free'}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{(counts ?? []).find((c: any) => c.plan_id === plan.id)?.count ?? 0} subscribers</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Subscribers</h3>
          <div className="flex items-center gap-2">
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> New Membership</Button>
          </div>
        </div>

        {loadingMembers ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-2">
            {memberships.map((m) => (
              <div key={m.id} className="p-3 rounded-lg border bg-background flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{profiles.find(p => p.user_id === m.user_id)?.full_name ?? m.user_id}</div>
                  <div className="text-xs text-muted-foreground">Plan: {plans?.find((p: any) => p.id === m.plan_id)?.name ?? m.plan_id} • Expires: {m.expires_at ? new Date(m.expires_at).toLocaleDateString() : '—'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => extendMembership(m.id)}>Extend</Button>
                  <Button size="sm" variant="ghost" onClick={() => cancelMembership(m.id)}>Cancel</Button>
                  <Button size="sm" onClick={() => startCredit(m.id)}>Credit Points</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Create Membership</h4>
              <button onClick={() => setShowCreate(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <Label>User</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={newMembership.user_id} onChange={(e) => setNewMembership({ ...newMembership, user_id: e.target.value })}>
                  <option value="">Select user</option>
                  {profiles.map((p) => <option key={p.user_id} value={p.user_id}>{p.full_name} — {p.phone}</option>)}
                </select>
              </div>
              <div>
                <Label>Plan</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={newMembership.plan_id} onChange={(e) => setNewMembership({ ...newMembership, plan_id: e.target.value })}>
                  <option value="">Select plan</option>
                  {plans?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Expires at</Label>
                <Input type="date" value={newMembership.expires_at} onChange={(e) => setNewMembership({ ...newMembership, expires_at: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button onClick={createMembership}>Create</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credit modal */}
      {crediting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Credit Points</h4>
              <button onClick={() => setCrediting(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Points</Label>
                <Input type="number" value={String(crediting.points)} onChange={(e) => setCrediting({ ...crediting, points: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Reason</Label>
                <Textarea rows={3} value={crediting.reason} onChange={(e) => setCrediting({ ...crediting, reason: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCrediting(null)}>Cancel</Button>
                <Button onClick={doCredit}>Credit</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
