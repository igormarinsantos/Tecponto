const CONSENT_KEY = "tecponto_marketing_consent";
export const MARKETING_CONSENT_EVENT = "tecponto:marketing-consent";

export type MarketingConsent = "granted" | "denied" | null;

export const getMarketingConsent = (): MarketingConsent => {
  const stored = localStorage.getItem(CONSENT_KEY);
  return stored === "granted" || stored === "denied" ? stored : null;
};

export const hasMarketingConsent = () => getMarketingConsent() === "granted";

export const setMarketingConsent = (consent: Exclude<MarketingConsent, null>) => {
  localStorage.setItem(CONSENT_KEY, consent);
  window.dispatchEvent(new CustomEvent(MARKETING_CONSENT_EVENT, { detail: { consent } }));
};
