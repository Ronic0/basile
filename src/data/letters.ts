/**
 * Catalogue des lettres-jouets.
 *
 * Deux notions distinctes et volontairement séparées :
 *  - le NOM de la lettre (audio `lettre-*`, ex. « bé ») : c'est ce que joue une
 *    lettre-jouet ;
 *  - le PHONÈME (`phoneme`) : information pédagogique, jamais confondu avec le
 *    nom ;
 *  - le personnage ALPHA associé (`alphaId` / `alphaName`) : sa correspondance
 *    pédagogique validée est conservée et son audio reste `alpha-*` (jamais
 *    remplacé par un nom de lettre, et inversement).
 *
 * Règle audio : on ne réutilise JAMAIS l'enregistrement d'un mot complet (ni
 * `mot-*`, ni `tresor-*`) comme audio d'une lettre isolée. Un seul audio par
 * caractère (`lettre-a` … `lettre-z`).
 *
 * Progression : l'ordre commence par les lettres du prénom BASILE, puis s'étend
 * aux lettres du catalogue découvert (voir `src/lib/letters.ts`).
 */
import { ALPHAS, type Alpha } from "./alphas";

export interface LetterToy {
  /** Caractère affiché en grand (majuscule). */
  char: string;
  /** Nom français de la lettre (prononcé par l'audio). */
  name: string;
  /** Phonème indicatif (jamais joué à la place du nom). */
  phoneme: string;
  /** Id de la voix du NOM de la lettre (manifeste audio). */
  audio: string;
  /** Alpha associé (correspondance pédagogique validée), si connu. */
  alphaId?: string;
  alphaName?: string;
  color: string;
  colorDark: string;
}

const LETTER_NAMES: Record<string, { name: string; phoneme: string }> = {
  a: { name: "a", phoneme: "/a/" },
  b: { name: "bé", phoneme: "/b/" },
  c: { name: "cé", phoneme: "/k/ ou /s/" },
  d: { name: "dé", phoneme: "/d/" },
  e: { name: "e", phoneme: "/ə/" },
  f: { name: "effe", phoneme: "/f/" },
  g: { name: "gé", phoneme: "/ɡ/ ou /ʒ/" },
  h: { name: "ache", phoneme: "(muet)" },
  i: { name: "i", phoneme: "/i/" },
  j: { name: "ji", phoneme: "/ʒ/" },
  k: { name: "ka", phoneme: "/k/" },
  l: { name: "elle", phoneme: "/l/" },
  m: { name: "emme", phoneme: "/m/" },
  n: { name: "enne", phoneme: "/n/" },
  o: { name: "o", phoneme: "/o/" },
  p: { name: "pé", phoneme: "/p/" },
  q: { name: "ku", phoneme: "/k/" },
  r: { name: "erre", phoneme: "/ʁ/" },
  s: { name: "esse", phoneme: "/s/" },
  t: { name: "té", phoneme: "/t/" },
  u: { name: "u", phoneme: "/y/" },
  v: { name: "vé", phoneme: "/v/" },
  w: { name: "double vé", phoneme: "/w/ ou /v/" },
  x: { name: "ixe", phoneme: "/ks/" },
  y: { name: "i grec", phoneme: "/j/ ou /i/" },
  z: { name: "zède", phoneme: "/z/" },
};

/** Lettres du prénom de Basile, dans l'ordre — point de départ de la progression. */
export const BASILE_LETTERS = ["b", "a", "s", "i", "l", "e"];

/** Un Alpha « lettre » par graphème simple (les digrammes/variantes sont exclus). */
function letterAlphas(): Map<string, Alpha> {
  const map = new Map<string, Alpha>();
  for (const a of ALPHAS) {
    if (a.kind !== "letter") continue;
    if (!/^[a-z]$/.test(a.letter)) continue;
    if (!map.has(a.letter)) map.set(a.letter, a);
  }
  return map;
}

function buildToys(): LetterToy[] {
  const byLetter = letterAlphas();
  const make = (letter: string): LetterToy => {
    const alpha = byLetter.get(letter);
    const meta = LETTER_NAMES[letter];
    return {
      char: letter.toUpperCase(),
      name: meta?.name ?? letter,
      phoneme: meta?.phoneme ?? "",
      audio: `lettre-${letter}`,
      alphaId: alpha?.id,
      alphaName: alpha?.name,
      color: alpha?.color ?? "#3aa27d",
      colorDark: alpha?.colorDark ?? "#25694f",
    };
  };
  const rest = "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .filter((l) => !BASILE_LETTERS.includes(l));
  return [...BASILE_LETTERS, ...rest].map(make);
}

export const LETTERS: LetterToy[] = buildToys();

/** Recherche insensible à la casse par caractère. */
export function getLetterToy(char: string): LetterToy | undefined {
  const target = char.trim().toUpperCase();
  return LETTERS.find((l) => l.char === target);
}
