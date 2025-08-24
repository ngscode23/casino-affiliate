// src/lib/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Склейка классов с устранением конфликтов tailwind */
const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export default cn; // поддерживает: import cn from "@/lib/cn"
export { cn };     // поддерживает: import { cn } from "@/lib/cn"