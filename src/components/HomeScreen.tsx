import type { Stats } from "../lib/storage";

interface Props {
  onPlay: () => void;
  onParent: () => void;
  stats: Stats;
}

export function HomeScreen({ onPlay, onParent, stats }: Props) {
  return (
    <div className="screen screen--home">
      <div className="home__stars" aria-hidden="true">
        <span>⭐</span>
        <span>🐍</span>
        <span>🥾</span>
        <span>✨</span>
        <span>🐌</span>
      </div>

      <h1 className="home__title">
        Les aventures des
        <br />
        <span>Alphas de Basile</span>
      </h1>

      <p className="home__subtitle">Trouve le bon Alpha&nbsp;!</p>

      <button type="button" className="btn btn--huge btn--play" onClick={onPlay}>
        <span aria-hidden="true">▶</span> Jouer
      </button>

      <button type="button" className="btn btn--ghost home__parent" onClick={onParent}>
        Parent
      </button>

      {stats.parties > 0 && (
        <p className="home__stats">
          {stats.parties} partie{stats.parties > 1 ? "s" : ""} • {stats.bonnes} réussie
          {stats.bonnes > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
