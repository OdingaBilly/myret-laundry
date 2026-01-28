import { motion } from "framer-motion";
import { Calendar, Package, Truck, CheckCircle } from "lucide-react";

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
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary text-sm font-semibold tracking-wider uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Effortless from Start to Finish
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We've designed a seamless experience that respects your time 
            and delivers exceptional results.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                <div className="glass-card p-8 rounded-2xl text-center h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
