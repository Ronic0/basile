import { useCallback, useEffect, useRef, useState } from "react";
import type { Alpha } from "../data/alphas";
import type { Universe } from "../data/universes";
import { playSfx, playVoice } from "../lib/audio";
import { createRound, SESSION_ROUNDS, type Round } from "../lib/game";
import { choixMax, choixSuivant, type EtatProgression } from "../lib/difficulty";
import type { DifficulteMode } from "../lib/storage";
import type { Phase } from "./boards/types";
import { UNIVERSE_VIEWS } from "./universes/registry";
import { BasileMascot } from "./BasileMascot";

export interface SessionResult {
  bonnes: number;
  erreurs: number;
  sansAide: number;
  avecAide: number;
  maitrise: Record<string, number>;
}

interface Props {
  universe: Universe;
  discovered: Alpha[];
  difficulte: DifficulteMode;
  maitrise: Record<string, number>;
  onExit: () => void;
  onFinish: (result: SessionResult) => void;
}

export function GameScreen({ universe, discovered, difficulte, maitrise, onExit, onFinish }: Props) {
  const [optionCount, setOptionCount] = useState(() => choixMax(difficulte, discovered.length));
  const [progress, setProgress] = useState<EtatProgression>({
    serieAutonome: 0,
    serieDifficulte: 0,
  });
  const [round, setRound] = useState<Round>(() =>
    createRound(discovered, undefined, choixMax(difficulte, discovered.length)),
  );
  const [roundIndex, setRoundIndex] = useState(0);
  const [bonnes, setBonnes] = useState(0);
  const [erreurs, setErreurs] = useState(0);
  const [phase, setPhase] = useState<Phase>("asking");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const sfxTimer = useRef<number | null>(null);
  const roundHadError = useRef(false);
  const session = useRef({ sansAide: 0, avecAide: 0, maitrise: { ...maitrise } });
  const finished = useRef(false);

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
    if (roundIndex >= SESSION_ROUNDS && !finished.current) {
      finished.current = true;
      onFinish({
        bonnes,
        erreurs,
        sansAide: session.current.sansAide,
        avecAide: session.current.avecAide,
        maitrise: session.current.maitrise,
      });
    }
  }, [roundIndex, bonnes, erreurs, onFinish]);

  const handlePick = useCallback(
    (alpha: Alpha) => {
      if (phase !== "asking") return;
      setPickedId(alpha.id);

      if (alpha.id === round.target.id) {
        const autonome = !roundHadError.current;
        setPhase("correct");
        setBonnes((b) => b + 1);
        if (autonome) {
          session.current.sansAide += 1;
          session.current.maitrise[alpha.id] = (session.current.maitrise[alpha.id] ?? 0) + 1;
        } else {
          session.current.avecAide += 1;
        }
        setProgress((p) => ({
          serieAutonome: autonome ? p.serieAutonome + 1 : 0,
          serieDifficulte: 0,
        }));
        playVoice("bravo");
        playSfx(universe.correctSfx);
        if (sfxTimer.current) window.clearTimeout(sfxTimer.current);
        sfxTimer.current = window.setTimeout(() => {
          playSfx(universe.accentSfx);
        }, 350);
        timer.current = window.setTimeout(() => {
          const next = roundIndex + 1;
          if (next < SESSION_ROUNDS) {
            const etat: EtatProgression = {
              serieAutonome: autonome ? progress.serieAutonome + 1 : 0,
              serieDifficulte: 0,
            };
            const choix = choixSuivant(
              difficulte,
              discovered.length,
              session.current.maitrise,
              etat,
            );
            setOptionCount(choix);
            setRound(createRound(discovered, round.target.id, choix));
            setPhase("asking");
            setPickedId(null);
            roundHadError.current = false;
          }
          setRoundIndex(next);
        }, 1600);
      } else {
        roundHadError.current = true;
        setPhase("wrong");
        setErreurs((e) => e + 1);
        setProgress((p) => ({
          serieAutonome: 0,
          serieDifficulte: p.serieDifficulte + 1,
        }));
        playVoice("reessaie");
        timer.current = window.setTimeout(() => {
          setPhase("asking");
          setPickedId(null);
        }, 1100);
      }
    },
    [phase, round.target.id, roundIndex, universe, difficulte, discovered, progress],
  );

  const progressPct = Math.round((roundIndex / SESSION_ROUNDS) * 100);
  const { Scene, Board } = UNIVERSE_VIEWS[universe.id];

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
        <Scene>
          <div
            className={`board-host board-host--${optionCount}`}
            data-options={optionCount}
          >
            <Board
              options={round.options}
              targetId={round.target.id}
              phase={phase}
              pickedId={pickedId}
              bonnes={bonnes}
              onPick={handlePick}
            />
          </div>
        </Scene>
      </main>

      <footer className="progress">
        <div className="progress__bar" style={{ width: `${progressPct}%` }} />
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
