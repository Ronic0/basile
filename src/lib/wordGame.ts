/**
 * Mots jouables du mini-jeu « Jouer avec le mot ».
 *
 * Source : catalogue de la mission 1 (`src/data/words.ts`). On ne joue JAMAIS
 * un mot qui ne correspond pas à un objet réellement présent dans le jeu.
 *
 * Mots de départ proposés (mission 3) : EAU, ÎLE, OR, ROBOT, POMME, PERLE, RUBIS.
 *   - Activés : EAU, ROBOT, POMME, PERLE, RUBIS (objets réels du catalogue).
 *   - Non activés : ÎLE et OR — aucun objet nommé ainsi (« une île » est un
 *     décor, « or » n'est pas un objet du catalogue).
 * Le reste du catalogue correspond également à des objets réels : il est donc
 * activé (mots courts ET longs, avec accents : ÉMERAUDE, FUSÉE, FENÊTRE…).
 */
import { getWord, WORDS, type WordId } from "../data/words";

export const PLAYABLE_WORD_IDS: WordId[] = WORDS.map((w) => w.id);

const PLAYABLE = new Set<WordId>(PLAYABLE_WORD_IDS);

export function isPlayableWord(id: WordId): boolean {
  return PLAYABLE.has(id);
}

export interface GameLetter {
  /** Identifiant unique : deux lettres identiques ont deux ids distincts. */
  id: string;
  /** Caractère affiché (accents conservés). */
  char: string;
  /** Lettre de base a-z pour l'audio du nom (é → e, î → i). */
  base: string;
}

const DIACRITICS = /[\u0300-\u036f]/g;

/** Lettre de base pour l'audio du nom ; vide si ce n'est pas une lettre latine. */
export function baseLetter(char: string): string {
  const stripped = char.normalize("NFD").replace(DIACRITICS, "").toLowerCase();
  return /^[a-z]$/.test(stripped) ? stripped : "";
}

/** Découpe le mot en lettres mobiles, avec un id unique par occurrence. */
export function lettersForWord(word: WordId): GameLetter[] {
  return Array.from(getWord(word).label).map((char, i) => ({
    id: `${word}-${i}`,
    char,
    base: baseLetter(char),
  }));
}

/** Mélange (Fisher-Yates) sans muter le tableau d'origine. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
