interface Props {
  /** Humeur visuelle : maladroit au repos, joyeux à la victoire. */
  mood?: "silly" | "happy";
  /** Le dragon s'envole (victoire). */
  flying?: boolean;
  className?: string;
}

/**
 * Dragon du prénom : original, sympathique et maladroit.
 * SVG maison, aucune ressource distante.
 */
export function BossDragon({ mood = "silly", flying = false, className = "" }: Props) {
  const classes = ["dragon-svg", `dragon-svg--${mood}`];
  if (flying) classes.push("is-flying");
  if (className) classes.push(className);

  return (
    <svg
      className={classes.join(" ")}
      viewBox="0 0 220 180"
      role="img"
      aria-label="Dragon du prénom"
    >
      <ellipse className="dragon-svg__shadow" cx="110" cy="168" rx="58" ry="9" />

      <g className="dragon-svg__body">
        <path
          className="dragon-svg__tail"
          d="M186 120 q30 -4 24 -30 q-4 -16 -18 -12 q10 12 -2 18 q-8 4 -14 2 z"
        />
        <ellipse className="dragon-svg__torso" cx="104" cy="118" rx="54" ry="40" />
        <ellipse className="dragon-svg__belly" cx="104" cy="126" rx="36" ry="27" />
        <path
          className="dragon-svg__wing"
          d="M92 96 q-52 -40 -78 -6 q26 6 34 22 q-22 4 -26 16 q30 -2 52 -4 z"
        />
        <path
          className="dragon-svg__wing dragon-svg__wing--back"
          d="M120 92 q40 -44 72 -18 q-24 6 -32 22 q20 2 24 14 q-28 -2 -50 -4 z"
        />
        <circle className="dragon-svg__head" cx="66" cy="74" r="34" />
        <path
          className="dragon-svg__snout"
          d="M40 74 q-26 0 -28 16 q0 16 26 14 q18 -2 20 -16 z"
        />
        <circle className="dragon-svg__nostril" cx="22" cy="90" r="3.4" />
        <circle className="dragon-svg__cheek" cx="52" cy="88" r="8" />
        <circle className="dragon-svg__eye" cx="58" cy="62" r="11" />
        <circle className="dragon-svg__pupil" cx="55" cy="64" r="5" />
        <circle className="dragon-svg__glint" cx="52.5" cy="61" r="1.8" />
        <circle className="dragon-svg__eye" cx="88" cy="64" r="10" />
        <circle className="dragon-svg__pupil" cx="86" cy="66" r="4.6" />
        <circle className="dragon-svg__glint" cx="83.5" cy="63" r="1.6" />
        <path className="dragon-svg__horn" d="M70 44 q2 -22 16 -26 q-4 14 4 18 z" />
        <path className="dragon-svg__horn" d="M94 46 q8 -20 24 -18 q-10 12 -6 18 z" />
        <path
          className="dragon-svg__mouth"
          d="M32 96 q14 10 30 2"
          fill="none"
        />
        <path className="dragon-svg__spike" d="M104 82 l8 -14 l8 14 z" />
        <path className="dragon-svg__spike" d="M128 88 l9 -12 l7 14 z" />
        <path className="dragon-svg__spike" d="M150 100 l10 -10 l5 15 z" />
        <ellipse className="dragon-svg__foot" cx="80" cy="156" rx="16" ry="9" />
        <ellipse className="dragon-svg__foot" cx="126" cy="156" rx="16" ry="9" />

        <g className="dragon-svg__tiles" aria-hidden="true">
          <text x="8" y="34" className="dragon-svg__tile">
            B
          </text>
          <text x="30" y="22" className="dragon-svg__tile">
            A
          </text>
          <text x="52" y="34" className="dragon-svg__tile">
            S
          </text>
        </g>
      </g>
    </svg>
  );
}
