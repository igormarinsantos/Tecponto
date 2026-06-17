import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Maria Silva",
    text: "Excelente atendimento! Trocaram a tela do meu iPhone em menos de 2 horas. Ficou perfeito!",
    rating: 5,
  },
  {
    name: "Carlos Santos",
    text: "Preço justo e serviço de qualidade. Já indiquei para vários amigos.",
    rating: 5,
  },
  {
    name: "Ana Paula",
    text: "Meu Samsung estava com a bateria viciada. Resolveram rápido e ainda buscaram em casa. Recomendo!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleVideoHover = (isHovering: boolean) => {
    if (videoRef.current) {
      setIsMuted(!isHovering);
    }
  };

  return (
    <section ref={ref} id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Google Rating Card - Above Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-card p-4 rounded-xl shadow-soft border border-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl font-bold text-foreground">4.9</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">250+ avaliações no Google</p>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-xl text-muted-foreground">
            Qualidade comprovada por quem já confiou em nós
          </p>
        </motion.div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto items-stretch">
          {/* Left Side - Video */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative lg:w-1/3 flex-shrink-0"
          >
            <div 
              className="relative rounded-2xl overflow-hidden shadow-strong aspect-[9/16] max-h-[600px] bg-muted mx-auto max-w-sm"
              onMouseEnter={() => handleVideoHover(true)}
              onMouseLeave={() => handleVideoHover(false)}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                autoPlay
                muted={isMuted}
                playsInline
              >
                <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              </video>
              
              {/* Mute Indicator */}
              {isMuted && (
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-foreground">
                  Passe o mouse para ativar som
                </div>
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Veja o depoimento de nossos clientes satisfeitos
            </p>
          </motion.div>

          {/* Right Side - Testimonial Cards */}
          <div className="flex-1 flex flex-col">
            {/* Horizontal Carousel */}
            <div className="relative overflow-hidden flex-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative"
              >
                <div className="overflow-hidden">
                  <motion.div
                    className="flex gap-4"
                    animate={{ x: `-${currentIndex * 100}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {testimonials.map((testimonial, index) => (
                      <div
                        key={index}
                        className="min-w-full bg-card p-8 rounded-2xl shadow-soft border border-border h-full flex flex-col justify-center"
                      >
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                          ))}
                        </div>
                        <p className="text-muted-foreground mb-6 leading-relaxed italic text-lg">
                          "{testimonial.text}"
                        </p>
                        <p className="font-semibold text-foreground text-base">
                          {testimonial.name}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2 justify-center mt-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrev}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Dots Indicator */}
                <div className="flex gap-2 justify-center mt-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-base ${
                        index === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;