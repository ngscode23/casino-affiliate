// src/components/CompareBar.tsx
import Section from "@/ui/Section";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCompare } from "@/ctx/CompareContext";

export default function CompareBar() {
  const { selected, clear, remove } = useCompare();

  // если нечего сравнивать — панель не показываем
  if (selected.length === 0) return null;

  return (
    <div className="sticky bottom-3 z-40">
      <Section>
        <div className="neon-card flex flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[var(--text-dim)]">Compare:</span>
            {selected.map((o) => {
              const id = o.slug ?? o.name;
              return (
                <span key={id} className="neon-chip flex items-center gap-2">
                  {o.name}
                  <button
                    type="button"
                    className="cursor-pointer inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/10"
                    aria-label={`Remove ${o.name} from compare`}
                    onClick={() => remove(id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Button
              type="button"
              variant="soft"
              onClick={clear}
              disabled={selected.length === 0}
              className="cursor-pointer"
              aria-label="Clear compare list"
            >
              Clear
            </Button>

            <Button asChild className="cursor-pointer" aria-label="Open compare page">
              <Link to="/compare">Open compare</Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}