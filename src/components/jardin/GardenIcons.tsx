import type { PlantType } from "../../lib/garden";

/** Aperçu d'une graine / de la plante finale (barre d'outils). */
export function SeedPreview({ type, className = "" }: { type: PlantType; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      {type === "tournesol" && (
        <g>
          <path d="M32 58 V26" stroke="#3f8f38" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 44 q-12 -2 -14 -12 q12 0 14 12 z" fill="#5aa64a" />
          <path d="M32 38 q12 -2 14 -12 q-12 0 -14 12 z" fill="#6cc05a" />
          {Array.from({ length: 10 }).map((_, i) => (
            <ellipse key={i} cx="0" cy="-14" rx="4" ry="8" fill="#ffd34d" transform={`translate(32 16) rotate(${i * 36})`} />
          ))}
          <circle cx="32" cy="16" r="8" fill="#8a5a2b" />
        </g>
      )}
      {type === "fraisier" && (
        <g>
          <ellipse cx="32" cy="50" rx="20" ry="12" fill="#3f8f38" />
          <ellipse cx="22" cy="44" rx="10" ry="7" fill="#5aa64a" />
          <ellipse cx="42" cy="44" rx="10" ry="7" fill="#6cc05a" />
          <path d="M32 30 q9 2 8 12 q-2 10 -8 12 q-6 -2 -8 -12 q-1 -10 8 -12 z" fill="#e8543f" />
          <path d="M26 29 q6 -5 12 0 q-6 3 -12 0 z" fill="#3aa34a" />
        </g>
      )}
      {type === "carotte" && (
        <g>
          <path d="M24 34 q-3 -14 8 -22" stroke="#3f8f38" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <path d="M32 32 V10" stroke="#3f8f38" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M40 34 q3 -14 -8 -22" stroke="#3f8f38" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <path d="M20 34 q12 -6 24 0 q-3 20 -12 26 q-9 -6 -12 -26 z" fill="#f0913a" />
          <path d="M28 40 l2 8 M36 40 l-2 8" stroke="#d5713a" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
}

export function WateringCanIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <rect x="20" y="24" width="26" height="26" rx="6" fill="#3aa34a" />
      <rect x="24" y="16" width="16" height="10" rx="4" fill="#4fb06a" />
      <path d="M22 26 L6 20 L6 26 L22 32 z" fill="#2f8f42" />
      <circle cx="8" cy="23" r="4" fill="#2f8f42" />
      <path d="M46 28 q10 4 8 14 q-6 -2 -10 -6 z" fill="#2f8f42" />
      <circle cx="8" cy="34" r="2" fill="#8ad0ff" />
      <circle cx="13" cy="40" r="2" fill="#8ad0ff" />
      <circle cx="18" cy="46" r="2" fill="#8ad0ff" />
    </svg>
  );
}

export function BasketIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M14 30 h36 l-5 24 h-26 z" fill="#b5763c" />
      <path d="M14 30 h36 l-1.4 7 h-33.2 z" fill="#8a5a2b" />
      <g stroke="#8a5a2b" strokeWidth="1.6">
        <path d="M22 30 l-2 24" />
        <path d="M32 30 v24" />
        <path d="M42 30 l2 24" />
      </g>
      <path d="M20 30 q12 -16 24 0" fill="none" stroke="#8a5a2b" strokeWidth="3" />
      <circle cx="26" cy="24" r="5" fill="#e8543f" />
      <circle cx="38" cy="22" r="5" fill="#ffd34d" />
    </svg>
  );
}
