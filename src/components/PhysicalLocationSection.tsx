import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import shopLocation from "@/assets/shop-location.jpg";

const PhysicalLocationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 bg-card">
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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conheça nosso espaço equipado para melhor atendê-lo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src={shopLocation}
              alt="Loja em Cumbica"
              className="w-full h-auto rounded-2xl shadow-strong"
            />
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold shadow-strong">
              Em reforma
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Endereço
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Cumbica, Guarulhos - SP
                  <br />
                  (Localização exata fornecida via WhatsApp)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Horário de Funcionamento
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Segunda a Sexta: 9h às 18h
                  <br />
                  Sábado: 9h às 14h
                  <br />
                  Domingo: Fechado
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Contato
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  WhatsApp: (11) 99999-9999
                  <br />
                  Atendimento rápido e personalizado
                </p>
              </div>
            </div>

            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg">
              <p className="text-foreground leading-relaxed">
                <span className="font-semibold">Estamos em reforma!</span> Mas
                continuamos atendendo normalmente. Entre em contato para agendar
                sua visita ou solicitar nosso serviço de busca e entrega.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PhysicalLocationSection;