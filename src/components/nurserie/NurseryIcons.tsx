/** Petites illustrations vectorielles des boutons d'action (SVG originaux). */

export function AppleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M32 20 q-6 -8 -18 -6 q-10 2 -8 18 q2 20 14 26 q6 3 12 0 q12 -6 14 -26 q2 -16 -8 -18 q-6 -2 -6 6 z"
        fill="#e8543f"
      />
      <path d="M32 20 q-2 -10 6 -14 q3 8 -2 15 z" fill="#3aa34a" />
      <rect x="30" y="8" width="4" height="12" rx="2" fill="#8a5a2b" />
      <ellipse cx="22" cy="34" rx="4" ry="6" fill="#ffffff" opacity="0.35" />
    </svg>
  );
}

export function FishIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M22 32 q14 -16 30 -10 q-4 10 0 20 q-16 6 -30 -10 z" fill="#f5a623" />
      <path d="M22 32 l-14 -10 v20 z" fill="#e8862a" />
      <circle cx="44" cy="27" r="3" fill="#22303a" />
      <path d="M34 24 q6 8 0 16" stroke="#e8862a" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function WaterIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M32 8 q16 20 16 30 a16 16 0 0 1 -32 0 q0 -10 16 -30 z"
        fill="#2f9bd6"
      />
      <path d="M26 34 a8 8 0 0 0 8 8" stroke="#bfe6ff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function PetIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M20 30 v-10 a4 4 0 0 1 8 0 v8 a4 4 0 0 1 8 0 v-2 a4 4 0 0 1 8 0 v6 a4 4 0 0 1 8 0 v6 q0 14 -16 14 q-16 0 -18 -12 z"
        fill="#ffd9a0"
        stroke="#e0a860"
        strokeWidth="2"
      />
      <path
        d="M30 16 c-2 -6 -10 -4 -9 2 c1 5 9 8 9 8 s8 -3 9 -8 c1 -6 -7 -8 -9 -2 z"
        fill="#ff7d9a"
      />
    </svg>
  );
}

export function BallIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="34" r="22" fill="#ffffff" stroke="#22303a" strokeWidth="2" />
      <path d="M32 12 q-12 22 0 44" stroke="#e8543f" strokeWidth="5" fill="none" />
      <path d="M10 34 q22 -12 44 0" stroke="#2f9bd6" strokeWidth="5" fill="none" />
    </svg>
  );
}

export function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M40 10 a24 24 0 1 0 14 40 a20 20 0 0 1 -14 -40 z"
        fill="#c084fc"
      />
      <text x="40" y="30" fontFamily="'Trebuchet MS', sans-serif" fontWeight="800" fontSize="16" fill="#ffffff">
        z
      </text>
    </svg>
  );
}

export function AwakeIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <g fill="#ffd34d">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x="30"
            y="4"
            width="4"
            height="10"
            rx="2"
            transform={`rotate(${i * 45} 32 32)`}
          />
        ))}
      </g>
      <circle cx="32" cy="32" r="16" fill="#ffe28a" />
      <circle cx="32" cy="32" r="12" fill="#ffd34d" />
    </svg>
  );
}
