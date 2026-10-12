export type UniverseId =
  | "pirates"
  | "dragons"
  | "jurassic"
  | "racing"
  | "creatures"
  | "workshop"
  | "rescue"
  | "hero";

export interface Universe {
  id: UniverseId;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  colorDark: string;
  background: string;
  /** Bruitage joué immédiatement sur une bonne réponse. */
  correctSfx: string;
  /** Bruitage secondaire joué peu après (accent). */
  accentSfx: string;
}

export const UNIVERSES: Universe[] = [
  {
    id: "pirates",
    title: "Les Pirates",
    subtitle: "Ouvre le bon coffre au trésor",
    emoji: "🏴‍☠️",
    color: "#2f9bd6",
    colorDark: "#123c56",
    background: "linear-gradient(160deg, #0e5f86 0%, #0a3247 100%)",
    correctSfx: "coffre",
    accentSfx: "piece",
  },
  {
    id: "dragons",
    title: "Les Dragons",
    subtitle: "Aide le dragon à attraper l'Alpha",
    emoji: "🐲",
    color: "#e8543f",
    colorDark: "#5e1c12",
    background: "linear-gradient(160deg, #7a2a1c 0%, #3a1109 100%)",
    correctSfx: "dragon",
    accentSfx: "etoile",
  },
  {
    id: "jurassic",
    title: "Jurassic Basile",
    subtitle: "Ouvre le bon œuf de dinosaure",
    emoji: "🦕",
    color: "#3f9142",
    colorDark: "#123f1b",
    background: "linear-gradient(160deg, #2f7d3a 0%, #102b18 100%)",
    correctSfx: "eclosion",
    accentSfx: "etoile",
  },
  {
    id: "racing",
    title: "Turbo Basile",
    subtitle: "Fonce vers le bon Alpha",
    emoji: "🏎️",
    color: "#e8543f",
    colorDark: "#5e1c12",
    background: "linear-gradient(160deg, #1f4f8a 0%, #14243f 100%)",
    correctSfx: "moteur",
    accentSfx: "etoile",
  },
  {
    id: "creatures",
    title: "Les Créatures",
    subtitle: "Découvre les créatures cachées",
    emoji: "🦄",
    color: "#c084fc",
    colorDark: "#4a2472",
    background: "linear-gradient(160deg, #7d4bd1 0%, #2a1450 100%)",
    correctSfx: "capture",
    accentSfx: "etoile",
  },
  {
    id: "workshop",
    title: "Bricolo Basile",
    subtitle: "Construis avec les Alphas",
    emoji: "🧱",
    color: "#f5a623",
    colorDark: "#6b4410",
    background: "linear-gradient(160deg, #c4761c 0%, #3d240a 100%)",
    correctSfx: "construction",
    accentSfx: "piece",
  },
  {
    id: "rescue",
    title: "Mission Sauvetage",
    subtitle: "Sauve l'animal avec le bon Alpha",
    emoji: "🚒",
    color: "#e8543f",
    colorDark: "#5e1c12",
    background: "linear-gradient(160deg, #2f6fb0 0%, #14243f 100%)",
    correctSfx: "sirene",
    accentSfx: "etoile",
  },
  {
    id: "hero",
    title: "Super Basile",
    subtitle: "Soulève le bon rocher",
    emoji: "🦸",
    color: "#2f9bd6",
    colorDark: "#123c56",
    background: "linear-gradient(160deg, #243a63 0%, #0d1730 100%)",
    correctSfx: "pouvoir",
    accentSfx: "etoile",
  },
];

export function getUniverse(id: UniverseId): Universe {
  return UNIVERSES.find((u) => u.id === id) ?? UNIVERSES[0];
}

export const SOON_UNIVERSES: { title: string; emoji: string }[] = [];
