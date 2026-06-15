import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Bike } from "lucide-react";

const FinalCTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const scrollToWhatsApp = () => {
    const element = document.getElementById("whatsapp-chat");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="py-20 relative overflow-hidden" style={{ backgroundColor: '#25292D' }}>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Seu celular novo em pouco<br />
            tempo, {" "}
            <span className="text-primary">
              rápido e sem dor<br />de cabeça
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Atendimento profissional, peças originais e garantia estendida
          </p>

          <Button
            size="lg"
            onClick={scrollToWhatsApp}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-12 py-6 rounded-full uppercase"
          >
            Quero um Orçamento Gratuito
          </Button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8 text-white/80 text-sm md:text-base"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Resposta em até 5 minutos</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Garantia de 90 dias</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-2">
              <Bike className="w-5 h-5 text-primary" />
              <span>Busca e entrega grátis</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;