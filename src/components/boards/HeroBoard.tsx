import { AlphaCard } from "../AlphaCard";
import { Hero } from "../critters/Hero";
import type { BoardProps } from "./types";

const HERO_COLORS = ["#e8543f", "#2f9bd6", "#7d4bd1", "#3aa34a"];

export function HeroBoard({ options, targetId, phase, pickedId, onPick }: BoardProps) {
  return (
    <div className="board board--hero">
      {options.map((alpha, i) => {
        const isCorrect = phase === "correct" && alpha.id === targetId;
        const isWrong = phase === "wrong" && alpha.id === pickedId;
        const state = isCorrect ? "correct" : isWrong ? "wrong" : "idle";
        return (
          <div
            key={alpha.id}
            className={`rock-slot ${isCorrect ? "is-lifted" : ""} ${
              isWrong ? "is-shake" : ""
            }`}
          >
            <div className="rock__hero" aria-hidden="true">
              <Hero className="hero-svg" color={HERO_COLORS[i % HERO_COLORS.length]} />
            </div>
            <div className="rock__boulder" aria-hidden="true" />
            <div className="rock__dust" aria-hidden="true">
              <span>💨</span>
              <span>✨</span>
            </div>
            <div className="rock__alpha">
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
