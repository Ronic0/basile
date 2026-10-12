import type { Stats } from "../lib/storage";
import { AudioTestPanel } from "./AudioTestPanel";
import { BasileMascot } from "./BasileMascot";

interface Props {
  stats: Stats;
  onReset: () => void;
  onBack: () => void;
}

export function ParentScreen({ stats, onReset, onBack }: Props) {
  return (
    <div className="screen screen--parent">
      <header className="topbar">
        <button type="button" className="btn btn--icon" onClick={onBack} aria-label="Retour">
          ⬅️
        </button>
        <h2 className="topbar__title">Espace parent</h2>
        <span className="topbar__spacer" />
      </header>

      <div className="parent__content">
        <div className="parent__stats-col">
          <ul className="parent__stats">
            <li>
              <span>Parties jouées</span>
              <strong>{stats.parties}</strong>
            </li>
            <li>
              <span>Bonnes réponses</span>
              <strong>{stats.bonnes}</strong>
            </li>
            <li>
              <span>Erreurs</span>
              <strong>{stats.erreurs}</strong>
            </li>
            <li>
              <span>Dernier univers</span>
              <strong>{stats.dernierUnivers ?? "—"}</strong>
            </li>
            <li>
              <span>Alphas découverts</span>
              <strong>{stats.decouverte} / 6</strong>
            </li>
          </ul>

          <button type="button" className="btn btn--danger" onClick={onReset}>
            Réinitialiser les progrès
          </button>
        </div>

        <AudioTestPanel />
      </div>

      <BasileMascot
        variant="guide"
        size="11vmin"
        position="bottom-right"
        mood="idle"
      />
    </div>
  );
}
