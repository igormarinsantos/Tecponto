import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Shield, Zap, Award, CheckCircle2, RefreshCw } from "lucide-react";
import reparoPhone from "@/assets/broken-phone-hero.png";
import trocaPhone from "@/assets/troca.png";
import comprePhone from "@/assets/compre.png";
import handLeft from "@/assets/hand-old-phone.png";
import handRight from "@/assets/hand-new-phone.png";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import type { LandingVariant } from "@/types/landing";

const heroImages: Record<LandingVariant, string> = {
  repare: reparoPhone,
  troque: trocaPhone,
  compre: comprePhone,
};

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

const glassShards = [
  {
    className: "left-[6%] top-[24%] h-16 w-11",
    clipPath: "polygon(18% 0, 100% 20%, 72% 100%, 0 76%)",
    delay: 0,
  },
  {
    className: "left-[17%] top-[17%] h-10 w-8",
    clipPath: "polygon(45% 0, 100% 100%, 0 78%)",
    delay: 0.4,
  },
  {
    className: "left-[36%] top-[23%] h-12 w-9",
    clipPath: "polygon(0 18%, 82% 0, 100% 72%, 28% 100%)",
    delay: 0.8,
  },
  {
    className: "left-[2%] top-[55%] h-12 w-10",
    clipPath: "polygon(18% 8%, 100% 0, 78% 100%, 0 62%)",
    delay: 1.1,
  },
  {
    className: "left-[24%] top-[69%] h-9 w-14",
    clipPath: "polygon(0 0, 100% 32%, 72% 100%, 12% 78%)",
    delay: 0.2,
  },
  {
    className: "left-[43%] top-[62%] h-14 w-10",
    clipPath: "polygon(35% 0, 100% 48%, 54% 100%, 0 32%)",
    delay: 0.65,
  },
];

const GlassShards = () => (
  <div className="absolute inset-0 hidden md:block pointer-events-none" aria-hidden="true">
    {glassShards.map((shard) => (
      <motion.div
        key={`${shard.className}-${shard.clipPath}`}
        className={`absolute ${shard.className} border border-primary/25 bg-white/20 shadow-[0_8px_30px_rgba(255,255,255,0.25)] backdrop-blur-[2px]`}
        style={{ clipPath: shard.clipPath }}
        initial={{ opacity: 0, y: 10, rotate: -8 }}
        animate={{
          opacity: [0.22, 0.46, 0.22],
          y: [0, -12, 0],
          rotate: [-8, 5, -8],
        }}
        transition={{
          duration: 7,
          delay: shard.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

type NewHeroSectionProps = {
  variant?: LandingVariant;
};

const NewHeroSection = ({ variant = "repare" }: NewHeroSectionProps) => {
  const content = heroContent[variant];

  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center bg-background overflow-hidden pt-24 md:pt-28 pb-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        {variant === "repare" && <GlassShards />}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-[1360px] mx-auto">
          {/* Two Column Layout */}
          {variant === "troque" ? (
            <div className="relative w-full py-6 md:py-12">
              {/* Left Hand Image */}
              <motion.img
                initial={{ opacity: 0, x: -80, y: "-50%" }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  y: ["-50%", "-52%", "-50%"]
                }}
                transition={{ 
                  opacity: { duration: 0.8, delay: 0.4 },
                  x: { duration: 0.8, delay: 0.4 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
                src={handLeft}
                alt="Mão entregando celular"
                className="absolute left-[-5%] xl:left-[0%] top-1/2 w-[42%] xl:w-[48%] max-w-[620px] object-contain pointer-events-none hidden lg:block drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)]"
              />
              
              {/* Right Hand Image */}
              <motion.img
                initial={{ opacity: 0, x: 80, y: "-50%" }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  y: ["-50%", "-48%", "-50%"]
                }}
                transition={{ 
                  opacity: { duration: 0.8, delay: 0.4 },
                  x: { duration: 0.8, delay: 0.4 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
                src={handRight}
                alt="Mão recebendo celular"
                className="absolute right-[-5%] xl:right-[0%] top-1/2 w-[42%] xl:w-[48%] max-w-[620px] object-contain pointer-events-none hidden lg:block drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)]"
              />

              {/* Centered Content */}
              <div className="flex flex-col items-center text-center max-w-4xl mx-auto relative z-20">
                {/* Badges Row */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6 justify-center"
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
                  <span className="text-primary relative block sm:inline">
                    {content.highlight}
                  </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-sm md:text-base lg:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl"
                >
                  {content.description}
                </motion.p>

                {/* Feature Pills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-wrap gap-2 md:gap-3 mb-5 md:mb-6 justify-center"
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

                {/* Mobile/Tablet image showcase (hidden on desktop) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="w-full max-w-[280px] xs:max-w-[320px] aspect-[1.6] relative my-4 flex items-center justify-center lg:hidden overflow-visible select-none"
                >
                  {/* Left hand (old phone) */}
                  <motion.img
                    src={handLeft}
                    alt="Celular antigo usado"
                    animate={{ y: [0, -6, 0], rotate: [-2, 0, -2] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[-8%] w-[80%] object-contain drop-shadow-xl z-10"
                  />
                  
                  {/* Swap icon */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-background shadow-md z-30"
                  >
                    <RefreshCw className="w-4.5 h-4.5 text-white" />
                  </motion.div>

                  {/* Right hand (new phone) */}
                  <motion.img
                    src={handRight}
                    alt="Celular novo premium"
                    animate={{ y: [0, 6, 0], rotate: [2, 0, 2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    className="absolute right-[-8%] w-[80%] object-contain drop-shadow-2xl z-20"
                  />
                </motion.div>

                {/* Social Proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
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
            </div>
          ) : (
            /* Two Column Layout */
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
                  </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-sm md:text-base lg:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl"
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
                  src={heroImages[variant]} 
                  alt={content.imageAlt} 
                  fetchPriority="high"
                  decoding="async"
                  className="w-full max-w-[160px] md:max-w-[220px] lg:max-w-[280px] drop-shadow-2xl relative z-10"
                />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewHeroSection;
