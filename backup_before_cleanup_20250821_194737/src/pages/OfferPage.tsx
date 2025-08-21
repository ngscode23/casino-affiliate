// src/pages/OfferPage.tsx
import { useParams, Link } from "react-router-dom";
import { offers } from "@/data/offers";

export default function OfferPage() {
  const { slug } = useParams<{ slug: string }>();
  const offer = offers.find(
    o => (o.slug ?? o.name.toLowerCase().replace(/\s+/g, "-")) === slug
  );

  if (!offer) {
    return (
      <div className="neon-container py-10">
        <div className="neon-card p-6">
          <h1 className="text-xl font-bold">Offer not found</h1>
          <p className="neon-subline mt-2">Проверь ссылку или вернись на главную.</p>
          <Link to="/" className="neon-btn inline-block mt-4 px-4 py-2">Back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="neon-container py-10">
      <div className="neon-card p-6 space-y-4">
        <h1 className="text-2xl font-extrabold">{offer.name}</h1>
        <div className="text-[var(--text-dim)]">License: {offer.license}</div>
        <div>Payout: {offer.payout}{offer.payoutHours ? ` (~${offer.payoutHours}h)` : ""}</div>
        <div className="flex flex-wrap gap-2">
          {(offer.methods ?? offer.payments ?? []).map((m, i) => (
            <span key={`${m}-${i}`} className="neon-chip">{m}</span>
          ))}
        </div>
        {offer.link && (
          <a href={offer.link} className="neon-btn inline-block px-4 py-2">Play</a>
        )}
        <div>
          <Link to="/" className="text-[var(--text-dim)] hover:underline">← Back to list</Link>
        </div>
      </div>
    </div>
  );
}