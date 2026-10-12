interface Props {
  className?: string;
}

/** Bateau pirate original (SVG), avec coque, mât, voiles et pavillon. */
export function PirateShip({ className = "" }: Props) {
  return (
    <svg className={className} viewBox="0 0 170 150" role="img" aria-label="Bateau pirate">
      <ellipse className="pirate-ship__shadow" cx="86" cy="132" rx="66" ry="10" />

      <g className="pirate-ship__rock">
        <path className="pirate-ship__hull" d="M18 104 h134 l-16 26 q-52 12 -102 0 z" />
        <path className="pirate-ship__deck" d="M18 104 h134 l-3 8 h-128 z" />
        <circle className="pirate-ship__port" cx="52" cy="116" r="5" />
        <circle className="pirate-ship__port" cx="86" cy="118" r="5" />
        <circle className="pirate-ship__port" cx="120" cy="116" r="5" />

        <rect className="pirate-ship__mast" x="82" y="16" width="6" height="90" rx="3" />
        <path className="pirate-ship__sail" d="M88 24 q40 10 40 34 q-40 8 -40 -6 z" />
        <path className="pirate-ship__sail pirate-ship__sail--front" d="M82 34 q-30 8 -30 28 q30 6 30 -4 z" />
        <path className="pirate-ship__flag" d="M88 16 l26 4 l-26 6 z" />
        <g className="pirate-ship__skull" transform="translate(104 40)">
          <circle cx="0" cy="0" r="7" fill="#ffffff" />
          <circle cx="-2.6" cy="-1" r="1.8" fill="#22303a" />
          <circle cx="2.6" cy="-1" r="1.8" fill="#22303a" />
          <rect x="-3" y="4" width="6" height="4" rx="1" fill="#ffffff" />
          <path d="M-6 -8 l-5 -4 M6 -8 l5 -4" stroke="#fff" strokeWidth="2" />
        </g>
        <circle className="pirate-ship__flag-skull" cx="97" cy="20" r="0" />
      </g>
    </svg>
  );
}
