/**
 * Données du Port des Pirates : îles, cachettes et trésors.
 * Chaque cachette donne un trésor déterministe (aucune frustration, chaque
 * île garantit des découvertes).
 */
export type IslandId = "palmiers" | "volcan" | "mysterieuse";

export type TreasureId =
  | "piece"
  | "coquillage"
  | "perle"
  | "rubis"
  | "emeraude"
  | "carte";

export type Rarity = "commun" | "rare";

export interface Treasure {
  id: TreasureId;
  name: string;
  rarity: Rarity;
  /** Voix du nom (public/audio/fr/<voice>.wav). */
  voice: string;
}

export const TREASURES: Treasure[] = [
  { id: "piece", name: "Pièces d'or", rarity: "commun", voice: "tresor-piece" },
  { id: "coquillage", name: "Coquillage", rarity: "commun", voice: "tresor-coquillage" },
  { id: "perle", name: "Perle", rarity: "commun", voice: "tresor-perle" },
  { id: "rubis", name: "Rubis", rarity: "rare", voice: "tresor-rubis" },
  { id: "emeraude", name: "Émeraude", rarity: "rare", voice: "tresor-emeraude" },
  { id: "carte", name: "Carte ancienne", rarity: "rare", voice: "tresor-carte" },
];

export function getTreasure(id: TreasureId): Treasure {
  return TREASURES.find((t) => t.id === id) ?? TREASURES[0];
}

export interface IslandSpot {
  id: string;
  label: string;
  treasure: TreasureId;
  /** Position de la cachette dans la scène (pourcentage). */
  x: number;
  y: number;
  scale: number;
}

export interface Island {
  id: IslandId;
  name: string;
  tagline: string;
  /** Position sur la carte maritime (pourcentage). */
  mapX: number;
  mapY: number;
  spots: IslandSpot[];
}

export const ISLANDS: Island[] = [
  {
    id: "palmiers",
    name: "L'île des Palmiers",
    tagline: "Sable doré et cocotiers",
    mapX: 24,
    mapY: 30,
    spots: [
      { id: "palmier", label: "Palmier", treasure: "coquillage", x: 24, y: 44, scale: 1 },
      { id: "rocher", label: "Gros rocher", treasure: "piece", x: 70, y: 62, scale: 1 },
      { id: "sable", label: "Tas de sable", treasure: "coquillage", x: 48, y: 78, scale: 0.9 },
      { id: "buisson", label: "Buisson", treasure: "perle", x: 78, y: 40, scale: 0.85 },
    ],
  },
  {
    id: "volcan",
    name: "L'île du Volcan",
    tagline: "Un volcan rigolo",
    mapX: 74,
    mapY: 26,
    spots: [
      { id: "rocher-volcanique", label: "Rocher volcanique", treasure: "rubis", x: 30, y: 66, scale: 1 },
      { id: "grotte", label: "Grotte", treasure: "piece", x: 62, y: 58, scale: 1 },
      { id: "buisson", label: "Buisson", treasure: "emeraude", x: 80, y: 72, scale: 0.85 },
      { id: "caisse", label: "Ancienne caisse", treasure: "piece", x: 46, y: 82, scale: 0.9 },
    ],
  },
  {
    id: "mysterieuse",
    name: "L'île Mystérieuse",
    tagline: "Ruines et mystères",
    mapX: 58,
    mapY: 72,
    spots: [
      { id: "statue", label: "Statue", treasure: "perle", x: 34, y: 46, scale: 1 },
      { id: "coffre", label: "Coffre caché", treasure: "carte", x: 66, y: 70, scale: 0.95 },
      { id: "arbre", label: "Arbre", treasure: "piece", x: 78, y: 40, scale: 0.95 },
      { id: "pierre-gravee", label: "Pierre gravée", treasure: "emeraude", x: 46, y: 76, scale: 0.9 },
    ],
  },
];

export function getIsland(id: IslandId): Island {
  return ISLANDS.find((i) => i.id === id) ?? ISLANDS[0];
}

export const COMMON_TREASURES = TREASURES.filter((t) => t.rarity === "commun");
export const RARE_TREASURES = TREASURES.filter((t) => t.rarity === "rare");
