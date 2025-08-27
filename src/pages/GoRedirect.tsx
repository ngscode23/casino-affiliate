import { useEffect } from "react";
import { useParams } from "react-router-dom";

// слugs -> целевые URL
const MAP: Record<string, string> = {
  "lucky-star": "https://partner.example.com/lucky-star?utm_source=site",
  "mega-spin": "https://partner.example.com/mega-spin?utm_source=site",
};

export default function GoRedirect() {
  const { slug = "" } = useParams();

  useEffect(() => {
    const target = MAP[slug];
    if (target) {
      // тут можно дернуть пиксель/аналитику
      location.replace(target);
    } else {
      // если нет маппинга, уводим на главную
      location.replace("/");
    }
  }, [slug]);

  return null;
}