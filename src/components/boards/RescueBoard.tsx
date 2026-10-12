import { useMemo } from "react";
import { AlphaCard } from "../AlphaCard";
import type { BoardProps } from "./types";

const ANIMALS = ["🐱", "🐶", "🐰", "🐢", "🦊"];

export function RescueBoard({ options, targetId, phase, pickedId, onPick }: BoardProps) {
  const animal = useMemo(() => ANIMALS[Math.floor(Math.random() * ANIMALS.length)], []);
  const saved = phase === "correct";
  const waiting = phase === "wrong";

  return (
    <div className="board board--rescue">
      <div className="rescue-stage" aria-hidden="true">
        <span className={`rescue-vehicle ${saved ? "is-driving" : ""} ${
          waiting ? "is-waiting" : ""
        }`}>
          🚒
        </span>

        <span className={`rescue-bridge ${saved ? "is-down" : ""}`} />

        <span className={`rescue-animal ${saved ? "is-saved" : ""}`}>{animal}</span>

        {waiting && <span className="rescue-hint">💡</span>}
      </div>

      <div className="command-row">
        {options.map((alpha) => {
          const isCorrect = phase === "correct" && alpha.id === targetId;
          const isWrong = phase === "wrong" && alpha.id === pickedId;
          const state = isCorrect ? "correct" : isWrong ? "wrong" : "idle";
          return (
            <div key={alpha.id} className={`command ${isCorrect ? "is-ok" : ""}`}>
              <AlphaCard
                alpha={alpha}
                state={state}
                onPick={() => onPick(alpha)}
                disabled={phase !== "asking"}
              />
              <span className="command__pad" aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
