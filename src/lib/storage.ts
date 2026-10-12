import type { UniverseId } from "../data/universes";
import { ALL_ALPHA_IDS, BASILE_ALPHA_IDS } from "../data/alphas";

/** Mode de difficulté choisi dans l'espace Parent. */
export type DifficulteMode = "toujours2" | "adaptatif" | "toujours3";

/** Niveau d'aide du boss du prénom. */
export type AideBoss = "debutant" | "intermediaire" | "avance";

export interface Stats {
  parties: number;
  bonnes: number;
  erreurs: number;
  dernierUnivers: UniverseId | null;
  /** Nombre d'Alphas découverts (conservé pour compatibilité, dérivé). */
  decouverte: number;
  /** Réglage choisi par le parent. */
  difficulte: DifficulteMode;
  /** Niveau d'aide du boss. */
  aideBoss: AideBoss;
  /** Réussites autonomes (du premier coup) et assistées (après erreur). */
  bonnesSansAide: number;
  bonnesAvecAide: number;
  /** Reconnaissances autonomes par Alpha. */
  maitrise: Record<string, number>;
  /** Ids des Alphas découverts par l'enfant. */
  decouverts: string[];
  /** Ids des Alphas activés par le parent (proposés dans le jeu). */
  actifs: string[];
  /** Ordre de découverte souhaité (ids du catalogue). */
  ordre: string[];
  /** Confusions fréquentes : clé "choisi->cible", valeur = nombre d'occurrences. */
  confusions: Record<string, number>;
}

const KEY = "alphas-de-basile/stats/v1";

const DEFAULT_ORDER = [...ALL_ALPHA_IDS];

const DEFAULT_STATS: Stats = {
  parties: 0,
  bonnes: 0,
  erreurs: 0,
  dernierUnivers: null,
  decouverte: 0,
  difficulte: "adaptatif",
  aideBoss: "debutant",
  bonnesSansAide: 0,
  bonnesAvecAide: 0,
  maitrise: {},
  decouverts: BASILE_ALPHA_IDS.slice(0, 2),
  actifs: [...BASILE_ALPHA_IDS],
  ordre: DEFAULT_ORDER,
  confusions: {},
};

const KNOWN_ALPHA_IDS = new Set(ALL_ALPHA_IDS);

function sanitizeMaitrise(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof v === "number" && Number.isFinite(v) && v > 0) out[k] = Math.floor(v);
  }
  return out;
}

function sanitizeConfusions(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof v === "number" && Number.isFinite(v) && v > 0) out[k] = Math.floor(v);
  }
  return out;
}

/** Nettoie une liste d'ids : chaînes valides uniquement, sans doublon, en conservant l'ordre. */
function sanitizeIds(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return [...fallback];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of value) {
    if (typeof item === "string" && !seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }
  return out;
}

/** Réordonne l'ordre de découverte : complète et filtre selon le catalogue connu. */
function normalizeOrder(value: unknown): string[] {
  const raw = sanitizeIds(value, DEFAULT_ORDER).filter((id) => KNOWN_ALPHA_IDS.has(id));
  const missing = DEFAULT_ORDER.filter((id) => !raw.includes(id));
  return [...raw, ...missing];
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return { ...DEFAULT_STATS, decouverts: BASILE_ALPHA_IDS.slice(0, 2), actifs: [...BASILE_ALPHA_IDS], ordre: [...DEFAULT_ORDER], maitrise: {}, confusions: {} };
    }
    const parsed = JSON.parse(raw) as Partial<Stats>;

    // Migration rétro-compatible : `decouverte` (nombre) → `decouverts` (ids).
    const legacyCount =
      typeof parsed.decouverte === "number" ? Math.max(0, Math.min(BASILE_ALPHA_IDS.length, parsed.decouverte)) : 0;
    const decouverts = Array.isArray(parsed.decouverts)
      ? sanitizeIds(parsed.decouverts, [])
      : BASILE_ALPHA_IDS.slice(0, legacyCount);

    const actifs = Array.isArray(parsed.actifs)
      ? sanitizeIds(parsed.actifs, BASILE_ALPHA_IDS)
      : [...BASILE_ALPHA_IDS];

    return {
      ...DEFAULT_STATS,
      ...parsed,
      maitrise: sanitizeMaitrise(parsed.maitrise),
      confusions: sanitizeConfusions(parsed.confusions),
      decouverts,
      actifs,
      ordre: normalizeOrder(parsed.ordre),
      decouverte: decouverts.length,
    };
  } catch (err) {
    console.debug("[storage] lecture impossible:", err);
    return { ...DEFAULT_STATS, decouverts: BASILE_ALPHA_IDS.slice(0, 2), actifs: [...BASILE_ALPHA_IDS], ordre: [...DEFAULT_ORDER], maitrise: {}, confusions: {} };
  }
}

export function saveStats(stats: Stats): void {
  try {
    const next: Stats = { ...stats, decouverte: stats.decouverts.length };
    localStorage.setItem(KEY, JSON.stringify(next));
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
