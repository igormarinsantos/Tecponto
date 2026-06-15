import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import whatsappAssistant from "@/assets/whatsapp-assistant.png";
import type { LandingVariant } from "@/types/landing";

const whatsappByVariant: Record<LandingVariant, {
  headline: JSX.Element;
  messages: Array<{ type: "received" | "sent"; text: string; time: string }>;
  placeholders: string[];
  defaultMessage: string;
}> = {
  repare: {
    headline: (
      <>
        Envie uma mensagem <span className="font-bold text-foreground">agora</span> e receba seu orçamento em{" "}
        <span className="font-bold text-foreground">minutos</span>
      </>
    ),
    messages: [
      { type: "received", text: "Olá! Bem-vindo à TecPonto! 👋", time: "14:30" },
      { type: "received", text: "Qual problema seu celular apresenta?", time: "14:30" },
    ],
    placeholders: ["Escreva aqui seu problema...", "Nos conte o que você precisa..."],
    defaultMessage: "Olá! Gostaria de solicitar um orçamento para reparo de celular.",
  },
  troque: {
    headline: (
      <>
        Envie seu modelo <span className="font-bold text-foreground">agora</span> e receba uma pré-avaliação para{" "}
        <span className="font-bold text-foreground">troca</span>
      </>
    ),
    messages: [
      { type: "received", text: "Olá! Vamos avaliar seu celular para troca? 👋", time: "14:30" },
      { type: "received", text: "Me envie modelo, fotos e estado do aparelho.", time: "14:30" },
    ],
    placeholders: ["Quero trocar meu celular...", "Meu modelo é..."],
    defaultMessage: "Olá! Gostaria de avaliar meu celular para troca.",
  },
  compre: {
    headline: (
      <>
        Chame no WhatsApp e veja os <span className="font-bold text-foreground">modelos disponíveis</span> para compra
      </>
    ),
    messages: [
      { type: "received", text: "Olá! Quer ver os celulares disponíveis? 👋", time: "14:30" },
      { type: "received", text: "Me diga a marca ou faixa de preço que você procura.", time: "14:30" },
    ],
    placeholders: ["Quero comprar um celular...", "Procuro um iPhone/Samsung..."],
    defaultMessage: "Olá! Gostaria de ver os celulares disponíveis para compra.",
  },
};

type WhatsAppChatSectionProps = {
  variant?: LandingVariant;
};

const WhatsAppChatSection = ({ variant = "repare" }: WhatsAppChatSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [inputValue, setInputValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const content = whatsappByVariant[variant];

  useEffect(() => {
    let placeholderIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = window.setInterval(() => {
      const currentPlaceholder = content.placeholders[placeholderIndex];

      if (!isDeleting) {
        setPlaceholder(currentPlaceholder.substring(0, charIndex + 1));
        charIndex++;

        if (charIndex === currentPlaceholder.length) {
          window.setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        setPlaceholder(currentPlaceholder.substring(0, charIndex - 1));
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          placeholderIndex = (placeholderIndex + 1) % content.placeholders.length;
        }
      }
    }, isDeleting ? 50 : 100);

    return () => window.clearInterval(typeEffect);
  }, [content.placeholders]);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(inputValue || content.defaultMessage);
    window.open(`https://wa.me/5511999999999?text=${text}`, "_blank");
  };

  return (
    <section ref={ref} id="whatsapp-chat" className="py-16 md:py-20" style={{ backgroundColor: "#F0EFF5" }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
            <span className="text-primary">Fale Conosco</span> pelo WhatsApp
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            {content.headline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-[#e5ddd5] rounded-3xl shadow-strong overflow-hidden">
            <div className="bg-[#075e54] text-white p-4 flex items-center gap-3">
              <img
                src={whatsappAssistant}
                alt="TecPonto"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold">TecPonto</h3>
                <p className="text-xs opacity-80">Online</p>
              </div>
            </div>

            <div className="p-4 space-y-3 min-h-[160px] md:min-h-[200px] overflow-y-auto">
              {content.messages.map((message, index) => (
                <motion.div
                  key={`${message.text}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[75%] rounded-lg p-3 ${message.type === "sent" ? "bg-[#dcf8c6]" : "bg-white"}`}>
                    <p className="text-sm text-foreground">{message.text}</p>
                    <span className="text-xs text-muted-foreground mt-1 block text-right">
                      {message.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-[#f0f0f0] p-4 flex gap-2">
              <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleWhatsApp()}
                className="bg-white"
              />
              <Button
                size="icon"
                className="bg-[#075e54] hover:bg-[#064e47]"
                onClick={handleWhatsApp}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatsAppChatSection;
