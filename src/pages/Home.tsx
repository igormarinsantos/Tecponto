import { useEffect, useState } from "react";
import type { PointerEvent } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, PlayCircle, RefreshCw, ShieldCheck, ShoppingBag, Smartphone, Star, Wrench, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/layouts/Footer";
import WhatsAppButton from "@/features/whatsapp/WhatsAppButton";
import WhatsAppQualificationModal from "@/features/whatsapp/WhatsAppQualificationModal";
import type { LandingVariant } from "@/types/landing";
import brokenPhone from "@/assets/devices/reparo.png";
import perfectPhone from "@/assets/devices/compre.png";
import motoboy from "@/assets/devices/troca.png";
import homeHeroCompre from "@/assets/devices/home-hero-compre.png";
import homeHeroRepare from "@/assets/devices/home-hero-repare.png";
import homeHeroTroque from "@/assets/devices/home-hero-troque.png";
import customer1 from "@/assets/people/customer-1.jpg";
import customer2 from "@/assets/people/customer-2.jpg";
import customer3 from "@/assets/people/customer-3.jpg";
import customer4 from "@/assets/people/customer-4.jpg";
import whatsappLogo from "@/assets/icons/whatsapp-logo.svg";
import shopLocation from "@/assets/media/shop-location.jpg";
import spaceVideoMp4 from "@/assets/media/testimonial-video.mp4";
import spaceVideoWebm from "@/assets/media/testimonial-video.webm";
import { SHOPEE_STORE_URL } from "@/constants/links";

const modalities = [
  {
    title: "Compre",
    path: SHOPEE_STORE_URL,
    external: true,
    icon: ShoppingBag,
    description: "Celulares revisados, testados pela assistência e prontos para uso.",
    image: perfectPhone,
    cta: "Ver aparelhos",
  },
  {
    title: "Troque",
    path: "/troque",
    icon: RefreshCw,
    description: "Use seu aparelho atual como entrada para evoluir para um modelo melhor.",
    image: motoboy,
    cta: "Avaliar troca",
  },
  {
    title: "Repare",
    path: "/repare",
    icon: Wrench,
    description: "Conserto rápido, garantia de 90 dias e atendimento especializado.",
    image: brokenPhone,
    cta: "Solicitar reparo",
  },
];

const trustPoints = [
  "Atendimento em Guarulhos",
  "Busca e entrega combinadas pelo WhatsApp",
  "Suporte de quem entende de assistência técnica",
];

const heroVisuals = [
  { image: homeHeroRepare, alt: "Celular quebrado para reparo TecPonto" },
  { image: homeHeroTroque, alt: "Celular para troca TecPonto" },
  { image: homeHeroCompre, alt: "Celular para compra TecPonto" },
];

const heroModes = [
  {
    label: "Reparo",
    variant: "repare" as const,
    icon: Wrench,
    title: "Seu celular resolvido sem enrolação.",
    lead: "Repare com garantia e atendimento rápido.",
    description: "Consertamos seu celular com agilidade, peças de qualidade e garantia de 90 dias. Receba seu orçamento direto pelo WhatsApp.",
    cta: "Solicitar reparo",
  },
  {
    label: "Troca",
    variant: "troque" as const,
    icon: RefreshCw,
    title: "Seu usado vale mais na troca.",
    lead: "Troque com avaliação clara e segura.",
    description: "Avalie seu aparelho, use como entrada e evolua para um celular revisado com orientação da equipe TecPonto.",
    cta: "Iniciar avaliação",
  },
  {
    label: "Compra",
    variant: "compre" as const,
    icon: ShoppingBag,
    title: "Compre seu próximo celular com confiança.",
    lead: "Aparelhos revisados e prontos para uso.",
    description: "Encontre celulares selecionados pela TecPonto, testados pela assistência e disponíveis na nossa loja Shopee.",
    cta: "Acessar loja",
  },
];

const AnimatedCounter = ({ end, duration = 1200, suffix = "", decimals = 0 }: { end: number; duration?: number; suffix?: string; decimals?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = progress * end;
      setCount(currentValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return (
    <span>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const Home = () => {
  const [videoHover, setVideoHover] = useState(false);
  const [videoHoverPosition, setVideoHoverPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<LandingVariant | undefined>(undefined);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const currentHeroMode = heroModes[currentWordIndex];
  const heroPointerY = useMotionValue(0);
  const heroVisualY = useSpring(heroPointerY, {
    stiffness: 70,
    damping: 18,
    mass: 0.8,
  });


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % heroModes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const openModal = (variant?: LandingVariant) => {
    setModalVariant(variant);
    setIsModalOpen(true);
  };

  const handleHeroPointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerY = (event.clientY - rect.top) / rect.height;
    heroPointerY.set((pointerY - 0.5) * 96);
  };

  return (
    <main className="min-h-screen bg-background">
      <WhatsAppButton />
      <WhatsAppQualificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant={modalVariant} />
      
      <section
        className="relative m-[10px] flex min-h-[calc(100dvh-20px)] items-center overflow-hidden rounded-[30px] bg-[#FF4B00] py-16 md:py-20"
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={() => heroPointerY.set(0)}
      >

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] max-w-[1360px] mx-auto">
            <div className="p-2 text-left text-white">
              <div className="mb-5 grid w-[calc(100vw-40px)] max-w-full grid-cols-3 overflow-hidden rounded-full bg-[#25292D] p-1 md:mb-6 md:inline-flex md:w-auto md:overflow-visible">
                {heroModes.map((mode, index) => {
                  const Icon = mode.icon;
                  const isActive = index === currentWordIndex;
                  return (
                    <button
                      key={mode.label}
                      type="button"
                      onClick={() => setCurrentWordIndex(index)}
                      className={`flex w-full min-w-0 items-center justify-center gap-1 rounded-full px-1.5 py-2.5 text-[10px] font-black transition-all min-[360px]:gap-1.5 min-[360px]:px-2.5 min-[360px]:text-xs sm:gap-2 sm:px-3 sm:text-sm md:w-auto md:min-w-[96px] md:px-4 ${
                        isActive ? "bg-white text-primary" : "text-white/85 hover:text-white"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 min-[360px]:h-4 min-[360px]:w-4" />
                      {mode.label}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHeroMode.label}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight text-white md:text-6xl lg:text-7xl">
                    {currentHeroMode.title}
                  </h1>

                  <p className="mt-5 max-w-2xl text-xl font-black leading-tight text-white md:text-2xl">
                    {currentHeroMode.lead}
                  </p>

                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
                    {currentHeroMode.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
                {currentHeroMode.variant === "compre" ? (
                  <Button
                    asChild
                    size="lg"
                    className="h-14 rounded-xl bg-white px-7 text-base font-black uppercase text-[#25292D] transition-all hover:-translate-y-0.5 hover:bg-white/95"
                  >
                    <a href={SHOPEE_STORE_URL} target="_blank" rel="noopener noreferrer">
                      <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                      {currentHeroMode.cta}
                    </a>
                  </Button>
                ) : (
                  <Button
                    onClick={() => openModal(currentHeroMode.variant)}
                    size="lg"
                    className="h-14 rounded-xl bg-white px-7 text-base font-black uppercase text-[#25292D] transition-all hover:-translate-y-0.5 hover:bg-white/95"
                  >
                    <img src={whatsappLogo} alt="" className="mr-2 h-5 w-5" />
                    {currentHeroMode.cta}
                  </Button>
                )}

                <Button
                  onClick={() => document.getElementById("modalidades")?.scrollIntoView({ behavior: "smooth" })}
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-xl border-white/55 bg-white/10 px-7 text-base font-black uppercase text-white backdrop-blur hover:bg-white hover:text-primary"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Como funciona
                </Button>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex -space-x-3">
                  <img className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" src={customer1} alt="Cliente TecPonto" />
                  <img className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" src={customer2} alt="Cliente TecPonto" />
                  <img className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" src={customer3} alt="Cliente TecPonto" />
                  <img className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" src={customer4} alt="Cliente TecPonto" />
                </div>
                <div>
                  <p className="text-sm font-black leading-none text-white">+2.000 atendimentos</p>
                  <div className="mt-1 flex items-center gap-1 text-xs font-bold text-white">
                    Avaliação 4.9 no Google <span className="text-[#FFD33D]">★★★★★</span>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid max-w-2xl grid-cols-3 gap-3 md:gap-5">
                <div className="rounded-2xl bg-white/10 p-3 text-white backdrop-blur">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="block text-3xl font-black leading-none">
                    <AnimatedCounter end={90} />
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold leading-tight text-white/80">dias de garantia</span>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-white backdrop-blur">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                    <Star className="h-4 w-4" />
                  </div>
                  <span className="block text-3xl font-black leading-none">
                    <AnimatedCounter end={8} suffix="+" />
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold leading-tight text-white/80">anos de experiência</span>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-white backdrop-blur">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="block text-3xl font-black leading-none">
                    <AnimatedCounter end={4.9} decimals={1} />
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold leading-tight text-white/80">avaliação média</span>
                </div>
              </div>

            </div>

            {/* Showcase visual sincronizado com a palavra da hero */}
            <div className="flex min-h-[360px] items-center justify-end md:min-h-[500px] lg:-mr-16 lg:min-h-[620px] xl:-mr-24 2xl:-mr-28">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative flex aspect-square w-full max-w-[500px] items-center justify-end py-6 md:max-w-[620px]"
              >
                <motion.div
                  style={{ y: heroVisualY }}
                  className="relative flex h-full w-full items-center justify-end pr-6 will-change-transform md:pr-8 lg:pr-12 xl:pr-14"
                >
                  <div
                    className="pointer-events-none absolute right-[2%] top-1/2 z-0 h-[66%] w-[78%] -translate-y-1/2 rounded-full opacity-70 blur-3xl"
                    style={{ background: "radial-gradient(circle, rgba(255, 220, 185, 0.78) 0%, rgba(255, 178, 116, 0.42) 42%, rgba(255, 178, 116, 0) 74%)" }}
                    aria-hidden="true"
                  />
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={heroVisuals[currentWordIndex].alt}
                      src={heroVisuals[currentWordIndex].image}
                      alt={heroVisuals[currentWordIndex].alt}
                      initial={{ opacity: 0, y: 24, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -24, scale: 0.96 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="relative z-10 ml-auto max-h-[480px] w-full object-contain object-right drop-shadow-[0_28px_38px_rgba(0,0,0,0.22)] md:max-h-[590px]"
                    />
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="modalidades" className="py-14 md:py-20" style={{ backgroundColor: "#F0EFF5" }}>
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-primary">Nossas modalidades</p>
              <h2 className="mt-2 text-3xl md:text-5xl font-bold text-foreground">
                Escolha o que você precisa hoje.
              </h2>
            </div>
            <p className="max-w-xl text-muted-foreground">
              Cada modalidade tem uma LP própria para conversão, mas todas fazem parte da mesma experiência TecPonto.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {modalities.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="group overflow-hidden rounded-2xl border border-border bg-background shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-strong"
                >
                  <div className="h-64 bg-primary/5">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-bold uppercase text-primary">
                      {item.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div>
              <div className="hidden">
                Nosso espaço
              </div>
              <h2 className="mx-auto mb-8 max-w-3xl text-center text-3xl font-bold leading-tight text-foreground md:text-5xl">
                Conheça onde seu celular é atendido.
              </h2>
              <p className="hidden">
                Um ambiente preparado para diagnóstico, reparo, compra e troca com atendimento direto da equipe TecPonto.
              </p>
            </div>

            <div
              className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-strong"
              onMouseEnter={() => setVideoHover(true)}
              onMouseLeave={() => setVideoHover(false)}
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                setVideoHoverPosition({
                  x: event.clientX - rect.left,
                  y: event.clientY - rect.top,
                });
              }}
            >
              <video
                className="aspect-video w-full bg-[#25292D] object-cover"
                controls
                loop
                muted
                playsInline
                preload="metadata"
                poster={shopLocation}
              >
                <source src={spaceVideoWebm} type="video/webm" />
                <source src={spaceVideoMp4} type="video/mp4" />
                Seu navegador nao suporta video.
              </video>
              <div
                className={`pointer-events-none absolute hidden items-center gap-2 rounded-full bg-background/95 px-4 py-2 text-xs font-bold uppercase text-foreground shadow-strong backdrop-blur transition-opacity duration-200 md:inline-flex ${
                  videoHover ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  left: videoHoverPosition.x,
                  top: videoHoverPosition.y,
                  transform: "translate(-50%, -140%)",
                }}
              >
                <PlayCircle className="h-4 w-4 text-primary" />
                Aperte o play
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-[#25292D] p-8 md:p-12 text-white shadow-strong">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="mb-4 flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase">Atendimento TecPonto</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold">
                  Um caminho simples para resolver seu celular.
                </h2>
                <p className="mt-4 max-w-2xl text-gray-300">
                  Fale pelo WhatsApp, diga se quer comprar, trocar ou reparar, e nossa equipe direciona você para a melhor solução.
                </p>
              </div>
              <Button asChild size="lg" className="rounded-full px-8 py-6 font-bold uppercase">
                <NavLink to="/repare">
                  Falar com a TecPonto
                  <Smartphone className="ml-2 h-4 w-4" />
                </NavLink>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Home;
