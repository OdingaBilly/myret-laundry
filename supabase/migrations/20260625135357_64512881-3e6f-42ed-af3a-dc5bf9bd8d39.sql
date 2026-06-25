
-- Services catalog table (admin-managed)
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  full_description text NOT NULL DEFAULT '',
  base_price numeric(10,2) NOT NULL DEFAULT 0,
  price_label text,
  turnaround text NOT NULL DEFAULT '24-48 hours',
  features text[] NOT NULL DEFAULT '{}',
  icon_key text NOT NULL DEFAULT 'sparkles',
  gradient text NOT NULL DEFAULT 'from-primary/20 to-primary/5',
  category text NOT NULL DEFAULT 'garment',
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are viewable by all" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins manage services" ON public.services FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Delivery zones (logistics regions w/ fees)
CREATE TABLE public.delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  area_description text NOT NULL DEFAULT '',
  pickup_fee numeric(10,2) NOT NULL DEFAULT 0,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  eta_hours int NOT NULL DEFAULT 24,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.delivery_zones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.delivery_zones TO authenticated;
GRANT ALL ON public.delivery_zones TO service_role;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zones are viewable by all" ON public.delivery_zones FOR SELECT USING (true);
CREATE POLICY "Admins manage zones" ON public.delivery_zones FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_zones_updated BEFORE UPDATE ON public.delivery_zones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Drivers / dispatch roster
CREATE TABLE public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  vehicle text,
  zone_id uuid REFERENCES public.delivery_zones(id) ON DELETE SET NULL,
  active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.drivers TO authenticated;
GRANT ALL ON public.drivers TO service_role;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage drivers" ON public.drivers FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Authenticated can view drivers" ON public.drivers FOR SELECT TO authenticated USING (true);
CREATE TRIGGER trg_drivers_updated BEFORE UPDATE ON public.drivers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Extend orders with logistics fields
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS zone_id uuid REFERENCES public.delivery_zones(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS driver_id uuid REFERENCES public.drivers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS dispatch_notes text,
  ADD COLUMN IF NOT EXISTS pickup_fee numeric(10,2),
  ADD COLUMN IF NOT EXISTS delivery_fee numeric(10,2);

-- Seed services
INSERT INTO public.services (slug, name, description, full_description, base_price, price_label, turnaround, features, icon_key, gradient, category, sort_order) VALUES
('dry-cleaning','Dry Cleaning','Premium solvent-free cleaning for delicate fabrics and designer pieces.','Our advanced dry cleaning service uses eco-friendly solvents that are gentle on fabrics while removing stubborn stains. Perfect for suits, silk, cashmere, and other delicate materials.',350,'From KES 350','24-48 hours',ARRAY['Eco-friendly solvents','Expert stain pre-treatment','Hand finishing','Premium packaging','Garment inspection','Minor repairs included'],'sparkles','from-primary/20 to-primary/5','garment',1),
('wash-and-fold','Wash & Fold','Fresh, crisp everyday laundry with eco-friendly detergents.','Our wash and fold service is perfect for your everyday laundry needs. Premium eco-friendly detergents tough on dirt yet gentle on fabrics.',150,'From KES 150','Same day available',ARRAY['Eco-friendly detergents','Color separation','Temperature control','Professional folding','Fabric softener option','Stain treatment'],'shirt','from-secondary/20 to-secondary/5','garment',2),
('express-service','Express Service','Same-day turnaround when you need it most.',' Get your garments professionally cleaned and ready within hours.',500,'From KES 500','3-6 hours',ARRAY['Priority processing','Dedicated team','Real-time tracking','Quality guaranteed','Door-to-door delivery','Emergency slots'],'zap','from-primary/20 to-secondary/5','garment',3),
('stain-removal','Stain Removal','Expert treatment for even the most stubborn stains.','Our stain removal experts use advanced techniques and specialized solutions.',250,'From KES 250','24-72 hours',ARRAY['Expert assessment','Specialized solutions','Multiple techniques','Color restoration','Fabric protection','Success guarantee'],'droplets','from-secondary/20 to-primary/5','garment',4),
('eco-care','Eco Care','Sustainable cleaning options for the environmentally conscious.','100% biodegradable, plant-based cleaning with minimal water and energy.',200,'From KES 200','24-48 hours',ARRAY['100% biodegradable','Plant-based solutions','Water conservation','Energy efficient','Carbon neutral','Recyclable packaging'],'leaf','from-emerald-500/20 to-emerald-500/5','garment',5),
('vip-treatment','VIP Treatment','White-glove service for luxury and heirloom garments.','Designed for your most precious garments with individual attention to every detail.',800,'From KES 800','48-72 hours',ARRAY['Individual attention','Master craftsmen','Hand cleaning','Climate controlled','Insurance included','Archival packaging'],'crown','from-amber-500/20 to-amber-500/5','garment',6),
('car-wash','Car Upholstery Wash','Deep cleaning for car seats, mats, and interior fabrics.','Professional deep cleaning for your vehicle interior fabrics — seats, mats, headliners, all soft surfaces.',2500,'From KES 2,500','24-48 hours',ARRAY['Seat deep cleaning','Floor mat washing','Stain & odor removal','Leather conditioning','Headliner care','Pickup & delivery'],'car','from-sky-500/20 to-sky-500/5','vehicle',7),
('carpet-cleaning','Floor & Carpet Cleaning','Professional cleaning for carpets, rugs, and floor mats.','Revive your carpets, area rugs, and floor coverings with our deep-cleaning service.',1500,'From KES 1,500','48-72 hours',ARRAY['Deep extraction','Stain treatment','Deodorizing','Anti-allergen treatment','Color restoration','Fiber protection'],'layers','from-violet-500/20 to-violet-500/5','home',8)
ON CONFLICT (slug) DO NOTHING;

-- Seed default zones
INSERT INTO public.delivery_zones (name, area_description, pickup_fee, delivery_fee, eta_hours, sort_order) VALUES
('Nairobi CBD','City Centre and surrounding areas',150,150,24,1),
('Westlands & Parklands','Westlands, Parklands, Highridge',200,200,24,2),
('Karen & Lang''ata','Karen, Lang''ata, Hardy',350,350,36,3),
('Kilimani & Kileleshwa','Kilimani, Kileleshwa, Lavington',200,200,24,4),
('Eastlands','Eastleigh, Buruburu, Donholm',250,250,36,5)
ON CONFLICT DO NOTHING;
