import { Cookie, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { captureCampaignAttribution, trackCampaignEvent } from "@/features/analytics/campaign";
import { getMarketingConsent, MARKETING_CONSENT_EVENT, setMarketingConsent, type MarketingConsent } from "@/features/analytics/consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

const loadScript = (id: string, source: string) => {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = source;
  document.head.appendChild(script);
};

const activateAdvertisingTools = () => {
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (gaMeasurementId) {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = (...args) => window.dataLayer?.push(args);
    window.gtag("js", new Date());
    window.gtag("config", gaMeasurementId, { send_page_view: false, anonymize_ip: true });
    loadScript("tecponto-ga4", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`);
  }

  const metaPixelId = import.meta.env.VITE_META_PIXEL_ID;
  if (metaPixelId && !window.fbq) {
    const fbq = ((...args: unknown[]) => {
      const instance = fbq as typeof fbq & { callMethod?: (...callArgs: unknown[]) => void; queue: unknown[][] };
      if (instance.callMethod) instance.callMethod(...args);
      else instance.queue.push(args);
    }) as typeof window.fbq & { queue: unknown[][]; push?: typeof window.fbq };
    fbq.queue = [];
    fbq.push = fbq;
    window.fbq = fbq;
    window._fbq = fbq;
    loadScript("tecponto-meta-pixel", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", metaPixelId);
  }
};

const MarketingConsent = () => {
  const { pathname } = useLocation();
  const [consent, setConsent] = useState<MarketingConsent>(() => getMarketingConsent());
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const onConsent = () => setConsent(getMarketingConsent());
    window.addEventListener(MARKETING_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(MARKETING_CONSENT_EVENT, onConsent);
  }, []);

  useEffect(() => {
    if (consent !== "granted") return;
    activateAdvertisingTools();
    captureCampaignAttribution();
    trackCampaignEvent("page_view", { page_path: pathname, page_type: pathname === "/" ? "home" : pathname.slice(1) || "home", consent_granted: true });
  }, [consent, pathname]);

  useEffect(() => {
    if (consent || !isExpanded) return;
    const timer = window.setTimeout(() => setIsExpanded(false), 6500);
    return () => window.clearTimeout(timer);
  }, [consent, isExpanded]);

  if (pathname === "/marketing" || consent) return null;

  const chooseConsent = (choice: Exclude<MarketingConsent, null>) => {
    setMarketingConsent(choice);
    setIsExpanded(false);
  };

  return <div className="fixed bottom-5 left-4 z-[120] sm:left-5">
    {isExpanded ? <aside className="w-[min(360px,calc(100vw-2rem))] rounded-xl border border-white/15 bg-[#25292C] p-4 text-white shadow-[0_18px_50px_rgba(37,41,44,0.28)]" aria-label="Preferencias de cookies">
      <div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-[#FE5000]"><Cookie className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="text-sm font-black">Sua navegacao, suas escolhas.</p><p className="mt-1 text-xs font-medium leading-relaxed text-white/70">Usamos medicao opcional para melhorar campanhas e atendimento.</p></div><button onClick={() => setIsExpanded(false)} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-white/55 transition hover:bg-white/10 hover:text-white" aria-label="Recolher preferencias"><X className="h-4 w-4" /></button></div>
      <div className="mt-4 flex gap-2"><button onClick={() => chooseConsent("denied")} className="h-9 flex-1 rounded-lg border border-white/25 px-3 text-[11px] font-black uppercase text-white transition hover:bg-white/10">Recusar</button><button onClick={() => chooseConsent("granted")} className="h-9 flex-1 rounded-lg bg-[#FE5000] px-3 text-[11px] font-black uppercase text-white transition hover:bg-[#df4600]">Aceitar</button></div>
    </aside> : <button onClick={() => setIsExpanded(true)} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25292C] px-4 text-xs font-black text-white shadow-[0_12px_30px_rgba(37,41,44,0.22)] transition hover:bg-[#353a3e]" aria-label="Abrir preferencias de cookies"><SlidersHorizontal className="h-4 w-4 text-[#FE5000]" /> Cookies</button>}
  </div>;
};

export default MarketingConsent;
