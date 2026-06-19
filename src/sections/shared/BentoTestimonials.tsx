import { motion, useInView } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import avaliacaoHomemJovem from "@/assets/media/avaliacao-homem-jovem.mp4";
import avaliacaoMulherJovem from "@/assets/media/avaliacao-mulher-jovem.mp4";
import avaliacaoMulher from "@/assets/media/avaliacao-mulher.mp4";

const storyVideos = [
  {
    title: "Rafael Martins",
    description: "Cliente mostrando como foi o atendimento",
    video: avaliacaoHomemJovem,
  },
  {
    title: "Camila Ferreira",
    description: "Da conversa até a pré-avaliação",
    video: avaliacaoMulherJovem,
  },
  {
    title: "Juliana Rocha",
    description: "Experiência depois do conserto",
    video: avaliacaoMulher,
  },
];

const BentoTestimonials = () => {
  const ref = useRef(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [audioIndex, setAudioIndex] = useState(-1);

  const playVideo = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    video.muted = audioIndex !== index;
    video.play().catch(() => undefined);
  };

  const toggleAudio = (index: number) => {
    const nextAudioIndex = audioIndex === index ? -1 : index;
    setAudioIndex(nextAudioIndex);

    videoRefs.current.forEach((video, videoIndex) => {
      if (!video) return;
      video.muted = videoIndex !== nextAudioIndex;
      if (videoIndex === index) video.play().catch(() => undefined);
    });
  };

  return (
    <section ref={ref} id="testimonials" className="bg-background py-12 md:py-20">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center md:mb-12"
        >
          <h2 className="mb-2 text-3xl font-bold text-foreground md:mb-4 md:text-4xl lg:text-5xl">
            Avaliações em vídeo
          </h2>
          <p className="text-sm text-muted-foreground md:text-xl">
            Histórias reais de quem já foi atendido pela TecPonto
          </p>
        </motion.div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:w-full md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {storyVideos.map((story, index) => (
            <motion.article
              key={story.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => {
                setHoveredIndex(index);
                playVideo(index);
              }}
              onMouseLeave={() => {
                setHoveredIndex(-1);
              }}
              onClick={() => toggleAudio(index)}
              className="group relative aspect-[9/16] w-[76vw] max-w-[300px] shrink-0 snap-center cursor-pointer overflow-hidden rounded-2xl border border-border bg-[#25292D] shadow-strong sm:w-[58vw] md:w-full md:max-w-none"
            >
              <video
                ref={(node) => {
                  videoRefs.current[index] = node;
                }}
                className="pointer-events-none h-full w-full object-cover"
                loop
                muted={audioIndex !== index}
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

              <button
                type="button"
                aria-label={audioIndex === index ? `Mutar video de ${story.title}` : `Ativar audio do video de ${story.title}`}
                aria-pressed={audioIndex === index}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleAudio(index);
                }}
                className={`absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full shadow-strong transition-all duration-200 md:hidden ${
                  audioIndex === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-white text-[#25292D]"
                }`}
              >
                {audioIndex === index ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>

              <div
                className={`pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-wide text-[#25292D] shadow-strong transition-all duration-300 ease-out md:flex ${
                  hoveredIndex === index ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
                style={{ left: "50%", top: "50%" }}
              >
                {audioIndex === index ? (
                  <VolumeX className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 text-primary" />
                )}
                {audioIndex === index ? "Clique e desative o áudio" : "Clique e ative o áudio"}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoTestimonials;
