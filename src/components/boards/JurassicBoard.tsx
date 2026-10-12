import { AlphaCard } from "../AlphaCard";
import type { BoardProps } from "./types";

const DINO_COLORS = ["#7ec850", "#f6a623", "#4db6e6", "#c084fc", "#ff8f7d"];
const DINO_BABIES = ["🦕", "🦖"];

function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export function JurassicBoard({ options, targetId, phase, pickedId, onPick }: BoardProps) {
  return (
    <div className="board board--jurassic">
      {options.map((alpha) => {
        const isCorrect = phase === "correct" && alpha.id === targetId;
        const isWrong = phase === "wrong" && alpha.id === pickedId;
        const state = isCorrect ? "correct" : isWrong ? "wrong" : "idle";
        const h = hash(alpha.id);
        const color = DINO_COLORS[h % DINO_COLORS.length];
        const baby = DINO_BABIES[h % DINO_BABIES.length];
        return (
          <div
            key={alpha.id}
            className={`egg-slot ${isCorrect ? "is-open" : ""} ${
              isWrong ? "is-shake" : ""
            }`}
          >
            <div className="egg" style={{ "--dino-color": color } as React.CSSProperties}>
              <span className="egg__spots" aria-hidden="true" />
              <div className="egg__alpha">
                <AlphaCard
                  alpha={alpha}
                  state={state}
                  onPick={() => onPick(alpha)}
                  disabled={phase !== "asking"}
                />
              </div>
              <div className="egg__top" aria-hidden="true" />
              <div className="egg__baby" aria-hidden="true">
                {baby}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
