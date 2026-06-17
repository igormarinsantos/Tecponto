import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Smartphone, Battery, Cpu, Code, Volume2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Smartphone,
    title: "Troca de Tela",
    description: "Telas originais e de alta qualidade para todos os modelos",
  },
  {
    icon: Battery,
    title: "Troca de Bateria",
    description: "Bateria nova com garantia de 90 dias",
  },
  {
    icon: Cpu,
    title: "Reparos Internos",
    description: "Placas, conectores e componentes internos",
  },
  {
    icon: Code,
    title: "Problemas de Software",
    description: "Formatação, atualização e desbloqueio",
  },
  {
    icon: Volume2,
    title: "Alto-falante",
    description: "Troca e reparo de alto-falantes e microfones",
  },
  {
    icon: ArrowRight,
    title: "Pronto pra consertar?",
    description: "Receba um orçamento gratuito em até 5 minutos",
    isCTA: true,
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const scrollToQuote = () => {
    const quoteSection = document.getElementById("quote-section");
    quoteSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nossas Soluções
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluções completas e profissionais para seu dispositivo móvel
          </p>
        </motion.div>

        {/* Services Grid with Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {service.isCTA ? (
                <div 
                  onClick={scrollToQuote}
                  className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-8 rounded-2xl shadow-soft hover:shadow-strong transition-base h-full flex flex-col items-center justify-center text-center border-2 border-primary/20 overflow-hidden cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-base" />
                  
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-base shadow-soft">
                    {(() => {
                      const Icon = service.icon;
                      return <Icon className="h-10 w-10 text-primary" />;
                    })()}
                  </div>
                  <h3 className="relative z-10 text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-base">
                    {service.title}
                  </h3>
                  <p className="relative z-10 text-muted-foreground leading-relaxed text-sm mb-4">
                    {service.description}
                  </p>
                  <Button
                    className="relative z-10 bg-primary text-primary-foreground font-semibold shadow-strong hover:scale-105 transition-base"
                  >
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative bg-gradient-to-br from-card to-card/50 p-8 rounded-2xl shadow-soft hover:shadow-strong transition-base h-full flex flex-col items-center text-center border border-primary/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-base" />
                  
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-base shadow-soft">
                    {(() => {
                      const Icon = service.icon;
                      return <Icon className="h-10 w-10 text-primary" />;
                    })()}
                  </div>
                  <h3 className="relative z-10 text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-base">
                    {service.title}
                  </h3>
                  <p className="relative z-10 text-muted-foreground leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;