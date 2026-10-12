/**
 * Sélecteurs et mutations du catalogue pédagogique, à partir des `Stats`.
 * Toutes les fonctions sont pures et renvoient un nouvel objet `Stats`.
 */
import { alphasByIds, BASILE_ALPHA_IDS, getAlphaSafe, type Alpha } from "../data/alphas";
import type { Stats } from "./storage";

/** Alphas découverts ET activés, dans l'ordre de découverte. */
export function playableAlphas(stats: Stats): Alpha[] {
  const dec = new Set(stats.decouverts);
  const act = new Set(stats.actifs);
  return alphasByIds(stats.ordre).filter(
    (a) => dec.has(a.id) && act.has(a.id) && a.available,
  );
}

/** Prochain Alpha à proposer à la découverte (actif, disponible, pas encore découvert). */
export function nextToDiscover(stats: Stats): Alpha | null {
  const dec = new Set(stats.decouverts);
  const act = new Set(stats.actifs);
  const found = alphasByIds(stats.ordre).find(
    (a) => act.has(a.id) && !dec.has(a.id) && a.available,
  );
  return found ?? null;
}

export function isDiscovered(stats: Stats, id: string): boolean {
  return stats.decouverts.includes(id);
}

export function isActive(stats: Stats, id: string): boolean {
  return stats.actifs.includes(id);
}

/** Marque un Alpha comme découvert (sans doublon). */
export function markDiscovered(stats: Stats, id: string): Stats {
  if (stats.decouverts.includes(id)) return stats;
  return { ...stats, decouverts: [...stats.decouverts, id] };
}

/** Active/désactive un Alpha (proposé dans le jeu). */
export function setActive(stats: Stats, id: string, active: boolean): Stats {
  if (active) {
    if (stats.actifs.includes(id)) return stats;
    return { ...stats, actifs: [...stats.actifs, id] };
  }
  return { ...stats, actifs: stats.actifs.filter((x) => x !== id) };
}

/** Débloque un Alpha pour jouer : l'active et le marque découvert. */
export function unlockAlpha(stats: Stats, id: string): Stats {
  return markDiscovered(setActive(stats, id, true), id);
}

/** Déplace un Alpha dans l'ordre de découverte (delta -1 / +1). */
export function moveInOrder(stats: Stats, id: string, delta: number): Stats {
  const order = [...stats.ordre];
  const i = order.indexOf(id);
  if (i < 0) return stats;
  const j = Math.max(0, Math.min(order.length - 1, i + delta));
  if (i === j) return stats;
  order.splice(i, 1);
  order.splice(j, 0, id);
  return { ...stats, ordre: order };
}

/** Enregistre une confusion : l'enfant a choisi `chosenId` au lieu de `targetId`. */
export function recordConfusion(stats: Stats, chosenId: string, targetId: string): Stats {
  if (chosenId === targetId) return stats;
  const key = `${chosenId}->${targetId}`;
  const confusions = { ...stats.confusions, [key]: (stats.confusions[key] ?? 0) + 1 };
  return { ...stats, confusions };
}

export interface ConfusionPair {
  chosen: Alpha;
  target: Alpha;
  count: number;
}

/** Confusions fréquentes, triées de la plus fréquente à la moins fréquente. */
export function frequentConfusions(stats: Stats, limit = 8): ConfusionPair[] {
  const pairs: ConfusionPair[] = [];
  for (const [key, count] of Object.entries(stats.confusions)) {
    const [chosenId, targetId] = key.split("->");
    const chosen = getAlphaSafe(chosenId);
    const target = getAlphaSafe(targetId);
    if (chosen && target) pairs.push({ chosen, target, count });
  }
  return pairs.sort((a, b) => b.count - a.count).slice(0, limit);
}

/**
 * Réinitialise uniquement les progrès pédagogiques (découvertes, maîtrise,
 * confusions, résultats avec/sans aide). Conserve l'ordre, les activations,
 * la difficulté et le reste des statistiques.
 */
export function resetPedagogy(stats: Stats): Stats {
  return {
    ...stats,
    decouverts: BASILE_ALPHA_IDS.slice(0, 2),
    maitrise: {},
    confusions: {},
    bonnesSansAide: 0,
    bonnesAvecAide: 0,
  };
}
