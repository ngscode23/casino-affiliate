//src/components/FavControl.tsx
import { useFavorites } from "@/lib/useFavorites";
import Button from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";

export function FavControl({ id }: { id: string }) {
  const { has, toggle } = useFavorites();
  const active = has(id);
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      onClick={() => toggle(id)}
      aria-pressed={active}
      title={active ? "Remove from favorites" : "Add to favorites"}
    >
      {active ? <HeartOff className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
    </Button>
  );
}