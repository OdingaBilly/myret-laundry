import { useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Shield, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { LaundryDispatchForm } from "@/components/orders/LaundryDispatchForm";
import { useService } from "@/hooks/useServices";
import laundryWaterSplash from "@/assets/laundry-water-splash.jpg";
import laundryColorfulTowels from "@/assets/laundry-colorful-towels.jpg";
import type { Database } from "@/integrations/supabase/types";
import { Sparkles } from "lucide-react";

type LaundryService = Database['public']['Enums']['laundry_service'];

const serviceImages: Record<string, string> = {
  'dry-cleaning': laundryWaterSplash,
  'wash-and-fold': laundryWaterSplash,
  'express-service': laundryColorfulTowels,
  'stain-removal': laundryWaterSplash,
  'eco-care': laundryColorfulTowels,
  'vip-treatment': laundryWaterSplash,
  'car-wash': laundryColorfulTowels,
  'carpet-cleaning': laundryWaterSplash,
};

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const navigate = useNavigate();
  const { service, isLoading } = useService(slug);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading…</div></div>;
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Link to="/" className="text-primary hover:underline">Return to home</Link>
        </div>
      </div>
    );
  }

  const image = serviceImages[slug!] || laundryWaterSplash;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient-bg opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link to="/#services" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Services</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{service.name}</h1>
              <p className="text-white/90 text-sm md:text-base lg:text-lg mb-6">{service.fullDescription}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-white/80"><Clock className="w-4 h-4" /><span className="text-sm">{service.turnaround}</span></div>
                <div className="flex items-center gap-2 text-white/80"><Shield className="w-4 h-4" /><span className="text-sm">Quality Guaranteed</span></div>
                <div className="flex items-center gap-2 text-white/80"><Star className="w-4 h-4" /><span className="text-sm">4.9 Rating</span></div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-2xl md:text-3xl font-bold text-white">{service.price}</span>
                <Button variant="hero" size="lg" onClick={() => setShowOrderForm(true)}>
                  <Package className="w-4 h-4 mr-2" />Book Now
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="relative">
              <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img src={image} alt={service.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {showOrderForm && slug && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
              <LaundryDispatchForm
                serviceType={slug as LaundryService}
                serviceName={service.name}
                onSuccess={() => { setShowOrderForm(false); navigate('/dashboard'); }}
              />
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3">What's Included</h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">Every service comes with our commitment to quality and care.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            {service.features.map((feature, index) => (
              <motion.div key={feature} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }} className="glass-card p-4 rounded-xl text-center">
                <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 relative overflow-hidden bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Ready to Experience Premium Care?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm md:text-base">Book your first pickup today and see the difference quality makes.</p>
          <Button variant="hero" size="lg" onClick={() => setShowOrderForm(true)}>
            <Package className="w-4 h-4 mr-2" />Schedule Pickup
          </Button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
