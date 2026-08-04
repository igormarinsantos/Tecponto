import { Cookie, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { captureCampaignAttribution } from "@/features/analytics/campaign";
import { getMarketingConsent, MARKETING_CONSENT_EVENT, setMarketingConsent, type MarketingConsent } from "@/features/analytics/consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

const PREFERENCES_EVENT = "tecponto:open-cookie-preferences";

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
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    const onConsent = () => setConsent(getMarketingConsent());
    const openPreferences = () => setIsPreferencesOpen(true);
    window.addEventListener(MARKETING_CONSENT_EVENT, onConsent);
    window.addEventListener(PREFERENCES_EVENT, openPreferences);
    return () => {
      window.removeEventListener(MARKETING_CONSENT_EVENT, onConsent);
      window.removeEventListener(PREFERENCES_EVENT, openPreferences);
    };
  }, []);

  useEffect(() => {
    if (consent !== null) return;
    setMarketingConsent("granted");
  }, [consent]);

  useEffect(() => {
    if (consent !== "granted") return;
    activateAdvertisingTools();
    captureCampaignAttribution();
  }, [consent]);

  if (pathname === "/marketing" || !isPreferencesOpen) return null;

  const chooseConsent = (choice: Exclude<MarketingConsent, null>) => {
    setMarketingConsent(choice);
    setIsPreferencesOpen(false);
  };

  return <div className="fixed inset-0 z-[150] grid place-items-center bg-[#25292C]/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Preferencias de cookies">
    <section className="w-full max-w-md rounded-xl border border-black/10 bg-white p-5 text-[#25292C] shadow-[0_24px_70px_rgba(37,41,44,0.3)]">
      <div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#FE5000]/10 text-[#FE5000]"><Cookie className="h-5 w-5" /></div><div className="min-w-0 flex-1"><h2 className="font-black">Preferencias de cookies</h2><p className="mt-1 text-sm font-medium leading-relaxed text-[#25292C]/60">A medicao ajuda a TecPonto a entender campanhas e melhorar o atendimento.</p></div><button onClick={() => setIsPreferencesOpen(false)} className="grid h-8 w-8 place-items-center rounded-md text-[#25292C]/45 transition hover:bg-black/5 hover:text-[#25292C]" aria-label="Fechar preferencias"><X className="h-4 w-4" /></button></div>
      <div className="mt-5 grid grid-cols-2 gap-2"><button onClick={() => chooseConsent("denied")} className="h-10 rounded-lg border border-black/15 text-xs font-black uppercase transition hover:bg-black/[0.03]">Recusar medicao</button><button onClick={() => chooseConsent("granted")} className="h-10 rounded-lg bg-[#FE5000] text-xs font-black uppercase text-white transition hover:bg-[#df4600]">Aceitar medicao</button></div>
    </section>
  </div>;
};

export default MarketingConsent;
