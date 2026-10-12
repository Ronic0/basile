import type { AideBoss, DifficulteMode, Stats } from "../lib/storage";
import { alphasConnus } from "../lib/difficulty";
import { AudioTestPanel } from "./AudioTestPanel";
import { BasileMascot } from "./BasileMascot";

interface Props {
  stats: Stats;
  onSetDifficulte: (mode: DifficulteMode) => void;
  onSetAideBoss: (level: AideBoss) => void;
  onReset: () => void;
  onBack: () => void;
}

const DIFFICULTES: { id: DifficulteMode; label: string; hint: string }[] = [
  { id: "toujours2", label: "Toujours 2", hint: "Deux propositions, en douceur." },
  { id: "adaptatif", label: "Adaptatif", hint: "Trois choix quand Basile progresse." },
  { id: "toujours3", label: "Toujours 3", hint: "Trois choix dès que possible." },
];

const AIDES: { id: AideBoss; label: string; hint: string }[] = [
  { id: "debutant", label: "Débutant", hint: "Modèle, emplacement surligné, consigne audio." },
  { id: "intermediaire", label: "Intermédiaire", hint: "Modèle visible, moins d'indices." },
  { id: "avance", label: "Avancé", hint: "Modèle masqué, indice à la demande." },
];

export function ParentScreen({
  stats,
  onSetDifficulte,
  onSetAideBoss,
  onReset,
  onBack,
}: Props) {
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
            <li>
              <span>Réussites autonomes</span>
              <strong>{stats.bonnesSansAide}</strong>
            </li>
            <li>
              <span>Réussites avec aide</span>
              <strong>{stats.bonnesAvecAide}</strong>
            </li>
            <li>
              <span>Alphas bien connus</span>
              <strong>{alphasConnus(stats.maitrise)} / 6</strong>
            </li>
          </ul>

          <section className="parent__settings">
            <h3 className="parent__settings-title">Nombre de propositions</h3>
            <div className="parent__choices">
              {DIFFICULTES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`choice ${stats.difficulte === d.id ? "is-active" : ""}`}
                  onClick={() => onSetDifficulte(d.id)}
                  aria-pressed={stats.difficulte === d.id}
                >
                  <span className="choice__label">{d.label}</span>
                  <span className="choice__hint">{d.hint}</span>
                </button>
              ))}
            </div>

            <h3 className="parent__settings-title">Aide du boss du prénom</h3>
            <div className="parent__choices">
              {AIDES.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`choice ${stats.aideBoss === a.id ? "is-active" : ""}`}
                  onClick={() => onSetAideBoss(a.id)}
                  aria-pressed={stats.aideBoss === a.id}
                >
                  <span className="choice__label">{a.label}</span>
                  <span className="choice__hint">{a.hint}</span>
                </button>
              ))}
            </div>
          </section>

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
