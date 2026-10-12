/** Décor de l'atelier : planches, étagères, outils, lampe, engrenages. */
export function WorkshopBackdrop() {
  return (
    <div className="atelier-decor" aria-hidden="true">
      <div className="atelier-decor__shelf atelier-decor__shelf--left">
        <Shelf />
      </div>
      <div className="atelier-decor__shelf atelier-decor__shelf--right">
        <Shelf />
      </div>

      <div className="atelier-decor__pegboard">
        <Pegboard />
      </div>

      <div className="atelier-decor__lamp">
        <Lamp />
      </div>

      <div className="atelier-decor__gear atelier-decor__gear--1">
        <Gear />
      </div>
      <div className="atelier-decor__gear atelier-decor__gear--2">
        <Gear />
      </div>

      <div className="atelier-decor__bench" />
    </div>
  );
}

function Shelf() {
  return (
    <svg viewBox="0 0 200 80">
      <rect x="0" y="54" width="200" height="14" rx="4" fill="#8a5a2b" />
      <rect x="0" y="54" width="200" height="6" rx="3" fill="#a06a34" />
      <rect x="18" y="26" width="34" height="28" rx="4" fill="#e8543f" />
      <rect x="18" y="26" width="34" height="8" rx="4" fill="#ff8f7d" />
      <rect x="62" y="34" width="26" height="20" rx="4" fill="#2f9bd6" />
      <rect x="98" y="20" width="30" height="34" rx="4" fill="#f0b429" />
      <rect x="138" y="36" width="24" height="18" rx="4" fill="#3aa34a" />
      <circle cx="170" cy="46" r="9" fill="#7d4bd1" />
    </svg>
  );
}

function Pegboard() {
  return (
    <svg viewBox="0 0 120 160">
      <rect x="0" y="0" width="120" height="160" rx="8" fill="#b5763c" />
      <rect x="6" y="6" width="108" height="148" rx="6" fill="#c98a4a" />
      <g fill="#9a6a34">
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 4 }).map((_, c) => (
            <circle key={`${r}-${c}`} cx={20 + c * 26} cy={22 + r * 30} r="2.4" />
          )),
        )}
      </g>
      <rect x="18" y="24" width="10" height="34" rx="4" fill="#e8543f" />
      <circle cx="23" cy="20" r="6" fill="#f0b429" />
      <path d="M52 26 l6 20 l-12 0 z" fill="#9aa3b0" />
      <rect x="52" y="46" width="6" height="24" rx="3" fill="#8a5a2b" />
      <circle cx="86" cy="30" r="9" fill="none" stroke="#9aa3b0" strokeWidth="5" />
      <rect x="20" y="96" width="40" height="10" rx="4" fill="#2f9bd6" />
      <rect x="66" y="92" width="30" height="16" rx="4" fill="#3aa34a" />
    </svg>
  );
}

function Lamp() {
  return (
    <svg viewBox="0 0 80 120">
      <g className="atelier-decor__lamp-arm">
        <rect x="38" y="0" width="4" height="40" rx="2" fill="#3a3f4a" />
        <path d="M14 40 h52 l-10 26 h-32 z" fill="#4a5568" />
        <path d="M14 40 h52 l-3 8 h-46 z" fill="#5a6578" />
        <ellipse className="atelier-decor__lamp-glow" cx="40" cy="70" rx="30" ry="16" fill="#ffe08a" />
        <circle cx="40" cy="66" r="6" fill="#fff3b0" />
      </g>
    </svg>
  );
}

function Gear() {
  return (
    <svg viewBox="0 0 80 80">
      <g className="atelier-decor__gear-spin">
        <path
          d="M40 12 l6 2 l3 8 l8 0 l6 6 l0 8 l6 6 l-3 8 l3 8 l-6 6 l0 8 l-6 6 l-8 0 l-6 6 l-8 -3 l-8 3 l-6 -6 l-8 0 l-6 -6 l0 -8 l-6 -6 l3 -8 l-3 -8 l6 -6 l0 -8 l6 -6 l8 0 z"
          fill="#9aa3b0"
          opacity="0.55"
        />
        <circle cx="40" cy="40" r="10" fill="#6b7280" />
      </g>
    </svg>
  );
}
