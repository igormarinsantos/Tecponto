import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, PlayCircle, RefreshCw, Shield, ShieldCheck, ShoppingBag, Star, Wrench, Zap, type LucideIcon } from "lucide-react";
import reparoPhone from "@/assets/repare/repare-hero-phone.png";
import trocaPhone from "@/assets/devices/troca.png";
import comprePhone from "@/assets/devices/compre.png";
import handLeft from "@/assets/devices/hand-old-phone.png";
import handRight from "@/assets/devices/hand-new-phone.png";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { SHOPEE_STORE_URL } from "@/constants/links";
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
    title: "Seu celular resolvido",
    highlight: "sem enrolação.",
    description: (
      <>
        <span className="font-bold text-foreground">Repare com garantia</span> e{" "}
        <span className="font-bold text-foreground">atendimento rápido</span>. Receba seu orçamento direto pelo WhatsApp.
      </>
    ),
    features: [
      { icon: ShieldCheck, text: "90 dias de garantia" },
      { icon: Zap, text: "Atendimento ágil" },
      { icon: Wrench, text: "Peças de qualidade" },
    ],
    floatingBadge: "Reparo em 2h",
    imageAlt: "Celular quebrado - Conserto profissional",
  },
  troque: {
    eyebrow: "Avaliação rápida do seu usado",
    title: "Troque seu celular",
    highlight: "com segurança.",
    description: (
      <>
        <span className="font-bold text-foreground">Avaliação clara do seu usado</span>,{" "}
        <span className="font-bold text-foreground">modelos revisados</span> e negociação sem complicação.
      </>
    ),
    features: [
      { icon: Zap, text: "Avaliação Rápida" },
      { icon: ShieldCheck, text: "Troca segura" },
      { icon: Star, text: "Linha revisada" },
    ],
    floatingBadge: "Troca facilitada",
    imageAlt: "Celular para troca - Avaliação TecPonto",
  },
  compre: {
    eyebrow: "Celulares revisados e com garantia",
    title: "Compre seu próximo",
    highlight: "celular.",
    description: (
      <>
        <span className="font-bold text-foreground">Aparelhos selecionados</span>,{" "}
        <span className="font-bold text-foreground">testados pela assistência</span> e prontos para você comprar com confiança
      </>
    ),
    features: [
      { icon: Zap, text: "Pronta Entrega" },
      { icon: ShieldCheck, text: "Garantia TecPonto" },
      { icon: Star, text: "Curadoria Técnica" },
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
    speed: 1.8,
    phase: 0.0,
    ampX: 5,
    ampY: 20,
    ampRot: 8,
    maxOpacity: 1,
    centerXMultiplier: 0.65,
    centerYMultiplier: 0.55,
  },
  {
    src: shard2,
    className: "absolute right-[-4%] md:right-[-12%] lg:right-[-20%] top-[8%] w-[15%] z-20 pointer-events-none filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] repare-shard",
    depth: 0.7,
    speed: 1.4,
    phase: 1.5,
    ampX: 6,
    ampY: 25,
    ampRot: -10,
    maxOpacity: 1,
    centerXMultiplier: -0.7,
    centerYMultiplier: 0.42,
  },
  {
    src: shard3,
    className: "absolute left-[-4%] md:left-[-12%] lg:left-[-18%] top-[30%] w-[16%] z-0 pointer-events-none filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.15)] blur-[0.8px] repare-shard",
    depth: -0.3,
    speed: 1.1,
    phase: 3.0,
    ampX: 4,
    ampY: 18,
    ampRot: 6,
    maxOpacity: 0.75,
    centerXMultiplier: 0.68,
    centerYMultiplier: 0.2,
  },
  {
    src: shard4,
    className: "absolute right-[-3%] md:right-[-10%] lg:right-[-15%] top-[55%] w-[11%] z-20 pointer-events-none filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.2)] repare-shard",
    depth: 0.9,
    speed: 1.9,
    phase: 4.5,
    ampX: 7,
    ampY: 22,
    ampRot: -15,
    maxOpacity: 1,
    centerXMultiplier: -0.65,
    centerYMultiplier: -0.05,
  },
  {
    src: shard5,
    className: "absolute left-[-2%] md:left-[-8%] lg:left-[-12%] bottom-[12%] w-[13%] z-20 pointer-events-none filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] repare-shard",
    depth: 0.6,
    speed: 1.5,
    phase: 2.1,
    ampX: 6,
    ampY: 20,
    ampRot: 7,
    maxOpacity: 1,
    centerXMultiplier: 0.62,
    centerYMultiplier: -0.38,
  },
  {
    src: shard6,
    className: "absolute right-[-6%] md:right-[-15%] lg:right-[-22%] bottom-[18%] w-[18%] z-0 pointer-events-none filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.15)] blur-[1.2px] repare-shard",
    depth: -0.5,
    speed: 1.2,
    phase: 0.8,
    ampX: 5,
    ampY: 28,
    ampRot: -8,
    maxOpacity: 0.7,
    centerXMultiplier: -0.72,
    centerYMultiplier: -0.32,
  },
  {
    src: shard7,
    className: "absolute left-[25%] top-[-15%] w-[11%] z-20 pointer-events-none filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.2)] repare-shard",
    depth: 0.4,
    speed: 1.7,
    phase: 5.2,
    ampX: 4,
    ampY: 16,
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

const modalityTabs = [
  { variant: "repare" as const, label: "Reparo", href: "/repare", icon: Wrench },
  { variant: "troque" as const, label: "Troca", href: "/troque", icon: RefreshCw },
  { variant: "compre" as const, label: "Compra", href: SHOPEE_STORE_URL, icon: ShoppingBag, external: true },
];

const ctaLabels: Record<LandingVariant, string> = {
  repare: "Solicitar reparo",
  troque: "Iniciar avaliação",
  compre: "Ver loja Shopee",
};

const statCards: Record<LandingVariant, Array<{ value: string; label: string; icon: LucideIcon }>> = {
  repare: [
    { value: "90", label: "dias de garantia", icon: ShieldCheck },
    { value: "8+", label: "anos de experiência", icon: Star },
    { value: "4.9", label: "avaliação média", icon: Zap },
  ],
  troque: [
    { value: "5min", label: "pré-avaliação", icon: Zap },
    { value: "8+", label: "anos de experiência", icon: Star },
    { value: "4.9", label: "avaliação média", icon: ShieldCheck },
  ],
  compre: [
    { value: "100%", label: "revisados", icon: ShieldCheck },
    { value: "8+", label: "anos de experiência", icon: Star },
    { value: "4.9", label: "avaliação média", icon: Zap },
  ],
};

const customerAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
];

type HeroConversionContentProps = {
  variant: LandingVariant;
  content: (typeof heroContent)[LandingVariant];
  align?: "left" | "center";
};

const HeroConversionContent = ({ variant, content, align = "left" }: HeroConversionContentProps) => {
  const isCentered = align === "center";
  const selectedStats = statCards[variant];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className={`mb-4 flex flex-col gap-3 ${isCentered ? "items-center" : "items-center lg:items-start"}`}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-[#25292D]/90 px-3.5 py-2 text-[11px] font-bold text-white shadow-soft">
          <ShieldCheck className="h-3.5 w-3.5 text-white" />
          <span>Assistência técnica • Troca • Acessórios</span>
        </div>

        <div className="inline-flex rounded-full bg-[#25292D] p-1 shadow-strong">
          {modalityTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.variant === variant;
            return (
              <a
                key={tab.variant}
                href={tab.href}
                target={tab.external ? "_blank" : undefined}
                rel={tab.external ? "noopener noreferrer" : undefined}
                className={`flex min-w-[96px] items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all ${
                  isActive ? "bg-white text-primary shadow-soft" : "text-white/85 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </a>
            );
          })}
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.12 }}
        className={`mb-3 max-w-3xl text-4xl font-black leading-[0.98] tracking-tight text-white md:text-6xl lg:text-7xl ${
          isCentered ? "text-center" : "text-center lg:text-left"
        }`}
      >
        {content.title}{" "}
        <span className="block text-white">{content.highlight}</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.22 }}
        className={`mb-5 max-w-2xl ${isCentered ? "text-center" : "text-center lg:text-left"}`}
      >
        <p className="mb-2 text-xl font-black text-white md:text-2xl">
          {variant === "troque" ? "Seu usado pode virar entrada." : variant === "compre" ? "Compre revisado e com garantia." : "Repare com garantia e atendimento rápido."}
        </p>
        <p className="text-base leading-relaxed text-white/90 md:text-lg [&_span]:text-white">{content.description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.32 }}
        className={`mb-5 flex flex-col gap-3 sm:flex-row ${isCentered ? "justify-center" : "justify-center lg:justify-start"}`}
      >
        <Button
          size="lg"
          onClick={variant === "compre" ? undefined : scrollToWhatsApp}
          asChild={variant === "compre"}
          className="h-14 rounded-xl bg-white px-7 text-base font-black text-[#25292D] shadow-strong transition-all hover:-translate-y-0.5 hover:bg-white/95"
        >
          {variant === "compre" ? (
            <a href={SHOPEE_STORE_URL} target="_blank" rel="noopener noreferrer">
              <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
              {ctaLabels[variant]}
              <ArrowRight className="ml-4 h-5 w-5" />
            </a>
          ) : (
            <>
              <img src="/favicon.ico" alt="" className="mr-2 h-5 w-5 rounded-full" />
              {ctaLabels[variant]}
              <ArrowRight className="ml-4 h-5 w-5" />
            </>
          )}
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={scrollToWhatsApp}
          className="h-14 rounded-xl border-white/30 bg-[#25292D]/35 px-7 text-base font-black text-white backdrop-blur hover:bg-[#25292D]/45 hover:text-white"
        >
          <PlayCircle className="mr-2 h-5 w-5" />
          Como funciona
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.42 }}
        className={`mb-6 flex flex-col gap-3 sm:flex-row sm:items-center ${isCentered ? "justify-center" : "justify-center lg:justify-start"}`}
      >
        <div className="flex -space-x-2">
          {customerAvatars.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Cliente TecPonto ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="h-9 w-9 rounded-full border-2 border-background object-cover"
            />
          ))}
        </div>
        <div className={`${isCentered ? "text-center sm:text-left" : "text-center sm:text-left"}`}>
          <p className="text-sm font-black text-white">+2.000 atendimentos</p>
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-white sm:justify-start">
            <span>Avaliação 4.9 no Google</span>
            <span className="text-[#FFD33D]">★★★★★</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.5 }}
        className={`grid max-w-2xl grid-cols-3 gap-3 ${isCentered ? "mx-auto" : "mx-auto lg:mx-0"}`}
      >
        {selectedStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl bg-white/10 p-3 text-white backdrop-blur">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-2xl font-black leading-none md:text-3xl">{stat.value}</div>
              <div className="mt-1 text-[11px] font-semibold leading-tight text-white/80">{stat.label}</div>
            </div>
          );
        })}
      </motion.div>
    </>
  );
};

type LandingHeroSectionProps = {
  variant?: LandingVariant;
};

const LandingHeroSection = ({ variant = "repare" }: LandingHeroSectionProps) => {
  const content = heroContent[variant];
  const repareContainerRef = useRef<HTMLDivElement>(null);
  const troqueHandsRef = useRef<HTMLDivElement>(null);

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
        const phoneFloatY = Math.sin(time * 1.6 + 1.5) * 12;
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

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rAFId);
    };
  }, [variant]);

  useEffect(() => {
    if (variant !== "troque") return;
    const container = troqueHandsRef.current;
    if (!container) return;

    const leftHand = container.querySelector<HTMLElement>(".troque-hand-left");
    const rightHand = container.querySelector<HTMLElement>(".troque-hand-right");
    if (!leftHand || !rightHand) return;

    let targetY = 0;
    let currentY = 0;
    let time = 0;
    let rAFId = 0;

    const handleMouseMove = (event: MouseEvent) => {
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const animateHands = () => {
      time += 0.01;
      currentY += (targetY - currentY) * 0.07;

      const idleLeftY = Math.cos(time * 1.1) * 5;
      const idleRightY = Math.cos(time * 1.25 + 0.8) * 5;

      leftHand.style.transform = `
        translate3d(0, ${currentY * 28 + idleLeftY}px, 0)
      `;
      rightHand.style.transform = `
        translate3d(0, ${currentY * -28 + idleRightY}px, 0)
      `;

      rAFId = requestAnimationFrame(animateHands);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animateHands();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rAFId);
    };
  }, [variant]);

  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center overflow-hidden bg-[#FF4B00] pt-24 md:pt-28 pb-12">
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
        <div ref={troqueHandsRef} className="absolute inset-0 pointer-events-none hidden lg:block" aria-hidden="true">
          {/* Left Hand Image */}
          <div className="troque-hand-left absolute left-0 top-1/2 z-10 w-[28%] min-w-[200px] max-w-[420px] will-change-transform">
            <div className="-translate-y-1/2">
            <motion.img
              src={handLeft}
              alt="Mão entregando celular antigo"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0, y: [0, -10, 0], rotate: [-1.5, 0.5, -1.5] }}
              transition={{
                opacity: { duration: 0.8, delay: 0.4 },
                x: { duration: 0.8, delay: 0.4 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="w-full object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.12)]"
            />
            </div>
          </div>
          
          {/* Right Hand Image */}
          <div className="troque-hand-right absolute right-0 top-1/2 z-10 w-[28%] min-w-[200px] max-w-[420px] will-change-transform">
            <div className="-translate-y-1/2">
            <motion.img
              src={handRight}
              alt="Mão recebendo celular novo"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0, y: [0, 10, 0], rotate: [1.5, -0.5, 1.5] }}
              transition={{
                opacity: { duration: 0.8, delay: 0.4 },
                x: { duration: 0.8, delay: 0.4 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
              }}
              className="w-full object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.12)]"
            />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-[1360px] mx-auto">
          {/* Two Column Layout */}
          {variant === "troque" ? (
            <div className="relative w-full py-6 md:py-12">
              {/* Centered Content */}
              <div className="flex flex-col items-center text-center max-w-4xl mx-auto relative z-20">
                <HeroConversionContent variant={variant} content={content} align="center" />

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


              </div>
            </div>
          ) : (
            /* Two Column Layout */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
                <HeroConversionContent variant={variant} content={content} align="left" />
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
                    <div className="pointer-events-none absolute inset-[-8%] z-0 rounded-full bg-[#FFB088]/45 blur-3xl" aria-hidden="true" />
                    <div className="pointer-events-none absolute inset-[8%] z-0 rounded-full bg-white/20 blur-2xl" aria-hidden="true" />
                    <GlassShards />
                    <img 
                      src={heroImages[variant]} 
                      alt={content.imageAlt} 
                      decoding="async"
                      className="w-full max-w-[340px] md:max-w-[460px] lg:max-w-[560px] drop-shadow-3xl relative z-10 repare-phone"
                      style={{ opacity: 0, transform: 'scale(0.8) translate3d(0,0,0)' }}
                    />
                  </div>
                ) : (
                  <>
                    <div className="pointer-events-none absolute inset-[8%] z-0 rounded-full bg-[#FFB088]/45 blur-3xl" aria-hidden="true" />
                    <div className="pointer-events-none absolute inset-[22%] z-0 rounded-full bg-white/20 blur-2xl" aria-hidden="true" />
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

export default LandingHeroSection;
