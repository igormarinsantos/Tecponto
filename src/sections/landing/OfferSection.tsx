import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tag, Clock } from "lucide-react";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";

const OfferSection = () => {
  const timeLeft = useCountdownTimer();
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    const updateVisibility = () => {
      animationFrame.current = null;
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollY.current;
      
      const nextVisible = currentScrollY > 200 && currentScrollY > previousScrollY;
      setIsVisible((current) => current === nextVisible ? current : nextVisible);
      
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
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  const scrollToQuote = () => {
    const quoteSection = document.getElementById("whatsapp-chat");
    quoteSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-primary backdrop-blur-sm"
        >
      <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4 text-center sm:text-left">
          <div className="flex w-full items-center justify-center gap-3 sm:w-auto sm:justify-start md:gap-4">
            <div className="flex items-center gap-1.5 flex-shrink-0 md:gap-2">
              <Tag className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground flex-shrink-0" />
              <span className="font-bold text-primary-foreground text-[11px] md:text-base whitespace-nowrap">
                10% OFF NOVOS CLIENTES
              </span>
            </div>

            <div className="flex items-center gap-1.5 md:gap-3">
              <div className="hidden items-center gap-1 text-primary-foreground/90 text-[10px] md:flex md:text-xs">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Termina em:</span>
              </div>
              <div className="flex gap-1">
                {[
                  { value: timeLeft.hours, label: "h" },
                  { value: timeLeft.minutes, label: "m" },
                  { value: timeLeft.seconds, label: "s" },
                ].map((item, index) => (
                  <div key={index} className="flex items-baseline gap-0.5">
                    <div className="bg-primary-foreground text-primary w-6 h-6 md:w-9 md:h-9 rounded flex items-center justify-center text-[10px] md:text-sm font-bold">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <span className="text-primary-foreground/80 text-[10px] md:text-xs">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            size="sm"
            onClick={scrollToQuote}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold text-xs md:text-sm px-3 md:px-6 h-8 md:h-10 hover:scale-105 transition-base whitespace-nowrap uppercase w-full sm:w-auto"
          >
            Aproveitar Agora
          </Button>
        </div>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfferSection;
