import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useCompare } from "@/ctx/CompareContext";
import Rating from "@/ui/Rating";

export default function CompareBar() {
  const { selected, clear, remove } = useCompare();
  const canCompare = selected.length >= 2;

  const rows = useMemo(() => {
    // простая структура сравнения
    return [
      { k: "Rating", render: (o: any) => <Rating value={o.rating} /> },
      { k: "License", render: (o: any) => o.license },
      { k: "Payout", render: (o: any) => `${o.payout}${o.payoutHours ? ` (~${o.payoutHours}h)` : ""}` },
      { k: "Methods", render: (o: any) => (o.methods ?? o.payments ?? []).join(", ") || "—" },
    ];
  }, [selected]);

  if (!selected.length) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[60]">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[var(--bg-1)]/95 backdrop-blur p-3 shadow-[0_8px_30px_rgba(0,0,0,.4)]">
        <div className="flex items-center gap-2">
          <div className="text-sm text-[var(--text-dim)]">Compare:</div>
          <div className="flex flex-wrap gap-2">
            {selected.map(o => (
              <span key={o.slug ?? o.name} className="neon-chip inline-flex items-center gap-2">
                {o.name}
                <button
                  className="opacity-70 hover:opacity-100"
                  onClick={() => remove(o.slug ?? o.name)}
                  aria-label={`Remove ${o.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" onClick={clear}>Clear</Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button disabled={!canCompare}>Open compare</Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[80vh] overflow-auto rounded-t-2xl bg-[var(--bg-0)] text-[var(--text)]">
                <SheetHeader>
                  <SheetTitle>Compare offers</SheetTitle>
                </SheetHeader>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm border-separate border-spacing-y-2">
                    <thead>
                      <tr>
                        <th className="text-left px-3 py-2">Field</th>
                        {selected.map(o => (
                          <th key={o.slug ?? o.name} className="text-left px-3 py-2">{o.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(row => (
                        <tr key={row.k}>
                          <td className="px-3 py-2 text-[var(--text-dim)]">{row.k}</td>
                          {selected.map(o => (
                            <td key={(o.slug ?? o.name) + row.k} className="px-3 py-2">
                              {row.render(o)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}