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
 * Seuls les Alphas proposés au jeu sont utilisés, sans doublon.
 * `maitrise` permet de réviser davantage les personnages difficiles
 * (ceux encore peu reconnus en autonomie sont tirés plus souvent).
 */
export function createRound(
  discovered: Alpha[],
  previousTargetId: string | undefined,
  optionCount: number,
  maitrise: Record<string, number> = {},
): Round {
  const pool = discovered.length > 0 ? discovered : [];
  const sansPrecedent = pool.filter((a) => a.id !== previousTargetId);
  const targetPool = sansPrecedent.length > 0 ? sansPrecedent : pool;

  const weighted: Alpha[] = [];
  for (const alpha of targetPool) {
    const known = maitrise[alpha.id] ?? 0;
    const weight = Math.max(1, 4 - Math.min(3, known));
    for (let k = 0; k < weight; k++) weighted.push(alpha);
  }
  const target = weighted[Math.floor(Math.random() * weighted.length)] ?? targetPool[0];

  const count = Math.max(2, Math.min(optionCount, pool.length));
  const distractors = shuffle(pool.filter((a) => a.id !== target.id)).slice(0, count - 1);

  return { target, options: shuffle([target, ...distractors]) };
}
