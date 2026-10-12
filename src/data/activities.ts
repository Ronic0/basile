/**
 * Portail « Le Monde de Basile » : les grandes activités.
 *
 * `ready`  : activité jouable aujourd'hui.
 * `soon`   : illustrée mais désactivée (extension future).
 *
 * Le Jardin des Alphas est la porte d'entrée vers le moteur pédagogique
 * existant (huit univers + boss). Les autres activités sont autonomes.
 */
export type ActivityId =
  | "jardin-alphas"
  | "nurserie"
  | "jardin-magique"
  | "atelier"
  | "port-pirates"
  | "cabane";

export type ActivityStatus = "ready" | "soon";

export interface Activity {
  id: ActivityId;
  title: string;
  tagline: string;
  status: ActivityStatus;
  /** Couleur d'accent (bordure, halo). */
  accent: string;
  /** Dégradé d'ambiance de la carte. */
  background: string;
}

export const ACTIVITIES: Activity[] = [
  {
    id: "jardin-alphas",
    title: "Le Jardin des Alphas",
    tagline: "Joue avec les Alphas",
    status: "ready",
    accent: "#3aa34a",
    background: "linear-gradient(160deg, #cdeba0 0%, #7cc25a 55%, #4a9a3f 100%)",
  },
  {
    id: "nurserie",
    title: "La Nurserie des dragons",
    tagline: "Un bébé dragon à choyer",
    status: "soon",
    accent: "#e8543f",
    background: "linear-gradient(160deg, #ffd9a0 0%, #f0a860 55%, #d5713a 100%)",
  },
  {
    id: "jardin-magique",
    title: "Le Jardin magique",
    tagline: "Plante, arrose, récolte",
    status: "soon",
    accent: "#f0b429",
    background: "linear-gradient(160deg, #d9f0b0 0%, #9ad06a 55%, #5aa64a 100%)",
  },
  {
    id: "atelier",
    title: "L'Atelier",
    tagline: "Construis des machines",
    status: "soon",
    accent: "#7d4bd1",
    background: "linear-gradient(160deg, #d9c6f5 0%, #a97fe0 55%, #7d4bd1 100%)",
  },
  {
    id: "port-pirates",
    title: "Le Port des pirates",
    tagline: "Navigue vers les îles",
    status: "soon",
    accent: "#2f9bd6",
    background: "linear-gradient(160deg, #bfe6ff 0%, #6fb8e6 55%, #2f9bd6 100%)",
  },
  {
    id: "cabane",
    title: "Ma cabane",
    tagline: "Décore ta maison",
    status: "soon",
    accent: "#f5a623",
    background: "linear-gradient(160deg, #ffe6b0 0%, #f5c46a 55%, #e08f2a 100%)",
  },
];

export function getActivity(id: ActivityId): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}
