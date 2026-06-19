import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCheck, Send } from "lucide-react";
import WhatsAppQualificationModal from "@/features/whatsapp/WhatsAppQualificationModal";
import whatsappAssistant from "@/assets/people/whatsapp-assistant.png";
import type { LandingVariant } from "@/types/landing";
import { defaultWhatsAppChatContent, getLandingContent } from "@/content/landingContent";

type WhatsAppChatSectionProps = {
  variant?: LandingVariant;
};

const WhatsAppChatSection = ({ variant }: WhatsAppChatSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isOpen, setIsOpen] = useState(false);
  const content = variant ? getLandingContent(variant).whatsappChat : defaultWhatsAppChatContent;

  return (
    <section ref={ref} id="whatsapp-chat" className="py-12 md:py-20" style={{ backgroundColor: "#F0EFF5" }}>
      <WhatsAppQualificationModal isOpen={isOpen} onClose={() => setIsOpen(false)} variant={variant} />
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {content.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-lg">
              {content.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto w-full max-w-[430px] px-0"
          >
            <div className="overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-strong md:rounded-[2rem]">
              <div className="flex items-center gap-3 bg-[#25292D] px-4 py-3 md:px-5 md:py-4">
                <div className="relative">
                  <img
                    src={whatsappAssistant}
                    alt="Rodrigo - TecPonto"
                    className="h-11 w-11 rounded-full border-2 border-white/20 object-cover md:h-12 md:w-12"
                  />
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#25292D] bg-[#25D366]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-white">Rodrigo - TecPonto</p>
                  <p className="text-[11px] font-black uppercase tracking-wide text-primary">Atendimento online</p>
                </div>
              </div>

              <div className="space-y-3 bg-[#ece5dd] p-3 md:p-4">
                <div className="max-w-[86%] rounded-[18px] rounded-tl-md bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm leading-relaxed text-[#111b21] md:text-[15px]">{content.firstMessage}</p>
                  <span className="mt-1 flex justify-end text-[10px] text-gray-400">agora</span>
                </div>

                <div className="max-w-[86%] rounded-[18px] rounded-tl-md bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm leading-relaxed text-[#111b21] md:text-[15px]">{content.secondMessage}</p>
                  <span className="mt-1 flex justify-end text-[10px] text-gray-400">agora</span>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[86%] rounded-[18px] rounded-tr-md bg-[#e7ffdb] px-4 py-3 shadow-sm">
                    <p className="text-sm leading-relaxed text-[#111b21] md:text-[15px]">{content.userReply}</p>
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
