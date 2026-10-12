import type { UniverseId } from "../data/universes";

export interface Stats {
  parties: number;
  bonnes: number;
  erreurs: number;
  dernierUnivers: UniverseId | null;
  decouverte: number;
}

const KEY = "alphas-de-basile/stats/v1";

const DEFAULT_STATS: Stats = {
  parties: 0,
  bonnes: 0,
  erreurs: 0,
  dernierUnivers: null,
  decouverte: 2,
};

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw) as Partial<Stats>;
    return { ...DEFAULT_STATS, ...parsed };
  } catch (err) {
    console.debug("[storage] lecture impossible:", err);
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats: Stats): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(stats));
  } catch (err) {
    console.debug("[storage] écriture impossible:", err);
  }
}

export function resetStats(): void {
  try {
    localStorage.removeItem(KEY);
  } catch (err) {
    console.debug("[storage] reset impossible:", err);
  }
}
