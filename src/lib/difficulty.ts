import type { DifficulteMode } from "./storage";

/** Nombre de reconnaissances autonomes pour considérer un Alpha connu. */
export const MAITRISE_SEUIL = 2;
/** Nombre d'Alphas connus requis avant de passer à trois choix. */
export const ALPHAS_CONNUS_REQUIS = 3;
/** Nombre de réussites autonomes indépendantes avant de passer à trois choix. */
export const AUTONOMIE_REQUISE = 3;
/** Difficultés répétées avant de revenir à deux choix. */
export const DIFFICULTES_RETOUR = 2;

/**
 * Nombre maximum de propositions autorisé par le mode, borné par les Alphas
 * déjà découverts. Deux choix minimum pour pouvoir jouer.
 */
export function choixMax(mode: DifficulteMode, decouverte: number): number {
  const disponibles = Math.max(2, Math.min(6, decouverte));
  if (mode === "toujours2") return 2;
  if (mode === "toujours3") return Math.min(3, disponibles);
  return disponibles >= 3 ? 3 : 2;
}

/** Nombre d'Alphas ayant atteint le seuil de maîtrise autonome. */
export function alphasConnus(maitrise: Record<string, number>): number {
  return Object.values(maitrise).filter((v) => v >= MAITRISE_SEUIL).length;
}

export interface EtatProgression {
  /** Réussites autonomes consécutives, indépendantes d'une même manche. */
  serieAutonome: number;
  /** Difficultés consécutives depuis la dernière réussie. */
  serieDifficulte: number;
}

/**
 * Décide du nombre de propositions pour la manche suivante.
 * En mode adaptatif, on ne passe à trois que si les personnages sont
 * suffisamment connus (jamais d'augmentation artificielle).
 */
export function choixSuivant(
  mode: DifficulteMode,
  decouverte: number,
  maitrise: Record<string, number>,
  etat: EtatProgression,
): number {
  const max = choixMax(mode, decouverte);
  if (max < 3) return max;
  if (mode === "toujours3") return 3;

  if (etat.serieDifficulte >= DIFFICULTES_RETOUR) return 2;
  const assezConnus = alphasConnus(maitrise) >= ALPHAS_CONNUS_REQUIS;
  const assezAutonome = etat.serieAutonome >= AUTONOMIE_REQUISE;
  return assezConnus && assezAutonome ? 3 : 2;
}
