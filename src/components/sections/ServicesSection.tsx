import { motion } from "framer-motion";
import { Shirt, Sparkles, Timer, Shield, Leaf, Crown } from "lucide-react";

const services = [
  {
    icon: Shirt,
    title: "Dry Cleaning",
    description: "Premium solvent-free cleaning for delicate fabrics and designer pieces.",
    price: "From KES 350",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Sparkles,
    title: "Wash & Fold",
    description: "Fresh, crisp everyday laundry with eco-friendly detergents.",
    price: "From KES 150",
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    icon: Timer,
    title: "Express Service",
    description: "Same-day turnaround when you need it most. Ready in hours.",
    price: "From KES 500",
    gradient: "from-primary/20 to-secondary/5",
  },
  {
    icon: Shield,
    title: "Stain Removal",
    description: "Expert treatment for even the most stubborn stains.",
    price: "From KES 250",
    gradient: "from-secondary/20 to-primary/5",
  },
  {
    icon: Leaf,
    title: "Eco Care",
    description: "Sustainable cleaning options for the environmentally conscious.",
    price: "From KES 200",
    gradient: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: Crown,
    title: "VIP Treatment",
    description: "White-glove service for luxury and heirloom garments.",
    price: "From KES 800",
    gradient: "from-amber-500/20 to-amber-500/5",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function ServicesSection() {
  return (
    <section id="services" className="py-12 md:py-20 lg:py-24 relative bg-background overflow-hidden">
      {/* Smooth transition from hero */}
      <div className="absolute inset-x-0 -top-1 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-14"
        >
          <span className="text-primary text-xs md:text-sm font-semibold tracking-wider uppercase mb-2 md:mb-3 block">
            Our Services
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-5">
            Care Beyond Compare
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            From everyday essentials to treasured pieces, we handle every garment 
            with the attention it deserves.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group gradient-border p-3 md:p-5 rounded-xl md:rounded-2xl hover:scale-[1.02] transition-transform duration-300"
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-3 md:mb-4`}
              >
                <service.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              </div>
              <h3 className="text-sm md:text-lg font-semibold text-foreground mb-1 md:mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-2 line-clamp-2 md:line-clamp-none">
                {service.description}
              </p>
              <p className="text-primary font-semibold text-xs md:text-sm">
                {service.price}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
