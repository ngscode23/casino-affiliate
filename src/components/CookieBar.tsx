// src/components/CookieBar.tsx
import { useState } from "react";

export default function CookieBar() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="neon-card fixed bottom-4 left-1/2 -translate-x-1/2 p-4 flex items-center gap-4 z-50">
      <span>We use cookies to improve your experience.</span>
      <button className="neon-btn" onClick={() => setOpen(false)}>Accept</button>
      <button className="neon-btn" onClick={() => alert("Settings modal")}>Settings</button>
    </div>
  );
}