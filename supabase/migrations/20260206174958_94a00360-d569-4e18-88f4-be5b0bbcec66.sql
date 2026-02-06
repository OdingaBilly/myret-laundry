-- Update profiles table to allow anonymous users
ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;

-- Add anonymous session tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS anonymous_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT false;

-- Update orders table to support anonymous users
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS anonymous_id text;

-- Create index for anonymous_id lookups
CREATE INDEX IF NOT EXISTS idx_profiles_anonymous_id ON public.profiles(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_orders_anonymous_id ON public.orders(anonymous_id);

-- Drop existing policies that are too restrictive for anonymous users
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new policies that support both authenticated and anonymous users
CREATE POLICY "Users can insert their own orders"
ON public.orders FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND anonymous_id IS NOT NULL)
);

CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND anonymous_id IS NOT NULL)
);

CREATE POLICY "Users can update their own orders"
ON public.orders FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR 
  (user_id IS NULL AND anonymous_id IS NOT NULL)
);

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (
  auth.uid() = user_id OR 
  (user_id IS NULL AND anonymous_id IS NOT NULL)
);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id OR (user_id IS NULL AND anonymous_id IS NOT NULL));