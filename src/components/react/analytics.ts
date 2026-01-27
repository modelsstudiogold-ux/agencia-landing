// Placeholder de tracking. Completar cuando se defina el stack analítico.
export const trackEvent = (event: string, payload?: Record<string, unknown>) => {
  if (import.meta.env.DEV) {
    console.debug("[analytics placeholder]", event, payload);
  }
};
