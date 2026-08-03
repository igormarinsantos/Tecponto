type CampaignEventName = "bio_view" | "bio_action_click" | "bio_qualification_open" | "bio_whatsapp_start" | "bio_shopee_open";

export type CampaignAttribution = {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  clickId: string;
  referrer: string;
  landingPath: string;
  instagramBrowser: boolean;
};

const STORAGE_KEY = "tecponto_campaign_attribution";

const isInstagramBrowser = () => /instagram/i.test(navigator.userAgent) || /instagram\.com/i.test(document.referrer);
const getParameter = (params: URLSearchParams, key: string) => params.get(key)?.trim() ?? "";

export const captureCampaignAttribution = (): CampaignAttribution => {
  const params = new URLSearchParams(window.location.search);
  const instagramBrowser = isInstagramBrowser();
  const attribution: CampaignAttribution = {
    source: getParameter(params, "utm_source") || (instagramBrowser ? "instagram" : "direct"),
    medium: getParameter(params, "utm_medium") || (instagramBrowser ? "social" : "direct"),
    campaign: getParameter(params, "utm_campaign"),
    content: getParameter(params, "utm_content"),
    term: getParameter(params, "utm_term"),
    clickId: getParameter(params, "fbclid") || getParameter(params, "gclid") || getParameter(params, "igshid"),
    referrer: document.referrer,
    landingPath: `${window.location.pathname}${window.location.search}`,
    instagramBrowser,
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
};

export const getCampaignAttribution = (): CampaignAttribution | null => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) as CampaignAttribution : null;
  } catch {
    return null;
  }
};

const analyticsPayload = (attribution: CampaignAttribution | null) => ({
  campaign_source: attribution?.source ?? "direct",
  campaign_medium: attribution?.medium ?? "direct",
  campaign_name: attribution?.campaign ?? "",
  campaign_content: attribution?.content ?? "",
  campaign_term: attribution?.term ?? "",
  click_id: attribution?.clickId ?? "",
  landing_path: attribution?.landingPath ?? window.location.pathname,
  instagram_browser: attribution?.instagramBrowser ?? false,
});

export const trackCampaignEvent = (event: CampaignEventName, details: Record<string, string | boolean | number> = {}) => {
  const payload = { ...analyticsPayload(getCampaignAttribution()), ...details };
  const dataLayer = (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer;
  const gtag = (window as Window & { gtag?: (command: string, eventName: string, parameters: Record<string, unknown>) => void }).gtag;
  const fbq = (window as Window & { fbq?: (command: string, eventName: string, parameters: Record<string, unknown>) => void }).fbq;

  dataLayer?.push({ event: `tecponto_${event}`, ...payload });
  gtag?.("event", `tecponto_${event}`, payload);
  fbq?.("trackCustom", `Tecponto${event.replace(/(^|_)(\w)/g, (_, __, letter) => letter.toUpperCase())}`, payload);
  window.dispatchEvent(new CustomEvent("tecponto:campaign-event", { detail: { event, ...payload } }));
};

export const withCampaignParameters = (destination: string) => {
  const attribution = getCampaignAttribution();
  if (!attribution) return destination;

  const url = new URL(destination);
  const parameters: Record<string, string> = {
    utm_source: attribution.source,
    utm_medium: attribution.medium,
    utm_campaign: attribution.campaign,
    utm_content: attribution.content,
    utm_term: attribution.term,
  };

  Object.entries(parameters).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  return url.toString();
};

export const getCampaignWhatsAppContext = () => {
  const attribution = getCampaignAttribution();
  if (!attribution) return "";

  const campaign = attribution.campaign ? ` | campanha: ${attribution.campaign}` : "";
  return `Origem: ${attribution.source} / ${attribution.medium}${campaign}`;
};
