interface Props {
  /** Les portes s'ouvrent (victoire). */
  open?: boolean;
  className?: string;
}

/**
 * Château du prénom (SVG maison). Les portes s'ouvrent à la victoire.
 */
export function BossCastle({ open = false, className = "" }: Props) {
  const classes = ["castle-svg"];
  if (open) classes.push("is-open");
  if (className) classes.push(className);

  return (
    <svg
      className={classes.join(" ")}
      viewBox="0 0 280 240"
      role="img"
      aria-label="Château du prénom"
    >
      <ellipse className="castle-svg__shadow" cx="140" cy="228" rx="120" ry="12" />

      <rect className="castle-svg__wall" x="60" y="110" width="160" height="112" rx="6" />

      <g className="castle-svg__tower">
        <rect x="26" y="70" width="48" height="152" rx="6" />
        <polygon className="castle-svg__roof" points="20,72 50,30 80,72" />
        <rect className="castle-svg__battlement" x="26" y="64" width="48" height="12" rx="3" />
      </g>
      <g className="castle-svg__tower">
        <rect x="206" y="70" width="48" height="152" rx="6" />
        <polygon className="castle-svg__roof" points="200,72 230,30 260,72" />
        <rect className="castle-svg__battlement" x="206" y="64" width="48" height="12" rx="3" />
      </g>

      <g className="castle-svg__tower castle-svg__tower--center">
        <rect x="112" y="52" width="56" height="170" rx="6" />
        <polygon className="castle-svg__roof" points="104,54 140,8 176,54" />
        <rect className="castle-svg__battlement" x="112" y="46" width="56" height="12" rx="3" />
        <path className="castle-svg__flag" d="M140 8 l30 8 l-30 8 z" />
        <line className="castle-svg__mast" x1="140" y1="0" x2="140" y2="14" />
      </g>

      <g className="castle-svg__gate">
        <path className="castle-svg__arch" d="M112 222 v-52 a28 28 0 0 1 56 0 v52 z" />
        <rect className="castle-svg__door castle-svg__door--left" x="112" y="142" width="28" height="80" />
        <rect className="castle-svg__door castle-svg__door--right" x="140" y="142" width="28" height="80" />
      </g>

      <circle className="castle-svg__window" cx="140" cy="96" r="9" />
      <circle className="castle-svg__window" cx="50" cy="110" r="7" />
      <circle className="castle-svg__window" cx="230" cy="110" r="7" />
    </svg>
  );
}
