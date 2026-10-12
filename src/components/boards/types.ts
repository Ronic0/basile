import type { Alpha } from "../../data/alphas";

export type Phase = "asking" | "correct" | "wrong";

/** Contrat commun à tous les plateaux d'univers. */
export interface BoardProps {
  options: Alpha[];
  targetId: string;
  phase: Phase;
  pickedId: string | null;
  /** Nombre de bonnes réponses déjà obtenues dans la session. */
  bonnes?: number;
  onPick: (alpha: Alpha) => void;
}
