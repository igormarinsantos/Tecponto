import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const InfrastructureSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

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
            Nossa Infraestrutura em Cumbica
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-strong group cursor-pointer"
          onClick={() => window.open("https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20um%20orçamento", "_blank")}
        >
          <video
            className="w-full h-auto"
            controls
            loop
            muted
            preload="metadata"
            poster="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=675&fit=crop"
          >
            <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" type="video/mp4" />
            Seu navegador não suporta a tag de vídeo.
          </video>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl uppercase">
              Quero um Orçamento Agora
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InfrastructureSection;
