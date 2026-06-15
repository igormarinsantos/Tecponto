import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Shield, Zap, Award, CheckCircle2 } from "lucide-react";
import brokenPhone from "@/assets/broken-phone-hero.png";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import type { LandingVariant } from "@/types/landing";

const scrollToWhatsApp = () => {
  const element = document.getElementById("whatsapp-chat");
  element?.scrollIntoView({ behavior: "smooth" });
};

const HeroCountdown = () => {
  const timeLeft = useCountdownTimer();

  return (
    <div className="flex gap-0.5">
      <span className="bg-primary-foreground text-primary w-4 h-4 md:w-5 md:h-5 rounded flex items-center justify-center text-[9px] md:text-[10px] font-bold">
        {String(timeLeft.hours).padStart(2, "0")}
      </span>
      <span className="text-[10px] md:text-xs">:</span>
      <span className="bg-primary-foreground text-primary w-4 h-4 md:w-5 md:h-5 rounded flex items-center justify-center text-[9px] md:text-[10px] font-bold">
        {String(timeLeft.minutes).padStart(2, "0")}
      </span>
      <span className="text-[10px] md:text-xs">:</span>
      <span className="bg-primary-foreground text-primary w-4 h-4 md:w-5 md:h-5 rounded flex items-center justify-center text-[9px] md:text-[10px] font-bold">
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </div>
  );
};

const heroContent: Record<LandingVariant, {
  eyebrow: string;
  title: string;
  highlight: string;
  description: JSX.Element;
  features: Array<{ icon: typeof Zap; text: string }>;
  floatingBadge: string;
  imageAlt: string;
}> = {
  repare: {
    eyebrow: "10% OFF Novos Clientes",
    title: "Seu celular",
    highlight: "quebrou?",
    description: (
      <>
        <span className="font-bold text-foreground">Conserto rápido</span>,{" "}
        <span className="font-bold text-foreground">garantia de 90 dias</span> e{" "}
        <span className="font-bold text-foreground">atendimento especializado</span> que você merece
      </>
    ),
    features: [
      { icon: Zap, text: "Reparo Rápido" },
      { icon: Shield, text: "90 Dias Garantia" },
      { icon: Award, text: "Peças Originais" },
    ],
    floatingBadge: "Reparo em 2h",
    imageAlt: "Celular quebrado - Conserto profissional",
  },
  troque: {
    eyebrow: "Avaliação rápida do seu usado",
    title: "Troque seu celular",
    highlight: "sem enrolação",
    description: (
      <>
        <span className="font-bold text-foreground">Avaliamos seu aparelho</span>,{" "}
        <span className="font-bold text-foreground">aceitamos como entrada</span> e te ajudamos a sair com um modelo melhor
      </>
    ),
    features: [
      { icon: Zap, text: "Avaliação Rápida" },
      { icon: Shield, text: "Troca Segura" },
      { icon: Award, text: "Modelos Selecionados" },
    ],
    floatingBadge: "Troca facilitada",
    imageAlt: "Celular para troca - Avaliação TecPonto",
  },
  compre: {
    eyebrow: "Celulares revisados e com garantia",
    title: "Compre seu próximo",
    highlight: "celular",
    description: (
      <>
        <span className="font-bold text-foreground">Aparelhos selecionados</span>,{" "}
        <span className="font-bold text-foreground">testados pela assistência</span> e prontos para você comprar com confiança
      </>
    ),
    features: [
      { icon: Zap, text: "Pronta Entrega" },
      { icon: Shield, text: "Garantia TecPonto" },
      { icon: Award, text: "Curadoria Técnica" },
    ],
    floatingBadge: "Compra segura",
    imageAlt: "Celular revisado para venda - TecPonto",
  },
};

type NewHeroSectionProps = {
  variant?: LandingVariant;
};

const NewHeroSection = ({ variant = "repare" }: NewHeroSectionProps) => {
  const content = heroContent[variant];

  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center bg-gradient-to-br from-background via-background/95 to-primary/10 overflow-hidden py-6 md:py-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-1/4 -right-1/4 w-[80%] h-[80%] bg-gradient-to-br from-primary/15 to-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[60%] h-[60%] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
        
        {/* Floating shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-16 h-16 md:w-24 md:h-24 border-2 border-primary/20 rounded-2xl hidden md:block"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-[15%] w-12 h-12 md:w-20 md:h-20 bg-primary/10 rounded-full hidden md:block"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-[5%] w-8 h-8 bg-primary/20 rounded-lg hidden lg:block"
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
              {/* Badges Row */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6 justify-center lg:justify-start"
              >
                <div className="inline-flex items-center gap-1.5 md:gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-border/50">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="text-[10px] md:text-xs font-medium text-foreground uppercase">Guarulhos, SP</span>
                </div>
                
                <div className="inline-flex items-center gap-1.5 md:gap-2 bg-primary text-primary-foreground px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] md:text-xs font-semibold uppercase">{content.eyebrow}</span>
                  <span className="text-[10px] md:text-xs opacity-70">|</span>
                  <HeroCountdown />
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-3 md:mb-4 leading-tight tracking-tight"
              >
                {content.title}{" "}
                <span className="text-primary relative">
                  {content.highlight}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="absolute -bottom-1 left-0 right-0 h-1 md:h-1.5 bg-primary/30 rounded-full origin-left"
                  />
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-sm md:text-base lg:text-lg text-muted-foreground mb-4 md:mb-6 max-w-lg"
              >
                {content.description}
              </motion.p>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-2 md:gap-3 mb-5 md:mb-6 justify-center lg:justify-start"
              >
                {content.features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-1.5 bg-card/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/30"
                  >
                    <feature.icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] md:text-xs font-medium text-foreground">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mb-5 md:mb-6"
              >
                <Button
                  size="lg"
                  onClick={scrollToWhatsApp}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 md:px-8 py-5 md:py-6 text-sm md:text-base rounded-full uppercase shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <span>Solicitar Orçamento Grátis</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-2"
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4"
              >
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
                  ].map((src, i) => (
                    <img 
                      key={i}
                      src={src} 
                      alt={`Cliente satisfeito ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-xs md:text-sm font-bold text-foreground">+2000 Clientes Atendidos</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] md:text-xs text-muted-foreground">Avaliação 4.9/5 no Google</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Phone Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="order-1 lg:order-2 flex justify-center lg:justify-end relative"
            >
              {/* Glow effect behind phone */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 md:w-64 md:h-64 bg-primary/20 rounded-full blur-3xl" />
              </div>
              
              {/* Floating elements around phone */}
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 md:top-8 left-4 md:left-8 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-border/50 hidden sm:block"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] md:text-xs font-medium">Atendimento Online</span>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-8 md:bottom-16 right-0 md:right-4 bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg shadow-lg hidden sm:block"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  <span className="text-[10px] md:text-xs font-bold">{content.floatingBadge}</span>
                </div>
              </motion.div>

              {/* Phone Image */}
              <motion.img 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                src={brokenPhone} 
                alt={content.imageAlt} 
                fetchPriority="high"
                decoding="async"
                className="w-full max-w-[160px] md:max-w-[220px] lg:max-w-[280px] drop-shadow-2xl relative z-10"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHeroSection;
