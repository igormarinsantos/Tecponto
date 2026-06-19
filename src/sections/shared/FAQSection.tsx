import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { LandingVariant } from "@/types/landing";
import { getLandingContent } from "@/content/landingContent";

type FAQSectionProps = {
  variant?: LandingVariant;
};

const FAQSection = ({ variant = "repare" }: FAQSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const faqs = getLandingContent(variant).faq;

  return (
    <section ref={ref} id="faq" className="py-12 md:py-20" style={{ backgroundColor: "#F0EFF5" }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center md:mb-12"
        >
          <h2 className="mb-3 text-3xl font-bold text-foreground md:mb-4 md:text-5xl">
            <span className="text-primary">Perguntas Frequentes</span>
          </h2>
          <p className="text-base text-muted-foreground md:text-xl">
            <span className="font-bold text-foreground">Tire suas dúvidas</span> sobre reparo, troca, compra e garantia
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              return (
                <AccordionItem
                  key={faq.question}
                  value={`item-${index}`}
                  className="overflow-hidden rounded-2xl border-2 border-border bg-background px-4 shadow-soft transition-colors hover:border-primary/30 md:px-6"
                >
                  <AccordionTrigger className="py-4 text-left text-sm font-semibold text-foreground hover:text-primary hover:no-underline md:py-6 md:text-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 md:h-10 md:w-10">
                        <Icon className="h-4 w-4 text-primary md:h-5 md:w-5" />
                      </div>
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-0 text-sm leading-relaxed text-muted-foreground md:pb-6 md:pl-[52px] md:text-base">
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
