/** Décor du Jardin magique : ciel, soleil, nuages, arbres, cabanon, fleurs, papillons. */
export function GardenBackdrop() {
  return (
    <div className="garden-decor" aria-hidden="true">
      <div className="garden-decor__sun">
        <svg viewBox="0 0 100 100">
          <g className="garden-decor__sun-rays">
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x="48" y="2" width="4" height="14" rx="2" fill="#ffd34d" transform={`rotate(${i * 30} 50 50)`} />
            ))}
          </g>
          <circle cx="50" cy="50" r="22" fill="#ffe28a" />
          <circle cx="50" cy="50" r="17" fill="#ffd34d" />
        </svg>
      </div>

      <div className="garden-decor__cloud garden-decor__cloud--1">
        <Cloud />
      </div>
      <div className="garden-decor__cloud garden-decor__cloud--2">
        <Cloud />
      </div>

      <div className="garden-decor__tree garden-decor__tree--left">
        <Tree />
      </div>
      <div className="garden-decor__tree garden-decor__tree--right">
        <Tree />
      </div>

      <div className="garden-decor__cabin">
        <Cabin />
      </div>

      <div className="garden-decor__ground" />

      <div className="garden-decor__flowers">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`garden-decor__tuft garden-decor__tuft--${(i % 3) + 1}`} />
        ))}
      </div>

      <div className="garden-decor__butterfly garden-decor__butterfly--1">
        <Butterfly color="#ff8fb0" />
      </div>
      <div className="garden-decor__butterfly garden-decor__butterfly--2">
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

function Tree() {
  return (
    <svg viewBox="0 0 120 150">
      <rect x="52" y="90" width="16" height="55" rx="6" fill="#8a5a2b" />
      <circle cx="60" cy="70" r="42" fill="#5aa64a" />
      <circle cx="34" cy="86" r="28" fill="#6cc05a" />
      <circle cx="86" cy="86" r="28" fill="#4fa863" />
      <circle cx="48" cy="52" r="24" fill="#6cc05a" />
      <circle cx="74" cy="56" r="22" fill="#7cc25a" />
      <circle cx="40" cy="60" r="5" fill="#ff7d9a" />
      <circle cx="82" cy="72" r="5" fill="#ffd34d" />
      <circle cx="66" cy="44" r="5" fill="#ff8fb0" />
    </svg>
  );
}

function Cabin() {
  return (
    <svg viewBox="0 0 160 140">
      <ellipse cx="80" cy="130" rx="66" ry="10" fill="rgba(0,0,0,0.12)" />
      <rect x="34" y="66" width="92" height="62" rx="6" fill="#e6cfa0" />
      <path d="M22 68 L80 22 L138 68 z" fill="#c0563f" />
      <path d="M80 22 L80 68" stroke="#a8452f" strokeWidth="3" />
      <rect x="66" y="92" width="28" height="36" rx="4" fill="#8a5a2b" />
      <circle cx="88" cy="110" r="2.4" fill="#ffd34d" />
      <rect x="46" y="78" width="18" height="18" rx="3" fill="#8ad0ff" stroke="#6b8f3a" strokeWidth="2.5" />
      <rect x="100" y="78" width="18" height="18" rx="3" fill="#8ad0ff" stroke="#6b8f3a" strokeWidth="2.5" />
      <rect x="106" y="30" width="12" height="22" rx="3" fill="#a06a34" />
      <path d="M118 28 q14 -14 6 -26 q-12 8 -6 26 z" fill="#e9e9e9" opacity="0.85" />
    </svg>
  );
}

function Butterfly({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 60 50">
      <g className="garden-decor__butterfly-wings">
        <path d="M30 24 q-22 -20 -26 -4 q-2 12 16 14 q-10 8 0 12 q12 2 10 -14 z" fill={color} opacity="0.9" />
        <path d="M30 24 q22 -20 26 -4 q2 12 -16 14 q10 8 0 12 q-12 2 -10 -14 z" fill={color} opacity="0.9" />
      </g>
      <ellipse cx="30" cy="26" rx="3" ry="12" fill="#5a3a2a" />
      <circle cx="30" cy="14" r="4" fill="#5a3a2a" />
    </svg>
  );
}
