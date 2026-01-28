import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { MembershipSection } from "@/components/sections/MembershipSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { FooterSection } from "@/components/sections/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <MembershipSection />
      <CommunitySection />
      <FooterSection />
    </div>
  );
};

export default Index;
