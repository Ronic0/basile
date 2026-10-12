interface Props {
  className?: string;
}

/**
 * Décor du portail : ciel, soleil, nuages, chemin, cabane, fleurs,
 * papillons. Entièrement décoratif (pointer-events: none).
 */
export function GardenDecor({ className = "" }: Props) {
  return (
    <div className={`garden ${className}`.trim()} aria-hidden="true">
      <div className="garden__sun">
        <svg viewBox="0 0 120 120">
          <g className="garden__sun-rays">
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x="58"
                y="4"
                width="4"
                height="16"
                rx="2"
                fill="#ffd34d"
                transform={`rotate(${i * 30} 60 60)`}
              />
            ))}
          </g>
          <circle cx="60" cy="60" r="26" fill="#ffe28a" />
          <circle cx="60" cy="60" r="20" fill="#ffd34d" />
        </svg>
      </div>

      <div className="garden__cloud garden__cloud--1">
        <Cloud />
      </div>
      <div className="garden__cloud garden__cloud--2">
        <Cloud />
      </div>
      <div className="garden__cloud garden__cloud--3">
        <Cloud />
      </div>

      <div className="garden__cabin">
        <Cabin />
      </div>

      <div className="garden__path" />

      <div className="garden__flowers">
        <div className="garden__flower garden__flower--1">
          <Flower petal="#ff7d9a" />
        </div>
        <div className="garden__flower garden__flower--2">
          <Flower petal="#ffd34d" />
        </div>
        <div className="garden__flower garden__flower--3">
          <Flower petal="#8ab6ff" />
        </div>
        <div className="garden__flower garden__flower--4">
          <Flower petal="#c084fc" />
        </div>
        <div className="garden__flower garden__flower--5">
          <Flower petal="#ff9d3a" />
        </div>
      </div>

      <div className="garden__butterfly garden__butterfly--1">
        <Butterfly color="#ff8fb0" />
      </div>
      <div className="garden__butterfly garden__butterfly--2">
        <Butterfly color="#8ad0ff" />
      </div>
    </div>
  );
}

function Cloud() {
  return (
    <svg viewBox="0 0 120 70">
      <ellipse cx="40" cy="46" rx="34" ry="20" fill="#ffffff" />
      <ellipse cx="72" cy="40" rx="26" ry="22" fill="#ffffff" />
      <ellipse cx="96" cy="50" rx="22" ry="16" fill="#ffffff" />
      <ellipse cx="60" cy="56" rx="46" ry="14" fill="#ffffff" />
    </svg>
  );
}

function Cabin() {
  return (
    <svg viewBox="0 0 140 120">
      <ellipse cx="70" cy="110" rx="60" ry="10" fill="#5aa64a" />
      <rect x="34" y="58" width="72" height="52" rx="6" fill="#e6cfa0" />
      <path d="M24 60 L70 22 L116 60 z" fill="#c0563f" />
      <rect x="60" y="80" width="20" height="30" rx="3" fill="#8a5a2b" />
      <circle cx="75" cy="96" r="2" fill="#ffd34d" />
      <rect x="42" y="68" width="16" height="16" rx="3" fill="#8ad0ff" stroke="#6b8f3a" strokeWidth="2.5" />
      <rect x="84" y="68" width="16" height="16" rx="3" fill="#8ad0ff" stroke="#6b8f3a" strokeWidth="2.5" />
      <rect x="94" y="30" width="11" height="20" rx="3" fill="#a06a34" />
      <path d="M104 28 q12 -12 5 -22 q-10 7 -5 22 z" fill="#e9e9e9" opacity="0.85" />
    </svg>
  );
}

function Flower({ petal }: { petal: string }) {
  return (
    <svg viewBox="0 0 60 80">
      <path d="M30 78 V46" stroke="#3f8f38" strokeWidth="4" strokeLinecap="round" />
      <path d="M30 62 q-14 0 -16 -12 q14 0 16 12 z" fill="#5aa64a" />
      <path d="M30 58 q14 0 16 -12 q-14 0 -16 12 z" fill="#6cc05a" />
      <g fill={petal}>
        <circle cx="30" cy="22" r="9" />
        <circle cx="18" cy="30" r="9" />
        <circle cx="42" cy="30" r="9" />
        <circle cx="23" cy="40" r="9" />
        <circle cx="37" cy="40" r="9" />
      </g>
      <circle cx="30" cy="31" r="6" fill="#ffd34d" />
    </svg>
  );
}

function Butterfly({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 60 50">
      <g className="garden__butterfly-wings">
        <path d="M30 24 q-22 -20 -26 -4 q-2 12 16 14 q-10 8 0 12 q12 2 10 -14 z" fill={color} opacity="0.9" />
        <path d="M30 24 q22 -20 26 -4 q2 12 -16 14 q10 8 0 12 q-12 2 -10 -14 z" fill={color} opacity="0.9" />
      </g>
      <ellipse cx="30" cy="26" rx="3" ry="12" fill="#5a3a2a" />
      <circle cx="30" cy="14" r="4" fill="#5a3a2a" />
      <path d="M28 11 q-6 -8 -10 -7" stroke="#5a3a2a" strokeWidth="1.6" fill="none" />
      <path d="M32 11 q6 -8 10 -7" stroke="#5a3a2a" strokeWidth="1.6" fill="none" />
    </svg>
  );
}
