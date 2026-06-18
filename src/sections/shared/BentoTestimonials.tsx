import { motion, useInView } from "framer-motion";
import { Volume2 } from "lucide-react";
import { MouseEvent, useRef, useState } from "react";
import avaliacaoHomemJovem from "@/assets/media/avaliacao-homem-jovem.mp4";
import avaliacaoMulherJovem from "@/assets/media/avaliacao-mulher-jovem.mp4";
import avaliacaoMulher from "@/assets/media/avaliacao-mulher.mp4";

const storyVideos = [
  {
    title: "Avaliação no balcão",
    description: "Cliente mostrando como foi o atendimento",
    video: avaliacaoHomemJovem,
  },
  {
    title: "Troca pelo WhatsApp",
    description: "Da conversa até a pré-avaliação",
    video: avaliacaoMulherJovem,
  },
  {
    title: "Reparo com garantia",
    description: "Experiência depois do conserto",
    video: avaliacaoMulher,
  },
];

const BentoTestimonials = () => {
  const ref = useRef(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [cursor, setCursor] = useState({ index: -1, x: 0, y: 0 });

  const handleMove = (event: MouseEvent<HTMLElement>, index: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursor({
      index,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const playVideo = (index: number, withAudio = true) => {
    const video = videoRefs.current[index];
    if (!video) return;

    video.muted = !withAudio;
    video.play().catch(() => undefined);
  };

  const muteVideo = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    video.muted = true;
  };

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
              onMouseMove={(event) => handleMove(event, index)}
              onMouseEnter={() => playVideo(index)}
              onMouseLeave={() => {
                setCursor({ index: -1, x: 0, y: 0 });
                muteVideo(index);
              }}
              onClick={() => playVideo(index)}
              className="group relative aspect-[9/16] w-[78vw] max-w-[320px] shrink-0 snap-center cursor-pointer overflow-hidden rounded-2xl border border-border bg-[#25292D] shadow-strong md:w-full md:max-w-none"
            >
              <video
                ref={(node) => {
                  videoRefs.current[index] = node;
                }}
                className="pointer-events-none h-full w-full object-cover"
                loop
                muted
                playsInline
                preload="metadata"
                disablePictureInPicture
                onContextMenu={(event) => event.preventDefault()}
              >
                <source src={story.video} type="video/mp4" />
                Seu navegador não suporta vídeo.
              </video>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 text-white">
                <h3 className="text-lg font-bold leading-tight">{story.title}</h3>
                <p className="mt-1 text-sm text-white/75">{story.description}</p>
              </div>

              <div
                className={`pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-wide text-[#25292D] shadow-strong transition-opacity duration-150 md:flex ${
                  cursor.index === index ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  left: cursor.index === index ? cursor.x : "50%",
                  top: cursor.index === index ? cursor.y : "50%",
                }}
              >
                <Volume2 className="h-3.5 w-3.5 text-primary" />
                Clique e ative o áudio
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoTestimonials;
