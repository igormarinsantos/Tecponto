import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const stats = [
    {
      number: 1000,
      suffix: "+",
      label: "Clientes Satisfeitos",
    },
    {
      number: 8,
      suffix: "+",
      label: "Anos de Experiência",
    },
    {
      number: 4.9,
      suffix: "",
      label: "Avaliação Média",
    },
  ];
  
  const [counts, setCounts] = useState(stats.map(() => 0));
  
  useEffect(() => {
    if (!isInView) return;
    
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    
    stats.forEach((stat, index) => {
      let currentStep = 0;
      const increment = stat.number / steps;
      
      const timer = setInterval(() => {
        currentStep++;
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = Math.min(increment * currentStep, stat.number);
          return newCounts;
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    });
  }, [isInView]);

  return (
    <section ref={ref} className="py-6 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className="flex items-center gap-2"
            >
              <h3 className="text-xl md:text-2xl font-bold text-primary">
                {stat.number % 1 === 0 
                  ? Math.floor(counts[index]) 
                  : counts[index].toFixed(1)}{stat.suffix}
              </h3>
              <p className="text-muted-foreground text-xs font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
