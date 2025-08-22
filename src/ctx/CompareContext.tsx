import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CompareItem = {
  slug?: string;
  name: string;
} & Record<string, unknown>;

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

  const idOf = (x: CompareItem | string) =>
    typeof x === "string" ? x : (x.slug ?? x.name);

  const isSelected = (id: string) =>
    selected.some((s) => idOf(s) === id);

  const remove = (id: string) =>
    setSelected((prev) => prev.filter((s) => idOf(s) !== id));

  const toggle = (item: CompareItem) => {
    const id = idOf(item);
    if (isSelected(id)) {
      remove(id);
      return;
    }
    if (typeof item === "string") return;
    setSelected((prev) => {
      if (prev.length >= max) return prev;
      return [...prev, item];
    });
  };

  const clear = () => setSelected([]);

  const value = useMemo<Ctx>(
    () => ({
      selected,
      isSelected,
      toggle,
      remove,
      clear,
      max,
    }),
    [selected, max]
  );

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): Ctx {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}