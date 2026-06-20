import { useEffect, useState } from "react";
import type { PointerEvent } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, CheckCircle2, RefreshCw, ShieldCheck, ShoppingBag, Smartphone, Star, Wrench, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/layouts/Footer";
import WhatsAppButton from "@/features/whatsapp/WhatsAppButton";
import WhatsAppQualificationModal from "@/features/whatsapp/WhatsAppQualificationModal";
import type { LandingVariant } from "@/types/landing";
import brokenPhone from "@/assets/devices/reparo.png";
import perfectPhone from "@/assets/devices/compre.png";
import motoboy from "@/assets/devices/troca.png";
import homeHeroCompre from "@/assets/devices/home-hero-compre.webp";
import homeHeroRepare from "@/assets/devices/home-hero-repare.webp";
import homeHeroTroque from "@/assets/devices/home-hero-troque.webp";
import customer1 from "@/assets/people/customer-1.jpg";
import customer2 from "@/assets/people/customer-2.jpg";
import customer3 from "@/assets/people/customer-3.jpg";
import customer4 from "@/assets/people/customer-4.jpg";
import whatsappLogo from "@/assets/icons/whatsapp-logo.svg";
import { SHOPEE_STORE_URL } from "@/constants/links";

const modalities = [
  {
    title: "Compre",
    path: SHOPEE_STORE_URL,
    external: true,
    icon: ShoppingBag,
    description: "Celulares revisados pela TecPonto, testados e prontos para uso.",
    image: perfectPhone,
    cta: "Ver aparelhos",
  },
  {
    title: "Troque",
    path: "/troque",
    icon: RefreshCw,
    description: "Use seu celular usado como entrada e veja opções melhores para seu dia a dia.",
    image: motoboy,
    cta: "Avaliar troca",
  },
  {
    title: "Repare",
    path: "/repare",
    icon: Wrench,
    description: "Conserto de celular com diagnóstico rápido, garantia e suporte técnico.",
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
  {
    image: homeHeroRepare,
    alt: "Celular com tela quebrada em uma mão para reparo TecPonto",
    frameClass: "items-end justify-end pr-0 md:translate-y-20 md:pr-0 lg:pr-0",
    imageClass: "left-auto right-[-20px] h-[390px] w-auto max-w-none object-contain md:top-28 md:right-auto md:h-auto md:max-h-[780px] md:ml-auto md:w-[90%] lg:max-h-[880px] lg:w-[70%]",
    glowClass: "bottom-[-4%] right-[-12%] h-[88%] w-[94%] md:right-[-4%] md:top-[55%] md:h-[92%] md:w-[72%] md:-translate-y-1/2",
  },
  {
    image: homeHeroTroque,
    alt: "Celular usado e celular novo em uma mão para troca TecPonto",
    frameClass: "items-end justify-end pr-0 md:translate-y-20 md:pr-0 lg:pr-0",
    imageClass: "left-auto right-[-20px] h-[388px] w-auto max-w-none object-contain md:bottom-auto md:top-28 md:right-auto md:h-auto md:max-h-[740px] md:ml-auto md:w-[88%] lg:max-h-[820px] lg:w-[66%]",
    glowClass: "bottom-[-5%] right-[-10%] h-[86%] w-[96%] md:right-[-3%] md:top-[55%] md:h-[90%] md:-translate-y-1/2 md:w-[68%]",
  },
  {
    image: homeHeroCompre,
    alt: "Celular e acessórios TecPonto apoiados em uma mão",
    frameClass: "items-end justify-end pr-0 md:translate-y-8 md:items-center md:pr-0 lg:pr-0 2xl:translate-y-20",
    imageClass: "bottom-[21px] left-auto right-[-20px] h-[374px] w-auto max-w-none object-contain md:bottom-auto md:right-auto md:h-auto md:max-h-[700px] md:ml-auto md:w-[82%] lg:max-h-[740px] lg:w-[60%] 2xl:translate-x-[7%]",
    glowClass: "bottom-[-6%] right-[-12%] h-[82%] w-[94%] md:right-[-2%] md:top-[57%] md:h-[78%] md:-translate-y-1/2 md:w-[62%]",
  },
];

const heroModes = [
  {
    label: "Reparo",
    variant: "repare" as const,
    icon: Wrench,
    title: "Compra, troca e reparo de celular em Guarulhos.",
    lead: "Repare com garantia e atendimento rápido.",
    description: "Consertamos celulares com diagnóstico direto, peças de qualidade e garantia de 90 dias. Receba seu orçamento pelo WhatsApp.",
    cta: "Solicitar reparo",
  },
  {
    label: "Troca",
    variant: "troque" as const,
    icon: RefreshCw,
    title: "Use seu celular usado como entrada.",
    lead: "Troque com avaliação clara e segura.",
    description: "Avaliamos seu aparelho, orientamos a troca e mostramos opções revisadas para você evoluir de modelo com mais confiança.",
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<LandingVariant | undefined>(undefined);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [heroCycle, setHeroCycle] = useState(0);
  const currentHeroMode = heroModes[currentWordIndex];
  const currentHeroVisual = heroVisuals[currentWordIndex];
  const heroPointerY = useMotionValue(0);
  const heroVisualY = useSpring(heroPointerY, {
    stiffness: 70,
    damping: 18,
    mass: 0.8,
  });


  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setCurrentWordIndex((prev) => (prev + 1) % heroModes.length);
    }, 4000);
    return () => window.clearTimeout(timeout);
  }, [currentWordIndex, heroCycle]);

  const openModal = (variant?: LandingVariant) => {
    setModalVariant(variant);
    setIsModalOpen(true);
  };

  const selectHeroMode = (index: number) => {
    setCurrentWordIndex(index);
    setHeroCycle((cycle) => cycle + 1);
  };

  const handleHeroPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(max-width: 767px)").matches) {
      heroPointerY.set(0);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const pointerY = (event.clientY - rect.top) / rect.height;
    const parallaxRange = currentHeroMode.variant === "compre" ? 40 : 96;
    heroPointerY.set((pointerY - 0.5) * parallaxRange);
  };

  return (
    <main className="min-h-screen bg-background">
      <WhatsAppButton />
      <WhatsAppQualificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant={modalVariant} />
      
      <section
        className="relative m-[10px] flex min-h-[calc(100svh-20px)] items-start overflow-hidden rounded-[24px] bg-[#FF4B00] md:min-h-[calc(100dvh-20px)] md:items-center md:rounded-[30px] md:py-20"
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={() => heroPointerY.set(0)}
      >

        <div className="container relative z-10 mx-auto min-h-[calc(100svh-20px)] px-5 md:min-h-0 md:px-4">
          <div className="relative mx-auto grid min-h-[calc(100svh-20px)] max-w-[1360px] content-start pb-[416px] pt-20 md:min-h-0 md:items-center md:gap-10 md:pb-0 md:pt-0 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="relative z-20 p-0 text-left text-white md:p-2">
              <div className="mb-5 grid w-full max-w-full grid-cols-3 overflow-hidden rounded-full bg-[#25292D] p-1 md:mb-6 md:inline-flex md:w-auto md:overflow-visible">
                {heroModes.map((mode, index) => {
                  const Icon = mode.icon;
                  const isActive = index === currentWordIndex;
                  return (
                    <button
                      key={mode.label}
                      type="button"
                      onClick={() => selectHeroMode(index)}
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
                  <h1 className="max-w-3xl text-[2.45rem] font-black leading-[0.98] tracking-tight text-white min-[390px]:text-5xl md:text-6xl lg:text-7xl">
                    {currentHeroMode.title}
                  </h1>

                  <p className="mt-4 max-w-2xl text-lg font-black leading-tight text-white md:mt-5 md:text-2xl">
                    {currentHeroMode.lead}
                  </p>

                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 md:text-lg">
                    {currentHeroMode.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-7 md:gap-4">
                {currentHeroMode.variant === "compre" ? (
                  <Button
                    asChild
                    size="lg"
                    className="h-[52px] w-full rounded-xl bg-white px-5 text-sm font-black uppercase text-[#25292D] transition-all hover:-translate-y-0.5 hover:bg-white/95 sm:h-14 sm:w-auto sm:px-7 sm:text-base"
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
                    className="h-[52px] w-full rounded-xl bg-white px-5 text-sm font-black uppercase text-[#25292D] transition-all hover:-translate-y-0.5 hover:bg-white/95 sm:h-14 sm:w-auto sm:px-7 sm:text-base"
                  >
                    <img src={whatsappLogo} alt="" className="mr-2 h-5 w-5" />
                    {currentHeroMode.cta}
                  </Button>
                )}

                <Button
                  onClick={() => document.getElementById("modalidades")?.scrollIntoView({ behavior: "smooth" })}
                  size="lg"
                  variant="outline"
                  className="h-[52px] w-full rounded-xl border-white/55 bg-white/10 px-5 text-sm font-black uppercase text-white backdrop-blur hover:bg-white hover:text-primary sm:h-14 sm:w-auto sm:px-7 sm:text-base"
                >
                  Como funciona
                </Button>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex shrink-0 -space-x-3">
                  <img className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" src={customer1} alt="Cliente TecPonto" />
                  <img className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" src={customer2} alt="Cliente TecPonto" />
                  <img className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" src={customer3} alt="Cliente TecPonto" />
                  <img className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" src={customer4} alt="Cliente TecPonto" />
                </div>
                <div className="min-w-0">
                  <p className="whitespace-nowrap text-[13px] font-black leading-none text-white min-[390px]:text-sm">+2.000 Clientes Atendidos</p>
                  <div className="mt-1 flex items-center gap-1 whitespace-nowrap text-[11px] font-bold text-white/85 min-[390px]:text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 fill-emerald-500 text-white" />
                    <span>Avaliação 4.9/5 no Google</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid max-w-2xl grid-cols-3 gap-2 md:mt-7 md:gap-5">
                <div className="rounded-2xl bg-white/10 p-2.5 text-white backdrop-blur md:p-3">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 md:h-9 md:w-9">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="block text-2xl font-black leading-none md:text-3xl">
                    <AnimatedCounter end={90} />
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold leading-tight text-white/80">dias de garantia</span>
                </div>
                <div className="rounded-2xl bg-white/10 p-2.5 text-white backdrop-blur md:p-3">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 md:h-9 md:w-9">
                    <Star className="h-4 w-4" />
                  </div>
                  <span className="block text-2xl font-black leading-none md:text-3xl">
                    <AnimatedCounter end={8} suffix="+" />
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold leading-tight text-white/80">anos de experiência</span>
                </div>
                <div className="rounded-2xl bg-white/10 p-2.5 text-white backdrop-blur md:p-3">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 md:h-9 md:w-9">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="block text-2xl font-black leading-none md:text-3xl">
                    <AnimatedCounter end={4.9} decimals={1} />
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold leading-tight text-white/80">avaliação média</span>
                </div>
              </div>

            </div>

            {/* Showcase visual sincronizado com a palavra da hero */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex h-[416px] items-end justify-center pt-0 md:pointer-events-auto md:inset-y-0 md:left-0 md:right-[calc((100vw-20px-100%)/-2)] md:h-full md:justify-end md:pt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative flex h-full w-full items-end justify-end overflow-visible py-0"
              >
                <motion.div
                  style={{ y: heroVisualY }}
                  className="relative h-full w-full overflow-visible will-change-transform"
                >
                  <AnimatePresence initial={false} mode="sync">
                    <motion.div
                      key={currentHeroVisual.alt}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.65, ease: "easeInOut" }}
                      className={`absolute inset-0 flex overflow-visible ${currentHeroVisual.frameClass}`}
                    >
                      <div
                        className={`pointer-events-none absolute z-0 rounded-full opacity-100 blur-[48px] saturate-150 md:blur-[64px] ${currentHeroVisual.glowClass}`}
                        style={{ background: "radial-gradient(circle, rgba(255, 251, 235, 1) 0%, rgba(255, 221, 128, 0.98) 26%, rgba(255, 142, 35, 0.88) 50%, rgba(255, 75, 0, 0) 78%)" }}
                        aria-hidden="true"
                      />
                      <img
                        src={currentHeroVisual.image}
                        alt={currentHeroVisual.alt}
                        className={`absolute bottom-0 z-10 origin-right object-contain drop-shadow-[0_28px_38px_rgba(0,0,0,0.22)] md:relative md:bottom-auto md:right-auto md:ml-auto 2xl:scale-110 ${currentHeroVisual.imageClass}`}
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="modalidades" className="py-12 md:py-20" style={{ backgroundColor: "#F0EFF5" }}>
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-primary">Nossas modalidades</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground md:text-5xl">
                Escolha o que você precisa hoje.
              </h2>
            </div>
            <p className="max-w-xl text-muted-foreground">
              Escolha se quer consertar, trocar seu usado ou comprar um celular revisado com atendimento TecPonto.
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
                  <div className="h-48 bg-primary/5 md:h-64">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5 md:p-6">
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

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-[#25292D] p-6 text-white shadow-strong md:p-12">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="mb-4 flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase">Atendimento TecPonto</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold">
                  Um caminho simples para resolver seu celular.
                </h2>
                <p className="mt-4 max-w-2xl text-sm text-gray-300 md:text-base">
                  Fale pelo WhatsApp, diga se quer comprar, trocar ou reparar, e nossa equipe direciona você para o atendimento certo.
                </p>
              </div>
              <Button asChild size="lg" className="w-full rounded-full px-8 py-6 font-bold uppercase md:w-auto">
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
