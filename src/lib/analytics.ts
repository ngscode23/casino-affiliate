export function track(name: string, props?: Record<string, string|number|boolean>) {
  try { (window as any).plausible?.(name, props ? { props } : undefined); } catch {}
}