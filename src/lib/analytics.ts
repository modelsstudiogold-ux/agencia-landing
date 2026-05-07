type DataLayerValue = string | number | boolean | undefined;

type DataLayerPayload = {
  event: string;
  [key: string]: DataLayerValue;
};

type LandingAnalyticsOptions = {
  landingVariant: string;
  scrollDepths?: number[];
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const UTM_STORAGE_KEY = "gold_models_utm_params";

type UtmKey = (typeof UTM_KEYS)[number];
type UtmParams = Record<UtmKey, string>;

declare global {
  interface Window {
    dataLayer?: DataLayerPayload[];
  }
}

const emptyUtmParams = (): UtmParams => ({
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
});

const canUseWindow = () => typeof window !== "undefined";

export const initDataLayer = () => {
  if (!canUseWindow()) {
    return undefined;
  }

  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
};

export const pushDataLayerEvent = (event: string, params: Record<string, DataLayerValue> = {}) => {
  const dataLayer = initDataLayer();

  if (!dataLayer) {
    return;
  }

  dataLayer.push({
    event,
    ...params,
  });
};

export const readUtmParams = (): UtmParams => {
  if (!canUseWindow()) {
    return emptyUtmParams();
  }

  const searchParams = new URLSearchParams(window.location.search);
  const currentParams = emptyUtmParams();
  let hasCurrentUtm = false;

  UTM_KEYS.forEach((key) => {
    const value = searchParams.get(key);

    if (value) {
      currentParams[key] = value;
      hasCurrentUtm = true;
    }
  });

  if (hasCurrentUtm) {
    try {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(currentParams));
    } catch {
      return currentParams;
    }

    return currentParams;
  }

  try {
    const storedParams = window.sessionStorage.getItem(UTM_STORAGE_KEY);

    if (!storedParams) {
      return currentParams;
    }

    return {
      ...currentParams,
      ...JSON.parse(storedParams),
    };
  } catch {
    return currentParams;
  }
};

const getElementText = (element: Element) =>
  element.getAttribute("data-cta-text") ||
  element.getAttribute("aria-label") ||
  element.textContent?.replace(/\s+/g, " ").trim() ||
  "";

const inferWhatsappLocation = (element: Element) => {
  if (element.closest(".wpp-wrap")) {
    return "floating";
  }

  return element.getAttribute("data-cta-location") || "";
};

const inferWhatsappType = (element: Element) => {
  if (element.closest(".wpp-wrap")) {
    return "floating_button";
  }

  return element.getAttribute("data-whatsapp-type") || "";
};

export const initLandingAnalytics = ({ landingVariant, scrollDepths = [50, 75] }: LandingAnalyticsOptions) => {
  if (!canUseWindow()) {
    return;
  }

  initDataLayer();

  const baseParams = () => ({
    landing_variant: landingVariant,
    page_path: window.location.pathname,
  });

  pushDataLayerEvent("page_view_landing", {
    ...baseParams(),
    page_title: document.title,
    ...readUtmParams(),
  });

  const whatsappElements = new Set<Element>([
    ...document.querySelectorAll("[data-event='click_whatsapp']"),
    ...document.querySelectorAll("a[href*='wa.me/'], a[href*='whatsapp.com/']"),
  ]);

  whatsappElements.forEach((element) => {
    element.addEventListener("click", () => {
      const ctaLocation = inferWhatsappLocation(element);
      const eventParams = {
        ...baseParams(),
        cta_location: ctaLocation,
        cta_text: getElementText(element),
        whatsapp_type: inferWhatsappType(element),
      };

      pushDataLayerEvent("click_whatsapp", eventParams);

      if (ctaLocation === "hero") {
        pushDataLayerEvent("click_cta_principal", {
          ...baseParams(),
          cta_location: "hero",
          cta_text: getElementText(element),
        });
      }
    });
  });

  document.querySelectorAll("[data-event='click_faq'] summary").forEach((summary) => {
    summary.addEventListener("click", () => {
      const faq = summary.closest("[data-event='click_faq']");

      pushDataLayerEvent("click_faq", {
        ...baseParams(),
        faq_question: faq?.getAttribute("data-faq-question") || "",
      });
    });
  });

  const reachedDepths = new Set<number>();

  const trackScrollDepth = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentDepth = scrollableHeight <= 0 ? 100 : Math.round((window.scrollY / scrollableHeight) * 100);

    scrollDepths.forEach((scrollPercent) => {
      if (currentDepth >= scrollPercent && !reachedDepths.has(scrollPercent)) {
        reachedDepths.add(scrollPercent);
        pushDataLayerEvent("scroll_depth", {
          ...baseParams(),
          scroll_percent: scrollPercent,
        });
      }
    });
  };

  window.addEventListener("scroll", trackScrollDepth, { passive: true });
  window.addEventListener("load", trackScrollDepth);
};
