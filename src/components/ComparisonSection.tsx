import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { X, Check } from "lucide-react";

const ComparisonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const comparisons = [
    {
      problem: "Falta de Garantia",
      competitor: "Sem garantia ou apenas 30 dias",
      tecponto: "90 dias de garantia completa",
    },
    {
      problem: "Preços Abusivos",
      competitor: "Preços inflacionados e taxas ocultas",
      tecponto: "Preços justos e transparentes",
    },
    {
      problem: "Peças Genéricas",
      competitor: "Peças de baixa qualidade",
      tecponto: "Peças originais e de alta qualidade",
    },
    {
      problem: "Sem Atendimento",
      competitor: "Difícil contato e sem suporte",
      tecponto: "Atendimento rápido via WhatsApp",
    },
    {
      problem: "Longas Esperas",
      competitor: "Reparos demoram dias ou semanas",
      tecponto: "Maioria dos reparos em até 2 horas",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Por Que Escolher a TecPonto?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Veja a diferença entre nós e outras assistências técnicas
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Problema
              </p>
            </div>
            <div className="text-center bg-muted/50 rounded-t-xl p-3">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Outras Lojas
              </p>
            </div>
            <div className="text-center bg-primary/10 rounded-t-xl p-3">
              <p className="text-sm font-bold text-primary uppercase tracking-wide">
                TecPonto
              </p>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="space-y-3">
            {comparisons.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="grid grid-cols-3 gap-4 items-center"
              >
                {/* Problem */}
                <div className="bg-card p-4 rounded-xl border border-border">
                  <p className="text-sm font-semibold text-foreground">
                    {item.problem}
                  </p>
                </div>

                {/* Competitor */}
                <div className="bg-muted/50 p-4 rounded-xl flex items-start gap-2">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{item.competitor}</p>
                </div>

                {/* TecPonto */}
                <div className="bg-primary/10 p-4 rounded-xl flex items-start gap-2 border-2 border-primary/20">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-foreground">{item.tecponto}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom rounded corners */}
          <div className="grid grid-cols-3 gap-4 mt-0">
            <div></div>
            <div className="bg-muted/50 rounded-b-xl h-4"></div>
            <div className="bg-primary/10 rounded-b-xl h-4"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
