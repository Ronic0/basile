/** Décor de la nurserie : ciel, montagnes, herbe, fleurs, jouets, gamelles. */

export function NurseryBackdrop() {
  return (
    <div className="nursery__decor" aria-hidden="true">
      <div className="nursery__sun">
        <svg viewBox="0 0 100 100">
          <g className="nursery__sun-rays">
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x="48"
                y="2"
                width="4"
                height="14"
                rx="2"
                fill="#ffd34d"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
          </g>
          <circle cx="50" cy="50" r="22" fill="#ffe28a" />
          <circle cx="50" cy="50" r="17" fill="#ffd34d" />
        </svg>
      </div>

      <div className="nursery__cloud nursery__cloud--1">
        <Cloud />
      </div>
      <div className="nursery__cloud nursery__cloud--2">
        <Cloud />
      </div>

      <svg
        className="nursery__mountains"
        viewBox="0 0 1200 260"
        preserveAspectRatio="none"
      >
        <path d="M0 260 L150 90 L300 210 L430 60 L600 260 Z" fill="#8fb7d6" />
        <path d="M420 260 L560 120 L700 220 L850 80 L1000 260 Z" fill="#7aa6c9" />
        <path d="M900 260 L1040 130 L1200 260 Z" fill="#9cc0da" />
        <path d="M150 90 L190 130 L110 130 Z" fill="#f4f9ff" />
        <path d="M430 60 L474 116 L386 116 Z" fill="#f4f9ff" />
        <path d="M850 80 L896 138 L804 138 Z" fill="#f4f9ff" />
      </svg>

      <div className="nursery__ground" />

      <div className="nursery__flowers">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className={`nursery__tuft nursery__tuft--${(i % 3) + 1}`} />
        ))}
      </div>

      <div className="nursery__toys">
        <span className="nursery__toy-block" />
        <span className="nursery__toy-ball" />
      </div>

      <div className="nursery__bowl">
        <svg viewBox="0 0 120 90">
          <ellipse cx="60" cy="72" rx="52" ry="10" fill="rgba(0,0,0,0.12)" />
          <path d="M8 34 h104 q-6 44 -52 44 q-46 0 -52 -44 z" fill="#e8543f" />
          <ellipse cx="60" cy="34" rx="52" ry="12" fill="#ff8f7d" />
          <ellipse cx="60" cy="34" rx="40" ry="8" fill="#ffe0b0" />
          <circle cx="48" cy="30" r="5" fill="#3aa34a" />
          <circle cx="66" cy="30" r="4" fill="#e8543f" />
          <circle cx="78" cy="31" r="4" fill="#f5a623" />
        </svg>
      </div>

      <div className="nursery__water">
        <svg viewBox="0 0 100 110">
          <ellipse cx="50" cy="100" rx="42" ry="9" fill="rgba(0,0,0,0.12)" />
          <path d="M22 40 h56 v48 a10 10 0 0 1 -10 10 h-36 a10 10 0 0 1 -10 -10 z" fill="#2f9bd6" />
          <ellipse cx="50" cy="40" rx="28" ry="9" fill="#8ad0ff" />
          <ellipse className="nursery__water-surface" cx="50" cy="40" rx="22" ry="6" fill="#bfe6ff" />
          <path d="M50 8 q10 12 10 18 a10 10 0 0 1 -20 0 q0 -6 10 -18 z" fill="#8ad0ff" />
        </svg>
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
