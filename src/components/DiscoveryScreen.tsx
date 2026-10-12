import { useEffect, useState } from "react";
import type { Alpha } from "../data/alphas";
import { playVoice } from "../lib/audio";
import { AlphaCard } from "./AlphaCard";
import { BasileMascot } from "./BasileMascot";

interface Props {
  alphas: Alpha[];
  onDone: () => void;
  onBack: () => void;
}

export function DiscoveryScreen({ alphas, onDone, onBack }: Props) {
  const [index, setIndex] = useState(0);
  const alpha = alphas[index];
  const isLast = index === alphas.length - 1;

  useEffect(() => {
    if (alpha) playVoice(alpha.discoveryAudio);
  }, [alpha]);

  if (!alpha) {
    return (
      <div className="screen screen--discovery">
        <button type="button" className="btn btn--huge btn--play" onClick={onDone}>
          ▶ Jouer
        </button>
      </div>
    );
  }

  const handleNext = () => {
    if (isLast) {
      playVoice("bien-joue");
      onDone();
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="screen screen--discovery">
      <header className="topbar">
        <button type="button" className="btn btn--icon" onClick={onBack} aria-label="Retour">
          ⬅️
        </button>
        <h2 className="topbar__title">Je découvre les Alphas</h2>
        <span className="topbar__spacer" />
      </header>

      <main className="discovery-main">
        <div className="discovery-stage">
          <AlphaCard alpha={alpha} showName />
          <BasileMascot
            variant="guide"
            mood="happy"
            size="24vmin"
            position="inline"
            animated
            className="basile--presenter"
          />
        </div>
      </main>

      <div className="discovery-dots" aria-hidden="true">
        {alphas.map((a, i) => (
          <span key={a.id} className={i === index ? "is-active" : ""} />
        ))}
      </div>

      <div className="discovery-actions">
        <button
          type="button"
          className="btn btn--huge btn--ghost"
          onClick={() => playVoice(alpha.discoveryAudio)}
        >
          🔊 Réécouter
        </button>
        <button type="button" className="btn btn--huge btn--play" onClick={handleNext}>
          {isLast ? "🎮 Jouer" : "➡️ Suivant"}
        </button>
      </div>
    </div>
  );
}
