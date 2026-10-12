import { useCallback, useRef, useState } from "react";
import { ALPHA_GROUPS, alphasByIds, type Alpha } from "../data/alphas";
import type { Stats } from "../lib/storage";
import { isDiscovered } from "../lib/catalogue";
import { playVoice } from "../lib/audio";
import { BasileMascot } from "./BasileMascot";

interface Props {
  stats: Stats;
  onBack: () => void;
}

export function AlbumScreen({ stats, onBack }: Props) {
  const [popped, setPopped] = useState<string | null>(null);
  const popTimer = useRef<number | null>(null);

  const discoveredCount = ALPHA_GROUPS.flatMap((g) => g.ids).filter((id) =>
    stats.decouverts.includes(id),
  ).length;
  const total = ALPHA_GROUPS.flatMap((g) => g.ids).length;

  const speak = useCallback((alpha: Alpha) => {
    playVoice(alpha.discoveryAudio);
    setPopped(alpha.id);
    if (popTimer.current) window.clearTimeout(popTimer.current);
    popTimer.current = window.setTimeout(() => setPopped(null), 650);
  }, []);

  return (
    <div className="screen screen--album">
      <header className="topbar">
        <button type="button" className="btn btn--icon" onClick={onBack} aria-label="Retour">
          ⬅️
        </button>
        <h2 className="topbar__title">Mon album des Alphas</h2>
        <span className="album__count">
          {discoveredCount} / {total}
        </span>
      </header>

      <div className="album__scroll">
        {ALPHA_GROUPS.map((group) => {
          const alphas = alphasByIds(group.ids);
          const found = alphas.filter((a) => isDiscovered(stats, a.id)).length;
          return (
            <section className="album__group" key={group.id}>
              <h3 className="album__group-title">
                {group.label}
                <span className="album__group-count">
                  {found} / {alphas.length}
                </span>
              </h3>
              <div className="album__grid">
                {alphas.map((alpha, index) => (
                  <AlbumCard
                    key={alpha.id}
                    alpha={alpha}
                    found={isDiscovered(stats, alpha.id)}
                    popped={popped === alpha.id}
                    index={index}
                    onPick={speak}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <BasileMascot
        variant="guide"
        mood="happy"
        size="13vmin"
        position="bottom-right"
      />
    </div>
  );
}

interface CardProps {
  alpha: Alpha;
  found: boolean;
  popped: boolean;
  index: number;
  onPick: (alpha: Alpha) => void;
}

function AlbumCard({ alpha, found, popped, index, onPick }: CardProps) {
  const classes = ["album-card", found ? "is-found" : "is-locked"];
  if (popped) classes.push("is-popped");

  return (
    <button
      type="button"
      className={classes.join(" ")}
      style={
        {
          "--alpha-color": alpha.color,
          "--card-delay": `${Math.min(index * 40, 400)}ms`,
        } as React.CSSProperties
      }
      onClick={() => found && onPick(alpha)}
      disabled={!found}
      aria-label={found ? `${alpha.name}, lettre ${alpha.letter}` : "Alpha non découvert"}
    >
      <span className="album-card__frame">
        <img
          className="album-card__img"
          src={alpha.image}
          alt=""
          draggable={false}
          onError={(e) => {
            const el = e.currentTarget;
            if (!el.src.endsWith(alpha.imageFallback)) el.src = alpha.imageFallback;
          }}
        />
        {!found && (
          <span className="album-card__lock" aria-hidden="true">
            ?
          </span>
        )}
      </span>
      <span className="album-card__name">{found ? alpha.name : "Mystère"}</span>
      {found ? (
        <span className="album-card__letter">{alpha.letter}</span>
      ) : (
        <span className="album-card__letter album-card__letter--unknown">•</span>
      )}
    </button>
  );
}
