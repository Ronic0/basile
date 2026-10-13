/**
 * Sélection des lettres-jouets réellement « introduites ».
 *
 * Point de départ : les lettres du prénom BASILE (toujours disponibles). On
 * étend ensuite aux lettres des Alphas découverts ET activés. Une lettre non
 * introduite n'est jamais proposée comme objectif de reconnaissance.
 */
import { BASILE_LETTERS, getLetterToy, LETTERS, type LetterToy } from "../data/letters";
import { playableAlphas } from "./catalogue";
import type { Stats } from "./storage";

/** Lettres introduites : BASILE + lettres du catalogue pédagogique découvert. */
export function availableLetters(stats: Stats): LetterToy[] {
  const letters = new Set<string>(BASILE_LETTERS);
  for (const alpha of playableAlphas(stats)) {
    if (/^[a-z]$/.test(alpha.letter)) letters.add(alpha.letter);
  }
  return LETTERS.filter((l) => letters.has(l.char.toLowerCase()));
}

/** Lettre-jouet correspondant à la première lettre d'un mot (ex. FRAISE → F). */
export function firstLetterToy(label: string): LetterToy | undefined {
  return getLetterToy(label.slice(0, 1));
}

/** Choisit une lettre introduite (stable si `index` fourni). */
export function pickAvailableLetter(stats: Stats, index = 0): LetterToy | null {
  const list = availableLetters(stats);
  if (list.length === 0) return null;
  return list[Math.abs(index) % list.length];
}
