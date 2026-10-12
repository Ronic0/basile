import { AlphaCard } from "../AlphaCard";
import type { BoardProps } from "./types";

export function DragonBoard({ options, targetId, phase, pickedId, onPick }: BoardProps) {
  const targetIndex = options.findIndex((a) => a.id === targetId);
  const flying = phase === "correct";
  const offset = options.length > 1 ? (targetIndex === 0 ? "-1" : "1") : "0";

  return (
    <div className="board board--dragons">
      <div
        className={`dragon ${flying ? "is-flying" : ""}`}
        style={{ "--flying-offset": offset } as React.CSSProperties}
        aria-hidden="true"
      >
        <span className="dragon__body">🐲</span>
        {flying && <span className="dragon__sparkle">✨</span>}
      </div>

      <div className="dragon-choices">
        {options.map((alpha) => {
          const isCorrect = phase === "correct" && alpha.id === targetId;
          const isWrong = phase === "wrong" && alpha.id === pickedId;
          const state = isCorrect ? "correct" : isWrong ? "wrong" : "idle";
          return (
            <div key={alpha.id} className={`dragon-slot ${isCorrect ? "is-caught" : ""}`}>
              <AlphaCard
                alpha={alpha}
                state={state}
                onPick={() => onPick(alpha)}
                disabled={phase !== "asking"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
