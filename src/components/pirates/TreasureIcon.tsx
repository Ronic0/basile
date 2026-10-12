import type { TreasureId } from "../../data/pirates";

export function TreasureIcon({ id, className = "" }: { id: TreasureId; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-hidden="true">
      {id === "piece" && (
        <g>
          <circle cx="24" cy="40" r="16" fill="#e0a72a" />
          <circle cx="24" cy="40" r="12" fill="#ffd34d" />
          <path d="M24 32 v16 M20 36 q8 -4 8 4 q0 6 -8 4" stroke="#b98612" strokeWidth="2.4" fill="none" />
          <circle cx="42" cy="28" r="14" fill="#e0a72a" />
          <circle cx="42" cy="28" r="10" fill="#ffd34d" />
        </g>
      )}
      {id === "coquillage" && (
        <g>
          <path d="M32 54 q-24 -4 -24 -24 q0 -14 12 -14 q8 0 12 8 q4 -8 12 -8 q12 0 12 14 q0 20 -24 24 z" fill="#ff9db5" />
          <path d="M32 54 v-30 M20 40 q4 -8 12 -10 M44 40 q-4 -8 -12 -10" stroke="#ffd7e0" strokeWidth="2" fill="none" />
        </g>
      )}
      {id === "perle" && (
        <g>
          <path d="M8 40 q24 16 48 0 q-6 18 -24 18 q-18 0 -24 -18 z" fill="#c084fc" />
          <circle cx="32" cy="34" r="14" fill="#ffffff" />
          <circle cx="27" cy="29" r="4" fill="#e8dcff" />
        </g>
      )}
      {id === "rubis" && (
        <g>
          <path d="M32 8 L52 24 L32 56 L12 24 z" fill="#e8543f" />
          <path d="M32 8 L42 24 L32 56 L22 24 z" fill="#ff7d6a" />
          <path d="M12 24 h40" stroke="#b5321f" strokeWidth="2" />
        </g>
      )}
      {id === "emeraude" && (
        <g>
          <path d="M32 8 L52 24 L32 56 L12 24 z" fill="#2f9e5a" />
          <path d="M32 8 L42 24 L32 56 L22 24 z" fill="#5fd08a" />
          <path d="M12 24 h40" stroke="#1c6e3e" strokeWidth="2" />
        </g>
      )}
      {id === "carte" && (
        <g>
          <rect x="10" y="14" width="44" height="36" rx="4" fill="#e8d3a0" />
          <path d="M14 20 h36 v24 h-36 z" fill="#f3e4bd" />
          <path d="M18 38 q8 -12 14 -4 q4 5 12 -6" stroke="#c0563f" strokeWidth="2" fill="none" strokeDasharray="4 3" />
          <circle cx="42" cy="26" r="3.4" fill="#e8543f" />
          <path d="M10 14 q-6 18 0 36 M54 14 q6 18 0 36" stroke="#b98612" strokeWidth="3" fill="none" />
        </g>
      )}
    </svg>
  );
}
