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
    <section id="how-it-works" className="py-12 md:py-24 relative overflow-hidden bg-muted/30">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-secondary text-xs md:text-sm font-semibold tracking-wider uppercase mb-3 md:mb-4 block">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Effortless from Start to Finish
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto px-4">
            We've designed a seamless experience that respects your time 
            and delivers exceptional results.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line - Desktop only */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 -translate-y-1/2" />

          {/* Mobile: Vertical stepper with line */}
          <div className="lg:hidden absolute top-0 bottom-0 left-6 md:left-8 w-0.5 bg-gradient-to-b from-primary/30 via-secondary/30 to-primary/30" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Mobile layout: Horizontal card with step on left */}
                <div className="lg:hidden flex gap-4 md:gap-6">
                  {/* Step indicator */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm md:text-base font-bold text-primary-foreground shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="glass-card p-4 md:p-5 rounded-xl flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-base md:text-lg font-semibold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Desktop layout: Centered card */}
                <div className="hidden lg:block glass-card p-6 md:p-8 rounded-2xl text-center h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-2xl bg-muted/50 flex items-center justify-center">
                    <item.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
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
