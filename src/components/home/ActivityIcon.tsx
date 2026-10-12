import type { ActivityId } from "../../data/activities";

interface Props {
  id: ActivityId;
  className?: string;
}

/**
 * Illustrations vectorielles originales pour chaque activité.
 * Rendu cohérent (formes arrondies, couleurs douces), aucun emoji.
 */
export function ActivityIcon({ id, className = "" }: Props) {
  const classes = ["activity-icon", `activity-icon--${id}`, className].filter(Boolean).join(" ");
  return (
    <svg className={classes} viewBox="0 0 120 120" role="img" aria-hidden="true">
      {id === "jardin-alphas" && <JardinAlphas />}
      {id === "nurserie" && <Nurserie />}
      {id === "jardin-magique" && <JardinMagique />}
      {id === "atelier" && <Atelier />}
      {id === "port-pirates" && <PortPirates />}
      {id === "cabane" && <Cabane />}
    </svg>
  );
}

function JardinAlphas() {
  return (
    <g>
      <ellipse cx="60" cy="104" rx="46" ry="12" fill="#5aa64a" />
      <path
        d="M24 104 q-4 -46 36 -60 q40 14 36 60"
        fill="none"
        stroke="#6b8f3a"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path d="M60 44 v-12" stroke="#6b8f3a" strokeWidth="9" strokeLinecap="round" />
      <g fill="#f0b429">
        <circle cx="60" cy="26" r="7" />
      </g>
      <g stroke="#4a9a3f" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M30 62 q4 10 -2 16" />
        <path d="M90 62 q-4 10 2 16" />
      </g>
      <Flower x={28} y={96} petal="#ff7d9a" />
      <Flower x={92} y={96} petal="#8ab6ff" />
      <Flower x={60} y={99} petal="#ffd34d" />
      <g>
        <rect x="49" y="62" width="22" height="18" rx="4" fill="#b5763c" />
        <circle cx="60" cy="71" r="7" fill="#fff6e0" />
        <text
          x="60"
          y="76"
          textAnchor="middle"
          fontFamily="'Trebuchet MS', sans-serif"
          fontWeight="800"
          fontSize="11"
          fill="#8a5a2b"
        >
          A
        </text>
      </g>
    </g>
  );
}

function Nurserie() {
  return (
    <g>
      <ellipse cx="60" cy="102" rx="44" ry="13" fill="#8a5a2b" />
      <path
        d="M20 96 q10 -26 40 -26 q30 0 40 26 q-40 14 -80 0 z"
        fill="#b5763c"
      />
      <g stroke="#8a5a2b" strokeWidth="2.4" fill="none" opacity="0.7">
        <path d="M30 92 q30 8 60 0" />
        <path d="M26 84 q34 8 68 0" />
      </g>
      <ellipse cx="60" cy="78" rx="20" ry="25" fill="#fff6e0" stroke="#e7d9be" strokeWidth="2" />
      <g fill="#b9a58a" opacity="0.55">
        <circle cx="52" cy="70" r="3" />
        <circle cx="68" cy="66" r="2.6" />
        <circle cx="64" cy="84" r="3.4" />
        <circle cx="53" cy="88" r="2.2" />
      </g>
      <path d="M46 84 q6 -8 12 -2 q6 6 12 -1 q4 8 -6 11 q-10 3 -18 -8 z" fill="#5cbd77" />
      <circle cx="86" cy="54" r="12" fill="#5cbd77" />
      <path d="M74 52 q10 -2 14 6 q-8 2 -14 -6 z" fill="#7fd39a" />
      <circle cx="82" cy="52" r="2.6" fill="#22303a" />
      <circle cx="90" cy="55" r="2.2" fill="#22303a" />
      <path d="M96 48 q8 -6 12 -2 q-6 4 -4 8 q-6 0 -8 -6 z" fill="#f5a623" />
    </g>
  );
}

function JardinMagique() {
  return (
    <g>
      <ellipse cx="58" cy="102" rx="42" ry="12" fill="#8a5a2b" />
      <path d="M34 104 q0 -22 24 -22 q24 0 24 22 z" fill="#a06a34" />
      <path d="M62 100 v-34" stroke="#4a9a3f" strokeWidth="6" strokeLinecap="round" />
      <path d="M62 78 q-18 -2 -20 -16 q18 0 20 16 z" fill="#6cc05a" />
      <path d="M62 70 q18 -2 20 -16 q-18 0 -20 16 z" fill="#7fd39a" />
      <circle cx="62" cy="52" r="9" fill="#ffd34d" />
      <circle cx="62" cy="52" r="4" fill="#ff9d3a" />
      <g transform="translate(78 40)">
        <path d="M0 16 q10 -2 12 -12 q8 2 6 12 q-2 8 -12 8 q4 -6 -6 -8 z" fill="#2f9bd6" />
        <path d="M22 8 l10 4 l-2 6 l-10 -2 z" fill="#2f9bd6" />
        <circle cx="2" cy="24" r="2" fill="#8ad0ff" />
        <circle cx="8" cy="30" r="1.6" fill="#8ad0ff" />
      </g>
      <g fill="#fff3b0">
        <Sparkle x={30} y={40} s={1} />
        <Sparkle x={92} y={30} s={0.8} />
        <Sparkle x={40} y={22} s={0.7} />
      </g>
    </g>
  );
}

function Atelier() {
  return (
    <g>
      <ellipse cx="60" cy="104" rx="46" ry="11" fill="#c9b7a0" />
      <rect x="24" y="84" width="34" height="16" rx="4" fill="#f0b429" />
      <rect x="62" y="84" width="34" height="16" rx="4" fill="#e8543f" />
      <rect x="42" y="66" width="34" height="16" rx="4" fill="#2f9bd6" />
      <g>
        <rect x="40" y="30" width="40" height="30" rx="8" fill="#9aa9bf" />
        <rect x="46" y="38" width="28" height="10" rx="4" fill="#3a4a5e" />
        <circle cx="53" cy="43" r="3.4" fill="#8ad0ff" />
        <circle cx="67" cy="43" r="3.4" fill="#8ad0ff" />
        <rect x="52" y="52" width="16" height="4" rx="2" fill="#5a6b80" />
        <rect x="56" y="20" width="8" height="10" rx="3" fill="#7d4bd1" />
        <circle cx="60" cy="18" r="4" fill="#ffd34d" />
      </g>
    </g>
  );
}

function PortPirates() {
  return (
    <g>
      <ellipse cx="60" cy="90" rx="46" ry="12" fill="#2f9bd6" />
      <path d="M18 92 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0 v10 H18 z" fill="#1f6ea3" />
      <path d="M34 88 q4 14 26 14 q22 0 26 -14 z" fill="#8a5a2b" />
      <rect x="57" y="34" width="5" height="54" rx="2" fill="#6b4410" />
      <path d="M62 38 q26 6 26 22 q-26 6 -26 -6 z" fill="#fff6e0" />
      <path d="M62 44 q18 4 18 14 q-18 4 -18 -2 z" fill="#e8543f" />
      <path d="M62 34 l14 3 l-14 4 z" fill="#ffd34d" />
    </g>
  );
}

function Cabane() {
  return (
    <g>
      <ellipse cx="60" cy="104" rx="46" ry="11" fill="#8fc06a" />
      <rect x="30" y="56" width="60" height="46" rx="5" fill="#e6cfa0" />
      <path d="M22 58 L60 26 L98 58 z" fill="#c0563f" />
      <rect x="52" y="76" width="16" height="26" rx="3" fill="#8a5a2b" />
      <circle cx="64" cy="90" r="1.6" fill="#ffd34d" />
      <rect x="38" y="66" width="14" height="14" rx="3" fill="#8ad0ff" stroke="#6b8f3a" strokeWidth="2" />
      <rect x="70" y="30" width="10" height="18" rx="3" fill="#a06a34" />
      <path d="M78 28 q10 -10 4 -18 q-8 6 -4 18 z" fill="#d9d9d9" opacity="0.8" />
      <path
        d="M60 70 c-4 -6 -14 -2 -12 6 c2 6 12 10 12 10 s10 -4 12 -10 c2 -8 -8 -12 -12 -6 z"
        fill="#ff7d9a"
      />
    </g>
  );
}

function Flower({ x, y, petal }: { x: number; y: number; petal: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 v-14" stroke="#3f8f38" strokeWidth="3" strokeLinecap="round" />
      <g fill={petal}>
        <circle cx="0" cy="-20" r="5.5" />
        <circle cx="-6" cy="-15" r="5.5" />
        <circle cx="6" cy="-15" r="5.5" />
        <circle cx="-3" cy="-9" r="5.5" />
        <circle cx="3" cy="-9" r="5.5" />
      </g>
      <circle cx="0" cy="-15" r="3.4" fill="#ffd34d" />
    </g>
  );
}

function Sparkle({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z"
    />
  );
}
