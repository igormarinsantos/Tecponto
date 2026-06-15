import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import brokenPhone from "@/assets/broken-phone-hero.jpg";
import perfectPhone from "@/assets/perfect-phone.jpg";

const InteractiveHero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity1 = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [1, 0.5, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0.3, 0.7], [0.8, 1]);

  return (
    <section ref={ref} className="py-20 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
            Transformamos Defeitos em Perfeição
          </h2>
          <p className="text-xl text-secondary-foreground/80">
            Veja a diferença que podemos fazer
          </p>
        </div>

        <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
          {/* Celular Quebrado */}
          <motion.div
            style={{ opacity: opacity1, scale }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              <img
                src={brokenPhone}
                alt="Celular quebrado"
                className="w-full h-auto rounded-3xl shadow-strong"
              />
              <div className="absolute -top-6 -left-6 bg-destructive text-destructive-foreground px-6 py-3 rounded-full font-bold text-lg shadow-strong">
                ANTES
              </div>
            </div>
          </motion.div>

          {/* Celular Perfeito */}
          <motion.div
            style={{ opacity: opacity2, scale }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              <img
                src={perfectPhone}
                alt="Celular perfeito"
                className="w-full h-auto rounded-3xl shadow-strong"
              />
              <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-lg shadow-strong">
                DEPOIS
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveHero;