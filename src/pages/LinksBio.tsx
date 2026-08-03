import { ArrowRight, CheckCircle2, ExternalLink, Instagram, RotateCcw, ShoppingBag, Smartphone, Wrench, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/brand/logo-horizontal.png";
import WhatsAppQualificationModal from "@/features/whatsapp/WhatsAppQualificationModal";
import { SHOPEE_STORE_URL } from "@/constants/links";
import { captureCampaignAttribution, trackCampaignEvent, withCampaignParameters } from "@/features/analytics/campaign";
import type { LandingVariant } from "@/types/landing";

type BioAction = {
  variant: LandingVariant;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: "orange" | "dark" | "white";
};

const CHAT_STORAGE_KEY = "tecponto_chat_state";

const bioActions: BioAction[] = [
  {
    variant: "repare",
    title: "Reparar meu celular",
    subtitle: "Tela, bateria, carregamento, software e outros reparos.",
    icon: Wrench,
    tone: "orange",
  },
  {
    variant: "troque",
    title: "Trocar meu usado",
    subtitle: "Use seu aparelho como entrada em uma opção revisada.",
    icon: RotateCcw,
    tone: "dark",
  },
  {
    variant: "compre",
    title: "Comprar celular",
    subtitle: "Aparelhos revisados disponíveis direto na nossa Shopee.",
    icon: ShoppingBag,
    tone: "white",
  },
];

const toneClasses: Record<BioAction["tone"], string> = {
  orange: "border-[#FE5000] bg-[#FE5000] text-white",
  dark: "border-[#25292C] bg-[#25292C] text-white",
  white: "border-black/10 bg-white text-[#25292C]",
};

const getActionFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const rawAction = params.get("acao") ?? params.get("action") ?? window.location.hash.replace("#", "");
  if (rawAction === "repare" || rawAction === "troque" || rawAction === "compre") return rawAction;
  return null;
};

const LinksBio = () => {
  const [modalVariant, setModalVariant] = useState<LandingVariant | null>(null);

  const openQualification = (variant: LandingVariant) => {
    if (variant === "compre") {
      trackCampaignEvent("bio_action_click", { action: "compre", destination: "shopee" });
      trackCampaignEvent("bio_shopee_open", { placement: "bio_page" });
      window.open(withCampaignParameters(SHOPEE_STORE_URL), "_blank", "noopener,noreferrer");
      return;
    }

    trackCampaignEvent("bio_action_click", { action: variant, destination: "qualification" });
    trackCampaignEvent("bio_qualification_open", { modality: variant, placement: "bio_page" });
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
      trackCampaignEvent("bio_action_click", { action: "compre", destination: "shopee", direct_link: true });
      trackCampaignEvent("bio_shopee_open", { placement: "bio_direct_link" });
      window.location.replace(withCampaignParameters(SHOPEE_STORE_URL));
      return;
    }

    trackCampaignEvent("bio_action_click", { action, destination: "qualification", direct_link: true });
    trackCampaignEvent("bio_qualification_open", { modality: action, placement: "bio_direct_link" });
    localStorage.removeItem(CHAT_STORAGE_KEY);
    setModalVariant(action);
  }, []);

  return (
    <main className="min-h-screen bg-[#EEEDF6] px-3 py-3 text-[#25292C] sm:px-5 sm:py-5">
      <section className="relative mx-auto flex min-h-[calc(100vh-24px)] w-full max-w-[560px] flex-col overflow-hidden rounded-[26px] bg-[#FE5000] text-white sm:min-h-[calc(100vh-40px)] sm:rounded-[34px]">
        <div className="pointer-events-none absolute inset-x-[-20%] top-[-18%] h-[42%] rounded-full bg-[#ffcf4a]/70 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-12%] right-[-22%] h-[34%] w-[80%] rounded-full bg-[#25292C]/30 blur-[90px]" />

        <div className="relative z-10 flex flex-1 flex-col px-5 pb-5 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
          <header className="flex items-center justify-between gap-4">
            <img src={logo} alt="TecPonto" className="h-auto w-36 brightness-0 invert sm:w-40" />
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
              <Instagram className="h-5 w-5" aria-hidden="true" />
            </span>
          </header>

          <div className="mt-9 flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute inset-[-18px] rounded-[34px] bg-[#ffcf4a]/55 blur-2xl" />
              <img src="/apple-touch-icon.png" alt="Ícone TP" className="relative h-24 w-24 rounded-[26px] shadow-2xl shadow-black/20" />
            </div>

            <p className="mt-6 text-xs font-black uppercase text-white/75">Compre. Troque. Repare.</p>
            <h1 className="mt-2 max-w-[440px] text-4xl font-black leading-[0.96] sm:text-5xl">
              Seu celular resolvido sem enrolação.
            </h1>
            <p className="mt-4 max-w-[400px] text-sm font-medium leading-relaxed text-white/80 sm:text-base">
              Escolha o que você precisa e a TecPonto já te leva para o caminho certo.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            {bioActions.map((action) => {
              const Icon = action.icon;
              const isCompre = action.variant === "compre";

              if (isCompre) {
                return (
                  <a
                    key={action.variant}
                    href={withCampaignParameters(SHOPEE_STORE_URL)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackCampaignEvent("bio_action_click", { action: "compre", destination: "shopee" });
                      trackCampaignEvent("bio_shopee_open", { placement: "bio_page" });
                    }}
                    className={`group flex min-h-[86px] items-center gap-4 rounded-2xl border p-4 transition-transform duration-200 hover:-translate-y-0.5 ${toneClasses[action.tone]}`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FE5000]/10 text-[#FE5000]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-black leading-tight">{action.title}</span>
                      <span className="mt-1 block text-xs font-medium leading-relaxed opacity-70">{action.subtitle}</span>
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25292C] text-white transition-transform group-hover:translate-x-0.5">
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </a>
                );
              }

              return (
                <button
                  key={action.variant}
                  type="button"
                  onClick={() => openQualification(action.variant)}
                  className={`group flex min-h-[86px] items-center gap-4 rounded-2xl border p-4 text-left transition-transform duration-200 hover:-translate-y-0.5 ${toneClasses[action.tone]}`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-black leading-tight">{action.title}</span>
                    <span className="mt-1 block text-xs font-medium leading-relaxed opacity-75">{action.subtitle}</span>
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#25292C] transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/20 pt-5 text-center">
            <div className="rounded-2xl bg-white/10 px-2 py-3 ring-1 ring-white/10">
              <CheckCircle2 className="mx-auto h-4 w-4 text-white" aria-hidden="true" />
              <strong className="mt-1 block text-lg leading-none">90</strong>
              <span className="text-[10px] font-bold leading-tight text-white/70">dias de garantia</span>
            </div>
            <div className="rounded-2xl bg-white/10 px-2 py-3 ring-1 ring-white/10">
              <Smartphone className="mx-auto h-4 w-4 text-white" aria-hidden="true" />
              <strong className="mt-1 block text-lg leading-none">8+</strong>
              <span className="text-[10px] font-bold leading-tight text-white/70">anos de experiência</span>
            </div>
            <div className="rounded-2xl bg-white/10 px-2 py-3 ring-1 ring-white/10">
              <CheckCircle2 className="mx-auto h-4 w-4 text-white" aria-hidden="true" />
              <strong className="mt-1 block text-lg leading-none">4.9</strong>
              <span className="text-[10px] font-bold leading-tight text-white/70">avaliação média</span>
            </div>
          </div>

          <footer className="mt-auto pt-6 text-center text-xs font-semibold text-white/70">
            TecPonto Guarulhos · Atendimento pelo WhatsApp
          </footer>
        </div>
      </section>

      <WhatsAppQualificationModal
        isOpen={Boolean(modalVariant)}
        onClose={() => setModalVariant(null)}
        variant={modalVariant ?? undefined}
      />
    </main>
  );
};

export default LinksBio;
