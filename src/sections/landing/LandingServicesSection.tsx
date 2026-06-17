import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import screenRepair from "@/assets/services/screen-repair.png";
import battery from "@/assets/services/battery.png";
import internalRepair from "@/assets/services/internal-repair.png";
import software from "@/assets/services/software.png";
import speaker from "@/assets/services/speaker.png";
import perfectPhone from "@/assets/devices/perfect-phone.jpg";
import brokenPhone from "@/assets/devices/broken-phone-hero.png";
import troquePremiumImg from "@/assets/devices/troque-premium-line.png";
import troqueUsedValueImg from "@/assets/devices/troque-used-value.png";
import type { LandingVariant } from "@/types/landing";

type ServiceItem = {
  image: string;
  title: string;
  description: string;
  isCTA?: boolean;
};

const servicesByVariant: Record<LandingVariant, {
  title: string;
  subtitle: JSX.Element;
  ctaTitle: string;
  ctaDescription: JSX.Element;
  ctaButton: string;
  services: ServiceItem[];
}> = {
  repare: {
    title: "Nossas Soluções",
    subtitle: (
      <>
        <span className="font-bold text-foreground">Soluções completas e profissionais</span> para seu dispositivo móvel
      </>
    ),
    ctaTitle: "Pronto pra consertar?",
    ctaDescription: (
      <>
        <span className="font-bold text-foreground">Receba um orçamento gratuito</span> em até 5 minutos
      </>
    ),
    ctaButton: "Solicitar Orçamento",
    services: [
      { image: screenRepair, title: "Troca de Tela", description: "Telas certificadas e de alta qualidade para todos os modelos" },
      { image: battery, title: "Troca de Bateria", description: "Bateria nova com garantia de 90 dias" },
      { image: internalRepair, title: "Reparos Internos", description: "Placas, conectores e componentes internos especializados" },
      { image: software, title: "Problemas de Software", description: "Formatação profissional, atualização e desbloqueio seguro" },
      { image: speaker, title: "Alto-falante", description: "Troca e reparo especializado de alto-falantes e microfones" },
    ],
  },
  troque: {
    title: "Troque com Segurança",
    subtitle: (
      <>
        <span className="font-bold text-foreground">Seu usado pode virar entrada</span> para um aparelho revisado, testado e escolhido com orientação da TecPonto
      </>
    ),
    ctaTitle: "Quer descobrir quanto vale?",
    ctaDescription: (
      <>
        <span className="font-bold text-foreground">Responda rapidinho no WhatsApp</span> e receba uma pré-avaliação clara do seu aparelho
      </>
    ),
    ctaButton: "Descobrir Valor do Meu Usado",
    services: [
      { image: brokenPhone, title: "Avaliação Honesta do Seu Usado", description: "Analisamos modelo, estado, bateria, tela e funcionamento para chegar em uma proposta justa." },
      { image: troqueUsedValueImg, title: "Seu Usado Vira Entrada", description: "Seu aparelho atual pode abater parte do valor de um modelo melhor, sem proposta confusa." },
      { image: troquePremiumImg, title: "Linha Premium Revisada", description: "Modelos selecionados, testados e prontos para você sair usando com confiança." },
      { image: internalRepair, title: "Segurança Técnica", description: "A TecPonto revisa os aparelhos antes de indicar a melhor opção para sua troca." },
      { image: perfectPhone, title: "Upgrade Sem Complicação", description: "Você manda as informações pelo WhatsApp e recebe um caminho claro para evoluir de aparelho." },
      { image: software, title: "Transferência Orientada", description: "Te ajudamos a se preparar para trocar sem perder contatos, fotos e o que importa." },
    ],
  },
  compre: {
    title: "Compre com Confiança",
    subtitle: (
      <>
        <span className="font-bold text-foreground">Celulares revisados pela TecPonto</span> para você comprar sem susto
      </>
    ),
    ctaTitle: "Quer ver os disponíveis?",
    ctaDescription: (
      <>
        <span className="font-bold text-foreground">Peça a lista atualizada</span> de modelos pelo WhatsApp
      </>
    ),
    ctaButton: "Ver Modelos",
    services: [
      { image: perfectPhone, title: "Aparelhos Revisados", description: "Modelos testados pela assistência antes de chegar até você" },
      { image: battery, title: "Bateria Conferida", description: "Checagem de saúde e funcionamento para compra mais segura" },
      { image: screenRepair, title: "Tela Testada", description: "Toque, brilho, manchas e acabamento avaliados pela equipe" },
      { image: software, title: "Sistema Pronto", description: "Aparelho limpo, funcional e preparado para o novo dono" },
      { image: internalRepair, title: "Garantia TecPonto", description: "Compra com suporte de quem entende de assistência técnica" },
    ],
  },
};

const scrollToWhatsApp = () => {
  const element = document.getElementById("whatsapp-chat");
  element?.scrollIntoView({ behavior: "smooth" });
};

type LandingServicesSectionProps = {
  variant?: LandingVariant;
};

const LandingServicesSection = ({ variant = "repare" }: LandingServicesSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const content = servicesByVariant[variant];
  const services = [
    ...content.services,
    { image: "", title: content.ctaTitle, description: "", isCTA: true },
  ];

  return (
    <section ref={ref} id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-primary">{content.title}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {service.isCTA ? (
                <div
                  onClick={scrollToWhatsApp}
                  className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-8 rounded-2xl shadow-soft hover:shadow-strong transition-base h-full flex flex-col items-center justify-center text-center border-2 border-primary/20 overflow-hidden cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-base" />

                  <h3 className="relative z-10 text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-base">
                    <span className="text-primary">{content.ctaTitle}</span>
                  </h3>
                  <p className="relative z-10 text-muted-foreground leading-relaxed text-sm mb-4">
                    {content.ctaDescription}
                  </p>
                  <Button className="relative z-10 bg-primary text-primary-foreground font-bold hover:scale-105 transition-base uppercase">
                    {content.ctaButton}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={scrollToWhatsApp}
                  className="relative bg-card rounded-2xl shadow-soft hover:shadow-strong transition-base h-full overflow-hidden border border-border group cursor-pointer"
                >
                  <div className="relative h-48 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-50" />

                    <div className="absolute inset-0 bg-primary/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <span className="text-primary-foreground font-bold text-base md:text-lg uppercase text-center">
                        {content.ctaButton}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 text-center relative">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-base">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingServicesSection;
