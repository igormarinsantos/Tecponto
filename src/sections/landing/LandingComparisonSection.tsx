import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import phoneAntes from "@/assets/devices/phone-antes.png";
import phoneDepois from "@/assets/devices/phone-depois.png";
import type { LandingVariant } from "@/types/landing";

type LandingComparisonSectionProps = {
  variant?: LandingVariant;
};

const tradeComparisonRows = [
  {
    other: "Avaliação pouco clara do usado",
    tecponto: "Pré-avaliação objetiva pelo WhatsApp",
  },
  {
    other: "Proposta confusa na hora da troca",
    tecponto: "Seu usado pode entrar como parte do pagamento",
  },
  {
    other: "Aparelhos sem histórico de revisão",
    tecponto: "Modelos selecionados e conferidos pela equipe",
  },
  {
    other: "Atendimento sem orientação sobre próximo aparelho",
    tecponto: "Indicação de opções conforme seu uso e orçamento",
  },
];

const LandingComparisonSection = ({ variant = "repare" }: LandingComparisonSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    const updateScrollPosition = () => {
      animationFrame.current = null;
      const section = ref.current as HTMLElement | null;
      if (!section) return;
      
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Animation starts when section is 80% visible and completes when it passes viewport center
      // This makes the transition much slower and smoother
      const animationStartPoint = windowHeight * 0.8; // Start when 80% down viewport
      const animationEndPoint = -sectionHeight * 0.3; // End when section is 30% past top
      
      // Calculate progress based on section position
      if (sectionTop <= animationStartPoint) {
        const totalScrollDistance = animationStartPoint - animationEndPoint;
        const currentScrollPosition = animationStartPoint - sectionTop;
        const scrollProgress = Math.max(0, Math.min(1, currentScrollPosition / totalScrollDistance));
        const nextPosition = Math.round(scrollProgress * 1000) / 10;
        setScrollPosition((current) => current === nextPosition ? current : nextPosition);
      } else {
        // Section hasn't started animation yet
        setScrollPosition((current) => current === 0 ? current : 0);
      }
    };

    const handleScroll = () => {
      if (animationFrame.current === null) {
        animationFrame.current = window.requestAnimationFrame(updateScrollPosition);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollPosition();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  if (variant === "troque") {
    return (
      <section ref={ref} className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Por Que Trocar com a TecPonto?
            </h2>
            <p className="text-xl text-muted-foreground">
              Compare e entenda a diferença na hora de usar seu celular como entrada
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
          >
            <div className="grid grid-cols-2 border-b border-border bg-muted/30">
              <div className="px-4 py-5 text-center text-sm font-bold uppercase text-muted-foreground md:text-base">
                Outras Lojas
              </div>
              <div className="border-l border-border px-4 py-5 text-center text-sm font-bold uppercase text-primary md:text-base">
                TecPonto
              </div>
            </div>

            {tradeComparisonRows.map((row, index) => (
              <div key={row.tecponto} className={`grid grid-cols-2 ${index > 0 ? "border-t border-border" : ""}`}>
                <div className="flex items-center gap-3 px-4 py-5 md:px-6">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="text-sm leading-relaxed text-muted-foreground md:text-base">{row.other}</span>
                </div>
                <div className="flex items-center gap-3 border-l border-border bg-primary/5 px-4 py-5 md:px-6">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium leading-relaxed text-foreground md:text-base">{row.tecponto}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Por Que Escolher a TecPonto?
          </h2>
          <p className="text-xl text-muted-foreground">
            Compare e veja a diferença
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Outras Lojas Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-muted-foreground text-center mb-8">
                Outras Lojas
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <X className="w-5 h-5 text-destructive" />
                  </div>
                  <span className="text-muted-foreground">Sem garantia ou apenas 30 dias</span>
                </div>
                
                <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <X className="w-5 h-5 text-destructive" />
                  </div>
                  <span className="text-muted-foreground">Peças genéricas</span>
                </div>
                
                <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <X className="w-5 h-5 text-destructive" />
                  </div>
                  <span className="text-muted-foreground">Você precisa levar até a loja</span>
                </div>
                
                <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <X className="w-5 h-5 text-destructive" />
                  </div>
                  <span className="text-muted-foreground">Demora de dias ou semanas</span>
                </div>
              </div>
            </motion.div>

            {/* Before/After Device - Center Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="relative w-full aspect-[9/16] max-w-xs mx-auto rounded-3xl overflow-hidden">
                {/* Antes Image (quebrado) - Base layer */}
                <img 
                  src={phoneAntes} 
                  alt="Celular quebrado"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                
                {/* Depois Image (consertado) with sliding reveal */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ 
                    clipPath: `inset(0 ${100 - scrollPosition}% 0 0)`
                  }}
                >
                  <img 
                    src={phoneDepois} 
                    alt="Celular consertado"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
                
                {/* Slider Line */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-primary"
                  style={{ 
                    left: `${scrollPosition}%`,
                    transition: 'left 0.1s ease-out'
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full" />
                  </div>
                </div>
              </div>
              
              {/* Labels */}
              <div className="flex justify-between mt-4 px-4">
                <span className="text-sm font-semibold text-primary">Antes</span>
                <span className="text-sm font-semibold text-primary">Depois</span>
              </div>
            </motion.div>

            {/* TecPonto Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-primary text-center mb-8">
                TecPonto
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4 border-2 border-primary/20">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Garantia de 90 dias</span>
                </div>
                
                <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4 border-2 border-primary/20">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Peças de qualidade</span>
                </div>
                
                <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4 border-2 border-primary/20">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Busca e entrega grátis</span>
                </div>
                
                <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4 border-2 border-primary/20">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Reparo em até 2 horas</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingComparisonSection;
