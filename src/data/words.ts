/**
 * Catalogue central des mots du Monde de Basile.
 *
 * Chaque mot réutilise l'identifiant réel de l'objet présent dans le jeu :
 *   - Port des Pirates  : TreasureId (src/data/pirates.ts)
 *   - Jardin magique    : PlantType  (src/lib/garden.ts) — le fraisier donne une FRAISE
 *   - Atelier           : BuildableId (src/data/buildables.ts)
 *   - Nurserie          : actions de la nurserie (pomme, poisson, eau, balle, dragon)
 *   - Ma Cabane         : objets de la pièce (lampe, coffre, tapis, fenêtre)
 *
 * `voice` pointe vers une entrée du manifeste audio (src/data/audioManifest.ts).
 * Règle : on RÉUTILISE une prise existante si elle prononce exactement le mot
 * (article + nom, singulier, sans qualificatif) ; sinon on génère une voix `mot-*`.
 *   - Réutilisées : coquillage, rubis, émeraude, perle (tresor-*), fusée
 *     (alpha-fuse-aigue « La fusée. »).
 *   - Générées    : toutes les autres (`mot-*`).
 *
 * Accents français conservés dans `label`. `letter` est la première lettre
 * affichée en évidence (elle garde son accent, ex. « É »).
 */
import type { TreasureId } from "./pirates";
import type { BuildableId } from "./buildables";
import type { PlantType } from "../lib/garden";

export type WordId =
  | "piece"
  | "coquillage"
  | "rubis"
  | "emeraude"
  | "perle"
  | "carte"
  | "tournesol"
  | "fraise"
  | "carotte"
  | "voiture"
  | "robot"
  | "fusee"
  | "dragon"
  | "pomme"
  | "poisson"
  | "eau"
  | "balle"
  | "lampe"
  | "coffre"
  | "tapis"
  | "fenetre";

export interface WordEntry {
  id: WordId;
  /** Orthographe française, en majuscules, accents compris. */
  label: string;
  /** Identifiant de la voix dans le manifeste audio. */
  voice: string;
}

export const WORDS: WordEntry[] = [
  { id: "piece", label: "PIÈCE", voice: "mot-piece" },
  { id: "coquillage", label: "COQUILLAGE", voice: "tresor-coquillage" },
  { id: "rubis", label: "RUBIS", voice: "tresor-rubis" },
  { id: "emeraude", label: "ÉMERAUDE", voice: "tresor-emeraude" },
  { id: "perle", label: "PERLE", voice: "tresor-perle" },
  { id: "carte", label: "CARTE", voice: "mot-carte" },
  { id: "tournesol", label: "TOURNESOL", voice: "mot-tournesol" },
  { id: "fraise", label: "FRAISE", voice: "mot-fraise" },
  { id: "carotte", label: "CAROTTE", voice: "mot-carotte" },
  { id: "voiture", label: "VOITURE", voice: "mot-voiture" },
  { id: "robot", label: "ROBOT", voice: "mot-robot" },
  { id: "fusee", label: "FUSÉE", voice: "alpha-fuse-aigue" },
  { id: "dragon", label: "DRAGON", voice: "mot-dragon" },
  { id: "pomme", label: "POMME", voice: "mot-pomme" },
  { id: "poisson", label: "POISSON", voice: "mot-poisson" },
  { id: "eau", label: "EAU", voice: "mot-eau" },
  { id: "balle", label: "BALLE", voice: "mot-balle" },
  { id: "lampe", label: "LAMPE", voice: "mot-lampe" },
  { id: "coffre", label: "COFFRE", voice: "mot-coffre" },
  { id: "tapis", label: "TAPIS", voice: "mot-tapis" },
  { id: "fenetre", label: "FENÊTRE", voice: "mot-fenetre" },
];

const BY_ID: Record<WordId, WordEntry> = Object.fromEntries(
  WORDS.map((w) => [w.id, w]),
) as Record<WordId, WordEntry>;

export function getWord(id: WordId): WordEntry {
  return BY_ID[id];
}

/** Première lettre mise en évidence (conserve l'accent). */
export function firstLetter(label: string): string {
  return label.slice(0, 1);
}

/** Reste du mot après la première lettre. */
export function restOfWord(label: string): string {
  return label.slice(1);
}

/* ---------- Correspondances objet → mot (les trois événements intégrés) ---------- */

/** Trésor du Port des Pirates → mot (mêmes identifiants). */
export const TREASURE_WORDS: Record<TreasureId, WordId> = {
  piece: "piece",
  coquillage: "coquillage",
  rubis: "rubis",
  emeraude: "emeraude",
  perle: "perle",
  carte: "carte",
};

/** Plante récoltée au Jardin magique → mot (fraisier → FRAISE). */
export const PLANT_WORDS: Record<PlantType, WordId> = {
  tournesol: "tournesol",
  fraisier: "fraise",
  carotte: "carotte",
};

/** Objet terminé à l'Atelier → mot (mêmes identifiants). */
export const BUILDABLE_WORDS: Record<BuildableId, WordId> = {
  voiture: "voiture",
  robot: "robot",
  fusee: "fusee",
};
