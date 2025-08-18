export function track(event: string, props?: Record<string, string | number | boolean>) {
  try {
    (window as any).plausible?.(event, props ? { props } : undefined);
  } catch {
    // молча игнорим, чтобы не падало в деве
  }
}