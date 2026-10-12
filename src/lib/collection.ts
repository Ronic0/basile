/**
 * Petites collections locales (hors statistiques de jeu).
 * Clés dédiées, additives : la sauvegarde existante n'est jamais altérée.
 */
import type { UniverseId } from "../data/universes";

const CREATURES_KEY = "alphas-de-basile/creatures/v1";
const BUILDS_KEY = "alphas-de-basile/builds/v1";
const EXPLORED_KEY = "alphas-de-basile/explored/v1";
const BOSS_KEY = "alphas-de-basile/boss/v1";

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

/** Récompense persistante du boss du prénom. */
export interface BossReward {
  medaille: boolean;
  parties: number;
  derniereVictoire: string | null;
}

const DEFAULT_BOSS: BossReward = { medaille: false, parties: 0, derniereVictoire: null };

export function loadBossReward(): BossReward {
  try {
    const raw = localStorage.getItem(BOSS_KEY);
    if (!raw) return { ...DEFAULT_BOSS };
    const parsed = JSON.parse(raw) as Partial<BossReward>;
    return {
      medaille: parsed.medaille === true,
      parties: typeof parsed.parties === "number" ? parsed.parties : 0,
      derniereVictoire:
        typeof parsed.derniereVictoire === "string" ? parsed.derniereVictoire : null,
    };
  } catch (err) {
    console.debug("[collection] lecture boss impossible:", err);
    return { ...DEFAULT_BOSS };
  }
}

export function recordBossAttempt(): BossReward {
  const current = loadBossReward();
  const next: BossReward = { ...current, parties: current.parties + 1 };
  try {
    localStorage.setItem(BOSS_KEY, JSON.stringify(next));
  } catch (err) {
    console.debug("[collection] écriture boss impossible:", err);
  }
  return next;
}

export function recordBossVictory(): BossReward {
  const current = loadBossReward();
  const next: BossReward = {
    medaille: true,
    parties: current.parties,
    derniereVictoire: new Date().toISOString(),
  };
  try {
    localStorage.setItem(BOSS_KEY, JSON.stringify(next));
  } catch (err) {
    console.debug("[collection] écriture boss impossible:", err);
  }
  return next;
}
