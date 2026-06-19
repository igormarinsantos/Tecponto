import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Bike, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LandingVariant } from "@/types/landing";
import { getLandingContent } from "@/content/landingContent";

type FinalCTASectionProps = {
  variant?: LandingVariant;
};

const FinalCTASection = ({ variant = "repare" }: FinalCTASectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const content = getLandingContent(variant).finalCta;
  const icons = [Zap, Shield, Bike];

  const scrollToWhatsApp = () => {
    const element = document.getElementById("whatsapp-chat");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative overflow-hidden py-14 md:py-20" style={{ backgroundColor: "#25292D" }}>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-5 text-3xl font-bold text-white md:mb-6 md:text-6xl">
            {content.title}
          </h2>

          <p className="mx-auto mb-7 max-w-3xl text-base text-gray-300 md:mb-8 md:text-2xl">
            {content.subtitle}
          </p>

          <Button
            size="lg"
            onClick={scrollToWhatsApp}
            className="h-[52px] w-full max-w-sm rounded-full bg-primary px-6 py-5 text-sm font-bold uppercase text-primary-foreground hover:bg-primary/90 md:w-auto md:px-12 md:py-6 md:text-lg"
          >
            {content.button}
          </Button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm text-white/80 md:mt-8 md:gap-6 md:text-base"
          >
            {content.bullets.map((bullet, index) => {
              const Icon = icons[index] ?? Zap;
              return (
                <div key={bullet} className="contents">
                  {index > 0 && <span>|</span>}
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <span>{bullet}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
