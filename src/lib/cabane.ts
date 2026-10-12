/**
 * Sauvegarde locale de Ma Cabane.
 * Ne stocke QUE les décorations : les collections (trésors, objets construits,
 * récoltes, Alphas, dragon) sont lues dans leurs sauvegardes respectives.
 */
import { clampIndex, CURTAINS, RUGS, WALLS } from "../data/cabane";

export interface CabaneState {
  wall: number;
  rug: number;
  curtain: number;
  lampOn: boolean;
}

const KEY = "alphas-de-basile/cabane/v1";

export const DEFAULT_CABANE: CabaneState = {
  wall: 0,
  rug: 0,
  curtain: 0,
  lampOn: true,
};

function sanitize(value: unknown): CabaneState {
  const parsed = (value ?? {}) as Partial<CabaneState>;
  return {
    wall: clampIndex(parsed.wall, WALLS.length),
    rug: clampIndex(parsed.rug, RUGS.length),
    curtain: clampIndex(parsed.curtain, CURTAINS.length),
    lampOn: parsed.lampOn !== false,
  };
}

export function loadCabane(): CabaneState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_CABANE };
    return sanitize(JSON.parse(raw));
  } catch (err) {
    console.debug("[cabane] lecture impossible:", err);
    return { ...DEFAULT_CABANE };
  }
}

export function saveCabane(state: CabaneState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(sanitize(state)));
  } catch (err) {
    console.debug("[cabane] écriture impossible:", err);
  }
}

export function resetCabane(): void {
  try {
    localStorage.removeItem(KEY);
  } catch (err) {
    console.debug("[cabane] reset impossible:", err);
  }
}
