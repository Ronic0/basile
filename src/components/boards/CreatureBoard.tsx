import { useEffect, useState } from "react";
import { AlphaCard } from "../AlphaCard";
import { Creature } from "../critters/Creature";
import { addCreature, loadCreatures } from "../../lib/collection";
import type { BoardProps } from "./types";

const CREATURE_COUNT = 5;

function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function creatureFor(alphaId: string): number {
  return hash(alphaId) % CREATURE_COUNT;
}

export function CreatureBoard({ options, targetId, phase, pickedId, onPick }: BoardProps) {
  const [album, setAlbum] = useState<string[]>(() => loadCreatures());

  useEffect(() => {
    if (phase === "correct") {
      setAlbum(addCreature(String(creatureFor(targetId))));
    }
  }, [phase, targetId]);

  return (
    <div className="board board--creatures">
      <div className="bush-row">
        {options.map((alpha) => {
          const isCorrect = phase === "correct" && alpha.id === targetId;
          const isWrong = phase === "wrong" && alpha.id === pickedId;
          const state = isCorrect ? "correct" : isWrong ? "wrong" : "idle";
          const variant = creatureFor(alpha.id);
          return (
            <div
              key={alpha.id}
              className={`bush-slot ${isCorrect ? "is-open" : ""} ${
                isWrong ? "is-shy" : ""
              }`}
            >
              <div className="bush" aria-hidden="true">
                🌿
              </div>
              <div className="bush__orb" aria-hidden="true" />
              <div className="bush__creature" aria-hidden="true">
                <Creature variant={variant} className="creature-svg" />
              </div>
              <div className="bush__alpha">
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

      <div className="creature-album" aria-label="Album des créatures">
        {Array.from({ length: CREATURE_COUNT }).map((_, v) => {
          const found = album.includes(String(v));
          return (
            <span key={v} className={`album-slot ${found ? "is-found" : ""}`}>
              {found ? (
                <Creature variant={v} className="creature-svg creature-svg--small" />
              ) : (
                <span className="album-slot__empty">?</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
