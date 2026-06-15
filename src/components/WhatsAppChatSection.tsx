import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import whatsappAssistant from "@/assets/whatsapp-assistant.png";

const messages = [
  { type: "received", text: "Olá! Bem-vindo à TecPonto! 👋", time: "14:30" },
  { type: "received", text: "Qual problema seu celular apresenta?", time: "14:30" },
];

const WhatsAppChatSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [inputValue, setInputValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const placeholders = [
    "Escreva aqui seu problema...",
    "Nos conte o que você precisa...",
  ];
  
  useEffect(() => {
    let placeholderIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typeEffect = setInterval(() => {
      const currentPlaceholder = placeholders[placeholderIndex];
      
      if (!isDeleting) {
        setPlaceholder(currentPlaceholder.substring(0, charIndex + 1));
        charIndex++;
        
        if (charIndex === currentPlaceholder.length) {
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        setPlaceholder(currentPlaceholder.substring(0, charIndex - 1));
        charIndex--;
        
        if (charIndex === 0) {
          isDeleting = false;
          placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        }
      }
    }, isDeleting ? 50 : 100);
    
    return () => clearInterval(typeEffect);
  }, []);

  const handleWhatsApp = () => {
    window.open("https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20um%20orçamento", "_blank");
  };

  return (
    <section ref={ref} id="whatsapp-chat" className="py-16 md:py-20" style={{ backgroundColor: '#F0EFF5' }}>
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
            Envie uma mensagem <span className="font-bold text-foreground">agora</span> e receba seu orçamento em <span className="font-bold text-foreground">minutos</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {/* WhatsApp Chat Mockup */}
          <div className="bg-[#e5ddd5] rounded-3xl shadow-strong overflow-hidden">
            {/* Header */}
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

            {/* Messages */}
            <div className="p-4 space-y-3 min-h-[160px] md:min-h-[200px] overflow-y-auto">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      message.type === "sent"
                        ? "bg-[#dcf8c6]"
                        : "bg-white"
                    }`}
                  >
                    <p className="text-sm text-foreground">{message.text}</p>
                    <span className="text-xs text-muted-foreground mt-1 block text-right">
                      {message.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f0f0] p-4 flex gap-2">
              <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleWhatsApp()}
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
