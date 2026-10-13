import { useCallback, useEffect, useRef, useState } from "react";
import { playSfx, playVoice } from "../lib/audio";
import {
  loadGarden,
  saveGarden,
  MATURE_STAGE,
  PLANT_LABELS,
  PLANT_TYPES,
  PLOT_COUNT,
  type GardenTool,
  type GardenState,
  type PlantType,
} from "../lib/garden";
import { PLANT_WORDS, type WordId } from "../data/words";
import { GardenBackdrop } from "./jardin/GardenBackdrop";
import { Plant } from "./jardin/GardenPlants";
import { BasketIcon, SeedPreview, WateringCanIcon } from "./jardin/GardenIcons";
import { WordRevealCard } from "./WordRevealCard";
import { BasileMascot } from "./BasileMascot";

interface Props {
  onExit: () => void;
}

interface Fx {
  kind: "plant" | "water" | "harvest";
  plot: number;
  plant: PlantType | null;
  id: number;
}

export function JardinMagiqueScreen({ onExit }: Props) {
  const [garden, setGarden] = useState<GardenState>(() => loadGarden());
  const [fx, setFx] = useState<Fx | null>(null);
  const [sparkle, setSparkle] = useState<number | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [ladybug, setLadybug] = useState(false);
  const [resting, setResting] = useState<number | null>(null);
  const [wordReveal, setWordReveal] = useState<WordId | null>(null);

  const timers = useRef<number[]>([]);
  const fxId = useRef(0);
  const harvestCount = useRef(0);
  const hintedMature = useRef(false);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  // Persistance.
  useEffect(() => {
    saveGarden(garden);
  }, [garden]);

  // Nettoyage.
  useEffect(() => {
    return () => timers.current.forEach((id) => window.clearTimeout(id));
  }, []);

  // Consigne d'accueil (première visite).
  useEffect(() => {
    setHint("Bienvenue dans ton jardin, Basile ! Plante une graine !");
    playVoice("jardin-bienvenue");
    later(() => setHint(null), 6000);
  }, [later]);

  /** Affiche au plus une carte mot à la fois (la première gagne). */
  const showWord = useCallback(
    (id: WordId, delay: number) => {
      later(() => setWordReveal((cur) => cur ?? id), delay);
    },
    [later],
  );

  const runFx = useCallback(
    (kind: Fx["kind"], plot: number, plant: PlantType | null, ms: number) => {
      const id = ++fxId.current;
      setFx({ kind, plot, plant, id });
      later(() => setFx((cur) => (cur && cur.id === id ? null : cur)), ms);
    },
    [later],
  );

  const plantSeed = useCallback(
    (type: PlantType, i: number) => {
      setGarden((g) => ({
        ...g,
        plots: g.plots.map((p, idx) => (idx === i ? { plant: type, stage: 0 } : p)),
      }));
      playSfx("plantation", 0.5);
      runFx("plant", i, type, 750);
    },
    [runFx],
  );

  const water = useCallback(
    (i: number) => {
      const current = garden.plots[i];
      setGarden((g) => ({
        ...g,
        plots: g.plots.map((p, idx) =>
          idx === i && p.plant ? { ...p, stage: Math.min(MATURE_STAGE, p.stage + 1) } : p,
        ),
      }));
      playSfx("eau", 0.5);
      runFx("water", i, current?.plant ?? null, 850);
      if (current?.plant && current.stage + 1 >= MATURE_STAGE) {
        later(() => {
          playSfx("croissance", 0.5);
          setSparkle(i);
          later(() => setSparkle(null), 900);
        }, 520);
      }
    },
    [garden.plots, runFx, later],
  );

  const harvest = useCallback(
    (i: number) => {
      const current = garden.plots[i];
      if (!current.plant || current.stage < MATURE_STAGE) return;
      const type = current.plant;
      setGarden((g) => ({
        ...g,
        plots: g.plots.map((p, idx) => (idx === i ? { plant: null, stage: 0 } : p)),
        harvests: { ...g.harvests, [type]: g.harvests[type] + 1 },
      }));
      playSfx("recolte", 0.55);
      runFx("harvest", i, type, 950);
      harvestCount.current += 1;
      const spokeBravo = harvestCount.current === 1 || harvestCount.current % 4 === 0;
      if (spokeBravo) {
        later(() => playVoice("jardin-bravo"), 450);
      }
      // Une seule carte mot, après la récolte (et l'éventuel bravo).
      showWord(PLANT_WORDS[type], spokeBravo ? 2600 : 1000);
    },
    [garden.plots, runFx, later, showWord],
  );

  const tapPlot = useCallback(
    (i: number) => {
      setHint(null);
      const plot = garden.plots[i];
      if (plot.plant && plot.stage >= MATURE_STAGE) {
        harvest(i);
        return;
      }
      if (!plot.plant) {
        if (garden.tool && garden.tool !== "water") plantSeed(garden.tool, i);
        else {
          setHint("Choisis une graine dans la barre !");
          later(() => setHint(null), 1800);
        }
        return;
      }
      if (garden.tool === "water") water(i);
      else {
        setHint("Prends l'arrosoir pour arroser 💧");
        later(() => setHint(null), 1800);
      }
    },
    [garden.plots, garden.tool, harvest, plantSeed, water, later],
  );

  const chooseTool = useCallback((tool: GardenTool) => {
    setGarden((g) => ({ ...g, tool }));
  }, []);

  // Surprises : coccinelle qui traverse.
  useEffect(() => {
    let cancelled = false;
    const schedule = () => {
      later(() => {
        if (cancelled) return;
        setLadybug(true);
        later(() => {
          setLadybug(false);
          if (!cancelled) schedule();
        }, 6500);
      }, 12000 + Math.random() * 10000);
    };
    schedule();
    return () => {
      cancelled = true;
    };
  }, [later]);

  // Surprises : un papillon se pose sur une plante mûre.
  useEffect(() => {
    const mature = garden.plots
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.plant && p.stage >= MATURE_STAGE)
      .map(({ i }) => i);
    if (mature.length === 0) return;
    const id = later(() => {
      const plot = mature[Math.floor(Math.random() * mature.length)];
      setResting(plot);
      playSfx("papillon", 0.35);
      later(() => setResting(null), 4200);
    }, 9000 + Math.random() * 8000);
    return () => window.clearTimeout(id);
  }, [garden.plots, later]);

  // Petit conseil quand une plante est prête.
  useEffect(() => {
    const anyMature = garden.plots.some((p) => p.plant && p.stage >= MATURE_STAGE);
    if (anyMature && !hintedMature.current) {
      hintedMature.current = true;
      setHint("C'est mûr ! Touche la plante pour la récolter 🌟");
      later(() => setHint(null), 4200);
    }
  }, [garden.plots, later]);

  const totalHarvest = PLANT_TYPES.reduce((sum, t) => sum + garden.harvests[t], 0);

  return (
    <div className="screen screen--jardin">
      <header className="topbar jardin__topbar">
        <button type="button" className="btn btn--icon" onClick={onExit} aria-label="Retour">
          ⬅️
        </button>
        <h2 className="topbar__title">Le Jardin magique</h2>
        <div className="jardin__basket" aria-label={`Panier : ${totalHarvest} récoltes`}>
          <BasketIcon className="jardin__basket-icon" />
          <span className="jardin__basket-count">{totalHarvest}</span>
        </div>
      </header>

      <main className="jardin__stage">
        <GardenBackdrop />

        {hint && (
          <div className="jardin__bubble" role="status">
            {hint}
          </div>
        )}

        <div className="jardin__plots">
          {garden.plots.map((plot, i) => {
            const mature = plot.plant !== null && plot.stage >= MATURE_STAGE;
            const empty = plot.plant === null;
            return (
              <button
                key={i}
                type="button"
                className={`jardin__plot ${empty ? "is-empty" : ""} ${mature ? "is-mature" : ""}`}
                onClick={() => tapPlot(i)}
                aria-label={
                  empty
                    ? "Parcelle vide"
                    : mature
                      ? `${PLANT_LABELS[plot.plant as PlantType]} prêt à récolter`
                      : `${PLANT_LABELS[plot.plant as PlantType]} en croissance`
                }
              >
                <span className="jardin__plant-slot" aria-hidden="true">
                  {plot.plant && <Plant key={plot.stage} type={plot.plant} stage={plot.stage} />}
                </span>
                <span className="jardin__soil" aria-hidden="true">
                  <svg viewBox="0 0 120 44">
                    <ellipse cx="60" cy="24" rx="56" ry="18" fill="#8a5a2b" />
                    <ellipse cx="60" cy="18" rx="56" ry="16" fill="#a06a34" />
                    <ellipse cx="60" cy="15" rx="42" ry="9" fill="#7a4a20" opacity="0.55" />
                  </svg>
                </span>
                {mature && <span className="jardin__ready" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        {fx && (
          <div
            className={`jardin__fx jardin__fx--${fx.kind}`}
            style={{ left: `${((fx.plot + 0.5) / PLOT_COUNT) * 100}%` }}
            aria-hidden="true"
          >
            {fx.kind === "plant" && <span className="jardin__fx-seed" />}
            {fx.kind === "water" && (
              <>
                <span className="jardin__fx-can">
                  <WateringCanIcon />
                </span>
                <span className="jardin__fx-drop" />
                <span className="jardin__fx-drop jardin__fx-drop--2" />
                <span className="jardin__fx-drop jardin__fx-drop--3" />
              </>
            )}
            {fx.kind === "harvest" && fx.plant && (
              <>
                <SeedPreview type={fx.plant} className="jardin__fx-harvest" />
                <span className="jardin__fx-star">⭐</span>
              </>
            )}
          </div>
        )}

        {sparkle !== null && (
          <div
            className="jardin__sparkle"
            style={{ left: `${((sparkle + 0.5) / PLOT_COUNT) * 100}%` }}
            aria-hidden="true"
          >
            ✨✨
          </div>
        )}

        {resting !== null && (
          <span
            className="jardin__rest-butterfly"
            style={{ left: `${((resting + 0.5) / PLOT_COUNT) * 100}%` }}
            aria-hidden="true"
          >
            🦋
          </span>
        )}

        {ladybug && <span className="jardin__ladybug" aria-hidden="true">🐞</span>}

        <BasileMascot
          variant="sidekick"
          position="inline"
          size="13vmin"
          mood="happy"
          animated
          className="jardin__basile"
        />
      </main>

      <footer className="jardin__toolbar">
        {PLANT_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            className={`jardin__tool ${garden.tool === t ? "is-active" : ""}`}
            onClick={() => chooseTool(t)}
            aria-pressed={garden.tool === t}
            aria-label={`Graine de ${PLANT_LABELS[t]}`}
          >
            <span className="jardin__tool-icon">
              <SeedPreview type={t} />
            </span>
            <span className="jardin__tool-label">{PLANT_LABELS[t]}</span>
          </button>
        ))}
        <button
          type="button"
          className={`jardin__tool ${garden.tool === "water" ? "is-active" : ""}`}
          onClick={() => chooseTool("water")}
          aria-pressed={garden.tool === "water"}
          aria-label="Arrosoir"
        >
          <span className="jardin__tool-icon">
            <WateringCanIcon />
          </span>
          <span className="jardin__tool-label">Arrosoir</span>
        </button>
      </footer>

      {wordReveal && (
        <WordRevealCard word={wordReveal} onClose={() => setWordReveal(null)} />
      )}
    </div>
  );
}
