/**
 * Sauvegarde locale de l'Atelier de construction.
 * Clé dédiée, additive : les autres activités ne sont jamais touchées.
 */
import { OBJECT_COLORS, type BuildableId } from "../data/buildables";

export interface AtelierState {
  /** Objets terminés : id → couleur choisie. */
  built: Partial<Record<BuildableId, string>>;
  /** Nombre total de constructions terminées. */
  builds: number;
}

const KEY = "alphas-de-basile/atelier/v1";
const IDS: BuildableId[] = ["voiture", "robot", "fusee"];

export const DEFAULT_ATELIER: AtelierState = { built: {}, builds: 0 };

function sanitize(value: unknown): AtelierState {
  const parsed = (value ?? {}) as Partial<AtelierState>;
  const built: Partial<Record<BuildableId, string>> = {};
  if (parsed.built && typeof parsed.built === "object") {
    for (const id of IDS) {
      const color = (parsed.built as Record<string, unknown>)[id];
      if (typeof color === "string" && OBJECT_COLORS.includes(color)) built[id] = color;
    }
  }
  const builds =
    typeof parsed.builds === "number" && parsed.builds >= 0 ? Math.floor(parsed.builds) : 0;
  return { built, builds };
}

export function loadAtelier(): AtelierState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_ATELIER, built: {} };
    return sanitize(JSON.parse(raw));
  } catch (err) {
    console.debug("[atelier] lecture impossible:", err);
    return { ...DEFAULT_ATELIER, built: {} };
  }
}

export function saveAtelier(state: AtelierState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(sanitize(state)));
  } catch (err) {
    console.debug("[atelier] écriture impossible:", err);
  }
}

export function resetAtelier(): void {
  try {
    localStorage.removeItem(KEY);
  } catch (err) {
    console.debug("[atelier] reset impossible:", err);
  }
}
