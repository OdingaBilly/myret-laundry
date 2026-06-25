-- Create service categories table
CREATE TABLE IF NOT EXISTS public.service_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_categories TO authenticated;
GRANT ALL ON public.service_categories TO service_role;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by all" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.service_categories FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER IF NOT EXISTS trg_service_categories_updated BEFORE UPDATE ON public.service_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed provided categories (upsert/update)
INSERT INTO public.service_categories (id, name, sort_order) VALUES
('cat_weight_based','Weight Based Laundry',1),
('cat_everyday','Everyday Clothing',2),
('cat_formal','Formal Wear',3),
('cat_traditional','Traditional Wear',4),
('cat_bedding','Bedding & Linen',5),
('cat_bath','Towels & Bath Items',6),
('cat_curtains','Curtains & Household Fabrics',7),
('cat_special','Special Garments',8),
('cat_misc','Miscellaneous',9)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- Migrate existing service category text values to the new category ids where sensible
-- Map legacy 'garment' -> 'cat_everyday', 'vehicle' -> 'cat_misc', 'home' -> 'cat_bedding'
UPDATE public.services SET category = 'cat_everyday' WHERE category = 'garment';
UPDATE public.services SET category = 'cat_misc' WHERE category = 'vehicle';
UPDATE public.services SET category = 'cat_bedding' WHERE category = 'home';
