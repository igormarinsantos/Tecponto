import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import WhatsAppQualificationModal from "@/components/WhatsAppQualificationModal";
import whatsappLogo from "@/assets/whatsapp-logo.svg";
import type { LandingVariant } from "@/types/landing";

type WhatsAppButtonProps = {
  variant?: LandingVariant;
};

const WhatsAppButton = ({ variant }: WhatsAppButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [offerVisible, setOfferVisible] = useState(false);
  const lastScrollY = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const shouldAvoidOfferBanner = Boolean(variant);

  useEffect(() => {
    const updateVisibility = () => {
      animationFrame.current = null;
      if (!shouldAvoidOfferBanner) {
        setOfferVisible(false);
        return;
      }
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollY.current;
      const nextOfferVisible = currentScrollY > 200 && currentScrollY > previousScrollY;
      setOfferVisible((current) => current === nextOfferVisible ? current : nextOfferVisible);
      lastScrollY.current = currentScrollY;
    };

    const handleScroll = () => {
      if (animationFrame.current === null) {
        animationFrame.current = window.requestAnimationFrame(updateVisibility);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current);
    };
  }, [shouldAvoidOfferBanner]);

  return (
    <>
      <WhatsAppQualificationModal isOpen={isOpen} onClose={() => setIsOpen(false)} variant={variant} />

      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, delay: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        style={{ bottom: shouldAvoidOfferBanner && offerVisible ? "6.5rem" : "1.5rem" }}
        className="fixed right-3 md:right-6 z-40 w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center group transition-all duration-300 shadow-strong"
        aria-label="Abrir conversa no WhatsApp"
      >
        <img src={whatsappLogo} alt="WhatsApp" className="w-8 h-8 md:w-9 md:h-9 invert group-hover:scale-110 transition-transform" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
      </motion.button>
    </>
  );
};

export default WhatsAppButton;
