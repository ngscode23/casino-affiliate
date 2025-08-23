// src/lib/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Склейка классов с дедупом Tailwind (подходит для Tailwind v4) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

