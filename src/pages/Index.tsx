import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { QuickOrderSection } from "@/components/sections/QuickOrderSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { FooterSection } from "@/components/sections/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <QuickOrderSection />
      <HowItWorksSection />
      <CommunitySection />
      <FooterSection />
    </div>
  );
};

export default Index;
