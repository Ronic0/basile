import type { PlantType } from "../../lib/garden";

interface Props {
  type: PlantType;
  stage: number;
  className?: string;
}

/**
 * Plante du jardin (SVG original), ancrée au sol (bas du viewBox).
 * 4 étapes : graine, pousse, plante développée, mature.
 */
export function Plant({ type, stage, className = "" }: Props) {
  const s = Math.max(0, Math.min(3, stage));
  const classes = ["garden-plant", `garden-plant--${type}`, `garden-plant--stage-${s}`, className]
    .filter(Boolean)
    .join(" ");
  return (
    <svg className={classes} viewBox="0 0 100 140" role="img" aria-label={type}>
      {s === 0 && <Seed />}
      {type === "tournesol" && s >= 1 && <Sunflower stage={s} />}
      {type === "fraisier" && s >= 1 && <Strawberry stage={s} />}
      {type === "carotte" && s >= 1 && <Carrot stage={s} />}
    </svg>
  );
}

function Seed() {
  return (
    <g className="garden-plant__seed">
      <ellipse cx="50" cy="126" rx="9" ry="6" fill="#7a4a20" />
      <ellipse cx="47" cy="124" rx="3" ry="2" fill="#b5763c" />
    </g>
  );
}

function Sunflower({ stage }: { stage: number }) {
  const top = stage === 1 ? 100 : stage === 2 ? 66 : 50;
  const flowerY = stage === 3 ? 36 : 0;
  return (
    <g>
      <path className="garden-plant__stem" d={`M50 130 V${top}`} />
      <Leaf x={50} y={stage === 1 ? 116 : 104} dir={-1} small={stage === 1} />
      <Leaf x={50} y={stage === 1 ? 120 : 92} dir={1} small={stage === 1} />
      {stage >= 2 && <Leaf x={50} y={80} dir={-1} />}
      {stage === 2 && <circle className="garden-plant__bud" cx="50" cy={top - 4} r="8" />}
      {stage === 3 && (
        <g className="garden-plant__flower" transform={`translate(50 ${flowerY})`}>
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse
              key={i}
              className="garden-plant__petal"
              cx="0"
              cy="-20"
              rx="5"
              ry="11"
              transform={`rotate(${i * 30})`}
            />
          ))}
          <circle className="garden-plant__core" cx="0" cy="0" r="12" />
          <circle className="garden-plant__core-dot" cx="-4" cy="-2" r="1.6" />
          <circle className="garden-plant__core-dot" cx="4" cy="2" r="1.6" />
          <circle className="garden-plant__core-dot" cx="0" cy="5" r="1.4" />
        </g>
      )}
    </g>
  );
}

function Strawberry({ stage }: { stage: number }) {
  return (
    <g>
      {stage === 3 && (
        <g className="garden-plant__strawberries">
          <StrawberryFruit x={38} y={110} />
          <StrawberryFruit x={62} y={104} />
          <StrawberryFruit x={50} y={118} />
        </g>
      )}
      <Leaf x={50} y={126} dir={-1} />
      <Leaf x={50} y={126} dir={1} />
      <Leaf x={44} y={122} dir={-1} small={stage === 1} />
      <Leaf x={58} y={122} dir={1} small={stage === 1} />
      {stage >= 2 && <Leaf x={50} y={116} dir={-1} />}
      {stage >= 2 && <Leaf x={50} y={116} dir={1} />}
      {stage === 2 && (
        <g className="garden-plant__blossom">
          <FlowerWhite x={42} y={110} />
          <FlowerWhite x={60} y={114} />
        </g>
      )}
      {stage === 3 && <FlowerWhite x={56} y={96} />}
    </g>
  );
}

function StrawberryFruit({ x, y }: { x: number; y: number }) {
  return (
    <g className="garden-plant__berry" transform={`translate(${x} ${y})`}>
      <path d="M0 -6 q10 2 8 12 q-2 12 -8 14 q-6 -2 -8 -14 q-2 -10 8 -12 z" fill="#e8543f" />
      <path d="M-6 -7 q6 -5 12 0 q-6 3 -12 0 z" fill="#3aa34a" />
      <circle cx="-2" cy="0" r="1.2" fill="#ffe08a" />
      <circle cx="3" cy="3" r="1.2" fill="#ffe08a" />
      <circle cx="0" cy="7" r="1.1" fill="#ffe08a" />
    </g>
  );
}

function Carrot({ stage }: { stage: number }) {
  const bladeTop = stage === 1 ? 104 : stage === 2 ? 84 : 72;
  const shoulder = stage === 3;
  return (
    <g>
      {shoulder && (
        <path
          className="garden-plant__carrot"
          d="M42 128 q8 -10 16 0 q-2 6 -8 8 q-6 -2 -8 -8 z"
          fill="#f0913a"
        />
      )}
      <path className="garden-plant__stem" d={`M50 132 q-6 -20 -12 -${132 - bladeTop}`} />
      <path className="garden-plant__stem" d={`M50 132 V${bladeTop}`} />
      <path className="garden-plant__stem" d={`M50 132 q6 -20 12 -${132 - bladeTop}`} />
      <Leaf x={48} y={(132 + bladeTop) / 2} dir={-1} small />
      <Leaf x={52} y={(132 + bladeTop) / 2 - 8} dir={1} small />
    </g>
  );
}

function Leaf({ x, y, dir, small = false }: { x: number; y: number; dir: number; small?: boolean }) {
  const len = small ? 14 : 22;
  return (
    <path
      className="garden-plant__leaf"
      d={`M${x} ${y} q${dir * len} -8 ${dir * len} -18 q${-dir * (len - 6)} 4 ${-dir * len} 18 z`}
    />
  );
}

function FlowerWhite({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <circle
          key={i}
          className="garden-plant__petal-white"
          cx={Math.cos((i / 5) * Math.PI * 2) * 5}
          cy={Math.sin((i / 5) * Math.PI * 2) * 5}
          r="4"
        />
      ))}
      <circle cx="0" cy="0" r="3" fill="#ffd34d" />
    </g>
  );
}
