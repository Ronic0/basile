/**
 * Sauvegarde locale du Port des Pirates.
 * Clé dédiée, additive : aucune autre sauvegarde n'est touchée.
 * Structure des trésors pensée pour être réutilisée par « Ma Cabane ».
 */
import { TREASURES, type IslandId, type TreasureId } from "../data/pirates";

export interface PiratesState {
  treasures: Record<TreasureId, number>;
  expeditions: number;
  lastIsland: IslandId | null;
  /** Cachettes déjà fouillées : clé "ile:cachette". */
  searched: Record<string, boolean>;
}

const KEY = "alphas-de-basile/pirates-port/v1";

function emptyTreasures(): Record<TreasureId, number> {
  const out = {} as Record<TreasureId, number>;
  for (const t of TREASURES) out[t.id] = 0;
  return out;
}

export const DEFAULT_PIRATES: PiratesState = {
  treasures: emptyTreasures(),
  expeditions: 0,
  lastIsland: null,
  searched: {},
};

const ISLAND_IDS: IslandId[] = ["palmiers", "volcan", "mysterieuse"];

function sanitize(value: unknown): PiratesState {
  const parsed = (value ?? {}) as Partial<PiratesState>;
  const treasures = emptyTreasures();
  if (parsed.treasures && typeof parsed.treasures === "object") {
    for (const t of TREASURES) {
      const v = (parsed.treasures as Record<string, unknown>)[t.id];
      if (typeof v === "number" && v >= 0) treasures[t.id] = Math.floor(v);
    }
  }
  const expeditions =
    typeof parsed.expeditions === "number" && parsed.expeditions >= 0
      ? Math.floor(parsed.expeditions)
      : 0;
  const lastIsland =
    typeof parsed.lastIsland === "string" && ISLAND_IDS.includes(parsed.lastIsland as IslandId)
      ? (parsed.lastIsland as IslandId)
      : null;
  const searched: Record<string, boolean> = {};
  if (parsed.searched && typeof parsed.searched === "object") {
    for (const [k, v] of Object.entries(parsed.searched as Record<string, unknown>)) {
      if (v === true) searched[k] = true;
    }
  }
  return { treasures, expeditions, lastIsland, searched };
}

export function loadPirates(): PiratesState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_PIRATES, treasures: emptyTreasures(), searched: {} };
    return sanitize(JSON.parse(raw));
  } catch (err) {
    console.debug("[pirates] lecture impossible:", err);
    return { ...DEFAULT_PIRATES, treasures: emptyTreasures(), searched: {} };
  }
}

export function savePirates(state: PiratesState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(sanitize(state)));
  } catch (err) {
    console.debug("[pirates] écriture impossible:", err);
  }
}

export function resetPirates(): void {
  try {
    localStorage.removeItem(KEY);
  } catch (err) {
    console.debug("[pirates] reset impossible:", err);
  }
}
