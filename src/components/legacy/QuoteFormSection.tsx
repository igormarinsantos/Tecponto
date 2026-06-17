import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Send } from "lucide-react";
import { toast } from "sonner";

const QuoteFormSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    problem: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    if (!formData.name || !formData.model || !formData.problem) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // Criar mensagem para WhatsApp
    const message = `Olá! Gostaria de solicitar um orçamento:\n\nNome: ${formData.name}\nModelo do celular: ${formData.model}\nProblema: ${formData.problem}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, "_blank");
    
    // Resetar formulário
    setFormData({ name: "", model: "", problem: "" });
    toast.success("Redirecionando para o WhatsApp...");
  };

  return (
    <section
      id="quote-section"
      ref={ref}
      className="py-20 bg-card relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full mb-6">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Resposta em até 5 minutos</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Receba seu orçamento gratuito
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Preencha o formulário e entraremos em contato rapidamente, sem compromisso.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-background p-8 md:p-12 rounded-2xl shadow-strong space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                Seu nome
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 text-lg"
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-semibold text-foreground mb-2">
                Modelo do celular
              </label>
              <Input
                id="model"
                type="text"
                placeholder="Ex: iPhone 13, Samsung Galaxy S21"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="h-12 text-lg"
              />
            </div>

            <div>
              <label htmlFor="problem" className="block text-sm font-semibold text-foreground mb-2">
                Qual o problema?
              </label>
              <Textarea
                id="problem"
                placeholder="Descreva o problema do seu celular..."
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                className="min-h-32 text-lg resize-none"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gradient-hero text-primary-foreground font-semibold text-lg h-14 shadow-strong hover:scale-105 transition-base group"
            >
              <Send className="mr-2 group-hover:translate-x-1 transition-transform" />
              Solicitar orçamento agora
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Ao enviar, você será redirecionado para o WhatsApp
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default QuoteFormSection;