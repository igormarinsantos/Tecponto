import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import type { LandingVariant } from "@/types/landing";
import { getLandingContent } from "@/content/landingContent";

type DeliverySectionProps = {
  variant?: LandingVariant;
};

const DeliverySection = ({ variant = "repare" }: DeliverySectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const isTroque = variant === "troque";
  const content = getLandingContent(variant).delivery;

  return (
    <section ref={ref} className="bg-background py-10 md:py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Card com conteúdo */}
          <div className="bg-primary rounded-2xl shadow-soft relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Texto e CTA */}
              <div className="p-6 text-center md:p-12 md:text-left">
                <h3 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
                  {content.title}
                </h3>
                <p className="mb-6 text-base leading-relaxed text-primary-foreground/90 md:text-lg">
                  {content.description}
                </p>
                <button
                  onClick={() => {
                    const element = document.getElementById("whatsapp-chat");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="min-h-11 w-full rounded-full bg-white px-6 py-3 text-sm font-bold uppercase text-primary transition-all hover:scale-105 hover:bg-white/90 sm:w-auto"
                >
                  {content.buttonText}
                </button>
              </div>

              {/* Imagem do motoboy - alinhada na base do card */}
              <div className="relative flex justify-center md:justify-end items-end">
                <img 
                  src={content.image}
                  alt={content.title}
                  className={`h-auto object-contain self-end ${isTroque ? "w-72 p-3 md:w-[420px] md:p-0 lg:w-[520px]" : "w-64 md:w-80 lg:w-96"}`}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DeliverySection;
