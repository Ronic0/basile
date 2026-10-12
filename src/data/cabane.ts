/** Options de décoration de Ma Cabane (V1 : murs, tapis, rideaux). */
export interface DecorOption {
  id: string;
  label: string;
  color: string;
  /** Couleur secondaire (motif / ombre). */
  accent: string;
}

export const WALLS: DecorOption[] = [
  { id: "creme", label: "Crème", color: "#f3e2c4", accent: "#e6cfa0" },
  { id: "bleu", label: "Bleu", color: "#bcd8ea", accent: "#9dc2da" },
  { id: "vert", label: "Vert", color: "#cfe3b8", accent: "#b3cd98" },
];

export const RUGS: DecorOption[] = [
  { id: "rouge", label: "Rouge", color: "#c0563f", accent: "#a8452f" },
  { id: "jaune", label: "Jaune", color: "#e0a72a", accent: "#c48a12" },
  { id: "bleu", label: "Bleu", color: "#3a7fbf", accent: "#2c639a" },
];

export const CURTAINS: DecorOption[] = [
  { id: "soleil", label: "Soleil", color: "#ffd34d", accent: "#e0a72a" },
  { id: "fraise", label: "Fraise", color: "#e8543f", accent: "#c0563f" },
  { id: "menthe", label: "Menthe", color: "#5fc9a0", accent: "#3aa37d" },
];

export function clampIndex(value: unknown, length: number): number {
  const n = typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : 0;
  return Math.max(0, Math.min(length - 1, n));
}
