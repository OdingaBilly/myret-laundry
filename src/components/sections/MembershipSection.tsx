import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    price: "$19",
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
    price: "$39",
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
    price: "$79",
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
    <section id="membership" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
            Membership
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Join the Club
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Unlock exclusive benefits and elevate your garment care experience 
            with our membership tiers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 ${
                tier.popular
                  ? "glass-card border-primary/50"
                  : "glass-card"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-xs font-semibold text-primary-foreground flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              {/* Tier badge */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.accent} flex items-center justify-center mb-6`}
              >
                <span className="text-lg font-bold text-white">
                  {tier.name[0]}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-1">
                {tier.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {tier.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-muted-foreground">{tier.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.popular ? "hero" : "outline"}
                className="w-full"
              >
                {tier.price === "Free" ? "Get Started" : "Subscribe"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
