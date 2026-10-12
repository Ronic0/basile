export type DragonState =
  | "idle"
  | "happy"
  | "eating"
  | "drinking"
  | "sleeping"
  | "waking"
  | "playing"
  | "beingPetted";

export type DragonSurprise = "sneeze" | "spin" | "yawn" | "wiggle" | null;

interface Props {
  state: DragonState;
  surprise?: DragonSurprise;
  className?: string;
}

/**
 * Bébé dragon original de la Nurserie (pur SVG, aucune ressource distante).
 * Les états et surprises sont pilotés par des classes CSS.
 */
export function BabyDragon({ state, surprise = null, className = "" }: Props) {
  const classes = ["baby-dragon", `baby-dragon--${state}`];
  if (surprise) classes.push(`is-${surprise}`);
  if (className) classes.push(className);

  return (
    <svg
      className={classes.join(" ")}
      viewBox="0 0 220 220"
      role="img"
      aria-label="Bébé dragon"
    >
      <ellipse className="baby-dragon__shadow" cx="112" cy="203" rx="72" ry="13" />

      <g className="baby-dragon__rig">
        <path
          className="baby-dragon__tail"
          d="M150 168 q48 -4 42 -44 q-6 -22 -26 -16 q14 14 0 24 q-12 8 -22 4 z"
        />
        <path className="baby-dragon__tail-tip" d="M188 108 l-14 6 l12 12 z" />

        <path
          className="baby-dragon__wing baby-dragon__wing--left"
          d="M74 132 q-44 -34 -66 -8 q26 6 32 18 q-18 4 -22 14 q30 -2 56 -4 z"
        />
        <path
          className="baby-dragon__wing baby-dragon__wing--right"
          d="M150 130 q44 -34 66 -8 q-26 6 -32 18 q18 4 22 14 q-30 -2 -56 -4 z"
        />

        <ellipse className="baby-dragon__foot" cx="92" cy="190" rx="20" ry="12" />
        <ellipse className="baby-dragon__foot" cx="132" cy="190" rx="20" ry="12" />

        <ellipse className="baby-dragon__torso" cx="112" cy="150" rx="54" ry="46" />
        <ellipse className="baby-dragon__belly" cx="112" cy="158" rx="37" ry="32" />

        <g className="baby-dragon__spikes">
          <path d="M96 114 l10 -18 l10 18 z" />
          <path d="M120 110 l11 -17 l9 18 z" />
          <path d="M144 116 l11 -15 l7 18 z" />
        </g>

        <g className="baby-dragon__head">
          <path className="baby-dragon__horn" d="M78 60 q0 -24 16 -30 q-6 16 4 22 z" />
          <path className="baby-dragon__horn" d="M104 62 q10 -24 28 -22 q-12 14 -8 22 z" />
          <path className="baby-dragon__ear" d="M52 84 q-20 -6 -24 8 q16 4 26 -2 z" />
          <path className="baby-dragon__ear" d="M124 82 q22 -8 26 6 q-18 6 -28 0 z" />

          <circle className="baby-dragon__skull" cx="88" cy="92" r="42" />

          <path
            className="baby-dragon__snout"
            d="M52 92 q-30 0 -32 18 q0 18 30 16 q22 -2 24 -18 z"
          />
          <circle className="baby-dragon__nostril" cx="34" cy="104" r="3.6" />
          <circle className="baby-dragon__nostril" cx="48" cy="108" r="3.2" />
          <circle className="baby-dragon__cheek" cx="66" cy="106" r="9" />
          <circle className="baby-dragon__cheek" cx="116" cy="104" r="9" />

          <g className="baby-dragon__eyes">
            <circle className="baby-dragon__eye" cx="74" cy="82" r="12" />
            <circle className="baby-dragon__eye" cx="106" cy="80" r="12" />
            <circle className="baby-dragon__pupil" cx="72" cy="84" r="5.6" />
            <circle className="baby-dragon__pupil" cx="104" cy="82" r="5.6" />
            <circle className="baby-dragon__glint" cx="69" cy="80" r="2" />
            <circle className="baby-dragon__glint" cx="101" cy="78" r="2" />
            <rect className="baby-dragon__eyelid" x="60" y="68" width="28" height="30" rx="12" />
            <rect className="baby-dragon__eyelid" x="92" y="66" width="28" height="30" rx="12" />
          </g>

          <g className="baby-dragon__eyes-closed">
            <path d="M64 84 q10 8 20 0" />
            <path d="M96 82 q10 8 20 0" />
          </g>

          <path className="baby-dragon__smile" d="M44 118 q20 12 40 2" />

          <g className="baby-dragon__mouth-open">
            <path d="M46 116 q22 6 40 0 q-6 22 -20 22 q-14 0 -20 -22 z" />
          </g>

          <path
            className="baby-dragon__flame"
            d="M18 104 q-12 -4 -16 -14 q10 2 10 -6 q-4 -12 8 -14 q-2 12 8 14 q-6 12 -10 20 z"
          />
        </g>
      </g>

      <g className="baby-dragon__zzz" aria-hidden="true">
        <text className="baby-dragon__z baby-dragon__z--1" x="150" y="66">
          z
        </text>
        <text className="baby-dragon__z baby-dragon__z--2" x="164" y="50">
          Z
        </text>
        <text className="baby-dragon__z baby-dragon__z--3" x="178" y="32">
          Z
        </text>
      </g>
    </svg>
  );
}
