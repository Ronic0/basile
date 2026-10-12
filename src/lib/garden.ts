/**
 * Sauvegarde locale du Jardin magique.
 * Clé dédiée, additive : nurserie et Alphas ne sont jamais touchés.
 * Aucune horloge : la croissance dépend uniquement des arrosages.
 */
export type PlantType = "tournesol" | "fraisier" | "carotte";

export type GardenTool = "water" | PlantType | null;

export interface Plot {
  plant: PlantType | null;
  /** 0 = graine, 1 = pousse, 2 = plante, 3 = mature (fleur/fruit). */
  stage: number;
}

export interface GardenState {
  plots: Plot[];
  harvests: Record<PlantType, number>;
  /** Outil/graine sélectionné au clavier, conservé entre les sessions. */
  tool: GardenTool;
}

export const PLOT_COUNT = 4;
export const MATURE_STAGE = 3;

export const PLANT_TYPES: PlantType[] = ["tournesol", "fraisier", "carotte"];

export const PLANT_LABELS: Record<PlantType, string> = {
  tournesol: "Tournesol",
  fraisier: "Fraisier",
  carotte: "Carotte",
};

const KEY = "alphas-de-basile/jardin/v1";

function defaultPlots(): Plot[] {
  return Array.from({ length: PLOT_COUNT }, () => ({ plant: null, stage: 0 }));
}

export const DEFAULT_GARDEN: GardenState = {
  plots: defaultPlots(),
  harvests: { tournesol: 0, fraisier: 0, carotte: 0 },
  tool: null,
};

function isPlantType(value: unknown): value is PlantType {
  return value === "tournesol" || value === "fraisier" || value === "carotte";
}

function sanitize(value: unknown): GardenState {
  const parsed = (value ?? {}) as Partial<GardenState>;
  const rawPlots = Array.isArray(parsed.plots) ? parsed.plots : [];
  const plots: Plot[] = Array.from({ length: PLOT_COUNT }, (_, i) => {
    const p = (rawPlots[i] ?? {}) as Partial<Plot>;
    const plant = isPlantType(p.plant) ? p.plant : null;
    const stage = plant && typeof p.stage === "number" ? Math.max(0, Math.min(MATURE_STAGE, Math.floor(p.stage))) : 0;
    return { plant, stage };
  });

  const harvests = { ...DEFAULT_GARDEN.harvests };
  if (parsed.harvests && typeof parsed.harvests === "object") {
    for (const t of PLANT_TYPES) {
      const v = (parsed.harvests as Record<string, unknown>)[t];
      if (typeof v === "number" && v >= 0) harvests[t] = Math.floor(v);
    }
  }

  const tool: GardenTool = isPlantType(parsed.tool) ? parsed.tool : parsed.tool === "water" ? "water" : null;

  return { plots, harvests, tool };
}

export function loadGarden(): GardenState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_GARDEN, plots: defaultPlots(), harvests: { ...DEFAULT_GARDEN.harvests } };
    return sanitize(JSON.parse(raw));
  } catch (err) {
    console.debug("[jardin] lecture impossible:", err);
    return { ...DEFAULT_GARDEN, plots: defaultPlots(), harvests: { ...DEFAULT_GARDEN.harvests } };
  }
}

export function saveGarden(state: GardenState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(sanitize(state)));
  } catch (err) {
    console.debug("[jardin] écriture impossible:", err);
  }
}

export function resetGarden(): void {
  try {
    localStorage.removeItem(KEY);
  } catch (err) {
    console.debug("[jardin] reset impossible:", err);
  }
}
