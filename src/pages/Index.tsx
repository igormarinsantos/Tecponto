import NewHeroSection from "@/components/NewHeroSection";
import BrandCarousel from "@/components/BrandCarousel";
import StatsSection from "@/components/StatsSection";
import OfferSection from "@/components/OfferSection";
import NewServicesSection from "@/components/NewServicesSection";
import WarrantySection from "@/components/WarrantySection";
import DeliverySection from "@/components/DeliverySection";
import WhatsAppChatSection from "@/components/WhatsAppChatSection";

import BentoTestimonials from "@/components/BentoTestimonials";
import InfrastructureSection from "@/components/InfrastructureSection";
import NewComparisonSection from "@/components/NewComparisonSection";
import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
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
      <section id="hero" className="pt-20">
        <NewHeroSection variant={variant} />
      </section>

      {/* Brand Carousel */}
      <BrandCarousel />

      {/* Stats Section */}
      <StatsSection />

      {/* Services Section - With Photos */}
      <NewServicesSection variant={variant} />

      {/* Warranty Section */}
      <WarrantySection />

      {/* Delivery Section */}
      <DeliverySection />

      {/* WhatsApp Chat Simulation */}
      <WhatsAppChatSection variant={variant} />


      {/* Testimonials - Bento Grid */}
      <BentoTestimonials />

      {/* Infrastructure Video Section */}
      <InfrastructureSection />

      {/* Comparison Section - With Before/After in middle */}
      <NewComparisonSection />

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
