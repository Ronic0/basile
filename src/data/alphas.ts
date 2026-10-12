/**
 * Catalogue des Alphas.
 *
 * Correspondance nom ↔ graphème : elle provient de `public/assets/alphas/alphas.json`.
 * Les six personnages du prénom BASILE gardent leurs identifiants historiques
 * (`botte`, `monsieur-a`, `serpent`, `madame-i`, `limace`, `madame-e`) afin de
 * préserver les sauvegardes existantes.
 *
 * ⚠️ Ambiguïtés pédagogiques signalées (voir `kind`) :
 *  - `madame-e-aigu|grave|circonflexe` sont des VARIANTES de la voyelle e
 *    (é, è, ê), pas des lettres différentes. Groupe `special`, jamais proposées
 *    par défaut.
 *  - `chat` est un DIGRAMME (ch), pas une lettre.
 *  - Les correspondances incertaines ne sont pas inventées : on ne se fie
 *    qu'aux entrées du JSON fourni.
 */
export type AlphaKind = "letter" | "digraph" | "variant";

export type AlphaGroupId =
  | "basile"
  | "o-m-r-u"
  | "f-v-n-t"
  | "p-c-d-j"
  | "g-h-k-q"
  | "w-x-y-z"
  | "special";

export interface Alpha {
  id: string;
  name: string;
  /** Graphème associé (lettre, digramme ou lettre accentuée). */
  letter: string;
  kind: AlphaKind;
  group: AlphaGroupId;
  audioName: string;
  discoveryAudio: string;
  color: string;
  colorDark: string;
  emoji: string;
  /** Image optimisée (marges recadrées). */
  image: string;
  /** Image originale, utilisée si l'optimisée est absente. */
  imageFallback: string;
  /** Vrai si les ressources (image) sont présentes et validées sur le disque. */
  available: boolean;
}

const base = import.meta.env.BASE_URL;
const optimized = (file: string) => `${base}assets/alphas/optimized/${file}`;
const original = (file: string) => `${base}assets/alphas/${file}`;

function darken(hex: string, amount = 0.38): string {
  const c = hex.replace("#", "");
  const channel = (i: number) => Math.max(0, Math.round(parseInt(c.slice(i, i + 2), 16) * (1 - amount)));
  return `#${[channel(0), channel(2), channel(4)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

interface Seed {
  id: string;
  name: string;
  letter: string;
  group: AlphaGroupId;
  file: string;
  color: string;
  emoji: string;
  kind?: AlphaKind;
  colorDark?: string;
  audioName?: string;
  discoveryAudio?: string;
}

const SEEDS: Seed[] = [
  // --- Groupe 1 : BASILE (ordre du prénom) ---
  { id: "botte", name: "La botte", letter: "b", group: "basile", file: "botte.png", color: "#8a5a2b", colorDark: "#5e3c1a", emoji: "🥾", audioName: "trouve-la-botte", discoveryAudio: "alpha-botte" },
  { id: "monsieur-a", name: "Monsieur a", letter: "a", group: "basile", file: "monsieur-a.png", color: "#e8543f", colorDark: "#b5321f", emoji: "🅰️", audioName: "trouve-monsieur-a", discoveryAudio: "alpha-monsieur-a" },
  { id: "serpent", name: "Le serpent", letter: "s", group: "basile", file: "serpent.png", color: "#3aa34a", colorDark: "#246e30", emoji: "🐍", audioName: "trouve-le-serpent", discoveryAudio: "alpha-serpent" },
  { id: "madame-i", name: "Madame i", letter: "i", group: "basile", file: "madame-i.png", color: "#7d4bd1", colorDark: "#542e93", emoji: "ℹ️", audioName: "trouve-madame-i", discoveryAudio: "alpha-madame-i" },
  { id: "limace", name: "La limace", letter: "l", group: "basile", file: "limace.png", color: "#2f9bd6", colorDark: "#1c6a95", emoji: "🐌", audioName: "trouve-la-limace", discoveryAudio: "alpha-limace" },
  { id: "madame-e", name: "Madame e", letter: "e", group: "basile", file: "madame-e.png", color: "#f0b429", colorDark: "#b98612", emoji: "✨", audioName: "trouve-madame-e", discoveryAudio: "alpha-madame-e" },

  // --- Groupe 2 : O, M, R, U ---
  { id: "monsieur-o", name: "Monsieur o", letter: "o", group: "o-m-r-u", file: "monsieur_o.png", color: "#e8862a", emoji: "🟠" },
  { id: "monstre", name: "Le monstre", letter: "m", group: "o-m-r-u", file: "monstre.png", color: "#7d4bd1", emoji: "👾" },
  { id: "robinet", name: "Le robinet", letter: "r", group: "o-m-r-u", file: "robinet.png", color: "#2f9bd6", emoji: "🚰" },
  { id: "mademoiselle-u", name: "Mademoiselle u", letter: "u", group: "o-m-r-u", file: "mademoiselle-u.png", color: "#3aa34a", emoji: "🫧" },

  // --- Groupe 3 : F, V, N, T ---
  { id: "fuse-aigue", name: "La fusée", letter: "f", group: "f-v-n-t", file: "fuse-aigue.png", color: "#e8543f", emoji: "🚀" },
  { id: "vent", name: "Le vent", letter: "v", group: "f-v-n-t", file: "vent.png", color: "#4aa3d6", emoji: "🌬️" },
  { id: "nez", name: "Le nez", letter: "n", group: "f-v-n-t", file: "nez.png", color: "#f0b429", emoji: "👃" },
  { id: "toupie", name: "La toupie", letter: "t", group: "f-v-n-t", file: "toupie.png", color: "#c084fc", emoji: "🌀" },

  // --- Groupe 4 : P, C, D, J ---
  { id: "perroquet", name: "Le perroquet", letter: "p", group: "p-c-d-j", file: "perroquet.png", color: "#3aa34a", emoji: "🦜" },
  { id: "cornichon", name: "Le cornichon", letter: "c", group: "p-c-d-j", file: "cornichon.png", color: "#6a9a3a", emoji: "🥒" },
  { id: "dame", name: "La dame", letter: "d", group: "p-c-d-j", file: "dame.png", color: "#e8543f", emoji: "👩" },
  { id: "jet-deau", name: "Le jet d’eau", letter: "j", group: "p-c-d-j", file: "jet-deau.png", color: "#2f9bd6", emoji: "⛲" },

  // --- Groupe 5 : G, H, K, Q ---
  { id: "gulu", name: "Le gulu", letter: "g", group: "g-h-k-q", file: "gulu.png", color: "#f5a623", emoji: "🐛" },
  { id: "hutte", name: "La hutte", letter: "h", group: "g-h-k-q", file: "hutte.png", color: "#8a5a2b", emoji: "🛖" },
  { id: "kangourou", name: "Le kangourou", letter: "k", group: "g-h-k-q", file: "kangourou.png", color: "#e8862a", emoji: "🦘" },
  { id: "quille", name: "La quille", letter: "q", group: "g-h-k-q", file: "quille.png", color: "#7d4bd1", emoji: "🎳" },

  // --- Groupe 6 : W, X, Y, Z ---
  { id: "wagon", name: "Le wagon", letter: "w", group: "w-x-y-z", file: "wagon.png", color: "#2f9bd6", emoji: "🚃" },
  { id: "xiou", name: "Le xiou", letter: "x", group: "w-x-y-z", file: "xiou.png", color: "#9aa3b0", emoji: "❌" },
  { id: "monsieur-y", name: "Monsieur y", letter: "y", group: "w-x-y-z", file: "monsieur_y.png", color: "#e8543f", emoji: "🟡" },
  { id: "zibulus", name: "Le zibulus", letter: "z", group: "w-x-y-z", file: "zibulus.png", color: "#3aa34a", emoji: "🦓" },

  // --- Groupe spécial : digramme & variantes de e (jamais par défaut) ---
  { id: "chat", name: "Le chat", letter: "ch", group: "special", file: "chat.png", color: "#c084fc", emoji: "🐱", kind: "digraph" },
  { id: "madame-e-aigu", name: "Madame é", letter: "é", group: "special", file: "madame-e-aigu.png", color: "#f0b429", emoji: "✨", kind: "variant" },
  { id: "madame-e-grave", name: "Madame è", letter: "è", group: "special", file: "madame-e-grave.png", color: "#f0b429", emoji: "✨", kind: "variant" },
  { id: "madame-e-circonflexe", name: "Madame ê", letter: "ê", group: "special", file: "madame-e-circonflexe.png", color: "#f0b429", emoji: "✨", kind: "variant" },
];

export const ALPHAS: Alpha[] = SEEDS.map((s) => ({
  id: s.id,
  name: s.name,
  letter: s.letter,
  kind: s.kind ?? "letter",
  group: s.group,
  audioName: s.audioName ?? `trouve-${s.id}`,
  discoveryAudio: s.discoveryAudio ?? `alpha-${s.id}`,
  color: s.color,
  colorDark: s.colorDark ?? darken(s.color),
  emoji: s.emoji,
  image: optimized(s.file),
  imageFallback: original(s.file),
  available: true,
}));

export interface AlphaGroup {
  id: AlphaGroupId;
  label: string;
  ids: string[];
}

export const ALPHA_GROUPS: AlphaGroup[] = [
  { id: "basile", label: "BASILE", ids: ["botte", "monsieur-a", "serpent", "madame-i", "limace", "madame-e"] },
  { id: "o-m-r-u", label: "O · M · R · U", ids: ["monsieur-o", "monstre", "robinet", "mademoiselle-u"] },
  { id: "f-v-n-t", label: "F · V · N · T", ids: ["fuse-aigue", "vent", "nez", "toupie"] },
  { id: "p-c-d-j", label: "P · C · D · J", ids: ["perroquet", "cornichon", "dame", "jet-deau"] },
  { id: "g-h-k-q", label: "G · H · K · Q", ids: ["gulu", "hutte", "kangourou", "quille"] },
  { id: "w-x-y-z", label: "W · X · Y · Z", ids: ["wagon", "xiou", "monsieur-y", "zibulus"] },
  { id: "special", label: "Digramme & variantes", ids: ["chat", "madame-e-aigu", "madame-e-grave", "madame-e-circonflexe"] },
];

/** Les six Alphas fixes du prénom BASILE (utilisés par le boss). */
export const BASILE_ALPHAS: Alpha[] = ALPHAS.slice(0, 6);

export const BASILE_ALPHA_IDS: string[] = BASILE_ALPHAS.map((a) => a.id);
export const ALL_ALPHA_IDS: string[] = ALPHAS.map((a) => a.id);

export function getAlpha(id: string): Alpha {
  const alpha = ALPHAS.find((a) => a.id === id);
  if (!alpha) throw new Error(`Alpha inconnu: ${id}`);
  return alpha;
}

export function getAlphaSafe(id: string): Alpha | undefined {
  return ALPHAS.find((a) => a.id === id);
}

/** Renvoie les Alphas correspondant aux ids, dans l'ordre demandé, en ignorant les inconnus. */
export function alphasByIds(ids: string[]): Alpha[] {
  return ids.map(getAlphaSafe).filter((a): a is Alpha => Boolean(a));
}
