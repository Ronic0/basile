export interface Alpha {
  id: string;
  name: string;
  audioName: string;
  discoveryAudio: string;
  color: string;
  colorDark: string;
  emoji: string;
  /** Image optimisée (marges recadrées) générée par scripts/prepare-alphas.py. */
  image: string;
  /** Image originale, utilisée si l'optimisée est absente. */
  imageFallback: string;
}

const base = import.meta.env.BASE_URL;
const optimized = (file: string) => `${base}assets/alphas/optimized/${file}`;
const original = (file: string) => `${base}assets/alphas/${file}`;

export const ALPHAS: Alpha[] = [
  {
    id: "botte",
    name: "La botte",
    audioName: "trouve-la-botte",
    discoveryAudio: "alpha-botte",
    color: "#8a5a2b",
    colorDark: "#5e3c1a",
    emoji: "🥾",
    image: optimized("botte.png"),
    imageFallback: original("botte.png"),
  },
  {
    id: "monsieur-a",
    name: "Monsieur a",
    audioName: "trouve-monsieur-a",
    discoveryAudio: "alpha-monsieur-a",
    color: "#e8543f",
    colorDark: "#b5321f",
    emoji: "🅰️",
    image: optimized("monsieur-a.png"),
    imageFallback: original("monsieur-a.png"),
  },
  {
    id: "serpent",
    name: "Le serpent",
    audioName: "trouve-le-serpent",
    discoveryAudio: "alpha-serpent",
    color: "#3aa34a",
    colorDark: "#246e30",
    emoji: "🐍",
    image: optimized("serpent.png"),
    imageFallback: original("serpent.png"),
  },
  {
    id: "madame-i",
    name: "Madame i",
    audioName: "trouve-madame-i",
    discoveryAudio: "alpha-madame-i",
    color: "#7d4bd1",
    colorDark: "#542e93",
    emoji: "ℹ️",
    image: optimized("madame-i.png"),
    imageFallback: original("madame-i.png"),
  },
  {
    id: "limace",
    name: "La limace",
    audioName: "trouve-la-limace",
    discoveryAudio: "alpha-limace",
    color: "#2f9bd6",
    colorDark: "#1c6a95",
    emoji: "🐌",
    image: optimized("limace.png"),
    imageFallback: original("limace.png"),
  },
  {
    id: "madame-e",
    name: "Madame e",
    audioName: "trouve-madame-e",
    discoveryAudio: "alpha-madame-e",
    color: "#f0b429",
    colorDark: "#b98612",
    emoji: "✨",
    image: optimized("madame-e.png"),
    imageFallback: original("madame-e.png"),
  },
];

export function getAlpha(id: string): Alpha {
  const alpha = ALPHAS.find((a) => a.id === id);
  if (!alpha) throw new Error(`Alpha inconnu: ${id}`);
  return alpha;
}
