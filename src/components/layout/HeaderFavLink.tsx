import { Link } from "react-router-dom";
import { useFavorites } from "@/lib/useFavorites";

export default function HeaderFavLink() {
  const { items } = useFavorites();
  const count = items.length;

  return (
    <Link to="/favorites" className="relative inline-flex items-center gap-1">
      Favorites
      {count > 0 && (
        <span
          className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 text-white text-[11px] px-1"
          aria-label={`Favorites: ${count}`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}