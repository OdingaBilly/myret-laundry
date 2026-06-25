import { Sparkles, Shirt, Zap, Droplets, Leaf, Crown, Car, Layers, Package, Truck, Wrench, type LucideIcon } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type LaundryService = Database['public']['Enums']['laundry_service'];

export const iconRegistry: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  shirt: Shirt,
  zap: Zap,
  droplets: Droplets,
  leaf: Leaf,
  crown: Crown,
  car: Car,
  layers: Layers,
  package: Package,
  truck: Truck,
  wrench: Wrench,
};

export const iconOptions = Object.keys(iconRegistry);

export const gradientOptions = [
  'from-primary/20 to-primary/5',
  'from-secondary/20 to-secondary/5',
  'from-primary/20 to-secondary/5',
  'from-secondary/20 to-primary/5',
  'from-emerald-500/20 to-emerald-500/5',
  'from-amber-500/20 to-amber-500/5',
  'from-sky-500/20 to-sky-500/5',
  'from-violet-500/20 to-violet-500/5',
  'from-rose-500/20 to-rose-500/5',
];

export const categoryOptions = [
  { value: 'garment', label: 'Garments' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'home', label: 'Home & Carpet' },
  { value: 'other', label: 'Other' },
];

export const getIcon = (key: string | null | undefined): LucideIcon =>
  (key && iconRegistry[key]) || Sparkles;

export const formatPrice = (amount: number | string | null | undefined, label?: string | null) => {
  if (label && label.trim().length > 0) return label;
  const n = typeof amount === 'string' ? parseFloat(amount) : amount ?? 0;
  return `From KES ${Number(n).toLocaleString()}`;
};

// Fallback service slug labels for older orders / enum mapping
export const serviceLabels: Record<string, string> = {
  'dry-cleaning': 'Dry Cleaning',
  'wash-and-fold': 'Wash & Fold',
  'express-service': 'Express Service',
  'stain-removal': 'Stain Removal',
  'eco-care': 'Eco Care',
  'vip-treatment': 'VIP Treatment',
  'car-wash': 'Car Upholstery Wash',
  'carpet-cleaning': 'Floor & Carpet Cleaning',
};

export const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  picked_up: 'bg-indigo-100 text-indigo-800',
  at_store: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-pink-100 text-pink-800',
  ready: 'bg-green-100 text-green-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-teal-100 text-teal-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const statusOptions: { value: Database['public']['Enums']['order_status']; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'at_store', label: 'At Store' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'ready', label: 'Ready' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export type ServiceRow = Database['public']['Tables']['services']['Row'];

export interface ServiceData {
  id?: string;
  slug: string;
  name: string;
  description: string;
  fullDescription: string;
  price: string;
  basePrice: number;
  turnaround: string;
  features: string[];
  icon: LucideIcon;
  iconKey: string;
  gradient: string;
  category: string;
  active: boolean;
  sortOrder: number;
}

export const mapServiceRow = (row: ServiceRow): ServiceData => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description ?? '',
  fullDescription: row.full_description ?? '',
  price: formatPrice(row.base_price, row.price_label),
  basePrice: Number(row.base_price ?? 0),
  turnaround: row.turnaround ?? '24-48 hours',
  features: row.features ?? [],
  icon: getIcon(row.icon_key),
  iconKey: row.icon_key ?? 'sparkles',
  gradient: row.gradient ?? 'from-primary/20 to-primary/5',
  category: row.category ?? 'cat_everyday',
  active: row.active ?? true,
  sortOrder: row.sort_order ?? 0,
});

// Used as a fallback while DB loads or if it's empty
export const fallbackServices: ServiceData[] = [
  { slug: 'dry-cleaning', name: 'Dry Cleaning', description: 'Premium solvent-free cleaning for delicate fabrics.', fullDescription: '', price: 'From KES 350', basePrice: 350, turnaround: '24-48 hours', features: [], icon: Sparkles, iconKey: 'sparkles', gradient: 'from-primary/20 to-primary/5', category: 'cat_everyday', active: true, sortOrder: 1 },
  { slug: 'wash-and-fold', name: 'Wash & Fold', description: 'Fresh everyday laundry.', fullDescription: '', price: 'From KES 150', basePrice: 150, turnaround: 'Same day', features: [], icon: Shirt, iconKey: 'shirt', gradient: 'from-secondary/20 to-secondary/5', category: 'cat_everyday', active: true, sortOrder: 2 },
];

export const fallbackCategories = [
  { id: 'cat_weight_based', name: 'Weight Based Laundry', sort_order: 1 },
  { id: 'cat_everyday', name: 'Everyday Clothing', sort_order: 2 },
  { id: 'cat_formal', name: 'Formal Wear', sort_order: 3 },
  { id: 'cat_traditional', name: 'Traditional Wear', sort_order: 4 },
  { id: 'cat_bedding', name: 'Bedding & Linen', sort_order: 5 },
  { id: 'cat_bath', name: 'Towels & Bath Items', sort_order: 6 },
  { id: 'cat_curtains', name: 'Curtains & Household Fabrics', sort_order: 7 },
  { id: 'cat_special', name: 'Special Garments', sort_order: 8 },
  { id: 'cat_misc', name: 'Miscellaneous', sort_order: 9 },
];

// Back-compat export — populated lazily via hook; legacy importers fall back to defaults.
export const allServices: ServiceData[] = fallbackServices;
