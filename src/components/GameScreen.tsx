import { useCallback, useEffect, useRef, useState } from "react";
import type { Alpha } from "../data/alphas";
import type { Universe } from "../data/universes";
import { playSfx, playVoice } from "../lib/audio";
import { createRound, SESSION_ROUNDS, type Round } from "../lib/game";
import { DragonBoard } from "./boards/DragonBoard";
import { PirateBoard, type Phase } from "./boards/PirateBoard";
import { DragonScene } from "./scenes/DragonScene";
import { PirateScene } from "./scenes/PirateScene";
import { BasileMascot } from "./BasileMascot";

interface Props {
  universe: Universe;
  onExit: () => void;
  onFinish: (result: { bonnes: number; erreurs: number }) => void;
}

export function GameScreen({ universe, onExit, onFinish }: Props) {
  const [round, setRound] = useState<Round>(() => createRound());
  const [roundIndex, setRoundIndex] = useState(0);
  const [bonnes, setBonnes] = useState(0);
  const [erreurs, setErreurs] = useState(0);
  const [phase, setPhase] = useState<Phase>("asking");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const sfxTimer = useRef<number | null>(null);

  useEffect(() => {
    playVoice(round.target.audioName);
  }, [round]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      if (sfxTimer.current) window.clearTimeout(sfxTimer.current);
    };
  }, []);

  useEffect(() => {
    if (roundIndex >= SESSION_ROUNDS) {
      onFinish({ bonnes, erreurs });
    }
  }, [roundIndex, bonnes, erreurs, onFinish]);

  const handlePick = useCallback(
    (alpha: Alpha) => {
      if (phase !== "asking") return;
      setPickedId(alpha.id);

      if (alpha.id === round.target.id) {
        setPhase("correct");
        setBonnes((b) => b + 1);
        playVoice("bravo");
        playSfx(universe.id === "pirates" ? "coffre" : "dragon");
        if (sfxTimer.current) window.clearTimeout(sfxTimer.current);
        sfxTimer.current = window.setTimeout(() => {
          playSfx(universe.id === "pirates" ? "piece" : "etoile");
        }, 350);
        timer.current = window.setTimeout(() => {
          const next = roundIndex + 1;
          if (next < SESSION_ROUNDS) {
            setRound(createRound(round.target.id));
            setPhase("asking");
            setPickedId(null);
          }
          setRoundIndex(next);
        }, 1600);
      } else {
        setPhase("wrong");
        setErreurs((e) => e + 1);
        playVoice("reessaie");
        timer.current = window.setTimeout(() => {
          setPhase("asking");
          setPickedId(null);
        }, 1100);
      }
    },
    [phase, round.target.id, roundIndex, universe.id],
  );

  const progress = Math.round((roundIndex / SESSION_ROUNDS) * 100);

  return (
    <div className="screen screen--game" style={{ background: universe.background }}>
      <header className="topbar topbar--game">
        <button type="button" className="btn btn--icon" onClick={onExit} aria-label="Retour">
          ⬅️
        </button>

        <div className="prompt">
          <span className="prompt__emoji" aria-hidden="true">
            {universe.emoji}
          </span>
          <span className="prompt__text">Trouve&nbsp;: {round.target.name}</span>
          <button
            type="button"
            className="btn btn--sound"
            onClick={() => playVoice(round.target.audioName)}
            aria-label="Rejouer la consigne"
          >
            🔊
          </button>
        </div>

        <span className="topbar__spacer" />
      </header>

      <main className="game-main">
        {universe.id === "pirates" ? (
          <PirateScene>
            <PirateBoard
              options={round.options}
              targetId={round.target.id}
              phase={phase}
              pickedId={pickedId}
              onPick={handlePick}
            />
          </PirateScene>
        ) : (
          <DragonScene>
            <DragonBoard
              options={round.options}
              targetId={round.target.id}
              phase={phase}
              pickedId={pickedId}
              onPick={handlePick}
            />
          </DragonScene>
        )}
      </main>

      <footer className="progress">
        <div className="progress__bar" style={{ width: `${progress}%` }} />
      </footer>

      <BasileMascot
        variant="sidekick"
        position="bottom-left"
        mood={phase === "correct" ? "celebrate" : "idle"}
        animated
      />

      {phase === "correct" && <div className="flash flash--ok" aria-hidden="true" />}
    </div>
  );
}
