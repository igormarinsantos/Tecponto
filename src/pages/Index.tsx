import LandingHeroSection from "@/sections/landing/LandingHeroSection";
import BrandCarousel from "@/sections/shared/BrandCarousel";
import StatsSection from "@/sections/shared/StatsSection";
import OfferSection from "@/sections/landing/OfferSection";
import LandingServicesSection from "@/sections/landing/LandingServicesSection";
import WarrantySection from "@/sections/shared/WarrantySection";
import DeliverySection from "@/sections/shared/DeliverySection";
import WhatsAppChatSection from "@/features/whatsapp/WhatsAppChatSection";

import BentoTestimonials from "@/sections/shared/BentoTestimonials";
import InfrastructureSection from "@/sections/shared/InfrastructureSection";
import LandingComparisonSection from "@/sections/landing/LandingComparisonSection";
import FAQSection from "@/sections/shared/FAQSection";
import FinalCTASection from "@/sections/landing/FinalCTASection";
import Footer from "@/layouts/Footer";
import WhatsAppButton from "@/features/whatsapp/WhatsAppButton";
import type { LandingVariant } from "@/types/landing";

type IndexProps = {
  variant?: LandingVariant;
};

const Index = ({ variant = "repare" }: IndexProps) => {
  return (
    <div className="min-h-screen">
      {/* WhatsApp Floating Button */}
      <WhatsAppButton variant={variant} />
      
      {/* Hero Section - Centered with countdown */}
      <LandingHeroSection variant={variant} />

      {/* Brand Carousel */}
      <BrandCarousel />

      {/* Stats Section */}
      <StatsSection />

      {/* Services Section - With Photos */}
      <LandingServicesSection variant={variant} />

      {/* Warranty Section */}
      <WarrantySection variant={variant} />

      {/* Delivery Section */}
      <DeliverySection variant={variant} />

      {/* WhatsApp Chat Simulation */}
      <WhatsAppChatSection variant={variant} />


      {/* Testimonials - Bento Grid */}
      <BentoTestimonials />

      {/* Infrastructure Video Section */}
      <InfrastructureSection />

      {/* Comparison Section - With Before/After in middle */}
      <LandingComparisonSection />

      {/* FAQ Section */}
      <FAQSection variant={variant} />

      {/* Final CTA Section */}
      <FinalCTASection variant={variant} />

      {/* Footer */}
      <section id="footer">
        <Footer />
      </section>

      {/* Offer Banner - Fixed at Bottom (after footer) */}
      {variant !== "troque" && <OfferSection />}
    </div>
  );
};

export default Index;
