import { AlphaCard } from "../AlphaCard";
import type { BoardProps } from "./types";

export function RacingBoard({ options, targetId, phase, pickedId, onPick }: BoardProps) {
  const targetIndex = options.findIndex((a) => a.id === targetId);
  const offset =
    options.length <= 1
      ? "0"
      : options.length === 2
        ? targetIndex === 0
          ? "-1"
          : "1"
        : String(targetIndex - 1);
  const zooming = phase === "correct";
  const slowing = phase === "wrong";

  return (
    <div className="board board--racing">
      <div
        className={`race-car ${zooming ? "is-zoom" : ""} ${slowing ? "is-slow" : ""}`}
        style={{ "--race-offset": offset } as React.CSSProperties}
        aria-hidden="true"
      >
        <div className="race-car__body">
          <span className="race-car__cabin" />
          <span className="race-car__wheel race-car__wheel--back" />
          <span className="race-car__wheel race-car__wheel--front" />
        </div>
        <span className="race-car__speed">💨</span>
      </div>

      <div className="race-choices">
        {options.map((alpha) => {
          const isCorrect = phase === "correct" && alpha.id === targetId;
          const isWrong = phase === "wrong" && alpha.id === pickedId;
          const state = isCorrect ? "correct" : isWrong ? "wrong" : "idle";
          return (
            <div key={alpha.id} className={`race-portal ${isCorrect ? "is-open" : ""}`}>
              <div className="race-portal__arch" aria-hidden="true">
                <span className="race-portal__flag">🏁</span>
              </div>
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
