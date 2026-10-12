import type { Alpha } from "../data/alphas";

export const SESSION_ROUNDS = 6;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export interface Round {
  target: Alpha;
  options: Alpha[];
}

/**
 * Crée une manche avec un nombre de propositions paramétrable.
 * Seuls les Alphas déjà découverts sont utilisés, sans doublon.
 */
export function createRound(
  discovered: Alpha[],
  previousTargetId: string | undefined,
  optionCount: number,
): Round {
  const pool = discovered.length > 0 ? discovered : [];
  const sansPrecedent = pool.filter((a) => a.id !== previousTargetId);
  const targetPool = sansPrecedent.length > 0 ? sansPrecedent : pool;
  const target = shuffle(targetPool)[0];

  const count = Math.max(2, Math.min(optionCount, pool.length));
  const distractors = shuffle(pool.filter((a) => a.id !== target.id)).slice(0, count - 1);

  return { target, options: shuffle([target, ...distractors]) };
}
