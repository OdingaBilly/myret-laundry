import { useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Shield, Sparkles, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { LaundryDispatchForm } from "@/components/orders/LaundryDispatchForm";
import { useAuth } from "@/contexts/AuthContext";
import laundryWaterSplash from "@/assets/laundry-water-splash.jpg";
import laundryColorfulTowels from "@/assets/laundry-colorful-towels.jpg";
import type { Database } from "@/integrations/supabase/types";

type LaundryService = Database['public']['Enums']['laundry_service'];

const servicesData: Record<string, {
  title: string;
  description: string;
  fullDescription: string;
  price: string;
  turnaround: string;
  features: string[];
  image: string;
}> = {
  "dry-cleaning": {
    title: "Dry Cleaning",
    description: "Premium solvent-free cleaning for delicate fabrics and designer pieces.",
    fullDescription: "Our advanced dry cleaning service uses eco-friendly solvents that are gentle on fabrics while removing stubborn stains. Perfect for suits, silk, cashmere, and other delicate materials that require special care.",
    price: "From KES 350",
    turnaround: "24-48 hours",
    features: [
      "Eco-friendly solvents",
      "Expert stain pre-treatment",
      "Hand finishing",
      "Premium packaging",
      "Garment inspection",
      "Minor repairs included"
    ],
    image: laundryWaterSplash
  },
  "wash-and-fold": {
    title: "Wash & Fold",
    description: "Fresh, crisp everyday laundry with eco-friendly detergents.",
    fullDescription: "Our wash and fold service is perfect for your everyday laundry needs. We use premium eco-friendly detergents that are tough on dirt but gentle on fabrics, leaving your clothes fresh and beautifully folded.",
    price: "From KES 150",
    turnaround: "Same day available",
    features: [
      "Eco-friendly detergents",
      "Color separation",
      "Temperature control",
      "Professional folding",
      "Fabric softener option",
      "Stain treatment"
    ],
    image: laundryWaterSplash
  },
  "express-service": {
    title: "Express Service",
    description: "Same-day turnaround when you need it most. Ready in hours.",
    fullDescription: "When time is of the essence, our express service delivers. Get your garments professionally cleaned and ready within hours, without compromising on quality.",
    price: "From KES 500",
    turnaround: "3-6 hours",
    features: [
      "Priority processing",
      "Dedicated team",
      "Real-time tracking",
      "Quality guaranteed",
      "Door-to-door delivery",
      "Emergency slots"
    ],
    image: laundryColorfulTowels
  },
  "stain-removal": {
    title: "Stain Removal",
    description: "Expert treatment for even the most stubborn stains.",
    fullDescription: "Our stain removal experts use advanced techniques and specialized solutions to tackle even the most stubborn stains. From wine to oil, ink to grass, we have the expertise to restore your garments.",
    price: "From KES 250",
    turnaround: "24-72 hours",
    features: [
      "Expert assessment",
      "Specialized solutions",
      "Multiple techniques",
      "Color restoration",
      "Fabric protection",
      "Success guarantee"
    ],
    image: laundryWaterSplash
  },
  "eco-care": {
    title: "Eco Care",
    description: "Sustainable cleaning options for the environmentally conscious.",
    fullDescription: "Our eco care service uses 100% biodegradable, plant-based cleaning solutions. We minimize water usage and energy consumption while delivering exceptional cleaning results.",
    price: "From KES 200",
    turnaround: "24-48 hours",
    features: [
      "100% biodegradable",
      "Plant-based solutions",
      "Water conservation",
      "Energy efficient",
      "Carbon neutral",
      "Recyclable packaging"
    ],
    image: laundryColorfulTowels
  },
  "vip-treatment": {
    title: "VIP Treatment",
    description: "White-glove service for luxury and heirloom garments.",
    fullDescription: "Our VIP treatment is designed for your most precious garments. From designer pieces to heirloom items, we provide white-glove care with individual attention to every detail.",
    price: "From KES 800",
    turnaround: "48-72 hours",
    features: [
      "Individual attention",
      "Master craftsmen",
      "Hand cleaning",
      "Climate controlled",
      "Insurance included",
      "Archival packaging"
    ],
    image: laundryWaterSplash
  }
};

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const service = slug ? servicesData[slug] : null;

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    setShowOrderForm(true);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero section with gradient */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient-bg opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link 
            to="/#services" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Services</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {service.title}
              </h1>
              <p className="text-white/90 text-sm md:text-base lg:text-lg mb-6">
                {service.fullDescription}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{service.turnaround}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">4.9 Rating</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-2xl md:text-3xl font-bold text-white">
                  {service.price}
                </span>
                <Button variant="hero" size="lg" onClick={handleBookNow}>
                  <Package className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      {showOrderForm && slug && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
              <LaundryDispatchForm
                serviceType={slug as LaundryService}
                serviceName={service.title}
                onSuccess={() => {
                  setShowOrderForm(false);
                  navigate('/dashboard');
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Features section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3">
              What's Included
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              Every service comes with our commitment to quality and care.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            {service.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="glass-card p-4 rounded-xl text-center"
              >
                <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 md:py-16 relative overflow-hidden bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
            Ready to Experience Premium Care?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm md:text-base">
            Book your first pickup today and see the difference quality makes.
          </p>
          <Button variant="hero" size="lg" onClick={handleBookNow}>
            <Package className="w-4 h-4 mr-2" />
            Schedule Pickup
          </Button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
