import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, MapPin, Shield, CreditCard, FileText, Smartphone } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    icon: Clock,
    question: "Quanto tempo demora o reparo?",
    answer: "A maioria dos reparos é feita em até 2 horas. Casos mais complexos podem levar até 24 horas, mas sempre informamos o prazo antes de iniciar.",
  },
  {
    icon: MapPin,
    question: "Vocês buscam o aparelho em casa?",
    answer: "Sim! Oferecemos serviço de busca e entrega gratuito em toda a região. Basta agendar pelo WhatsApp.",
  },
  {
    icon: Shield,
    question: "Qual a garantia dos serviços?",
    answer: "Todos os nossos reparos incluem garantia de 90 dias para peças e mão de obra. Trabalhamos apenas com componentes de qualidade.",
  },
  {
    icon: CreditCard,
    question: "Aceitam quais formas de pagamento?",
    answer: "Aceitamos dinheiro, PIX, cartões de crédito e débito. Também parcelamos em até 3x sem juros.",
  },
  {
    icon: FileText,
    question: "Fazem orçamento sem compromisso?",
    answer: "Sim! O orçamento é totalmente gratuito e sem compromisso. Avaliamos seu aparelho e apresentamos o melhor valor.",
  },
  {
    icon: Smartphone,
    question: "Atendem todas as marcas?",
    answer: "Sim! Somos especializados em Apple, Samsung, Motorola, Xiaomi, LG e outras marcas populares.",
  },
];

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} id="faq" className="py-20" style={{ backgroundColor: '#F0EFF5' }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-primary">Perguntas Frequentes</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            <span className="font-bold text-foreground">Tire suas dúvidas</span> sobre nossos serviços
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              return (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-background rounded-2xl border-2 border-border hover:border-primary/30 transition-colors px-6 shadow-soft overflow-hidden"
                >
                  <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-foreground hover:text-primary py-6 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pl-[52px]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
