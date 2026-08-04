import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { captureCampaignAttribution, trackCampaignEvent } from "@/features/analytics/campaign";
import { hasMarketingConsent, MARKETING_CONSENT_EVENT } from "@/features/analytics/consent";

const getPageType = (pathname: string) => {
  if (pathname === "/") return "home";
  if (pathname === "/repare") return "repare";
  if (pathname === "/troque") return "troque";
  if (pathname === "/bio" || pathname === "/links") return "bio";
  return pathname.replace(/^\//, "") || "home";
};

const SiteAnalytics = () => {
  const { pathname } = useLocation();
  const hasCapturedAttribution = useRef(false);

  useEffect(() => {
    if (!hasCapturedAttribution.current) {
      captureCampaignAttribution();
      hasCapturedAttribution.current = true;
    }

    const pageType = getPageType(pathname);
    const reachedMilestones = new Set<number>();
    let frame: number | null = null;
    let hasTrackedPageView = false;

    const trackPageView = () => {
      if (hasTrackedPageView || !hasMarketingConsent()) return;
      hasTrackedPageView = true;
      trackCampaignEvent("page_view", { page_path: pathname, page_type: pageType });
    };

    trackPageView();

    const trackScroll = () => {
      frame = null;
      if (!hasMarketingConsent()) return;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const depth = (window.scrollY / scrollableHeight) * 100;
      [25, 50, 75, 90].forEach((milestone) => {
        if (depth >= milestone && !reachedMilestones.has(milestone)) {
          reachedMilestones.add(milestone);
          trackCampaignEvent("page_scroll", { page_path: pathname, page_type: pageType, depth: milestone });
        }
      });
    };

    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(trackScroll);
    };

    const onDocumentClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const href = anchor.href;
      const destination = href.includes("wa.me") ? "whatsapp" : href.includes("shopee") ? "shopee" : "external";
      if (destination === "external" && !anchor.target) return;

      trackCampaignEvent("external_click", {
        page_path: pathname,
        page_type: pageType,
        destination,
        placement: anchor.getAttribute("data-analytics-placement") ?? "link",
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(MARKETING_CONSENT_EVENT, trackPageView);
    document.addEventListener("click", onDocumentClick);
    trackScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(MARKETING_CONSENT_EVENT, trackPageView);
      document.removeEventListener("click", onDocumentClick);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
};

export default SiteAnalytics;
