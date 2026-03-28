import { Crown, Users } from 'lucide-react';

const tiers = [
  { name: 'Bronze', price: 'Free', members: 0, color: 'from-amber-700 to-amber-900' },
  { name: 'Silver', price: 'KES 1,900/mo', members: 0, color: 'from-slate-400 to-slate-600' },
  { name: 'Gold', price: 'KES 3,900/mo', members: 0, color: 'from-amber-400 to-amber-600' },
  { name: 'Platinum', price: 'KES 7,900/mo', members: 0, color: 'from-slate-200 to-slate-400' },
];

export default function AdminMemberships() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Membership Management</h2>
        <p className="text-muted-foreground text-sm">Manage membership tiers and subscribers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {tiers.map((tier) => (
          <div key={tier.name} className="glass-card p-5 rounded-xl">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
            <p className="text-primary font-semibold text-sm mb-3">{tier.price}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{tier.members} subscribers</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-2">Payment Integration Required</h3>
        <p className="text-sm text-muted-foreground">
          Stripe and M-Pesa payment integrations need to be configured to enable subscription billing. 
          Once connected, membership sign-ups and recurring payments will be tracked here automatically.
        </p>
      </div>
    </div>
  );
}
