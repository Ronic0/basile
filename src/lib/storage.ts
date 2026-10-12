import type { UniverseId } from "../data/universes";

/** Mode de difficulté choisi dans l'espace Parent. */
export type DifficulteMode = "toujours2" | "adaptatif" | "toujours3";

/** Niveau d'aide du boss du prénom. */
export type AideBoss = "debutant" | "intermediaire" | "avance";

export interface Stats {
  parties: number;
  bonnes: number;
  erreurs: number;
  dernierUnivers: UniverseId | null;
  decouverte: number;
  /** Réglage choisi par le parent. */
  difficulte: DifficulteMode;
  /** Niveau d'aide du boss. */
  aideBoss: AideBoss;
  /** Réussites autonomes (du premier coup) et assistées (après erreur). */
  bonnesSansAide: number;
  bonnesAvecAide: number;
  /** Reconnaissances autonomes par Alpha (au moins une par essai réussi). */
  maitrise: Record<string, number>;
}

const KEY = "alphas-de-basile/stats/v1";

const DEFAULT_STATS: Stats = {
  parties: 0,
  bonnes: 0,
  erreurs: 0,
  dernierUnivers: null,
  decouverte: 2,
  difficulte: "adaptatif",
  aideBoss: "debutant",
  bonnesSansAide: 0,
  bonnesAvecAide: 0,
  maitrise: {},
};

function sanitizeMaitrise(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
      out[key] = Math.floor(raw);
    }
  }
  return out;
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATS, maitrise: {} };
    const parsed = JSON.parse(raw) as Partial<Stats>;
    return {
      ...DEFAULT_STATS,
      ...parsed,
      maitrise: sanitizeMaitrise(parsed.maitrise),
    };
  } catch (err) {
    console.debug("[storage] lecture impossible:", err);
    return { ...DEFAULT_STATS, maitrise: {} };
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
