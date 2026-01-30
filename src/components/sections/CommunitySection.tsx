import { motion } from "framer-motion";
import { Trophy, Users, Flame, Gift } from "lucide-react";
import laundryFoldedTowels from "@/assets/laundry-folded-towels.jpg";

const features = [
  {
    icon: Trophy,
    title: "Earn Badges",
    description: "Complete challenges and unlock exclusive badges that showcase your commitment to premium care.",
  },
  {
    icon: Users,
    title: "Referral Rewards",
    description: "Invite friends and climb the leaderboard. Top referrers get premium perks each month.",
  },
  {
    icon: Flame,
    title: "Streak Tracking",
    description: "Maintain your care routine and earn bonus points for consistent orders.",
  },
  {
    icon: Gift,
    title: "Exclusive Rewards",
    description: "Redeem points for free services, upgrades, and partner brand experiences.",
  },
];

export function CommunitySection() {
  return (
    <section id="community" className="py-12 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Animated transition from previous section */}
      <div className="absolute inset-x-0 -top-1 h-24 md:h-32 transition-gradient-animated pointer-events-none rotate-180" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-muted/20 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image - Left side (alternating pattern) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
              <img
                src={laundryFoldedTowels}
                alt="Neatly folded laundry"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="absolute -inset-3 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl -z-10 blur-xl" />
          </motion.div>

          {/* Content - Right side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <span className="text-secondary text-xs md:text-sm font-semibold tracking-wider uppercase mb-2 md:mb-3 block">
              Community
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-5">
              More Than Just <span className="gradient-text">Laundry</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mb-6 md:mb-8 leading-relaxed">
              Join a community of style-conscious individuals who understand 
              that caring for your wardrobe is an investment in yourself.
            </p>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="glass-card p-3 md:p-4 rounded-xl"
                >
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-muted/50 flex items-center justify-center mb-2">
                    <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1 text-xs md:text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Leaderboard Preview - Below the main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 md:mt-12"
        >
          <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 max-w-2xl mx-auto">
            {/* Leaderboard preview */}
            <div className="flex items-center justify-between mb-3 md:mb-5">
              <h4 className="text-sm md:text-base font-semibold text-foreground">
                This Month's Leaders
              </h4>
              <span className="text-[10px] md:text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                Referrals
              </span>
            </div>

            <div className="space-y-2 md:space-y-3">
              {[
                { rank: 1, name: "Sarah M.", points: 24500, avatar: "S" },
                { rank: 2, name: "James L.", points: 21800, avatar: "J" },
                { rank: 3, name: "Emma K.", points: 19200, avatar: "E" },
                { rank: 4, name: "You", points: 8900, avatar: "Y", highlight: true },
              ].map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-2 md:gap-3 p-2 md:p-2.5 rounded-lg transition-colors ${
                    user.highlight
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-muted/30"
                  }`}
                >
                  <div
                    className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold ${
                      user.rank === 1
                        ? "bg-amber-500 text-amber-950"
                        : user.rank === 2
                        ? "bg-slate-400 text-slate-950"
                        : user.rank === 3
                        ? "bg-amber-700 text-amber-50"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.rank}
                  </div>
                  <div
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-semibold ${
                      user.highlight
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-xs md:text-sm truncate">{user.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground text-xs md:text-sm">
                      {user.points.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">pts</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Badges preview */}
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border">
              <p className="text-[10px] md:text-xs text-muted-foreground mb-2 md:mb-3">Your Badges</p>
              <div className="flex gap-1.5 md:gap-2">
                {["🌟", "🔥", "💎", "🏆"].map((badge, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-muted/50 flex items-center justify-center text-sm md:text-base"
                  >
                    {badge}
                  </div>
                ))}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground text-[10px] md:text-xs">
                  +3
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom transition gradient to footer */}
      <div className="absolute inset-x-0 -bottom-1 h-24 md:h-32 transition-gradient-animated pointer-events-none" />
    </section>
  );
}
