import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CustomRepairForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [problem, setProblem] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !problem) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const message = `Olá! Meu nome é ${name}.\n\nPreciso de um reparo personalizado:\n${problem}\n\nMeu telefone: ${phone}`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, "_blank");
    
    toast({
      title: "Redirecionando...",
      description: "Você será direcionado para o WhatsApp.",
    });

    setName("");
    setPhone("");
    setProblem("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-card p-8 rounded-2xl shadow-strong max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Não encontrou seu problema?
        </h3>
        <p className="text-muted-foreground">
          Descreva o problema e envie para nosso WhatsApp
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Input
            placeholder="Seu telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Textarea
            placeholder="Descreva o problema do seu aparelho..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full min-h-[100px]"
          />
        </div>

        <Button
          type="submit"
          className="w-full gradient-hero text-primary-foreground font-semibold group"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Enviar para WhatsApp
        </Button>
      </form>
    </motion.div>
  );
};

export default CustomRepairForm;
