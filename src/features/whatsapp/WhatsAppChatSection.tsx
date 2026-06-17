import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppQualificationModal from "@/features/whatsapp/WhatsAppQualificationModal";
import whatsappLogo from "@/assets/icons/whatsapp-logo.svg";
import type { LandingVariant } from "@/types/landing";

type WhatsAppChatSectionProps = {
  variant?: LandingVariant;
};

const WhatsAppChatSection = ({ variant }: WhatsAppChatSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section ref={ref} id="whatsapp-chat" className="py-16 md:py-20" style={{ backgroundColor: "#F0EFF5" }}>
      <WhatsAppQualificationModal isOpen={isOpen} onClose={() => setIsOpen(false)} variant={variant} />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] shadow-soft">
            <img src={whatsappLogo} alt="WhatsApp" className="h-9 w-9 invert" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
            Atendimento guiado no WhatsApp
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Abra a conversa, responda por opções rápidas e envie sua solicitação pronta para a TecPonto.
          </p>
          <Button
            size="lg"
            onClick={() => setIsOpen(true)}
            className="mt-8 rounded-full bg-[#25D366] px-8 py-6 text-white hover:bg-[#20BA5A] font-bold uppercase"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Iniciar conversa
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatsAppChatSection;
