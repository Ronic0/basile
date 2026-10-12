export type UniverseId = "pirates" | "dragons";

export interface Universe {
  id: UniverseId;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  colorDark: string;
  background: string;
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
  },
  {
    id: "dragons",
    title: "Les Dragons",
    subtitle: "Aide le dragon à attraper l'Alpha",
    emoji: "🐲",
    color: "#e8543f",
    colorDark: "#5e1c12",
    background: "linear-gradient(160deg, #7a2a1c 0%, #3a1109 100%)",
  },
];

export function getUniverse(id: UniverseId): Universe {
  return UNIVERSES.find((u) => u.id === id) ?? UNIVERSES[0];
}

export const SOON_UNIVERSES = [
  { title: "Les Fées", emoji: "🧚" },
  { title: "L'Espace", emoji: "🚀" },
  { title: "La Mer", emoji: "🐠" },
];
