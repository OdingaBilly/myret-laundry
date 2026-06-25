import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useServices } from "@/hooks/useServices";
import laundryWaterSplash from "@/assets/laundry-water-splash.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export function ServicesSection() {
  const { services } = useServices();
  return (
    <section id="services" className="py-12 md:py-20 lg:py-24 relative bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center mb-8 md:mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary text-xs md:text-sm font-semibold tracking-wider uppercase mb-2 md:mb-3 block">Our Services</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-5">Care Beyond Compare</h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              From everyday essentials to treasured pieces, we handle every garment with the attention it deserves.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
              <img src={laundryWaterSplash} alt="Fresh clean laundry" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="absolute -inset-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl -z-10 blur-xl" />
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.slug} variants={itemVariants}>
                <Link
                  to={`/services/${service.slug}`}
                  className="block group gradient-border p-3 md:p-5 rounded-xl md:rounded-2xl hover:scale-[1.02] transition-all duration-300"
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-3 md:mb-4`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                  </div>
                  <h3 className="text-sm md:text-lg font-semibold text-foreground mb-1 md:mb-2 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-2 line-clamp-2 md:line-clamp-none">
                    {service.description}
                  </p>
                  <p className="text-primary font-semibold text-xs md:text-sm">{service.price}</p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
