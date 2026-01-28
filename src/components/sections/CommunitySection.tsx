import { motion } from "framer-motion";
import { Trophy, Users, Flame, Gift } from "lucide-react";

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
    <section id="community" className="py-12 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-muted/20 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <span className="text-secondary text-xs md:text-sm font-semibold tracking-wider uppercase mb-3 md:mb-4 block">
              Community
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
              More Than Just <span className="gradient-text">Laundry</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-lg mb-8 md:mb-10 leading-relaxed">
              Join a community of style-conscious individuals who understand 
              that caring for your wardrobe is an investment in yourself. 
              Engage, compete, and be rewarded.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-3 md:gap-4"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm md:text-base">
                      {feature.title}
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            <div className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-8">
              {/* Leaderboard preview */}
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h4 className="text-base md:text-lg font-semibold text-foreground">
                  This Month's Leaders
                </h4>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 md:px-3 rounded-full">
                  Referral Board
                </span>
              </div>

              <div className="space-y-3 md:space-y-4">
                {[
                  { rank: 1, name: "Sarah M.", points: 24500, avatar: "S" },
                  { rank: 2, name: "James L.", points: 21800, avatar: "J" },
                  { rank: 3, name: "Emma K.", points: 19200, avatar: "E" },
                  { rank: 4, name: "You", points: 8900, avatar: "Y", highlight: true },
                ].map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl transition-colors ${
                      user.highlight
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-muted/30"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold ${
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
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold ${
                        user.highlight
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm md:text-base">{user.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground text-sm md:text-base">
                        {user.points.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Badges preview */}
              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-border">
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Your Badges</p>
                <div className="flex gap-2">
                  {["🌟", "🔥", "💎", "🏆"].map((badge, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted/50 flex items-center justify-center text-lg md:text-xl"
                    >
                      {badge}
                    </div>
                  ))}
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground text-xs md:text-sm">
                    +3
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl -z-10 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
