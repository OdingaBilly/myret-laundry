-- Add new service types to the laundry_service enum
ALTER TYPE public.laundry_service ADD VALUE IF NOT EXISTS 'car-wash';
ALTER TYPE public.laundry_service ADD VALUE IF NOT EXISTS 'carpet-cleaning';