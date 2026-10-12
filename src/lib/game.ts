import { ALPHAS, type Alpha } from "../data/alphas";

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

/** Crée une manche avec 2 propositions (à terme paramétrable). */
export function createRound(previousTargetId?: string): Round {
  const pool = ALPHAS.filter((a) => a.id !== previousTargetId);
  const target = shuffle(pool)[0] ?? ALPHAS[0];
  const distractors = shuffle(ALPHAS.filter((a) => a.id !== target.id));
  const options = shuffle([target, distractors[0]]);
  return { target, options };
}
