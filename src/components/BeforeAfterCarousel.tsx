import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const beforeAfterItems = [
  { id: 1, title: "iPhone 12 - Tela Quebrada", before: "Tela trincada", after: "Como novo" },
  { id: 2, title: "Samsung S21 - Bateria", before: "Bateria viciada", after: "100% saúde" },
  { id: 3, title: "Xiaomi Note 10 - Câmera", before: "Câmera embaçada", after: "Perfeita" },
  { id: 4, title: "iPhone 11 - Face ID", before: "Face ID com defeito", after: "Funcionando" },
  { id: 5, title: "Motorola G9 - Display", before: "Display manchado", after: "Impecável" },
  { id: 6, title: "iPhone XR - Alto-falante", before: "Som baixo", after: "Volume total" },
];

const scrollToQuote = () => {
  const element = document.getElementById("whatsapp-chat");
  element?.scrollIntoView({ behavior: "smooth" });
};

const BeforeAfterCarousel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Antes & Depois
          </h2>
          <p className="text-xl text-muted-foreground">
            Veja a transformação que fazemos nos aparelhos
          </p>
        </motion.div>
      </div>

      {/* Infinite Carousel */}
      <div className="relative">
        <div className="flex gap-6 animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
          {[...beforeAfterItems, ...beforeAfterItems].map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group min-w-[350px] h-[500px] flex-shrink-0"
            >
              {/* Card */}
              <div className="relative h-full bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
                {/* Before/After Split */}
                <div className="flex h-full">
                  {/* Before */}
                  <div className="w-1/2 bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center p-6 border-r border-border">
                    <div className="text-center">
                      <span className="text-xs font-bold text-red-600 mb-2 block">ANTES</span>
                      <div className="w-24 h-24 bg-red-200 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-3xl">😞</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.before}</p>
                    </div>
                  </div>

                  {/* After */}
                  <div className="w-1/2 bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center p-6">
                    <div className="text-center">
                      <span className="text-xs font-bold text-green-600 mb-2 block">DEPOIS</span>
                      <div className="w-24 h-24 bg-green-200 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-3xl">🎉</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.after}</p>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary to-transparent p-6">
                  <h3 className="text-white font-bold text-center">{item.title}</h3>
                </div>

                {/* Hover Overlay with CTA */}
                <div className="absolute inset-0 bg-secondary/95 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    onClick={scrollToQuote}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Quero Meu Orçamento
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default BeforeAfterCarousel;
