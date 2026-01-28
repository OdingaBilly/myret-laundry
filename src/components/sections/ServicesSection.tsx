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
    <section id="services" className="py-12 md:py-24 relative bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-primary text-xs md:text-sm font-semibold tracking-wider uppercase mb-3 md:mb-4 block">
            Our Services
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Care Beyond Compare
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto px-4">
            From everyday essentials to treasured pieces, we handle every garment 
            with the attention it deserves.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group gradient-border p-5 md:p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300"
            >
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 md:mb-5`}
              >
                <service.icon className="w-6 h-6 md:w-7 md:h-7 text-foreground" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                {service.description}
              </p>
              <p className="text-primary font-semibold text-sm">
                {service.price}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
