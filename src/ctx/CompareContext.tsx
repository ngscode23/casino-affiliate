// src/ctx/CompareContext.tsx
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type CompareItem = {
  slug?: string;
  name: string;
  rating?: number;
  license?: string;
  payout?: string;
  payoutHours?: number;
  methods?: string[];
  payments?: string[];
  link?: string | null;
  [k: string]: unknown;
};

type Ctx = {
  selected: CompareItem[];
  isSelected: (id: string) => boolean;
  toggle: (item: CompareItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  max: number;
};

const CompareContext = createContext<Ctx | null>(null);

export function CompareProvider({
  children,
  max = 4,
}: {
  children: ReactNode;
  max?: number;
}) {
  const [selected, setSelected] = useState<CompareItem[]>([]);

  const idOf = useCallback(
    (x: CompareItem | string) => (typeof x === "string" ? x : x.slug ?? x.name),
    []
  );

  const isSelected = useCallback(
    (id: string) => selected.some((s) => idOf(s) === id),
    [selected, idOf]
  );

  const remove = useCallback(
    (id: string) => {
      setSelected((prev) => prev.filter((s) => idOf(s) !== id));
    },
    [idOf]
  );

  const toggle = useCallback(
    (item: CompareItem) => {
      const id = idOf(item);
      setSelected((prev) => {
        const exists = prev.some((s) => idOf(s) === id);
        if (exists) return prev.filter((s) => idOf(s) !== id);
        if (prev.length >= max) return prev; // лимит
        return [...prev, item];
      });
    },
    [idOf, max]
  );

  const clear = useCallback(() => setSelected([]), []);

  const value = useMemo<Ctx>(
    () => ({ selected, isSelected, toggle, remove, clear, max }),
    [selected, isSelected, toggle, remove, clear, max]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

 
export function useCompare(): Ctx {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}