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

  if (pathname === "/marketing") return null;

  if (consent) return null;

  return (
    <aside className="fixed inset-x-3 bottom-3 z-[120] mx-auto max-w-[620px] rounded-2xl border border-white/15 bg-[#25292C] p-4 text-white shadow-2xl sm:bottom-5 sm:flex sm:items-center sm:gap-5 sm:p-5" aria-label="Preferências de cookies">
      <p className="text-sm font-medium leading-relaxed text-white/80">Usamos dados de navegação para medir campanhas e melhorar seu atendimento. Você pode aceitar ou recusar.</p>
      <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
        <button onClick={() => setMarketingConsent("denied")} className="h-10 rounded-lg border border-white/25 px-4 text-xs font-black uppercase text-white transition hover:bg-white/10">Recusar</button>
        <button onClick={() => setMarketingConsent("granted")} className="h-10 rounded-lg bg-[#FE5000] px-4 text-xs font-black uppercase text-white transition hover:bg-[#df4600]">Aceitar</button>
      </div>
    </aside>
  );
};

export default MarketingConsent;
