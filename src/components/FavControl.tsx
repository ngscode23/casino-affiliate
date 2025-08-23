// src/components/FavControl.tsx
import { useFavorites } from "@/lib/useFavorites";
import Button from "@/components/common/button";
import { Heart, HeartOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function FavControl({ id }: { id: string }) {
  const { has, toggle } = useFavorites();
  const active = has(id);

  const onClick = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      alert("Чтобы синхронизировать избранное между устройствами — войдите через e-mail");
    }
    await toggle(id);
  };

  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      onClick={onClick}                     
      aria-pressed={active}
      title={active ? "Remove from favorites" : "Add to favorites"}
    >
      {active ? <HeartOff className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
    </Button>
  );
}

