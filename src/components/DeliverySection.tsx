import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import motoboyImg from "@/assets/motoboy.png";
import type { LandingVariant } from "@/types/landing";

type DeliverySectionProps = {
  variant?: LandingVariant;
};

const DeliverySection = ({ variant = "repare" }: DeliverySectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const isTroque = variant === "troque";
  const title = isTroque ? "Seu Usado Vale Dinheiro" : "Leva e Traz";
  const description = isTroque ? (
    <>
      <span className="font-bold text-white">Avaliamos seu celular atual</span> de forma justa e transparente. Ele entra como <span className="font-semibold">parte do pagamento</span> para você levar um smartphone melhor hoje mesmo, sem complicações!
    </>
  ) : (
    <>
      <span className="font-bold text-white">Buscamos e entregamos</span> seu celular em <span className="font-semibold">total segurança</span> na região de{" "}
      <span className="font-bold text-white">Guarulhos e São Paulo</span>,
      <span className="font-bold"> sem custo adicional</span>. Você não precisa sair de casa!
    </>
  );
  const buttonText = isTroque ? "Avaliar Meu Usado" : "Solicitar Coleta";

  return (
    <section ref={ref} className="py-12 bg-background">
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
              <div className="text-center md:text-left p-8 md:p-12">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                  {title}
                </h3>
                <p className="text-lg text-primary-foreground/90 leading-relaxed mb-6">
                  {description}
                </p>
                <button
                  onClick={() => {
                    const element = document.getElementById("whatsapp-chat");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-white hover:bg-white/90 text-primary font-bold px-6 py-3 rounded-full transition-all hover:scale-105 uppercase text-sm"
                >
                  {buttonText}
                </button>
              </div>

              {/* Imagem do motoboy - alinhada na base do card */}
              <div className="relative flex justify-center md:justify-end items-end">
                <img 
                  src={motoboyImg} 
                  alt={title}
                  className="w-72 md:w-80 lg:w-96 h-auto object-contain self-end"
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
