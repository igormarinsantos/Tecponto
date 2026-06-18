import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCheck, Send } from "lucide-react";
import WhatsAppQualificationModal from "@/features/whatsapp/WhatsAppQualificationModal";
import whatsappAssistant from "@/assets/people/whatsapp-assistant.png";
import type { LandingVariant } from "@/types/landing";

type WhatsAppChatSectionProps = {
  variant?: LandingVariant;
};

const contentByVariant: Record<LandingVariant | "default", {
  title: string;
  subtitle: string;
  button: string;
  firstMessage: string;
  secondMessage: string;
  userReply: string;
}> = {
  repare: {
    title: "Resolva agora seu reparo",
    subtitle: "O Rodrigo te guia em poucas perguntas.",
    button: "Iniciar orçamento",
    firstMessage: "Oi! Sou o Rodrigo, da TecPonto. Vamos entender o que aconteceu com seu celular?",
    secondMessage: "Responda rapidinho e eu organizo seu pedido para o atendimento certo.",
    userReply: "Quero reparar meu celular",
  },
  troque: {
    title: "Avalie seu usado agora",
    subtitle: "Uma pré-avaliação simples, direto na conversa.",
    button: "Iniciar avaliação",
    firstMessage: "Oi! Sou o Rodrigo, da TecPonto. Quer usar seu celular como entrada?",
    secondMessage: "Responda poucas perguntas e eu preparo sua pré-avaliação.",
    userReply: "Quero avaliar meu usado",
  },
  compre: {
    title: "Encontre seu próximo celular",
    subtitle: "Receba o caminho certo para comprar com segurança.",
    button: "Ver opções",
    firstMessage: "Oi! Sou o Rodrigo, da TecPonto. Posso te ajudar a encontrar um celular revisado.",
    secondMessage: "Também temos nossa loja na Shopee para você ver os aparelhos disponíveis.",
    userReply: "Quero comprar um celular",
  },
  default: {
    title: "Fale com a TecPonto",
    subtitle: "Comece pelo WhatsApp e siga pelo atendimento certo.",
    button: "Iniciar conversa",
    firstMessage: "Oi! Sou o Rodrigo, da TecPonto. O que você gostaria de fazer hoje?",
    secondMessage: "Posso te ajudar com compra, troca ou reparo de celular.",
    userReply: "Quero atendimento",
  },
};

const WhatsAppChatSection = ({ variant }: WhatsAppChatSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isOpen, setIsOpen] = useState(false);
  const content = contentByVariant[variant ?? "default"];

  return (
    <section ref={ref} id="whatsapp-chat" className="py-16 md:py-20" style={{ backgroundColor: "#F0EFF5" }}>
      <WhatsAppQualificationModal isOpen={isOpen} onClose={() => setIsOpen(false)} variant={variant} />
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {content.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {content.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto w-full max-w-[430px]"
          >
            <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-strong">
              <div className="flex items-center gap-3 bg-[#25292D] px-5 py-4">
                <div className="relative">
                  <img
                    src={whatsappAssistant}
                    alt="Rodrigo - TecPonto"
                    className="h-12 w-12 rounded-full border-2 border-white/20 object-cover"
                  />
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#25292D] bg-[#25D366]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-white">Rodrigo - TecPonto</p>
                  <p className="text-[11px] font-black uppercase tracking-wide text-primary">Atendimento online</p>
                </div>
              </div>

              <div className="space-y-3 bg-[#ece5dd] p-4">
                <div className="max-w-[86%] rounded-[18px] rounded-tl-md bg-white px-4 py-3 shadow-sm">
                  <p className="text-[15px] leading-relaxed text-[#111b21]">{content.firstMessage}</p>
                  <span className="mt-1 flex justify-end text-[10px] text-gray-400">agora</span>
                </div>

                <div className="max-w-[86%] rounded-[18px] rounded-tl-md bg-white px-4 py-3 shadow-sm">
                  <p className="text-[15px] leading-relaxed text-[#111b21]">{content.secondMessage}</p>
                  <span className="mt-1 flex justify-end text-[10px] text-gray-400">agora</span>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[86%] rounded-[18px] rounded-tr-md bg-[#e7ffdb] px-4 py-3 shadow-sm">
                    <p className="text-[15px] leading-relaxed text-[#111b21]">{content.userReply}</p>
                    <span className="mt-1 flex justify-end gap-1 text-[10px] text-gray-400">
                      agora
                      <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#f0f2f5] p-3">
                <button
                  onClick={() => setIsOpen(true)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-green-500/20 transition-colors hover:bg-[#20BA5A]"
                >
                  {content.button}
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppChatSection;
