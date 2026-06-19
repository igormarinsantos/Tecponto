export const LANDING_QUALIFICATION_EVENT = "tecponto:open-landing-qualification";

export const openLandingQualification = () => {
  window.dispatchEvent(new Event(LANDING_QUALIFICATION_EVENT));
};
