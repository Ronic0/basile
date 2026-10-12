import { useState } from "react";
import type { AideBoss, DifficulteMode, Stats } from "../lib/storage";
import { alphasConnus } from "../lib/difficulty";
import { alphasByIds } from "../data/alphas";
import { frequentConfusions } from "../lib/catalogue";
import { AudioTestPanel } from "./AudioTestPanel";
import { BasileMascot } from "./BasileMascot";

interface Props {
  stats: Stats;
  onSetDifficulte: (mode: DifficulteMode) => void;
  onSetAideBoss: (level: AideBoss) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onUnlock: (id: string) => void;
  onMove: (id: string, delta: number) => void;
  onResetPedagogy: () => void;
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
  onToggleActive,
  onUnlock,
  onMove,
  onResetPedagogy,
  onReset,
  onBack,
}: Props) {
  const ordered = alphasByIds(stats.ordre);
  const confusions = frequentConfusions(stats, 8);
  const knownAlphas = alphasConnus(stats.maitrise);

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
              <strong>
                {stats.decouverts.length} / {ordered.length}
              </strong>
            </li>
            <li>
              <span>Alphas activés</span>
              <strong>{stats.actifs.length}</strong>
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
              <strong>{knownAlphas}</strong>
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

          <ConfusionList pairs={confusions} />

          <section className="parent__settings">
            <h3 className="parent__settings-title">Alphas à travailler</h3>
            <p className="parent__hint">
              Activez/désactivez un personnage, débloquez-le pour le découvrir, ou réordonnez la
              progression. Les six Alphas du prénom BASILE sont toujours disponibles.
            </p>
            <ul className="catalogue">
              {ordered.map((alpha, index) => {
                const discovered = stats.decouverts.includes(alpha.id);
                const active = stats.actifs.includes(alpha.id);
                return (
                  <li className="catalogue__row" key={alpha.id}>
                    <span
                      className="catalogue__color"
                      style={{ background: alpha.color }}
                      aria-hidden="true"
                    />
                    <span className="catalogue__name">
                      {alpha.name}
                      <span className="catalogue__letter">{alpha.letter}</span>
                    </span>
                    <span className="catalogue__tags">
                      {discovered ? (
                        <span className="catalogue__tag is-found">découvert</span>
                      ) : (
                        <span className="catalogue__tag">à découvrir</span>
                      )}
                    </span>
                    <span className="catalogue__actions">
                      <button
                        type="button"
                        className={`catalogue__btn ${active ? "is-on" : ""}`}
                        onClick={() => onToggleActive(alpha.id, !active)}
                        aria-pressed={active}
                        aria-label={`${active ? "Désactiver" : "Activer"} ${alpha.name}`}
                        title={active ? "Désactiver" : "Activer"}
                      >
                        {active ? "✓" : "○"}
                      </button>
                      {!discovered && (
                        <button
                          type="button"
                          className="catalogue__btn catalogue__btn--unlock"
                          onClick={() => onUnlock(alpha.id)}
                          aria-label={`Débloquer ${alpha.name}`}
                          title="Débloquer"
                        >
                          ★
                        </button>
                      )}
                      <button
                        type="button"
                        className="catalogue__btn"
                        onClick={() => onMove(alpha.id, -1)}
                        disabled={index === 0}
                        aria-label={`Monter ${alpha.name}`}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className="catalogue__btn"
                        onClick={() => onMove(alpha.id, 1)}
                        disabled={index === ordered.length - 1}
                        aria-label={`Descendre ${alpha.name}`}
                      >
                        ▼
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <ConfirmButton
            className="btn btn--danger"
            label="Réinitialiser les progrès pédagogiques"
            confirmLabel="Confirmer : effacer les découvertes et la maîtrise ?"
            onConfirm={onResetPedagogy}
          />

          <ConfirmButton
            className="btn btn--danger"
            label="Tout réinitialiser (statistiques comprises)"
            confirmLabel="Confirmer : tout effacer ?"
            onConfirm={onReset}
          />
        </div>

        <AudioTestPanel />
      </div>

      <BasileMascot variant="guide" size="11vmin" position="bottom-right" mood="idle" />
    </div>
  );
}

function ConfusionList({
  pairs,
}: {
  pairs: { chosen: { name: string; letter: string }; target: { name: string; letter: string }; count: number }[];
}) {
  if (pairs.length === 0) return null;
  return (
    <section className="parent__settings">
      <h3 className="parent__settings-title">Confusions fréquentes</h3>
      <ul className="confusions">
        {pairs.map((p, i) => (
          <li key={i} className="confusions__row">
            <span className="confusions__pair">
              {p.chosen.name} <span className="confusions__arrow">→</span> {p.target.name}
            </span>
            <span className="confusions__count">×{p.count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ConfirmButton({
  label,
  confirmLabel,
  className,
  onConfirm,
}: {
  label: string;
  confirmLabel: string;
  className?: string;
  onConfirm: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button type="button" className={className} onClick={() => setConfirming(true)}>
        {label}
      </button>
    );
  }

  return (
    <div className="confirm">
      <span className="confirm__text">{confirmLabel}</span>
      <div className="confirm__actions">
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => {
            onConfirm();
            setConfirming(false);
          }}
        >
          Oui, effacer
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setConfirming(false)}>
          Annuler
        </button>
      </div>
    </div>
  );
}
