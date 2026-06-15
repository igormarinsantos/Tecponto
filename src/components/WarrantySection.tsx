import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import warrantyImg from "@/assets/services/warranty.png";

const WarrantySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section ref={ref} className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto rounded-2xl p-12 md:p-16 shadow-soft border-2 border-border flex flex-col md:flex-row items-end gap-8 relative overflow-visible min-h-[320px]"
          style={{ backgroundColor: '#25292D' }}
        >
          <div className="flex-shrink-0 mb-8 md:mb-0 md:-mb-20">
            <img 
              src={warrantyImg} 
              alt="Garantia"
              className="w-48 h-48 md:w-64 md:h-64 object-contain"
            />
          </div>

          <div className="text-center md:text-left flex-1">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Garantia de 90 Dias
            </h3>
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              <span className="font-bold text-white">Todos os nossos reparos</span> incluem{" "}
              <span className="font-bold text-primary">garantia de 90 dias</span>.
              Trabalhamos com <span className="font-semibold">peças originais certificadas</span> e <span className="font-semibold">técnicos especializados</span> para
              garantir sua <span className="font-bold text-white">total satisfação</span>.
            </p>
            <button
              onClick={() => {
                const element = document.getElementById("whatsapp-chat");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-full transition-all hover:scale-105 uppercase text-sm"
            >
              Solicitar Garantia
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WarrantySection;