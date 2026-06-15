import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import brokenPhone from "@/assets/broken-phone-hero.jpg";
import perfectPhone from "@/assets/perfect-phone.jpg";
import { useScroll, useTransform } from "framer-motion";

const QuoteTransformSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    model: "",
    problem: "",
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity1 = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [1, 0.5, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 0.5, 1]);

  const steps = [
    { number: 1, title: "Seus Dados", fields: ["name", "phone"] },
    { number: 2, title: "Dispositivo", fields: ["model"] },
    { number: 3, title: "Problema", fields: ["problem"] },
  ];

  const handleNext = () => {
    const currentStepData = steps[currentStep - 1];
    const isValid = currentStepData.fields.every(
      (field) => formData[field as keyof typeof formData]?.trim() !== ""
    );

    if (!isValid) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const message = `Olá! Gostaria de solicitar um orçamento:\n\nNome: ${formData.name}\nTelefone: ${formData.phone}\nModelo do celular: ${formData.model}\nProblema: ${formData.problem}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
    setFormData({ name: "", phone: "", model: "", problem: "" });
    setCurrentStep(1);
    toast.success("Redirecionando para o WhatsApp...");
  };

  return (
    <section
      id="quote-section"
      ref={ref}
      className="py-20 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Receba Orçamento Gratuito em Cliques
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transformamos problemas em soluções. Veja o resultado do nosso trabalho.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column - Form Steps - Simplified */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card p-8 md:p-10 rounded-2xl shadow-strong"
          >
            {/* Steps Progress - Simplified */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.map((step, idx) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-base ${
                      currentStep >= step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-1 transition-base ${
                        currentStep > step.number ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-foreground text-center mb-6">
                Passo {currentStep}: {steps[currentStep - 1].title}
              </h3>

              {currentStep === 1 && (
                <>
                  <div>
                    <Input
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="h-11"
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <div>
                  <Input
                    type="text"
                    placeholder="Modelo do celular (Ex: iPhone 13)"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    className="h-11"
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <Textarea
                    placeholder="Descreva o problema do seu celular..."
                    value={formData.problem}
                    onChange={(e) =>
                      setFormData({ ...formData, problem: e.target.value })
                    }
                    className="min-h-28 resize-none"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-primary text-primary-foreground font-semibold text-lg h-12 shadow-strong hover:scale-105 transition-base group"
                >
                  {currentStep === 3 ? "Enviar Orçamento" : "Próximo"}
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Before/After Transformation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative h-[500px] md:h-[600px] flex items-center justify-center"
          >
            {/* Celular Quebrado */}
            <motion.div
              style={{ opacity: opacity1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-full max-w-md">
                <img
                  src={brokenPhone}
                  alt="Celular quebrado"
                  className="w-full h-auto rounded-3xl shadow-strong"
                />
                <div className="absolute -top-6 -left-6 bg-destructive text-destructive-foreground px-6 py-3 rounded-full font-bold text-lg shadow-strong">
                  ANTES
                </div>
              </div>
            </motion.div>

            {/* Celular Perfeito */}
            <motion.div
              style={{ opacity: opacity2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-full max-w-md">
                <img
                  src={perfectPhone}
                  alt="Celular perfeito"
                  className="w-full h-auto rounded-3xl shadow-strong"
                />
                <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-lg shadow-strong">
                  DEPOIS
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuoteTransformSection;
