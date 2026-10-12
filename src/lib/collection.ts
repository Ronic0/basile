/**
 * Petites collections locales (hors statistiques de jeu).
 * Clés dédiées, additives : la sauvegarde existante n'est jamais altérée.
 */
import type { UniverseId } from "../data/universes";

const CREATURES_KEY = "alphas-de-basile/creatures/v1";
const BUILDS_KEY = "alphas-de-basile/builds/v1";
const EXPLORED_KEY = "alphas-de-basile/explored/v1";

function loadList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch (err) {
    console.debug("[collection] lecture impossible:", key, err);
    return [];
  }
}

function addToList(key: string, id: string): string[] {
  const list = loadList(key);
  if (list.includes(id)) return list;
  const next = [...list, id];
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch (err) {
    console.debug("[collection] écriture impossible:", key, err);
  }
  return next;
}

export function loadCreatures(): string[] {
  return loadList(CREATURES_KEY);
}
export function addCreature(id: string): string[] {
  return addToList(CREATURES_KEY, id);
}

export function loadBuilds(): string[] {
  return loadList(BUILDS_KEY);
}
export function addBuild(id: string): string[] {
  return addToList(BUILDS_KEY, id);
}

export function loadExplored(): UniverseId[] {
  return loadList(EXPLORED_KEY) as UniverseId[];
}
export function markExplored(id: UniverseId): void {
  addToList(EXPLORED_KEY, id);
}
