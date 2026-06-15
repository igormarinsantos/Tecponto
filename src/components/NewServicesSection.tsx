import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import screenRepair from "@/assets/services/screen-repair.png";
import battery from "@/assets/services/battery.png";
import internalRepair from "@/assets/services/internal-repair.png";
import software from "@/assets/services/software.png";
import speaker from "@/assets/services/speaker.png";

const services = [
  {
    image: screenRepair,
    title: "Troca de Tela",
    description: "Telas originais certificadas e de alta qualidade para todos os modelos",
  },
  {
    image: battery,
    title: "Troca de Bateria",
    description: "Bateria nova original com garantia de 90 dias",
  },
  {
    image: internalRepair,
    title: "Reparos Internos",
    description: "Placas-mãe, conectores e componentes internos especializados",
  },
  {
    image: software,
    title: "Problemas de Software",
    description: "Formatação profissional, atualização e desbloqueio seguro",
  },
  {
    image: speaker,
    title: "Alto-falante",
    description: "Troca e reparo especializado de alto-falantes e microfones",
  },
  {
    image: null,
    title: "Pronto pra consertar?",
    description: "Receba um orçamento gratuito em até 5 minutos",
    isCTA: true,
  },
];

const scrollToWhatsApp = () => {
  const element = document.getElementById("whatsapp-chat");
  element?.scrollIntoView({ behavior: "smooth" });
};

const NewServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
            <span className="text-primary">Nossas Soluções</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            <span className="font-bold text-foreground">Soluções completas e profissionais</span> para seu dispositivo móvel
          </p>
        </motion.div>

        {/* Services Grid with Photos */}
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
                  onClick={scrollToWhatsApp}
                  className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-8 rounded-2xl shadow-soft hover:shadow-strong transition-base h-full flex flex-col items-center justify-center text-center border-2 border-primary/20 overflow-hidden cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-base" />
                  
                  <h3 className="relative z-10 text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-base">
                    <span className="text-primary">Pronto pra consertar?</span>
                  </h3>
                  <p className="relative z-10 text-muted-foreground leading-relaxed text-sm mb-4">
                    <span className="font-bold text-foreground">Receba um orçamento gratuito</span> em até 5 minutos
                  </p>
                  <Button
                    className="relative z-10 bg-primary text-primary-foreground font-bold hover:scale-105 transition-base uppercase"
                  >
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  onClick={scrollToWhatsApp}
                  className="relative bg-card rounded-2xl shadow-soft hover:shadow-strong transition-base h-full overflow-hidden border border-border group cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-50" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <span className="text-primary-foreground font-bold text-base md:text-lg uppercase text-center">
                        Solicitar Orçamento
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center relative">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-base">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewServicesSection;
