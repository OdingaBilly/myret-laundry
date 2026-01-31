import { motion } from "framer-motion";
import { Calendar, Package, Truck, CheckCircle } from "lucide-react";
import laundryColorfulTowels from "@/assets/laundry-colorful-towels.jpg";

const steps = [
  {
    icon: Calendar,
    step: "01",
    title: "Schedule Pickup",
    description: "Book a convenient time slot. We'll come to your door.",
  },
  {
    icon: Package,
    step: "02",
    title: "We Collect",
    description: "Our driver arrives, inspects, and bags your garments.",
  },
  {
    icon: Truck,
    step: "03",
    title: "Expert Care",
    description: "Your items are cleaned with precision and care.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Delivered Fresh",
    description: "Perfectly cleaned garments returned to your door.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-12 md:py-20 lg:py-24 relative overflow-hidden bg-muted/30">

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Section header with image - Image left, Text right (alternating pattern) */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center mb-8 md:mb-14">
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
                alt="Colorful fresh laundry"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="absolute -inset-3 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl -z-10 blur-xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <span className="text-secondary text-xs md:text-sm font-semibold tracking-wider uppercase mb-2 md:mb-3 block">
              How It Works
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-5">
              Effortless from Start to Finish
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              We've designed a seamless experience that respects your time.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Mobile: 2 column grid, Desktop: 4 column */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-3 md:p-5 rounded-xl md:rounded-2xl text-center relative"
              >
                {/* Step number */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xs md:text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 md:w-14 md:h-14 mx-auto mb-2 md:mb-4 mt-2 rounded-xl bg-muted/50 flex items-center justify-center">
                  <item.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                </div>

                <h3 className="text-sm md:text-lg font-semibold text-foreground mb-1 md:mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-[10px] md:text-sm line-clamp-2">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
