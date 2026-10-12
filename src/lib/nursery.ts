/**
 * Sauvegarde locale de la Nurserie des dragons.
 * Clé dédiée, additive : les statistiques des Alphas ne sont jamais touchées.
 * Aucune horloge de besoins en temps réel : les jauges n'évoluent que par
 * les actions de l'enfant.
 */
export type NurseryAction =
  | "nourrir"
  | "boire"
  | "caresser"
  | "jouer"
  | "dormir"
  | "reveiller";

export interface NurseryState {
  /** Nom du bébé dragon. */
  name: string;
  /** Satiété (0 = petit creux, 100 = bien repu). */
  faim: number;
  /** Joie (0..100). */
  bonheur: number;
  /** Forme (0..100). */
  energie: number;
  /** Nombre total d'interactions. */
  interactions: number;
  /** Dernière action effectuée. */
  derniereAction: NurseryAction | null;
}

const KEY = "alphas-de-basile/nurserie/v1";

export const DEFAULT_NURSERY: NurseryState = {
  name: "Pilou",
  faim: 66,
  bonheur: 68,
  energie: 58,
  interactions: 0,
  derniereAction: null,
};

const ACTIONS: NurseryAction[] = [
  "nourrir",
  "boire",
  "caresser",
  "jouer",
  "dormir",
  "reveiller",
];

export function clampGauge(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function sanitize(value: unknown): NurseryState {
  const parsed = (value ?? {}) as Partial<NurseryState>;
  return {
    name: typeof parsed.name === "string" && parsed.name.trim() ? parsed.name : DEFAULT_NURSERY.name,
    faim: clampGauge(typeof parsed.faim === "number" ? parsed.faim : DEFAULT_NURSERY.faim),
    bonheur: clampGauge(
      typeof parsed.bonheur === "number" ? parsed.bonheur : DEFAULT_NURSERY.bonheur,
    ),
    energie: clampGauge(
      typeof parsed.energie === "number" ? parsed.energie : DEFAULT_NURSERY.energie,
    ),
    interactions:
      typeof parsed.interactions === "number" && parsed.interactions >= 0
        ? Math.floor(parsed.interactions)
        : 0,
    derniereAction:
      typeof parsed.derniereAction === "string" &&
      ACTIONS.includes(parsed.derniereAction as NurseryAction)
        ? (parsed.derniereAction as NurseryAction)
        : null,
  };
}

export function loadNursery(): NurseryState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_NURSERY };
    return sanitize(JSON.parse(raw));
  } catch (err) {
    console.debug("[nursery] lecture impossible:", err);
    return { ...DEFAULT_NURSERY };
  }
}

export function saveNursery(state: NurseryState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(sanitize(state)));
  } catch (err) {
    console.debug("[nursery] écriture impossible:", err);
  }
}

export function resetNursery(): void {
  try {
    localStorage.removeItem(KEY);
  } catch (err) {
    console.debug("[nursery] reset impossible:", err);
  }
}
