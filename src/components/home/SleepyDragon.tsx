interface Props {
  className?: string;
}

/**
 * Petit dragon endormi, personnage décoratif original du portail.
 * Pur SVG, animation de respiration et « Zzz ».
 */
export function SleepyDragon({ className = "" }: Props) {
  return (
    <svg
      className={`sleepy-dragon ${className}`.trim()}
      viewBox="0 0 170 130"
      role="img"
      aria-label="Petit dragon endormi"
    >
      <ellipse className="sleepy-dragon__shadow" cx="88" cy="118" rx="62" ry="10" />

      <g className="sleepy-dragon__body">
        <path
          className="sleepy-dragon__tail"
          d="M150 96 q22 -4 16 -26 q-4 -16 -18 -10 q10 10 0 16 q-8 4 -14 2 z"
        />
        <ellipse className="sleepy-dragon__torso" cx="82" cy="88" rx="56" ry="32" />
        <ellipse className="sleepy-dragon__belly" cx="80" cy="96" rx="36" ry="20" />
        <path
          className="sleepy-dragon__wing"
          d="M64 70 q-34 -30 -58 -6 q22 4 28 16 q-18 2 -22 12 q26 -2 46 -4 z"
        />
        <circle className="sleepy-dragon__spike" cx="70" cy="58" r="7" />
        <circle className="sleepy-dragon__spike" cx="92" cy="62" r="6" />
        <circle className="sleepy-dragon__spike" cx="112" cy="70" r="5" />

        <circle className="sleepy-dragon__head" cx="46" cy="66" r="30" />
        <path className="sleepy-dragon__snout" d="M24 66 q-22 2 -22 16 q2 12 22 10 q14 -2 16 -14 z" />
        <circle className="sleepy-dragon__nostril" cx="10" cy="80" r="3" />
        <circle className="sleepy-dragon__cheek" cx="38" cy="78" r="7" />

        <path className="sleepy-dragon__eye" d="M36 60 q6 5 12 0" />
        <path className="sleepy-dragon__eye" d="M58 62 q5 4 10 0" />

        <path className="sleepy-dragon__horn" d="M52 40 q0 -18 12 -22 q-4 12 2 16 z" />
        <ellipse className="sleepy-dragon__foot" cx="64" cy="116" rx="14" ry="7" />
        <ellipse className="sleepy-dragon__foot" cx="102" cy="116" rx="14" ry="7" />
      </g>

      <g className="sleepy-dragon__zzz" aria-hidden="true">
        <text className="sleepy-dragon__z sleepy-dragon__z--1" x="120" y="52">
          z
        </text>
        <text className="sleepy-dragon__z sleepy-dragon__z--2" x="134" y="38">
          Z
        </text>
        <text className="sleepy-dragon__z sleepy-dragon__z--3" x="146" y="22">
          Z
        </text>
      </g>
    </svg>
  );
}
