// src/components/OrgJsonLd.tsx
import { useEffect } from "react";
import { upsertJsonLd } from "@/lib/jsonld";

type Props = { data: Record<string, unknown>; id?: string };

export default function OrgJsonLd({ data, id = "jsonld-org" }: Props) {
  useEffect(() => {
    return upsertJsonLd(id, data); // вернём cleanup
  }, [id, data]); // ← НИКАКИХ stringify здесь
  return null;
}