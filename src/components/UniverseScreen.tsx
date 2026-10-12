import { SOON_UNIVERSES, UNIVERSES, type UniverseId } from "../data/universes";
import { BasileMascot } from "./BasileMascot";

interface Props {
  onSelect: (id: UniverseId) => void;
  onBack: () => void;
}

export function UniverseScreen({ onSelect, onBack }: Props) {
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
        <span className="topbar__spacer" />
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
