/**
 * Objets et pièces de l'Atelier de construction.
 * Les zones d'accrochage sont exprimées en pourcentage (0..100) de la zone de
 * montage (viewBox SVG carré 200×200), ce qui les rend indépendantes de l'écran.
 */
export type BuildableId = "voiture" | "robot" | "fusee";

export interface PartZone {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface BuildPart {
  id: string;
  label: string;
  /** Zone d'accrochage généreuse (pourcentage du plateau). */
  zone: PartZone;
}

export interface Buildable {
  id: BuildableId;
  name: string;
  parts: BuildPart[];
  /** Animation finale jouée une fois l'objet terminé. */
  finishSfx: string;
}

/** Couleurs de personnalisation (V1 : trois teintes). */
export const OBJECT_COLORS = ["#e8543f", "#2f9bd6", "#3aa34a"];

export const BUILDABLES: Buildable[] = [
  {
    id: "voiture",
    name: "Voiture de course",
    finishSfx: "moteur",
    parts: [
      { id: "aileron", label: "Aileron", zone: { x: 10, y: 28, w: 24, h: 16 } },
      { id: "carrosserie", label: "Carrosserie", zone: { x: 28, y: 34, w: 46, h: 22 } },
      { id: "chassis", label: "Châssis", zone: { x: 12, y: 56, w: 76, h: 16 } },
      { id: "roues", label: "Roues", zone: { x: 18, y: 72, w: 64, h: 24 } },
    ],
  },
  {
    id: "robot",
    name: "Robot rigolo",
    finishSfx: "robot",
    parts: [
      { id: "tete", label: "Tête", zone: { x: 34, y: 12, w: 32, h: 24 } },
      { id: "bras", label: "Bras", zone: { x: 10, y: 40, w: 80, h: 16 } },
      { id: "corps", label: "Corps", zone: { x: 34, y: 58, w: 32, h: 16 } },
      { id: "jambes", label: "Jambes", zone: { x: 30, y: 76, w: 40, h: 22 } },
    ],
  },
  {
    id: "fusee",
    name: "Fusée spatiale",
    finishSfx: "fusee",
    parts: [
      { id: "nez", label: "Nez", zone: { x: 40, y: 6, w: 20, h: 22 } },
      { id: "corps", label: "Corps", zone: { x: 30, y: 30, w: 40, h: 36 } },
      { id: "ailes", label: "Ailes", zone: { x: 10, y: 54, w: 80, h: 22 } },
      { id: "moteur", label: "Moteur", zone: { x: 34, y: 78, w: 32, h: 16 } },
    ],
  },
];

export function getBuildable(id: BuildableId): Buildable {
  return BUILDABLES.find((b) => b.id === id) ?? BUILDABLES[0];
}
