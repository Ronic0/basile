import { SOON_UNIVERSES, UNIVERSES, type UniverseId } from "../data/universes";
import { BasileMascot } from "./BasileMascot";

interface Props {
  onSelect: (id: UniverseId) => void;
  onSelectBoss: () => void;
  onSelectAlbum: () => void;
  bossReady: boolean;
  onBack: () => void;
}

export function UniverseScreen({
  onSelect,
  onSelectBoss,
  onSelectAlbum,
  bossReady,
  onBack,
}: Props) {
  return (
    <div className="screen screen--universes">
      <BasileMascot
        variant="guide"
        mood="happy"
        size="14vmin"
        position="bottom-left"
      />

      <header className="topbar">
        <button type="button" className="btn btn--icon" onClick={onBack} aria-label="Retour">
          ⬅️
        </button>
        <h2 className="topbar__title">Choisis ton univers</h2>
        <button
          type="button"
          className="btn btn--album"
          onClick={onSelectAlbum}
          aria-label="Ouvrir mon album des Alphas"
        >
          📖 <span className="btn--album__text">Album</span>
        </button>
      </header>

      <div className="universe-grid">
        {UNIVERSES.map((u) => (
          <button
            key={u.id}
            type="button"
            className="universe-card"
            style={{ background: u.background }}
            onClick={() => onSelect(u.id)}
          >
            <span className="universe-card__emoji" aria-hidden="true">
              {u.emoji}
            </span>
            <span className="universe-card__title">{u.title}</span>
            <span className="universe-card__subtitle">{u.subtitle}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="boss-card"
        onClick={onSelectBoss}
        aria-label="Boss du prénom"
      >
        <span className="boss-card__glow" aria-hidden="true" />
        <span className="boss-card__dragon" aria-hidden="true">
          🐉
        </span>
        <span className="boss-card__text">
          <span className="boss-card__tag">Boss final</span>
          <span className="boss-card__title">Le Mystère du prénom BASILE</span>
          <span className="boss-card__subtitle">
            {bossReady
              ? "Affronte le Dragon des prénoms mélangés"
              : "Termine la découverte des 6 Alphas pour l'affronter"}
          </span>
        </span>
        <span className="boss-card__crown" aria-hidden="true">
          {bossReady ? "🏆" : "🔒"}
        </span>
      </button>

      {SOON_UNIVERSES.length > 0 && (
        <div className="universe-soon">
          {SOON_UNIVERSES.map((u) => (
            <div key={u.title} className="universe-soon__card">
              <span aria-hidden="true">{u.emoji}</span>
              <span className="universe-soon__title">{u.title}</span>
              <span className="universe-soon__tag">bientôt</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
