import { Sparkles, Shirt, Zap, Droplets, Leaf, Crown, Car, Layers } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type LaundryService = Database['public']['Enums']['laundry_service'];

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

export const serviceIcons: Record<string, any> = {
  'dry-cleaning': Sparkles,
  'wash-and-fold': Shirt,
  'express-service': Zap,
  'stain-removal': Droplets,
  'eco-care': Leaf,
  'vip-treatment': Crown,
  'car-wash': Car,
  'carpet-cleaning': Layers,
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

export interface ServiceData {
  slug: string;
  name: string;
  description: string;
  fullDescription: string;
  price: string;
  turnaround: string;
  features: string[];
  icon: any;
  gradient: string;
}

export const allServices: ServiceData[] = [
  {
    slug: 'dry-cleaning',
    name: 'Dry Cleaning',
    description: 'Premium solvent-free cleaning for delicate fabrics and designer pieces.',
    fullDescription: 'Our advanced dry cleaning service uses eco-friendly solvents that are gentle on fabrics while removing stubborn stains. Perfect for suits, silk, cashmere, and other delicate materials that require special care.',
    price: 'From KES 350',
    turnaround: '24-48 hours',
    features: ['Eco-friendly solvents', 'Expert stain pre-treatment', 'Hand finishing', 'Premium packaging', 'Garment inspection', 'Minor repairs included'],
    icon: Sparkles,
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    slug: 'wash-and-fold',
    name: 'Wash & Fold',
    description: 'Fresh, crisp everyday laundry with eco-friendly detergents.',
    fullDescription: 'Our wash and fold service is perfect for your everyday laundry needs. We use premium eco-friendly detergents that are tough on dirt but gentle on fabrics.',
    price: 'From KES 150',
    turnaround: 'Same day available',
    features: ['Eco-friendly detergents', 'Color separation', 'Temperature control', 'Professional folding', 'Fabric softener option', 'Stain treatment'],
    icon: Shirt,
    gradient: 'from-secondary/20 to-secondary/5',
  },
  {
    slug: 'express-service',
    name: 'Express Service',
    description: 'Same-day turnaround when you need it most. Ready in hours.',
    fullDescription: 'When time is of the essence, our express service delivers. Get your garments professionally cleaned and ready within hours.',
    price: 'From KES 500',
    turnaround: '3-6 hours',
    features: ['Priority processing', 'Dedicated team', 'Real-time tracking', 'Quality guaranteed', 'Door-to-door delivery', 'Emergency slots'],
    icon: Zap,
    gradient: 'from-primary/20 to-secondary/5',
  },
  {
    slug: 'stain-removal',
    name: 'Stain Removal',
    description: 'Expert treatment for even the most stubborn stains.',
    fullDescription: 'Our stain removal experts use advanced techniques and specialized solutions to tackle even the most stubborn stains.',
    price: 'From KES 250',
    turnaround: '24-72 hours',
    features: ['Expert assessment', 'Specialized solutions', 'Multiple techniques', 'Color restoration', 'Fabric protection', 'Success guarantee'],
    icon: Droplets,
    gradient: 'from-secondary/20 to-primary/5',
  },
  {
    slug: 'eco-care',
    name: 'Eco Care',
    description: 'Sustainable cleaning options for the environmentally conscious.',
    fullDescription: 'Our eco care service uses 100% biodegradable, plant-based cleaning solutions with minimal water and energy.',
    price: 'From KES 200',
    turnaround: '24-48 hours',
    features: ['100% biodegradable', 'Plant-based solutions', 'Water conservation', 'Energy efficient', 'Carbon neutral', 'Recyclable packaging'],
    icon: Leaf,
    gradient: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    slug: 'vip-treatment',
    name: 'VIP Treatment',
    description: 'White-glove service for luxury and heirloom garments.',
    fullDescription: 'Our VIP treatment is designed for your most precious garments with individual attention to every detail.',
    price: 'From KES 800',
    turnaround: '48-72 hours',
    features: ['Individual attention', 'Master craftsmen', 'Hand cleaning', 'Climate controlled', 'Insurance included', 'Archival packaging'],
    icon: Crown,
    gradient: 'from-amber-500/20 to-amber-500/5',
  },
  {
    slug: 'car-wash',
    name: 'Car Upholstery Wash',
    description: 'Deep cleaning for car seats, mats, and interior fabrics.',
    fullDescription: 'Professional deep cleaning for your vehicle\'s interior fabrics. We clean car seats, floor mats, headliners, and all soft surfaces to remove stains, odors, and allergens.',
    price: 'From KES 2,500',
    turnaround: '24-48 hours',
    features: ['Seat deep cleaning', 'Floor mat washing', 'Stain & odor removal', 'Leather conditioning', 'Headliner care', 'Pickup & delivery'],
    icon: Car,
    gradient: 'from-sky-500/20 to-sky-500/5',
  },
  {
    slug: 'carpet-cleaning',
    name: 'Floor & Carpet Cleaning',
    description: 'Professional cleaning for carpets, rugs, and floor mats.',
    fullDescription: 'Revive your carpets, area rugs, and floor coverings with our professional deep-cleaning service. We handle everything from delicate Persian rugs to heavy-duty commercial carpets.',
    price: 'From KES 1,500',
    turnaround: '48-72 hours',
    features: ['Deep extraction', 'Stain treatment', 'Deodorizing', 'Anti-allergen treatment', 'Color restoration', 'Fiber protection'],
    icon: Layers,
    gradient: 'from-violet-500/20 to-violet-500/5',
  },
];
