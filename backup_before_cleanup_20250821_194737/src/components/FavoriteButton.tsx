import { Heart, HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/useFavorites";

export default function FavoriteButton({ id }: { id: string }) {
  const { has, toggle } = useFavorites();
  const active = has(id);

  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="icon"
      aria-pressed={active}
      onClick={() => toggle(id)}
      title={active ? "Remove from favorites" : "Add to favorites"}
    >
      {active ? <HeartOff className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
    </Button>
  );
}