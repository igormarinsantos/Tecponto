import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import brokenPhoneHero from "@/assets/broken-phone-hero.jpg";
import customer1 from "@/assets/customer-1.jpg";
import customer2 from "@/assets/customer-2.jpg";
import customer3 from "@/assets/customer-3.jpg";
import customer4 from "@/assets/customer-4.jpg";
import { ArrowRight, DollarSign, Clock, Truck, Shield, MapPin } from "lucide-react";

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [brokenPhoneHero]; // Adicione a segunda imagem quando disponível
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const scrollToQuote = () => {
    const quoteSection = document.getElementById("quote-section");
    quoteSection?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    { icon: DollarSign, title: "Preço Justo", description: "Melhor custo-benefício" },
    { icon: Clock, title: "Orçamento em 5min", description: "Resposta rápida" },
    { icon: Truck, title: "Leva e Traz", description: "Busca e entrega grátis" },
    { icon: Shield, title: "Garantia", description: "90 dias de cobertura" },
  ];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft border border-primary/20"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Guarulhos, SP</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Seu celular com defeito?
              <br />
              <span className="text-primary">Nós resolvemos!</span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground"
            >
              Troca rápida, preço justo e orçamento gratuito em até 5 minutos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Button
                size="lg"
                onClick={scrollToQuote}
                className="bg-primary text-primary-foreground font-semibold text-lg px-8 py-6 h-auto shadow-strong hover:scale-105 transition-base group pulse-ring"
              >
                Peça seu orçamento gratuito
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[customer1, customer2, customer3, customer4].map((customer, i) => (
                    <motion.img
                      key={i}
                      src={customer}
                      alt={`Cliente ${i + 1}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                      className="w-10 h-10 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">+2000 clientes</p>
                  <p className="text-xs text-muted-foreground">confiam em nós</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image with Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <motion.img
                key={currentImage}
                src={images[currentImage]}
                alt="Celular com defeito"
                className="w-full h-auto object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              
              {/* Feature Cards Overlay - Organic Layout */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top Left */}
                {features[0] && (
                  <motion.div
                    initial={{ opacity: 0, x: -20, y: -20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-strong pointer-events-auto hover:scale-105 transition-base"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {(() => {
                          const Icon = features[0].icon;
                          return <Icon className="h-4 w-4 text-primary" />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs text-foreground leading-tight">
                          {features[0].title}
                        </h3>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {features[0].description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Top Right */}
                {features[1] && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, y: -20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-strong pointer-events-auto hover:scale-105 transition-base"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {(() => {
                          const Icon = features[1].icon;
                          return <Icon className="h-4 w-4 text-primary" />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs text-foreground leading-tight">
                          {features[1].title}
                        </h3>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {features[1].description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bottom Left */}
                {features[2] && (
                  <motion.div
                    initial={{ opacity: 0, x: -20, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-strong pointer-events-auto hover:scale-105 transition-base"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {(() => {
                          const Icon = features[2].icon;
                          return <Icon className="h-4 w-4 text-primary" />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs text-foreground leading-tight">
                          {features[2].title}
                        </h3>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {features[2].description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bottom Right */}
                {features[3] && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-strong pointer-events-auto hover:scale-105 transition-base"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {(() => {
                          const Icon = features[3].icon;
                          return <Icon className="h-4 w-4 text-primary" />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs text-foreground leading-tight">
                          {features[3].title}
                        </h3>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {features[3].description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;