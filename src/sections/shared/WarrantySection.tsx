import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import type { LandingVariant } from "@/types/landing";
import { getLandingContent } from "@/content/landingContent";
import { openLandingQualification } from "@/features/whatsapp/landingQualification";

type WarrantySectionProps = {
  variant?: LandingVariant;
};

const WarrantySection = ({ variant = "repare" }: WarrantySectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const isTroque = variant === "troque";
  const content = getLandingContent(variant).warranty;

  return (
    <section ref={ref} id="warranty" className="bg-background py-10 md:py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className={`relative mx-auto flex min-h-[280px] max-w-5xl ${isTroque ? "flex-col-reverse" : "flex-col"} items-center gap-6 rounded-2xl border-2 border-border shadow-soft md:min-h-[320px] md:flex-row md:items-end md:gap-8 ${
            isTroque ? "overflow-hidden px-6 pt-8 md:px-16 md:pt-16" : "overflow-visible p-8 md:p-16"
          }`}
          style={{ backgroundColor: '#25292D' }}
        >
          <div className={`flex-shrink-0 self-center md:self-end ${isTroque ? "mb-0" : "mb-2 md:mb-0 md:-mb-20"}`}>
            <img 
              src={content.image}
              alt={content.title}
              className={`object-contain ${isTroque ? "block h-auto w-56 scale-x-[-1] md:w-80 md:scale-x-100 lg:w-96" : "h-40 w-40 md:h-64 md:w-64"}`}
            />
          </div>

          <div className={`text-center md:text-left flex-1 ${isTroque ? "pb-0 md:pb-16" : ""}`}>
            <h3 className="mb-4 text-3xl font-bold text-white md:mb-6 md:text-5xl">
              {content.title}
            </h3>
            <p className="mb-6 text-base leading-relaxed text-gray-300 md:text-xl">
              {content.description}
            </p>
            <button
              onClick={openLandingQualification}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-full transition-all hover:scale-105 uppercase text-sm"
            >
              {content.buttonText}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WarrantySection;
