import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import warrantyImg from "@/assets/services/warranty.png";
import troquePremiumImg from "@/assets/devices/troque-premium-line.png";
import type { LandingVariant } from "@/types/landing";

type WarrantySectionProps = {
  variant?: LandingVariant;
};

const WarrantySection = ({ variant = "repare" }: WarrantySectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const isTroque = variant === "troque";
  const image = isTroque ? troquePremiumImg : warrantyImg;
  const title = isTroque ? "Linha Premium" : "Garantia de 90 Dias";
  const description = isTroque ? (
    <>
      Temos uma <span className="font-bold text-white">seleção exclusiva</span> de celulares seminovos e revisados. Todos os aparelhos passam por uma{" "}
      <span className="font-bold text-primary">rigorosa avaliação técnica</span> para garantir que você saia com um smartphone impecável e de alto padrão.
    </>
  ) : (
    <>
      <span className="font-bold text-white">Todos os nossos reparos</span> incluem{" "}
      <span className="font-bold text-primary">garantia de 90 dias</span>.
      Trabalhamos com <span className="font-semibold">peças originais certificadas</span> e <span className="font-semibold">técnicos especializados</span> para
      garantir sua <span className="font-bold text-white">total satisfação</span>.
    </>
  );
  const buttonText = isTroque ? "Ver Modelos Premium" : "Solicitar Garantia";

  return (
    <section ref={ref} id="warranty" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className={`max-w-5xl mx-auto rounded-2xl shadow-soft border-2 border-border flex flex-col md:flex-row items-end gap-8 relative min-h-[320px] ${
            isTroque ? "px-8 pt-10 md:px-16 md:pt-16 overflow-hidden" : "p-12 md:p-16 overflow-visible"
          }`}
          style={{ backgroundColor: '#25292D' }}
        >
          <div className={`flex-shrink-0 self-end ${isTroque ? "mb-0" : "mb-8 md:mb-0 md:-mb-20"}`}>
            <img 
              src={image} 
              alt={title}
              className={`object-contain ${isTroque ? "w-64 scale-x-[-1] md:w-80 md:scale-x-100 lg:w-96 h-auto block" : "w-48 h-48 md:w-64 md:h-64"}`}
            />
          </div>

          <div className={`text-center md:text-left flex-1 ${isTroque ? "pb-10 md:pb-16" : ""}`}>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {title}
            </h3>
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              {description}
            </p>
            <button
              onClick={() => {
                const element = document.getElementById("whatsapp-chat");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-full transition-all hover:scale-105 uppercase text-sm"
            >
              {buttonText}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WarrantySection;
