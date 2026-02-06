import { motion } from "framer-motion";
import { Check, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { useAuth } from "@/contexts/AuthContext";
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

export default function MembershipPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient-bg opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary-foreground/80 text-xs md:text-sm font-semibold tracking-wider uppercase mb-2 block">
                Membership
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Join the Club
              </h1>
              <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-xl">
                Unlock exclusive benefits and elevate your garment care experience
                with our membership tiers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="rounded-xl md:rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img
                  src={laundryWaterSplash}
                  alt="Premium laundry care"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tiers Grid */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`relative rounded-xl md:rounded-2xl p-5 md:p-6 ${
                  tier.popular
                    ? "glass-card border-primary/50 ring-2 ring-primary/20"
                    : "glass-card"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-xs font-semibold text-primary-foreground flex items-center gap-1 whitespace-nowrap">
                    <Star className="w-3 h-3" />
                    Popular
                  </div>
                )}

                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${tier.accent} flex items-center justify-center mb-4`}
                >
                  <span className="text-base md:text-lg font-bold text-white">
                    {tier.name[0]}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                  {tier.name}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-3">
                  {tier.description}
                </p>

                <div className="mb-5">
                  <span className="text-2xl md:text-3xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-muted-foreground text-xs md:text-sm">
                      {tier.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-xs md:text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.popular ? "hero" : "outline"}
                  className="w-full"
                  size="sm"
                  asChild={!user}
                >
                  {user ? (
                    tier.price === "Free" ? "Current Plan" : "Subscribe"
                  ) : (
                    <Link to="/auth">
                      {tier.price === "Free" ? "Sign Up Free" : "Sign Up to Subscribe"}
                    </Link>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
