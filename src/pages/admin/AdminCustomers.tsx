import { useEffect, useState } from 'react';
import { Search, Loader2, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function AdminCustomers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setProfiles(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = profiles.filter(p =>
    (p.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.phone || '').includes(searchTerm) ||
    (p.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Customers</h2>
        <p className="text-muted-foreground text-xs md:text-sm">{profiles.length} registered users</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((profile) => (
          <div key={profile.id} className="glass-card rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-medium truncate">{profile.full_name || 'Anonymous'}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${profile.is_anonymous ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {profile.is_anonymous ? 'Guest' : 'Registered'}
                  </span>
                </div>
                {profile.phone && <p className="text-xs text-muted-foreground">{profile.phone}</p>}
                {profile.address && <p className="text-xs text-muted-foreground truncate">{profile.address}</p>}
                <p className="text-xs text-muted-foreground mt-1">Joined {new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No customers found</div>}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((profile) => (
                <tr key={profile.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm font-medium">{profile.full_name || 'Anonymous'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{profile.phone || '—'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{profile.address || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${profile.is_anonymous ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {profile.is_anonymous ? 'Guest' : 'Registered'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(profile.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
