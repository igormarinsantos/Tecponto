import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, PlayCircle, RefreshCw, ShieldCheck, ShoppingBag, Smartphone, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import WhatsAppQualificationModal from "@/components/WhatsAppQualificationModal";
import type { LandingVariant } from "@/types/landing";
import brokenPhone from "@/assets/reparo.png";
import perfectPhone from "@/assets/compre.png";
import motoboy from "@/assets/troca.png";
import customer1 from "@/assets/customer-1.jpg";
import customer2 from "@/assets/customer-2.jpg";
import customer3 from "@/assets/customer-3.jpg";
import customer4 from "@/assets/customer-4.jpg";
import deviceMockupImage from "@/assets/perfect-phone.jpg";
import shopLocation from "@/assets/shop-location.jpg";
import spaceVideoMp4 from "@/assets/testimonial-video.mp4";
import spaceVideoWebm from "@/assets/testimonial-video.webm";
import { SHOPEE_STORE_URL } from "@/lib/links";

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

const words = ["reparar", "trocar", "comprar"];

const Home = () => {
  const [videoHover, setVideoHover] = useState(false);
  const [videoHoverPosition, setVideoHoverPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<LandingVariant | undefined>(undefined);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const openModal = (variant?: LandingVariant) => {
    setModalVariant(variant);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <WhatsAppButton />
      <WhatsAppQualificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant={modalVariant} />
      
      <section className="relative flex min-h-screen items-center overflow-hidden bg-primary py-16 md:py-20">

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] max-w-6xl mx-auto">
            <div className="text-left text-white">
              <h1 className="text-4xl md:text-6xl font-black leading-[1.2] tracking-tight text-white max-w-2xl min-h-[2.8em] md:min-h-[2.4em]">
                Ajudamos você a{" "}
                <span className="inline-block relative h-[1.25em] w-[140px] md:w-[220px] overflow-hidden align-middle mx-1 md:mx-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={words[currentWordIndex]}
                      initial={{ y: 28, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -28, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center rounded-2xl bg-white text-primary transform -skew-x-3 font-black text-2xl md:text-5xl"
                    >
                      {words[currentWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>{" "}
                seu celular.
              </h1>

              <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-white/85">
                Assistência especializada com garantia de 90 dias, avaliação justa no seu usado e curadoria de revisados. Simples, rápido e direto pelo WhatsApp.
              </p>

              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <Button 
                  onClick={() => openModal("repare")} 
                  size="lg" 
                  className="rounded-full bg-[#25292D] hover:bg-[#1f2327] px-8 py-6 font-bold uppercase text-white transition-all shadow-lg shadow-black/10"
                >
                  Solicitar Reparo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById("modalidades")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-full border-2 border-white bg-transparent hover:bg-white hover:text-primary px-8 py-6 font-bold uppercase text-white transition-all"
                >
                  Ver Modalidades
                </Button>
              </div>

              {/* Prova Social Clientes Atendidos e Avaliação */}
              <div className="mt-8 flex flex-row items-center gap-4 border-t border-white/10 pt-6">
                <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md shrink-0" src={customer1} alt="Cliente TecPonto" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md shrink-0" src={customer2} alt="Cliente TecPonto" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md shrink-0" src={customer3} alt="Cliente TecPonto" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md shrink-0" src={customer4} alt="Cliente TecPonto" />
                </div>
                <div className="flex flex-col text-white">
                  <span className="font-extrabold text-base md:text-lg tracking-tight leading-none">+2000 Clientes Atendidos</span>
                  <span className="flex items-center gap-1.5 text-xs md:text-sm text-white/85 font-semibold mt-1">
                    <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                    Avaliação 4.9/5 no Google
                  </span>
                </div>
              </div>

            </div>

            {/* Showcase Visual com Mockup de Celular e Pílulas Flutuantes Interativas */}
            <div className="flex justify-center lg:justify-end items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative w-full max-w-[380px] md:max-w-[420px] aspect-[4/5] flex items-center justify-center py-6"
              >
                {/* 3D Tilt Interaction Wrapper (Standard div to avoid Framer Motion override conflict) */}
                <div
                  style={{
                    transform: `perspective(1000px) rotateX(${-mousePos.y * 35}deg) rotateY(${mousePos.x * 35}deg)`,
                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    transformStyle: "preserve-3d"
                  }}
                  className="relative w-full h-full flex items-center justify-center cursor-pointer"
                >
                  {/* Orbe de luz de fundo decorativo */}
                  <div className="absolute w-[85%] h-[85%] rounded-full bg-white/10 blur-[60px] pointer-events-none" style={{ transform: "translateZ(-10px)" }} />

                  {/* Mockup do Dispositivo (Smartphone) */}
                  <div 
                    style={{
                      transform: "translateZ(30px)",
                      transformStyle: "preserve-3d"
                    }}
                    className="relative w-[65%] max-w-[260px] rounded-[2.8rem] p-2.5 bg-white/15 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden aspect-[9/19]"
                  >
                    <div 
                      style={{ transform: "translateZ(15px)" }}
                      className="w-full h-full rounded-[2.3rem] overflow-hidden border border-white/10 bg-zinc-950"
                    >
                      <img
                        src={deviceMockupImage}
                        alt="Celular TecPonto"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Floating Pill: Repare */}
                  <div 
                    className="absolute top-[18%] -left-[2%]" 
                    style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
                  >
                    <motion.button
                      onClick={() => openModal("repare")}
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3.2,
                        ease: "easeInOut"
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-lg hover:bg-white/25 hover:scale-105 active:scale-95 transition-all text-white font-bold text-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Wrench className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>Repare</span>
                    </motion.button>
                  </div>

                  {/* Floating Pill: Troque */}
                  <div 
                    className="absolute top-[45%] -right-[5%]" 
                    style={{ transform: "translateZ(90px)", transformStyle: "preserve-3d" }}
                  >
                    <motion.button
                      onClick={() => openModal("troque")}
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3.8,
                        ease: "easeInOut",
                        delay: 0.4
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-lg hover:bg-white/25 hover:scale-105 active:scale-95 transition-all text-white font-bold text-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <RefreshCw className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>Troque</span>
                    </motion.button>
                  </div>

                  {/* Floating Pill: Compre */}
                  <div 
                    className="absolute bottom-[22%] -left-[6%]" 
                    style={{ transform: "translateZ(65px)", transformStyle: "preserve-3d" }}
                  >
                    <motion.button
                      onClick={() => openModal("compre")}
                      animate={{ y: [0, -7, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3.5,
                        ease: "easeInOut",
                        delay: 0.2
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-lg hover:bg-white/25 hover:scale-105 active:scale-95 transition-all text-white font-bold text-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>Compre</span>
                    </motion.button>
                  </div>
                </div>
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
                className={`pointer-events-none absolute hidden items-center gap-2 rounded-full bg-background/95 px-4 py-2 text-xs font-bold uppercase text-foreground shadow-strong backdrop-blur transition-opacity duration-150 md:inline-flex ${
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
