import { motion, useInView } from "framer-motion";
import { Play } from "lucide-react";
import { useRef } from "react";
import testimonialVideo from "@/assets/media/testimonial-video.webm";

const storyVideos = [
  {
    title: "Marina Alves",
    description: "Depoimento em formato story",
    video: testimonialVideo,
  },
  {
    title: "Lucas Ribeiro",
    description: "Depoimento em formato story",
    video: testimonialVideo,
  },
  {
    title: "Camila Santos",
    description: "Depoimento em formato story",
    video: testimonialVideo,
  },
];

const BentoTestimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} id="testimonials" className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center md:mb-12"
        >
          <h2 className="mb-2 text-2xl font-bold text-foreground md:mb-4 md:text-4xl lg:text-5xl">
            Avaliações em vídeo
          </h2>
          <p className="text-base text-muted-foreground md:text-xl">
            Histórias reais de quem já foi atendido pela TecPonto
          </p>
        </motion.div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-auto md:grid md:max-w-5xl md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          {storyVideos.map((story, index) => (
            <motion.article
              key={story.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-[9/16] w-[78vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-[#25292D] shadow-strong md:w-full md:max-w-none"
            >
              <video
                className="h-full w-full object-cover"
                loop
                muted
                playsInline
                preload="metadata"
                controls
                onMouseEnter={(event) => {
                  event.currentTarget.muted = false;
                  event.currentTarget.play().catch(() => undefined);
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.muted = true;
                }}
              >
                <source src={story.video} type="video/webm" />
                Seu navegador não suporta vídeo.
              </video>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5 text-white">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                  <Play className="h-4 w-4 fill-white text-white" />
                </div>
                <h3 className="text-lg font-bold">{story.title}</h3>
                <p className="mt-1 text-sm text-white/75">{story.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoTestimonials;
