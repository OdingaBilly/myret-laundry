import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import laundryColorfulTowels from '@/assets/laundry-colorful-towels.jpg';

export function QuickOrderSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { services } = useServices();

  const handleServiceClick = (slug: string) => {
    navigate(`/order/new?service=${slug}`);
  };

  return (
    <section className="py-12 md:py-20 lg:py-24 relative bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header with image - Image left, Text right */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
              <img
                src={laundryColorfulTowels}
                alt="Colorful clean laundry"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="absolute -inset-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl -z-10 blur-xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <span className="text-primary text-xs md:text-sm font-semibold tracking-wider uppercase mb-2 md:mb-3 block">
              Quick Order
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-5">
              Dispatch Your Laundry in Minutes
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mb-6">
              Select a service below to start your order. We'll pick up your laundry, 
              clean it with care, and deliver it back fresh and folded.
            </p>

            {/* Quick service buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.button
                    key={service.slug}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleServiceClick(service.slug)}
                    className="flex items-center gap-2 p-3 rounded-xl glass-card hover:border-primary hover:shadow-lg transition-all group text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{service.name}</span>
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Button variant="hero" asChild>
                <Link to="/order/new">
                  <Package className="w-4 h-4 mr-2" />
                  Start Full Order
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
