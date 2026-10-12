import type { Island, IslandId } from "../../data/pirates";

/** Décor de fond d'une île (SVG). */
export function IslandBackdrop({ island }: { island: Island }) {
  return (
    <div className={`island-backdrop island-backdrop--${island.id}`} aria-hidden="true">
      <svg className="island-backdrop__svg" viewBox="0 0 400 240" preserveAspectRatio="xMidYMax slice">
        {island.id === "palmiers" && (
          <g>
            <ellipse cx="200" cy="230" rx="320" ry="70" fill="#f3dca0" />
            <ellipse cx="200" cy="216" rx="260" ry="52" fill="#f7e6b6" />
            <path d="M60 150 q-6 -34 20 -40 q-2 22 6 30 q-14 8 -26 10 z" fill="#5aa64a" opacity="0.5" />
            <path d="M340 158 q8 -30 -18 -40 q0 22 -8 28 q14 10 26 12 z" fill="#5aa64a" opacity="0.5" />
            <ellipse cx="120" cy="196" rx="20" ry="10" fill="#c9b48a" />
            <ellipse cx="300" cy="206" rx="24" ry="11" fill="#c9b48a" />
          </g>
        )}
        {island.id === "volcan" && (
          <g>
            <ellipse cx="200" cy="232" rx="330" ry="72" fill="#6b5a48" />
            <ellipse cx="200" cy="218" rx="260" ry="52" fill="#7d6a55" />
            <path d="M120 210 L200 70 L280 210 z" fill="#5c4a3a" />
            <path d="M170 210 L200 120 L230 210 z" fill="#4a3a2c" />
            <path d="M200 70 q-14 -6 -12 -20 q10 8 12 -4 q4 14 12 4 q0 16 -12 20 z" fill="#9aa3b0" opacity="0.6" />
            <path d="M150 210 q10 10 22 2 q10 12 26 4 q12 10 26 2 q10 8 22 0 L280 210 z" fill="#e8543f" opacity="0.85" />
            <circle cx="120" cy="196" r="9" fill="#3a2f26" />
            <circle cx="292" cy="188" r="11" fill="#3a2f26" />
          </g>
        )}
        {island.id === "mysterieuse" && (
          <g>
            <ellipse cx="200" cy="232" rx="320" ry="72" fill="#6f7d5a" />
            <ellipse cx="200" cy="218" rx="255" ry="52" fill="#7f8f68" />
            <g fill="#b9b3a0">
              <rect x="86" y="130" width="20" height="80" rx="4" />
              <rect x="120" y="120" width="18" height="90" rx="4" />
              <rect x="270" y="140" width="18" height="70" rx="4" />
              <rect x="300" y="150" width="16" height="60" rx="4" />
            </g>
            <path d="M86 128 h20 l-10 -14 z M120 118 h18 l-9 -14 z M270 138 h18 l-9 -12 z" fill="#a49e8c" />
            <path d="M226 120 q6 60 -6 92 q-6 -32 -6 -92 q4 6 12 0 z" fill="#8ad0ff" opacity="0.8" />
            <path d="M150 214 q20 8 40 0 q20 8 40 0" stroke="#5f6b4c" strokeWidth="3" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
}

const SPOT_NODES: Record<string, () => JSX.Element> = {
  palmier: Palm,
  rocher: Rock,
  sable: SandMound,
  buisson: Bush,
  "rocher-volcanique": VolcanicRock,
  grotte: Cave,
  caisse: Crate,
  statue: Statue,
  coffre: Chest,
  arbre: Tree,
  "pierre-gravee": CarvedStone,
};

export function IslandSpotArt({ island, spotId, searched }: { island: IslandId; spotId: string; searched: boolean }) {
  void island;
  const node = SPOT_NODES[spotId];
  return (
    <svg className={`spot-art ${searched ? "is-searched" : ""}`} viewBox="0 0 100 100" role="img" aria-hidden="true">
      {node ? node() : null}
      {searched && (
        <g className="spot-art__done" transform="translate(74 20)">
          <circle cx="0" cy="0" r="11" fill="#ffd34d" />
          <path d="M-5 0 l4 4 l7 -8" stroke="#4a2a00" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}

/* ---------- Cachettes ---------- */
function Palm() {
  return (
    <g>
      <path d="M50 98 q-6 -40 2 -60 q2 -8 6 0 q-4 26 2 60 z" fill="#8a5a2b" />
      <g className="spot-art__fronds" fill="#3f9a4a">
        <path d="M56 38 q-30 -18 -46 -2 q22 2 40 14 z" />
        <path d="M56 38 q30 -18 46 -2 q-22 2 -40 14 z" />
        <path d="M56 36 q-10 -28 -28 -30 q10 18 20 34 z" />
        <path d="M58 36 q10 -28 28 -30 q-10 18 -20 34 z" />
        <path d="M56 34 q0 -26 12 -34 q4 20 2 38 z" />
      </g>
      <circle cx="46" cy="44" r="5" fill="#7a4a20" />
      <circle cx="60" cy="46" r="5" fill="#7a4a20" />
    </g>
  );
}

function Rock() {
  return (
    <g>
      <path d="M12 96 L26 56 Q40 44 54 56 L86 96 z" fill="#9aa3b0" />
      <path d="M12 96 L26 56 Q34 52 40 60 L30 96 z" fill="#b4bcc7" />
      <path d="M70 96 L78 66 Q86 62 88 72 L86 96 z" fill="#7d8694" />
    </g>
  );
}

function SandMound() {
  return (
    <g>
      <ellipse cx="50" cy="92" rx="42" ry="20" fill="#f3dca0" />
      <ellipse cx="50" cy="86" rx="30" ry="13" fill="#f7e6b6" />
      <path d="M50 84 q-14 -2 -14 -12 q0 -8 10 -8 q8 0 12 6 q4 -6 12 -6 q10 0 10 8 q0 10 -14 12 z" fill="#ff9db5" />
      <path d="M50 84 v-16" stroke="#ffd7e0" strokeWidth="2" />
    </g>
  );
}

function Bush() {
  return (
    <g>
      <ellipse cx="34" cy="80" rx="22" ry="18" fill="#3f9a4a" />
      <ellipse cx="62" cy="78" rx="24" ry="20" fill="#4fb05a" />
      <ellipse cx="48" cy="66" rx="20" ry="18" fill="#5cc065" />
      <circle cx="40" cy="70" r="3" fill="#ff7d9a" />
      <circle cx="60" cy="74" r="3" fill="#ffd34d" />
    </g>
  );
}

function VolcanicRock() {
  return (
    <g>
      <path d="M16 96 L30 54 Q44 42 58 54 L84 96 z" fill="#4a3a2c" />
      <path d="M40 62 l8 14 l-8 10 l10 12" stroke="#ff6a3d" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M62 66 l6 12" stroke="#ff6a3d" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 96 L30 54 Q38 50 44 58 L34 96 z" fill="#5c4a3a" />
    </g>
  );
}

function Cave() {
  return (
    <g>
      <path d="M10 96 Q14 44 50 44 Q86 44 90 96 z" fill="#4a3a2c" />
      <path d="M30 96 Q34 62 50 62 Q66 62 70 96 z" fill="#1c1712" />
      <ellipse cx="50" cy="96" rx="16" ry="6" fill="#0f0c08" />
    </g>
  );
}

function Crate() {
  return (
    <g>
      <rect x="20" y="52" width="60" height="46" rx="6" fill="#a06a34" />
      <rect x="20" y="52" width="60" height="10" rx="4" fill="#b5763c" />
      <path d="M22 54 L78 96 M78 54 L22 96" stroke="#8a5a2b" strokeWidth="5" />
      <rect x="20" y="52" width="60" height="46" rx="6" fill="none" stroke="#6b4410" strokeWidth="4" />
    </g>
  );
}

function Statue() {
  return (
    <g>
      <rect x="34" y="84" width="32" height="14" rx="3" fill="#b9b3a0" />
      <rect x="40" y="52" width="20" height="34" rx="6" fill="#b9b3a0" />
      <circle cx="50" cy="40" r="16" fill="#c9c3b0" />
      <circle cx="44" cy="38" r="2.4" fill="#5a5750" />
      <circle cx="56" cy="38" r="2.4" fill="#5a5750" />
      <path d="M44 48 q6 6 12 0" stroke="#5a5750" strokeWidth="2" fill="none" />
      <path d="M50 44 q-6 10 6 10 q-2 -8 -6 -10 z" fill="#a49e8c" />
      <path d="M40 20 q10 -12 20 0 q-4 8 -10 8 q-6 0 -10 -8 z" fill="#e8543f" />
    </g>
  );
}

function Chest() {
  return (
    <g>
      <rect x="14" y="56" width="72" height="38" rx="5" fill="#8a5a2b" />
      <path d="M14 60 q36 -26 72 0 z" fill="#a06a34" />
      <rect x="14" y="70" width="72" height="8" fill="#6b4410" />
      <rect x="44" y="64" width="12" height="18" rx="3" fill="#ffd34d" />
      <circle cx="50" cy="72" r="3" fill="#b98612" />
      <circle className="spot-art__gem" cx="78" cy="60" r="6" fill="#e8543f" />
    </g>
  );
}

function Tree() {
  return (
    <g>
      <rect x="45" y="58" width="10" height="40" rx="4" fill="#8a5a2b" />
      <circle cx="50" cy="44" r="26" fill="#3f9a4a" />
      <circle cx="32" cy="52" r="18" fill="#4fb05a" />
      <circle cx="68" cy="52" r="18" fill="#4fb05a" />
      <circle cx="44" cy="34" r="16" fill="#5cc065" />
    </g>
  );
}

function CarvedStone() {
  return (
    <g>
      <path d="M24 96 L30 44 Q50 34 70 44 L76 96 z" fill="#a49e8c" />
      <g stroke="#6f6a5c" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M40 56 h20" />
        <path d="M42 64 q8 8 16 0" />
        <path d="M46 52 v-6 M54 52 v-6" />
        <circle cx="50" cy="76" r="5" />
      </g>
    </g>
  );
}
