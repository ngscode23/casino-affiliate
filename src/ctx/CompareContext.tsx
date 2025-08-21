import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Минимальный тип сущности для сравнения — нам важно уметь
 * стабильно получить id (slug или name). Остальные поля — по желанию.
 */
export type CompareItem = {
  slug?: string;
  name: string;
} & Record<string, unknown>;

type Ctx = {
  selected: CompareItem[];
  /** Проверить, выбран ли оффер (можно передавать оффер или строковый id) */
  isSelected: (item: CompareItem | string) => boolean;
  /** Переключить выбор (если строка — добавление невозможно, только снятие) */
  toggle: (item: CompareItem | string) => void;
  /** Удалить из сравнения по офферу или id */
  remove: (item: CompareItem | string) => void;
  /** Очистить сравнение */
  clear: () => void;
  /** Максимум одновременно выбранных офферов */
  max: number;
};

const CompareContext = createContext<Ctx | null>(null);

const getId = (x: CompareItem | string) =>
  typeof x === "string" ? x : (x.slug ?? x.name);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<CompareItem[]>([]);
  const max = 3;

  const isSelected = (item: CompareItem | string) => {
    const id = getId(item);
    return selected.some((s) => (s.slug ?? s.name) === id);
  };

  const remove = (item: CompareItem | string) => {
    const id = getId(item);
    setSelected((prev) => prev.filter((s) => (s.slug ?? s.name) !== id));
  };

  const toggle = (item: CompareItem | string) => {
    const id = getId(item);
    // если уже выбран — снять
    if (selected.some((s) => (s.slug ?? s.name) === id)) {
      remove(id);
      return;
    }
    // добавлять можно только объект (не string), чтобы что-то реально положить в список
    if (typeof item === "string") return;
    setSelected((prev) => {
      if (prev.length >= max) return prev; // лимит
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
    [selected]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within <CompareProvider>");
  return ctx;
}