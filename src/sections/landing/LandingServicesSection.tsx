import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LandingVariant } from "@/types/landing";
import { getLandingContent } from "@/content/landingContent";
import type { LandingServiceItem } from "@/content/landingContent";
import { openLandingQualification } from "@/features/whatsapp/landingQualification";

type ServiceCardItem = LandingServiceItem & {
  isCTA?: boolean;
};

type LandingServicesSectionProps = {
  variant?: LandingVariant;
};

const LandingServicesSection = ({ variant = "repare" }: LandingServicesSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const content = getLandingContent(variant).services;
  const services: ServiceCardItem[] = [
    ...content.items,
    { image: "", title: content.ctaTitle, description: "", isCTA: true },
  ];

  return (
    <section ref={ref} id="services" className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center md:mb-16"
        >
          <h2 className="mb-3 text-3xl font-bold text-foreground md:mb-4 md:text-5xl">
            <span className="text-primary">{content.title}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-xl">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {service.isCTA ? (
                <div
                  onClick={openLandingQualification}
                  className="relative flex h-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 text-center shadow-soft transition-base hover:shadow-strong md:p-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-base" />

                  <h3 className="relative z-10 text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-base">
                    <span className="text-primary">{content.ctaTitle}</span>
                  </h3>
                  <p className="relative z-10 text-muted-foreground leading-relaxed text-sm mb-4">
                    {content.ctaDescription}
                  </p>
                  <Button className="relative z-10 w-full bg-primary text-primary-foreground font-bold uppercase transition-base hover:scale-105 sm:w-auto">
                    {content.ctaButton}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={openLandingQualification}
                  className="relative h-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-base hover:shadow-strong"
                >
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 md:h-48">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-50" />

                    <div className="absolute inset-0 bg-primary/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <span className="text-primary-foreground font-bold text-base md:text-lg uppercase text-center">
                        {content.ctaButton}
                      </span>
                    </div>
                  </div>

                  <div className="relative p-5 text-center md:p-6">
                    <h3 className="mb-2 text-lg font-bold text-foreground transition-base group-hover:text-primary md:mb-3 md:text-xl">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingServicesSection;
