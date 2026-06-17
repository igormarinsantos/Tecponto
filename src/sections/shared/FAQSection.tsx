import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, CreditCard, FileText, MapPin, Shield, Smartphone } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { LandingVariant } from "@/types/landing";

const faqsByVariant: Record<LandingVariant, Array<{
  icon: typeof Clock;
  question: string;
  answer: string;
}>> = {
  repare: [
    { icon: Clock, question: "Quanto tempo demora o reparo?", answer: "A maioria dos reparos é feita em até 2 horas. Casos mais complexos podem levar até 24 horas, mas sempre informamos o prazo antes de iniciar." },
    { icon: MapPin, question: "Vocês buscam o aparelho em casa?", answer: "Sim! Oferecemos serviço de busca e entrega gratuito em toda a região. Basta agendar pelo WhatsApp." },
    { icon: Shield, question: "Qual a garantia dos serviços?", answer: "Todos os nossos reparos incluem garantia de 90 dias para peças e mão de obra. Trabalhamos apenas com componentes de qualidade." },
    { icon: CreditCard, question: "Aceitam quais formas de pagamento?", answer: "Aceitamos dinheiro, PIX, cartões de crédito e débito. Também parcelamos em até 3x sem juros." },
    { icon: FileText, question: "Fazem orçamento sem compromisso?", answer: "Sim! O orçamento é gratuito e sem compromisso. Avaliamos seu aparelho e apresentamos o melhor valor." },
    { icon: Smartphone, question: "Atendem todas as marcas?", answer: "Sim! Somos especializados em Apple, Samsung, Motorola, Xiaomi, LG e outras marcas populares." },
  ],
  troque: [
    { icon: Smartphone, question: "Quais aparelhos vocês aceitam na troca?", answer: "Avaliamos celulares de várias marcas. O valor depende do modelo, estado da tela, bateria, carcaça e funcionamento geral." },
    { icon: FileText, question: "Como funciona a avaliação?", answer: "Você envia modelo, fotos e detalhes pelo WhatsApp. Nossa equipe faz uma pré-avaliação e confirma o valor após checar o aparelho." },
    { icon: Shield, question: "A troca é segura?", answer: "Sim. A TecPonto confere os aparelhos tecnicamente e orienta todo o processo para você trocar com transparência." },
    { icon: CreditCard, question: "Posso usar meu celular como entrada?", answer: "Sim. O valor aprovado pode ser usado como entrada para outro aparelho disponível." },
    { icon: MapPin, question: "Preciso ir até a loja?", answer: "Você pode começar pelo WhatsApp. Dependendo da região e disponibilidade, combinamos a melhor forma de avaliar e finalizar." },
    { icon: Clock, question: "Dá para trocar no mesmo dia?", answer: "Em muitos casos sim, principalmente quando o modelo desejado está disponível e a avaliação é aprovada rapidamente." },
  ],
  compre: [
    { icon: Smartphone, question: "Os celulares são revisados?", answer: "Sim. Os aparelhos passam por checagem técnica antes de serem oferecidos para venda." },
    { icon: Shield, question: "Tem garantia?", answer: "Sim. As condições variam conforme o aparelho, e explicamos tudo antes da compra." },
    { icon: FileText, question: "Como vejo os modelos disponíveis?", answer: "Peça a lista atualizada pelo WhatsApp. Como o estoque gira, confirmamos modelos, cores e valores em tempo real." },
    { icon: CreditCard, question: "Quais formas de pagamento aceitam?", answer: "Aceitamos PIX, dinheiro, débito e crédito. As opções de parcelamento podem variar conforme o aparelho." },
    { icon: MapPin, question: "Posso retirar na loja?", answer: "Sim. Também combinamos atendimento pelo WhatsApp para você confirmar o aparelho antes de sair de casa." },
    { icon: Clock, question: "O aparelho já vem pronto para uso?", answer: "Sim. Entregamos o celular testado e preparado para você configurar seus dados." },
  ],
};

type FAQSectionProps = {
  variant?: LandingVariant;
};

const FAQSection = ({ variant = "repare" }: FAQSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const faqs = faqsByVariant[variant];

  return (
    <section ref={ref} id="faq" className="py-20" style={{ backgroundColor: "#F0EFF5" }}>
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
                  key={faq.question}
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
