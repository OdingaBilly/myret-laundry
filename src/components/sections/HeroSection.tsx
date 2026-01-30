import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import packagingBag from "@/assets/packaging-bag-nobg.png";
import laundryTowels from "@/assets/laundry-folded-towels.jpg";

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
    <section className="relative min-h-[80vh] md:min-h-screen flex items-center overflow-hidden pt-20 pb-8 md:pt-24 md:pb-16">
      {/* Gradient background */}
      <div className="absolute inset-0 hero-gradient-bg opacity-90" />
      
      {/* Smooth transition overlay to next section */}
      <div className="absolute inset-x-0 bottom-0 h-32 md:h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />

      {/* Floating glow effects - contained within viewport */}
      <div className="hero-glow -top-20 -left-20 w-[200px] h-[200px] md:w-[400px] md:h-[400px]" />
      <div className="hero-glow hero-glow-secondary bottom-20 right-0 w-[150px] h-[150px] md:w-[300px] md:h-[300px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Content - Mobile first */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card mb-4 md:mb-6"
            >
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              <span className="text-xs md:text-sm font-medium text-foreground">
                Premium Lifestyle Platform
              </span>
            </motion.div>

            {/* Main heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 md:mb-5">
              <span className="text-white drop-shadow-lg">Your Wardrobe,</span>
              <br />
              <span className="gradient-text-vibrant">{displayText}</span>
              <span className="animate-pulse text-white">|</span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm md:text-base lg:text-lg text-white/90 max-w-md mx-auto lg:mx-0 mb-5 md:mb-8 leading-relaxed"
            >
              Experience luxury garment care with real-time tracking, 
              expert handling, and a membership community.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Button variant="hero" size="default" className="w-full sm:w-auto">
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="heroOutline" size="default" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                Explore Services
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-6 md:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-6 text-white/80"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400" />
                <span className="text-xs md:text-sm">Live Tracking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white" />
                <span className="text-xs md:text-sm">Expert Care</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-yellow-400" />
                <span className="text-xs md:text-sm">Same Day</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Stacked Images - Right aligned on desktop, centered on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px]">
              {/* Background image - Towels */}
              <motion.div
                className="absolute -left-4 sm:-left-6 lg:-left-10 top-8 sm:top-10 lg:top-12 w-[65%] aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <img
                  src={laundryTowels}
                  alt="Fresh folded towels"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>

              {/* Middle decorative card */}
              <motion.div
                className="absolute -right-2 sm:-right-4 lg:-right-8 top-4 sm:top-6 lg:top-8 w-[50%] aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden shadow-xl glass-card"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-center p-3">
                    <div className="text-2xl md:text-3xl font-bold text-foreground">10K+</div>
                    <div className="text-xs text-muted-foreground">Happy Clients</div>
                  </div>
                </div>
              </motion.div>

              {/* Front image - Packaging bag */}
              <motion.div
                className="relative z-10 w-[75%] mx-auto"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src={packagingBag}
                  alt="MyRet Premium Packaging"
                  className="w-full h-auto drop-shadow-2xl"
                />
              </motion.div>

              {/* Rating card - Positioned bottom-left */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="absolute -left-2 sm:-left-4 lg:-left-6 bottom-4 sm:bottom-6 glass-card rounded-lg md:rounded-xl p-2 md:p-3 shadow-lg z-20"
              >
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-500 text-xs">★</span>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">4.9 Rating</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - only on larger screens */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
