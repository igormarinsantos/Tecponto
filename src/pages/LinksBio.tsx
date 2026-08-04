import { ArrowRight, ExternalLink, Instagram, MapPin, Play, RotateCcw, ShoppingBag, Wrench, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/brand/logo-horizontal.png";
import perfectPhone from "@/assets/devices/compre.png";
import brokenPhone from "@/assets/devices/reparo.png";
import usedPhoneTrade from "@/assets/devices/troca.png";
import testimonialVideo from "@/assets/media/testimonial-video.webm";
import { SHOPEE_STORE_URL } from "@/constants/links";
import { captureCampaignAttribution, trackCampaignEvent, withCampaignParameters } from "@/features/analytics/campaign";
import WhatsAppQualificationModal from "@/features/whatsapp/WhatsAppQualificationModal";
import type { LandingVariant } from "@/types/landing";

type BioAction = {
  variant: LandingVariant;
  title: string;
  copy: string;
  cta: string;
  ctaMobile: string;
  icon: LucideIcon;
  image: string;
  className: string;
};

const CHAT_STORAGE_KEY = "tecponto_chat_state";
const address = "R. Itatira, 341 - Parque Uirapuru, Guarulhos - SP, 07230-300";
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const actions: BioAction[] = [
  {
    variant: "repare",
    title: "Seu celular pronto em poucas horas.",
    copy: "Diagnostico rapido e atendimento no mesmo dia quando possivel. Fale com a TecPonto agora.",
    cta: "Solicitar reparo agora",
    ctaMobile: "Reparar agora",
    icon: Wrench,
    image: brokenPhone,
    className: "bg-[#FE5000]",
  },
  {
    variant: "troque",
    title: "Troque seu usado sem perder tempo.",
    copy: "Receba uma pre-avaliacao rapida e descubra hoje quanto ele vale como entrada.",
    cta: "Avaliar meu usado",
    ctaMobile: "Avaliar usado",
    icon: RotateCcw,
    image: usedPhoneTrade,
    className: "bg-[#FE5000]",
  },
  {
    variant: "compre",
    title: "Modelos revisados prontos para sair.",
    copy: "Confira os aparelhos disponiveis agora na Shopee antes que o modelo que voce quer acabe.",
    cta: "Ver ofertas na Shopee",
    ctaMobile: "Ver ofertas",
    icon: ShoppingBag,
    image: perfectPhone,
    className: "bg-[#FE5000]",
  },
];

const getActionFromUrl = () => {
  const parameters = new URLSearchParams(window.location.search);
  const action = parameters.get("acao") ?? parameters.get("action") ?? window.location.hash.replace("#", "");
  return action === "repare" || action === "troque" || action === "compre" ? action : null;
};

const LinksBio = () => {
  const [modalVariant, setModalVariant] = useState<LandingVariant | null>(null);

  const openAction = (variant: LandingVariant, placement = "bio_bento") => {
    if (variant === "compre") {
      trackCampaignEvent("bio_action_click", { action: variant, destination: "shopee", placement });
      trackCampaignEvent("bio_shopee_open", { placement });
      window.open(withCampaignParameters(SHOPEE_STORE_URL), "_blank", "noopener,noreferrer");
      return;
    }

    trackCampaignEvent("bio_action_click", { action: variant, destination: "qualification", placement });
    trackCampaignEvent("bio_qualification_open", { modality: variant, placement });
    localStorage.removeItem(CHAT_STORAGE_KEY);
    setModalVariant(null);
    window.setTimeout(() => setModalVariant(variant), 0);
  };

  useEffect(() => {
    captureCampaignAttribution();
    trackCampaignEvent("bio_view", { page: "links_bio" });

    const action = getActionFromUrl();
    if (!action) return;

    if (action === "compre") {
      trackCampaignEvent("bio_action_click", { action, destination: "shopee", placement: "bio_direct_link", direct_link: true });
      trackCampaignEvent("bio_shopee_open", { placement: "bio_direct_link" });
      window.location.replace(withCampaignParameters(SHOPEE_STORE_URL));
      return;
    }

    trackCampaignEvent("bio_action_click", { action, destination: "qualification", placement: "bio_direct_link", direct_link: true });
    trackCampaignEvent("bio_qualification_open", { modality: action, placement: "bio_direct_link" });
    localStorage.removeItem(CHAT_STORAGE_KEY);
    setModalVariant(action);
  }, []);

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#EEEDF6] p-2 text-[#25292C] sm:p-3 lg:p-5">
      <section className="mx-auto grid h-full max-w-[1800px] grid-rows-[minmax(0,0.72fr)_minmax(0,1.28fr)] gap-2 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:grid-rows-none lg:gap-3">
        <aside className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl bg-[#25292C] p-6 text-white sm:p-8 lg:rounded-[28px] lg:p-10 xl:p-12">
          <div className="relative flex items-center justify-between gap-4">
            <img src={logo} alt="TecPonto" className="h-auto w-36 brightness-0 invert sm:w-40" />
            <a
              href="https://instagram.com/tecpontobrasil"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCampaignEvent("bio_instagram_open", { placement: "bio_intro" })}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-colors hover:bg-white/20"
              aria-label="Abrir Instagram da TecPonto"
            >
              <Instagram className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>

          <div className="relative flex flex-1 flex-col justify-center py-5 lg:py-8">
            <p className="text-xs font-black uppercase text-[#FE5000]">Compre. Troque. Repare.</p>
            <h1 className="mt-3 text-3xl font-black leading-[0.96] sm:mt-4 sm:text-5xl xl:text-6xl">
              Escolha o que seu celular precisa agora.
            </h1>
            <p className="mt-3 hidden max-w-md text-xs font-medium leading-relaxed text-white/70 sm:mt-5 sm:block sm:text-base">
              Escolha uma opcao e resolva agora pelo caminho certo, sem formulario longo.
            </p>
          </div>

          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="relative mt-5 flex items-center gap-3 border-y border-white/15 py-3 text-left transition-colors hover:text-[#ffb48d] sm:mt-6 sm:py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#FE5000] ring-1 ring-white/10"><MapPin className="h-4 w-4" aria-hidden="true" /></span>
            <span className="min-w-0 flex-1"><strong className="block text-sm font-black">Visite a TecPonto.</strong><span className="block truncate text-[11px] font-medium text-white/60">Guarulhos - SP · Abrir rota</span></span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>

          <div className="relative grid grid-cols-3 gap-2 pt-4 text-center sm:pt-5">
            <div><strong className="block text-xl font-black">90</strong><span className="text-[10px] font-bold text-white/60">dias de garantia</span></div>
            <div><strong className="block text-xl font-black">8+</strong><span className="text-[10px] font-bold text-white/60">anos de experiencia</span></div>
            <div><strong className="block text-xl font-black">4.9</strong><span className="text-[10px] font-bold text-white/60">avaliacao media</span></div>
          </div>
        </aside>

        <div className="grid min-h-0 grid-cols-2 grid-rows-[1.25fr_0.875fr_0.875fr] gap-2 lg:grid-cols-3 lg:grid-rows-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const isWide = index === 0;

            return (
              <button
                key={action.variant}
                type="button"
                onClick={() => openAction(action.variant)}
                className={`group relative flex min-w-0 flex-col overflow-hidden rounded-2xl bg-[#F5F4F8] text-left ring-1 ring-[#FE5000]/25 shadow-[0_16px_40px_rgba(37,41,44,0.08)] transition-all duration-300 hover:-translate-y-1 hover:ring-[#FE5000]/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FE5000]/35 lg:rounded-[22px] ${isWide ? "col-span-2 lg:col-span-1" : "col-span-1"}`}
              >
                <div className={`relative h-[44%] shrink-0 overflow-hidden lg:h-[45%] ${action.className}`}>
                  <img
                    src={action.image}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  />
                </div>
                <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-5 lg:p-5">
                  <div className="min-h-0 overflow-hidden">
                    <span className="mb-2 hidden h-8 w-8 items-center justify-center rounded-full bg-[#FE5000]/10 text-[#FE5000] lg:flex"><Icon className="h-4 w-4" aria-hidden="true" /></span>
                    <h2 className="text-base font-black leading-[0.98] text-[#25292C] lg:text-[clamp(1.25rem,1.6vw,1.5rem)]">
                      {action.title}
                    </h2>
                    <p className="bio-action-copy mt-2 max-w-md text-xs font-medium leading-relaxed text-[#25292C]/65 line-clamp-2">
                      {action.copy}
                    </p>
                  </div>

                  <span className="mt-auto inline-flex shrink-0 items-center gap-2 pt-2 text-[9px] font-black uppercase text-[#FE5000] transition-transform duration-200 group-hover:translate-x-1 sm:pt-3 sm:text-xs">
                    <span className="sm:hidden">{action.ctaMobile}</span>
                    <span className="hidden sm:inline">{action.cta}</span>
                    {action.variant === "compre" ? <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
                  </span>
                </div>
              </button>
            );
          })}
          <a
            href="https://instagram.com/tecpontobrasil"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative col-span-2 flex min-h-0 flex-col overflow-hidden rounded-2xl bg-[#25292C] p-4 text-white ring-1 ring-white/15 shadow-[0_16px_40px_rgba(37,41,44,0.16)] transition-transform duration-300 hover:-translate-y-1 sm:p-6 lg:col-span-3 lg:rounded-[22px] lg:p-6"
          >
            <video className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" autoPlay loop muted playsInline preload="metadata">
              <source src={testimonialVideo} type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-[#25292C]/95 via-[#25292C]/60 to-transparent" />
            <div className="relative mt-auto max-w-sm">
              <h2 className="text-lg font-black leading-[0.98] sm:text-3xl">Veja atendimentos reais.</h2>
              <p className="bio-tall-content mt-2 text-sm font-medium leading-relaxed text-white/75">Acompanhe reparos, entregas e novidades da TecPonto.</p>
              <span className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#FE5000] px-3 text-[10px] font-black uppercase text-white ring-1 ring-white/25 transition-transform duration-200 group-hover:translate-x-1 sm:h-12 sm:max-w-[250px] sm:px-4 sm:text-xs">
                <Play className="h-3.5 w-3.5 shrink-0 fill-current" aria-hidden="true" /> Ver no Instagram <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </span>
            </div>
          </a>
        </div>
      </section>

      <WhatsAppQualificationModal isOpen={Boolean(modalVariant)} onClose={() => setModalVariant(null)} variant={modalVariant ?? undefined} />
    </main>
  );
};

export default LinksBio;
