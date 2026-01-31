import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import laundryWaterSplash from "@/assets/laundry-water-splash.jpg";

const tiers = [
  {
    name: "Bronze",
    price: "Free",
    description: "Perfect for occasional use",
    features: [
      "Standard cleaning services",
      "Order tracking",
      "Email support",
      "Loyalty points",
    ],
    accent: "from-amber-700 to-amber-900",
    popular: false,
  },
  {
    name: "Silver",
    price: "KES 1,900",
    period: "/month",
    description: "For regular users",
    features: [
      "All Bronze benefits",
      "10% off all services",
      "Priority pickup slots",
      "Free express delivery",
      "2x loyalty points",
    ],
    accent: "from-slate-400 to-slate-600",
    popular: false,
  },
  {
    name: "Gold",
    price: "KES 3,900",
    period: "/month",
    description: "Maximum value",
    features: [
      "All Silver benefits",
      "20% off all services",
      "Same-day service included",
      "Dedicated account manager",
      "3x loyalty points",
      "Exclusive member events",
    ],
    accent: "from-amber-400 to-amber-600",
    popular: true,
  },
  {
    name: "Platinum",
    price: "KES 7,900",
    period: "/month",
    description: "Ultimate luxury experience",
    features: [
      "All Gold benefits",
      "Unlimited free pickups",
      "VIP white-glove service",
      "Wardrobe consultation",
      "5x loyalty points",
      "24/7 concierge support",
    ],
    accent: "from-slate-200 to-slate-400",
    popular: false,
  },
];

export function MembershipSection() {
  return (
    <section id="membership" className="py-12 md:py-20 lg:py-24 relative bg-muted/30 overflow-hidden">

      <div className="container mx-auto px-4 md:px-6">
        {/* Section header with image - Text left, Image right (alternating pattern) */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center mb-8 md:mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary text-xs md:text-sm font-semibold tracking-wider uppercase mb-2 md:mb-3 block">
              Membership
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-5">
              Join the Club
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Unlock exclusive benefits and elevate your garment care experience.
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
              <img
                src={laundryWaterSplash}
                alt="Premium laundry care"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="absolute -inset-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl -z-10 blur-xl" />
          </motion.div>
        </div>

        {/* Mobile: 2 column grid, Desktop: 4 column grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`relative rounded-xl md:rounded-2xl p-3 md:p-5 ${
                tier.popular
                  ? "glass-card border-primary/50 ring-1 md:ring-2 ring-primary/20"
                  : "glass-card"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-gradient-to-r from-primary to-accent text-[10px] md:text-xs font-semibold text-primary-foreground flex items-center gap-1 whitespace-nowrap">
                  <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  Popular
                </div>
              )}

              {/* Tier badge */}
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br ${tier.accent} flex items-center justify-center mb-3 md:mb-4`}
              >
                <span className="text-sm md:text-base font-bold text-white">
                  {tier.name[0]}
                </span>
              </div>

              <h3 className="text-base md:text-xl font-bold text-foreground mb-0.5">
                {tier.name}
              </h3>
              <p className="text-muted-foreground text-[10px] md:text-xs mb-2 md:mb-3">
                {tier.description}
              </p>

              <div className="mb-3 md:mb-5">
                <span className="text-lg md:text-2xl font-bold text-foreground">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-muted-foreground text-[10px] md:text-xs">{tier.period}</span>
                )}
              </div>

              <ul className="space-y-1.5 md:space-y-2 mb-4 md:mb-6">
                {tier.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-1.5 md:gap-2">
                    <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-[10px] md:text-xs text-muted-foreground line-clamp-2">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.popular ? "hero" : "outline"}
                className="w-full text-xs md:text-sm h-8 md:h-10"
                size="sm"
              >
                {tier.price === "Free" ? "Start" : "Subscribe"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
