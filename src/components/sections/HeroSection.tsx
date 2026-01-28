import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import packagingBag from "@/assets/packaging-bag.jpeg";

const typewriterTexts = [
  "Premium Garment Care",
  "Delivered.",
  "Managed.",
  "Remembered.",
];

export function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = typewriterTexts[currentTextIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && displayText === currentFullText) {
      setTimeout(() => setIsDeleting(true), 2000);
      return;
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % typewriterTexts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? prev.slice(0, -1)
          : currentFullText.slice(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Stripe-style gradient background */}
      <div className="absolute inset-0 hero-gradient-bg opacity-90" />
      
      {/* Soft overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />

      {/* Floating glow effects */}
      <div className="hero-glow -top-20 -left-20 md:-top-40 md:-left-40" />
      <div className="hero-glow hero-glow-secondary bottom-10 right-10 md:-bottom-20 md:-right-20" />
      <div className="hero-glow hero-glow-tertiary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content - Mobile first */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full glass-card mb-6 md:mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              <span className="text-xs md:text-sm font-medium text-foreground">
                Premium Lifestyle Platform
              </span>
            </motion.div>

            {/* Main heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 md:mb-6">
              <span className="text-white drop-shadow-lg">Your Wardrobe,</span>
              <br />
              <span className="gradient-text-vibrant">{displayText}</span>
              <span className="animate-pulse text-white">|</span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-xl mx-auto lg:mx-0 mb-6 md:mb-10 text-balance leading-relaxed"
            >
              Experience luxury garment care with real-time tracking, 
              expert handling, and a membership community designed 
              for modern living.
            </motion.p>

            {/* CTA Buttons - Stack on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start"
            >
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                Start Your Journey
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <Button variant="heroOutline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                Explore Services
              </Button>
            </motion.div>

            {/* Trust indicators - Horizontal scroll on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 md:mt-16 flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 text-white/80"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs md:text-sm">Live Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span className="text-xs md:text-sm">Expert Care</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-xs md:text-sm">Same Day Service</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Packaging bag image - Visible on larger screens, positioned creatively */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow behind bag */}
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl scale-90" />
              
              {/* Packaging bag */}
              <motion.img
                src={packagingBag}
                alt="MyRet Premium Packaging"
                className="relative w-48 h-auto sm:w-64 md:w-72 lg:w-80 xl:w-96 rounded-2xl shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Floating stats card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -right-4 md:-right-8 top-1/4 glass-card rounded-xl p-3 md:p-4 shadow-xl hidden sm:block"
              >
                <div className="text-xs text-muted-foreground mb-1">Happy Customers</div>
                <div className="text-lg md:text-2xl font-bold text-foreground">10,000+</div>
              </motion.div>

              {/* Floating rating card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -left-4 md:-left-8 bottom-1/4 glass-card rounded-xl p-3 md:p-4 shadow-xl hidden sm:block"
              >
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-500 text-xs md:text-sm">★</span>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">4.9 Rating</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 md:w-6 md:h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5 md:p-2"
        >
          <div className="w-1 h-1.5 md:h-2 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
