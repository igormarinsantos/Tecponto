import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Bike, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LandingVariant } from "@/types/landing";

const ctaByVariant: Record<LandingVariant, {
  title: JSX.Element;
  subtitle: string;
  button: string;
  bullets: string[];
}> = {
  repare: {
    title: (
      <>
        Seu celular novo em pouco
        <br />
        tempo, <span className="text-primary">rápido e sem dor de cabeça</span>
      </>
    ),
    subtitle: "Atendimento profissional, peças de qualidade e garantia estendida",
    button: "Quero um Orçamento Gratuito",
    bullets: ["Resposta em até 5 minutos", "Garantia de 90 dias", "Busca e entrega grátis"],
  },
  troque: {
    title: (
      <>
        Troque seu celular com
        <br />
        <span className="text-primary">avaliação justa e rápida</span>
      </>
    ),
    subtitle: "Use seu aparelho como entrada e veja opções melhores para o seu dia a dia",
    button: "Avaliar Meu Celular",
    bullets: ["Pré-avaliação por WhatsApp", "Troca segura", "Atendimento em Guarulhos"],
  },
  compre: {
    title: (
      <>
        Compre seu próximo celular
        <br />
        <span className="text-primary">revisado pela TecPonto</span>
      </>
    ),
    subtitle: "Modelos selecionados, testados e com suporte de assistência técnica",
    button: "Ver Modelos Disponíveis",
    bullets: ["Lista atualizada", "Aparelhos testados", "Compra com suporte"],
  },
};

type FinalCTASectionProps = {
  variant?: LandingVariant;
};

const FinalCTASection = ({ variant = "repare" }: FinalCTASectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const content = ctaByVariant[variant];
  const icons = [Zap, Shield, Bike];

  const scrollToWhatsApp = () => {
    const element = document.getElementById("whatsapp-chat");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="py-20 relative overflow-hidden" style={{ backgroundColor: "#25292D" }}>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {content.title}
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {content.subtitle}
          </p>

          <Button
            size="lg"
            onClick={scrollToWhatsApp}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-12 py-6 rounded-full uppercase"
          >
            {content.button}
          </Button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8 text-white/80 text-sm md:text-base"
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
