// src/components/AffiliateLink.tsx
import { ReactNode } from "react";

type Props = {
  href: string;          // исходный оффер-линк
  id: string;            // slug или name
  children: ReactNode;
  className?: string;
};
export default function AffiliateLink({ href, id, children, className }: Props) {
  // /go?id=... — ваш Netlify Function уже есть. Можно добавить UTM прямо здесь:
  const url = `/go?id=${encodeURIComponent(id)}&u=${encodeURIComponent(href)}&utm_source=site&utm_medium=button&utm_campaign=play`;
  return (
    <a
      href={url}
      rel="nofollow sponsored noopener"
      target="_blank"
      className={className}
      onClick={() => {
        // простейшая телеметрия
        window.dispatchEvent(new CustomEvent("track", { detail: { ev: "click_play", id } }));
      }}
    >
      {children}
    </a>
  );
}
