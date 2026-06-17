import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Shield, Zap, Award, CheckCircle2, RefreshCw } from "lucide-react";
import reparoPhone from "@/assets/repare/repare-hero-phone.png";
import trocaPhone from "@/assets/troca.png";
import comprePhone from "@/assets/compre.png";
import handLeft from "@/assets/hand-old-phone.png";
import handRight from "@/assets/hand-new-phone.png";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import type { LandingVariant } from "@/types/landing";

// Import glass shard PNG cutouts
import shard1 from "@/assets/repare/shard-1.png";
import shard2 from "@/assets/repare/shard-2.png";
import shard3 from "@/assets/repare/shard-3.png";
import shard4 from "@/assets/repare/shard-4.png";
import shard5 from "@/assets/repare/shard-5.png";
import shard6 from "@/assets/repare/shard-6.png";
import shard7 from "@/assets/repare/shard-7.png";

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

const glassShardsList = [
  {
    src: shard1,
    className: "absolute left-[-2%] md:left-[-10%] lg:left-[-15%] top-[-5%] w-[12%] z-20 pointer-events-none filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] repare-shard",
    depth: 0.5,
    speed: 4.2,
    phase: 0.0,
    ampX: 5,
    ampY: 30,
    ampRot: 8,
    maxOpacity: 1,
    centerXMultiplier: 0.65,
    centerYMultiplier: 0.55,
  },
  {
    src: shard2,
    className: "absolute right-[-4%] md:right-[-12%] lg:right-[-20%] top-[8%] w-[15%] z-20 pointer-events-none filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] repare-shard",
    depth: 0.7,
    speed: 3.3,
    phase: 1.5,
    ampX: 6,
    ampY: 38,
    ampRot: -10,
    maxOpacity: 1,
    centerXMultiplier: -0.7,
    centerYMultiplier: 0.42,
  },
  {
    src: shard3,
    className: "absolute left-[-4%] md:left-[-12%] lg:left-[-18%] top-[30%] w-[16%] z-0 pointer-events-none filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.15)] blur-[0.8px] repare-shard",
    depth: -0.3,
    speed: 2.6,
    phase: 3.0,
    ampX: 4,
    ampY: 28,
    ampRot: 6,
    maxOpacity: 0.75,
    centerXMultiplier: 0.68,
    centerYMultiplier: 0.2,
  },
  {
    src: shard4,
    className: "absolute right-[-3%] md:right-[-10%] lg:right-[-15%] top-[55%] w-[11%] z-20 pointer-events-none filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.2)] repare-shard",
    depth: 0.9,
    speed: 4.5,
    phase: 4.5,
    ampX: 7,
    ampY: 34,
    ampRot: -15,
    maxOpacity: 1,
    centerXMultiplier: -0.65,
    centerYMultiplier: -0.05,
  },
  {
    src: shard5,
    className: "absolute left-[-2%] md:left-[-8%] lg:left-[-12%] bottom-[12%] w-[13%] z-20 pointer-events-none filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] repare-shard",
    depth: 0.6,
    speed: 3.6,
    phase: 2.1,
    ampX: 6,
    ampY: 32,
    ampRot: 7,
    maxOpacity: 1,
    centerXMultiplier: 0.62,
    centerYMultiplier: -0.38,
  },
  {
    src: shard6,
    className: "absolute right-[-6%] md:right-[-15%] lg:right-[-22%] bottom-[18%] w-[18%] z-0 pointer-events-none filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.15)] blur-[1.2px] repare-shard",
    depth: -0.5,
    speed: 2.9,
    phase: 0.8,
    ampX: 5,
    ampY: 42,
    ampRot: -8,
    maxOpacity: 0.7,
    centerXMultiplier: -0.72,
    centerYMultiplier: -0.32,
  },
  {
    src: shard7,
    className: "absolute left-[25%] top-[-15%] w-[11%] z-20 pointer-events-none filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.2)] repare-shard",
    depth: 0.4,
    speed: 3.9,
    phase: 5.2,
    ampX: 4,
    ampY: 26,
    ampRot: 12,
    maxOpacity: 1,
    centerXMultiplier: 0.25,
    centerYMultiplier: 0.65,
  },
];

const GlassShards = () => (
  <div className="absolute inset-0 pointer-events-none overflow-visible animate-pulse-slow" aria-hidden="true">
    {glassShardsList.map((shard, index) => (
      <img
        key={index}
        src={shard.src}
        className={shard.className}
        style={{ opacity: 0, transform: 'scale(0) translate3d(0,0,0)' }}
      />
    ))}
  </div>
);

type NewHeroSectionProps = {
  variant?: LandingVariant;
};

const NewHeroSection = ({ variant = "repare" }: NewHeroSectionProps) => {
  const content = heroContent[variant];
  const repareContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant !== "repare") return;
    const container = repareContainerRef.current;
    if (!container) return;

    const shards = container.querySelectorAll<HTMLImageElement>(".repare-shard");
    const phoneImg = container.querySelector<HTMLImageElement>(".repare-phone");
    
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rAFId = 0;
    let time = 0;
    let burstProgress = 0;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleMouseMove = (event: MouseEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    if (!reduceMotion) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      const animateParallax = () => {
        const isMobile = window.innerWidth < 768;
        time += 0.01;
        
        // Easing for entry burst (shards fly out on mount)
        if (burstProgress < 1) {
          burstProgress += (1 - burstProgress) * 0.035;
          if (1 - burstProgress < 0.001) burstProgress = 1;
        }

        if (isMobile) {
          // Automatic float on mobile
          currentX = Math.sin(time * 0.8) * 0.2;
          currentY = Math.cos(time * 0.6) * 0.2;
        } else {
          // Smooth follow client mouse position on desktop
          currentX += (targetX - currentX) * 0.08;
          currentY += (targetY - currentY) * 0.08;
        }

        // Apply interactive 3D rotation and vertical float to phone mockup
        if (phoneImg) {
          const phoneScale = 0.85 + 0.15 * burstProgress;
          const phoneFloatY = Math.sin(time * 3.5 + 1.5) * 20;
          phoneImg.style.transform = `
            rotateY(${currentX * 12}deg)
            rotateX(${-currentY * 12}deg)
            translateY(${phoneFloatY}px)
            scale(${phoneScale})
          `;
          phoneImg.style.opacity = burstProgress.toString();
        }

        // Apply 3D float, parallax and entry burst to shards
        const containerWidth = container.clientWidth || 340;
        const containerHeight = container.clientHeight || 600;

        shards.forEach((shard, index) => {
          const config = glassShardsList[index];
          if (!config) return;

          // Parallax movement based on mouse
          const moveX = currentX * config.depth * 90;
          const moveY = currentY * config.depth * 90;
          
          // Auto-floating oscillations
          const floatX = Math.sin(time * config.speed + config.phase) * config.ampX;
          const floatY = Math.cos(time * config.speed + config.phase) * config.ampY;
          const floatRot = Math.sin(time * config.speed * 0.8 + config.phase) * config.ampRot;

          // Entry burst displacement (starts at center of phone, ends at outer float position)
          const burstX = config.centerXMultiplier * containerWidth * (1 - burstProgress);
          const burstY = config.centerYMultiplier * containerHeight * (1 - burstProgress);
          const shardScale = burstProgress * 1.0;

          shard.style.transform = `
            translate3d(${moveX + floatX + burstX}px, ${moveY + floatY + burstY}px, ${config.depth * 60}px)
            rotate(${floatRot}deg)
            scale(${shardScale})
          `;
          shard.style.opacity = (burstProgress * config.maxOpacity).toString();
        });

        rAFId = requestAnimationFrame(animateParallax);
      };

      animateParallax();
    } else {
      // Fallback
      if (phoneImg) {
        phoneImg.style.opacity = "1";
        phoneImg.style.transform = "scale(1)";
      }
      shards.forEach((shard, index) => {
        const config = glassShardsList[index];
        if (!config) return;
        shard.style.opacity = config.maxOpacity.toString();
        shard.style.transform = "scale(1)";
      });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rAFId);
    };
  }, [variant]);

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
      </div>

      {/* Absolute hands for trade page (aligned to screen edges) */}
      {variant === "troque" && (
        <>
          {/* Left Hand Image */}
          <motion.img
            initial={{ opacity: 0, x: -100, y: "-50%" }}
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
            alt="Mão entregando celular antigo"
            className="absolute left-0 top-1/2 w-[28%] min-w-[200px] max-w-[420px] object-contain pointer-events-none hidden lg:block z-10 drop-shadow-[0_20px_20px_rgba(0,0,0,0.12)]"
          />
          
          {/* Right Hand Image */}
          <motion.img
            initial={{ opacity: 0, x: 100, y: "-50%" }}
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
            alt="Mão recebendo celular novo"
            className="absolute right-0 top-1/2 w-[28%] min-w-[200px] max-w-[420px] object-contain pointer-events-none hidden lg:block z-10 drop-shadow-[0_20px_20px_rgba(0,0,0,0.12)]"
          />
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-[1360px] mx-auto">
          {/* Two Column Layout */}
          {variant === "troque" ? (
            <div className="relative w-full py-6 md:py-12">
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
                className={`order-1 lg:order-2 flex justify-center relative ${variant === "repare" ? "lg:justify-center" : "lg:justify-end"}`}
              >
                {variant === "repare" ? (
                  <div ref={repareContainerRef} className="relative w-fit mx-auto select-none flex items-center justify-center">
                    <GlassShards />
                    <img 
                      src={heroImages[variant]} 
                      alt={content.imageAlt} 
                      fetchPriority="high"
                      decoding="async"
                      className="w-full max-w-[320px] md:max-w-[400px] lg:max-w-[480px] drop-shadow-3xl relative z-10 repare-phone"
                      style={{ opacity: 0, transform: 'scale(0.8) translate3d(0,0,0)' }}
                    />
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewHeroSection;
