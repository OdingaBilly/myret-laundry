import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Shirt, Zap, Droplets, Leaf, Crown } from 'lucide-react';
import { Navigation } from '@/components/layout/Navigation';
import { LaundryDispatchForm } from '@/components/orders/LaundryDispatchForm';
import { FooterSection } from '@/components/sections/FooterSection';
import type { Database } from '@/integrations/supabase/types';

type LaundryService = Database['public']['Enums']['laundry_service'];

const services: { 
  slug: LaundryService; 
  name: string; 
  description: string; 
  icon: React.ReactNode;
  price: string;
}[] = [
  {
    slug: 'dry-cleaning',
    name: 'Dry Cleaning',
    description: 'Premium solvent-free cleaning for delicate fabrics',
    icon: <Sparkles className="w-5 h-5" />,
    price: 'From KES 350',
  },
  {
    slug: 'wash-and-fold',
    name: 'Wash & Fold',
    description: 'Fresh, crisp everyday laundry',
    icon: <Shirt className="w-5 h-5" />,
    price: 'From KES 150',
  },
  {
    slug: 'express-service',
    name: 'Express Service',
    description: 'Same-day turnaround when you need it most',
    icon: <Zap className="w-5 h-5" />,
    price: 'From KES 500',
  },
  {
    slug: 'stain-removal',
    name: 'Stain Removal',
    description: 'Expert treatment for stubborn stains',
    icon: <Droplets className="w-5 h-5" />,
    price: 'From KES 250',
  },
  {
    slug: 'eco-care',
    name: 'Eco Care',
    description: 'Sustainable cleaning for the eco-conscious',
    icon: <Leaf className="w-5 h-5" />,
    price: 'From KES 200',
  },
  {
    slug: 'vip-treatment',
    name: 'VIP Treatment',
    description: 'White-glove service for luxury garments',
    icon: <Crown className="w-5 h-5" />,
    price: 'From KES 800',
  },
];

export default function NewOrderPage() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') as LaundryService | null;
  const [selectedService, setSelectedService] = useState<LaundryService | null>(preselectedService);

  const selectedServiceData = services.find(s => s.slug === selectedService);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-2">New Order</h1>
            <p className="text-muted-foreground mb-6">
              Select a service and fill in the details
            </p>
          </motion.div>

          {/* Service Selection */}
          {!selectedService ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {services.map((service, index) => (
                <motion.button
                  key={service.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedService(service.slug)}
                  className="glass-card p-4 rounded-xl text-left hover:border-primary hover:shadow-lg transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{service.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{service.description}</p>
                  <p className="text-sm font-semibold text-primary">{service.price}</p>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Service info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="glass-card p-4 rounded-xl sticky top-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {selectedServiceData?.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{selectedServiceData?.name}</h3>
                      <p className="text-sm text-primary font-medium">{selectedServiceData?.price}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedServiceData?.description}
                  </p>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="text-sm text-primary hover:underline"
                  >
                    Change service
                  </button>
                </div>
              </motion.div>

              {/* Order form */}
              <div className="lg:col-span-2">
                <LaundryDispatchForm
                  serviceType={selectedService}
                  serviceName={selectedServiceData?.name || ''}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <FooterSection />
    </div>
  );
}
