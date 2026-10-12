import { useEffect, useMemo } from "react";
import { AlphaCard } from "../AlphaCard";
import { addBuild } from "../../lib/collection";
import type { BoardProps } from "./types";

interface BuildDef {
  id: string;
  label: string;
  emoji: string;
}

const BUILDS: BuildDef[] = [
  { id: "robot", label: "Le robot", emoji: "🤖" },
  { id: "fusee", label: "La fusée", emoji: "🚀" },
  { id: "chateau", label: "Le château", emoji: "🏰" },
];

const BRICK_COLORS = ["#f5a623", "#4db6e6", "#7ec850", "#c084fc", "#ff7d7d", "#ffd34d"];

export function WorkshopBoard({ options, targetId, phase, pickedId, bonnes = 0, onPick }: BoardProps) {
  const build = useMemo(
    () => BUILDS[Math.floor(Math.random() * BUILDS.length)],
    [],
  );
  const placed = Math.min(bonnes, 6);
  const done = placed >= 6;

  useEffect(() => {
    if (done) addBuild(build.id);
  }, [done, build.id]);

  return (
    <div className="board board--workshop">
      <div className="build">
        <span className="build__name">
          {build.emoji} {build.label}
        </span>
        {done ? (
          <div className="build__final" aria-hidden="true">
            {build.emoji}
          </div>
        ) : (
          <div className="build__bricks" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className={`brick ${i < placed ? "is-placed" : ""}`}
                style={{ background: BRICK_COLORS[i % BRICK_COLORS.length] }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bench-row">
        {options.map((alpha) => {
          const isCorrect = phase === "correct" && alpha.id === targetId;
          const isWrong = phase === "wrong" && alpha.id === pickedId;
          const state = isCorrect ? "correct" : isWrong ? "wrong" : "idle";
          return (
            <div key={alpha.id} className={`bin ${isCorrect ? "is-ok" : ""}`}>
              <div className="bin__shelf" aria-hidden="true" />
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
