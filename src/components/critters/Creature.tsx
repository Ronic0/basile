interface Props {
  variant: number;
  className?: string;
}

const PALETTE = [
  { body: "#ff9ec4", accent: "#ff5fa2" }, // 0 rose
  { body: "#7fd1ff", accent: "#3aa6e0" }, // 1 bleu
  { body: "#9be27a", accent: "#5bb64a" }, // 2 vert
  { body: "#ffd45e", accent: "#f2a71b" }, // 3 jaune
  { body: "#c6a6ff", accent: "#8f5fe0" }, // 4 violet
];

/**
 * Créature fantastique originale, dessinée en SVG.
 * 5 variantes : feuille, antennes, cornes, étoile, ailes.
 */
export function Creature({ variant, className }: Props) {
  const v = ((variant % PALETTE.length) + PALETTE.length) % PALETTE.length;
  const { body, accent } = PALETTE[v];

  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      {v === 4 && (
        <g fill={accent} opacity="0.85">
          <path d="M24 58 q-18 -10 -20 6 q10 6 20 -2 z" />
          <path d="M76 58 q18 -10 20 6 q-10 6 -20 -2 z" />
        </g>
      )}

      <circle cx="50" cy="60" r="30" fill={body} />
      <circle cx="50" cy="64" r="18" fill="rgba(255,255,255,0.45)" />

      {v === 0 && <path d="M50 30 q-10 -14 4 -20 q2 12 -4 20 z" fill="#5bb64a" />}
      {v === 1 && (
        <g stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M40 32 v-12" />
          <path d="M60 32 v-12" />
          <circle cx="40" cy="18" r="3.5" fill={accent} stroke="none" />
          <circle cx="60" cy="18" r="3.5" fill={accent} stroke="none" />
        </g>
      )}
      {v === 2 && (
        <g fill={accent}>
          <path d="M36 34 l-6 -12 l12 6 z" />
          <path d="M64 34 l6 -12 l-12 6 z" />
        </g>
      )}
      {v === 3 && (
        <path
          d="M50 10 l4 9 10 1 -7 7 2 10 -9 -5 -9 5 2 -10 -7 -7 10 -1 z"
          fill={accent}
        />
      )}

      <circle cx="40" cy="54" r="6" fill="#fff" />
      <circle cx="60" cy="54" r="6" fill="#fff" />
      <circle cx="41" cy="55" r="3" fill="#333" />
      <circle cx="61" cy="55" r="3" fill="#333" />
      <circle cx="33" cy="64" r="4" fill={accent} opacity="0.5" />
      <circle cx="67" cy="64" r="4" fill={accent} opacity="0.5" />
      <path
        d="M43 68 q7 7 14 0"
        stroke="#333"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
