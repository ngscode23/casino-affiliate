// src/lib/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Склейка классов с устранением конфликтов tailwind */
export default function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}