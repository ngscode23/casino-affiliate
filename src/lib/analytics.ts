export function track(event: string, props?: Record<string, any>) {
  if (import.meta.env.DEV || location.hostname === "localhost") return;
  (window as any).plausible?.(event, props ? { props } : undefined);
}