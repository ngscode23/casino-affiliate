
// src/lib/favorites.ts
const KEY = "favorites";

export function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  const set = new Set(getFavorites());
  if (set.has(slug)) set.delete(slug);
  else set.add(slug);
  const arr = Array.from(set);
  localStorage.setItem(KEY, JSON.stringify(arr));
  return set.has(slug);
}

