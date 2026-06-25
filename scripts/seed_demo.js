#!/usr/bin/env node
/*
Seed demo users, memberships and loyalty points.

Usage:
  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed_demo.js

Optional env vars:
  DEMO_USER_EMAIL - email for a single demo user to create
  DEMO_USER_PASSWORD - password for demo user (default: Passw0rd!)
  DEMO_COUNT - number of demo users to create (default: 1)
  PLAN_ID - membership plan id to assign (default: silver)
*/

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createAdminUser(email, password) {
  // Use admin API to create a user. supabase-js v2 exposes auth.admin.createUser
  if (supabase.auth && supabase.auth.admin && typeof supabase.auth.admin.createUser === 'function') {
    const res = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
    if (res.error) throw res.error;
    return res.user || res.data || res;
  }
  // fallback: try insert into auth.users via SQL (requires service role)
  const insert = await supabase.rpc('auth_create_user', { _email: email, _password: password }).catch(() => null);
  if (insert && insert.data) return insert.data;
  throw new Error('Unable to create user via admin API.');
}

async function main() {
  const demoEmail = process.env.DEMO_USER_EMAIL;
  const demoPassword = process.env.DEMO_USER_PASSWORD || 'Passw0rd!';
  const demoCount = Number(process.env.DEMO_COUNT || 1);
  const planId = process.env.PLAN_ID || 'silver';

  // Ensure membership plans exist
  const { data: plans } = await supabase.from('membership_plans').select('*');
  if (!plans || plans.length === 0) {
    console.log('Seeding default membership plans...');
    await supabase.from('membership_plans').insert([
      { id: 'bronze', name: 'Bronze', price: 0, benefits: { description: 'Basic membership' }, points_multiplier: 1, sort_order: 1 },
      { id: 'silver', name: 'Silver', price: 1900, benefits: { description: 'Priority pickup' }, points_multiplier: 1.1, sort_order: 2 },
      { id: 'gold', name: 'Gold', price: 3900, benefits: { description: 'Faster turnaround' }, points_multiplier: 1.25, sort_order: 3 },
      { id: 'platinum', name: 'Platinum', price: 7900, benefits: { description: 'Highest tier' }, points_multiplier: 1.5, sort_order: 4 },
    ]).then(r => { if (r.error) console.error('Failed to seed plans:', r.error.message); });
  }

  const created = [];
  for (let i = 0; i < demoCount; i++) {
    let email = demoEmail;
    if (!email) email = `demo+${Date.now()}+${i}@example.com`;

    console.log(`Creating user: ${email}`);
    let user;
    try {
      const res = await createAdminUser(email, demoPassword);
      user = res?.id || res?.user?.id || res?.data?.id || res?.id;
    } catch (err) {
      console.error('Failed to create user:', err.message || err);
      continue;
    }

    if (!user) {
      console.error('No user id returned; skipping.');
      continue;
    }

    // Insert profile
    await supabase.from('profiles').upsert({ user_id: user, full_name: `Demo User ${i}`, phone: `+2547000000${i}` }).then(r => { if (r.error) console.error('Profile upsert error:', r.error.message); });

    // Create membership
    const now = new Date();
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    const { data: mem, error: memErr } = await supabase.from('memberships').insert({ user_id: user, plan_id: planId, started_at: now.toISOString(), expires_at: expires.toISOString(), active: true, points_balance: 0 }).select('*').single();
    if (memErr) { console.error('Membership insert failed:', memErr.message); continue; }

    // Add loyalty points sample
    const pts = Math.floor(Math.random() * 100) + 20;
    const { error: lpErr } = await supabase.from('loyalty_points').insert({ user_id: user, membership_id: mem.id, order_id: null, points: pts, reason: 'Welcome bonus' });
    if (lpErr) console.error('Loyalty insert failed:', lpErr.message);

    // Update membership balance
    await supabase.from('memberships').update({ points_balance: pts }).eq('id', mem.id).then(r => { if (r.error) console.error('Balance update failed:', r.error.message); });

    created.push({ user, email, membership: mem.id, points: pts });
  }

  console.log('Finished. Created demo entries:', created);
}

main().catch((err) => { console.error(err); process.exit(1); });
