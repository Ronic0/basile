import { AlphaCard } from "../AlphaCard";
import type { Alpha } from "../../data/alphas";

export type Phase = "asking" | "correct" | "wrong";

interface Props {
  options: Alpha[];
  targetId: string;
  phase: Phase;
  pickedId: string | null;
  onPick: (alpha: Alpha) => void;
}

export function PirateBoard({ options, targetId, phase, pickedId, onPick }: Props) {
  return (
    <div className="board board--pirates">
      {options.map((alpha) => {
        const isCorrect = phase === "correct" && alpha.id === targetId;
        const isWrong = phase === "wrong" && alpha.id === pickedId;
        const state = isCorrect ? "correct" : isWrong ? "wrong" : "idle";
        return (
          <div
            key={alpha.id}
            className={`chest ${isCorrect ? "is-open" : ""} ${
              isWrong ? "is-shake" : ""
            }`}
          >
            <div className="chest__glow" aria-hidden="true" />
            <div className="chest__lid" aria-hidden="true">
              <span className="chest__lock">🔒</span>
            </div>
            <div className="chest__treasure" aria-hidden="true">
              <span>🪙</span>
              <span>💰</span>
              <span>💎</span>
              <span>🪙</span>
              <span>⭐</span>
            </div>
            <div className="chest__body">
              <AlphaCard
                alpha={alpha}
                state={state}
                onPick={() => onPick(alpha)}
                disabled={phase !== "asking"}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
