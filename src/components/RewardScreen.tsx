import { useEffect } from "react";
import type { Universe } from "../data/universes";
import { playSfx } from "../lib/audio";
import { BasileMascot } from "./BasileMascot";

interface Props {
  universe: Universe;
  bonnes: number;
  erreurs: number;
  onReplay: () => void;
  onHome: () => void;
}

export function RewardScreen({ universe, bonnes, erreurs, onReplay, onHome }: Props) {
  useEffect(() => {
    playSfx("reussite");
  }, []);

  return (
    <div className="screen screen--reward" style={{ background: universe.background }}>
      <div className="reward">
        <BasileMascot
          variant="reward"
          mood="celebrate"
          position="inline"
          showEffects
        />

        <h2 className="reward__title">Bravo&nbsp;!</h2>
        <p className="reward__line">
          {bonnes} bonne{bonnes > 1 ? "s" : ""} réponse{bonnes > 1 ? "s" : ""}
          {erreurs > 0 ? ` • ${erreurs} essai${erreurs > 1 ? "s" : ""}` : " • sans faute 🎉"}
        </p>

        <div className="reward__actions">
          <button type="button" className="btn btn--huge btn--play" onClick={onReplay}>
            🔁 Rejouer
          </button>
          <button type="button" className="btn btn--ghost" onClick={onHome}>
            🏠 Accueil
          </button>
        </div>
      </div>
    </div>
  );
}
