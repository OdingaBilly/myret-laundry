-- Membership plans
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  price numeric(10,2) DEFAULT 0,
  benefits jsonb DEFAULT '{}'::jsonb,
  points_multiplier numeric(6,2) NOT NULL DEFAULT 1,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.membership_plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.membership_plans TO authenticated;
GRANT ALL ON public.membership_plans TO service_role;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans are viewable by all" ON public.membership_plans FOR SELECT USING (true);
CREATE POLICY "Admins manage plans" ON public.membership_plans FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER IF NOT EXISTS trg_membership_plans_updated BEFORE UPDATE ON public.membership_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Memberships (user subscriptions)
CREATE TABLE IF NOT EXISTS public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id text REFERENCES public.membership_plans(id) ON DELETE SET NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  points_balance numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.memberships TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.memberships TO authenticated;
GRANT ALL ON public.memberships TO service_role;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own membership" ON public.memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own membership" ON public.memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage memberships" ON public.memberships FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER IF NOT EXISTS trg_memberships_updated BEFORE UPDATE ON public.memberships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Loyalty points ledger
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  membership_id uuid REFERENCES public.memberships(id) ON DELETE SET NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  points int NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.loyalty_points TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.loyalty_points TO authenticated;
GRANT ALL ON public.loyalty_points TO service_role;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own points" ON public.loyalty_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own points" ON public.loyalty_points FOR INSERT WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage points" ON public.loyalty_points FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Extend orders to record points awarded and linked membership
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS points_awarded int,
  ADD COLUMN IF NOT EXISTS membership_id uuid REFERENCES public.memberships(id) ON DELETE SET NULL;

-- Seed example plans
INSERT INTO public.membership_plans (id, name, price, benefits, points_multiplier, sort_order) VALUES
('bronze','Bronze',0,'{"description":"Basic membership"}',1,1),
('silver','Silver',1900,'{"description":"Priority pickup"}',1.1,2),
('gold','Gold',3900,'{"description":"Faster turnaround + discounts"}',1.25,3),
('platinum','Platinum',7900,'{"description":"Highest tier benefits"}',1.5,4)
ON CONFLICT (id) DO NOTHING;
