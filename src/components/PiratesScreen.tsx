import { useCallback, useEffect, useRef, useState } from "react";
import { playSfx, playVoice } from "../lib/audio";
import {
  getIsland,
  ISLANDS,
  TREASURES,
  type Island,
  type IslandId,
  type IslandSpot,
  type Treasure,
  type TreasureId,
} from "../data/pirates";
import { loadPirates, savePirates, type PiratesState } from "../lib/pirates";
import { PirateShip } from "./pirates/PirateShip";
import { IslandBackdrop, IslandSpotArt } from "./pirates/IslandScenes";
import { TreasureIcon } from "./pirates/TreasureIcon";
import { BasileMascot } from "./BasileMascot";

interface Props {
  onExit: () => void;
}

type Phase = "map" | "sailing" | "island";

const PORT = { x: 10, y: 72 };
const SAIL_MS = 2500;

export function PiratesScreen({ onExit }: Props) {
  const [pirates, setPirates] = useState<PiratesState>(() => loadPirates());
  const [phase, setPhase] = useState<Phase>("map");
  const [islandId, setIslandId] = useState<IslandId | null>(null);
  const [shipPos, setShipPos] = useState(PORT);
  const [arrived, setArrived] = useState(false);
  const [showChest, setShowChest] = useState(false);
  const [pop, setPop] = useState<{ token: number; treasure: TreasureId; x: number; y: number } | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const timers = useRef<number[]>([]);
  const spoken = useRef<Set<string>>(new Set());
  const treasureVoiceBudget = useRef(0);
  const popToken = useRef(0);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    savePirates(pirates);
  }, [pirates]);

  useEffect(() => {
    return () => timers.current.forEach((id) => window.clearTimeout(id));
  }, []);

  const speakOnce = useCallback((id: string) => {
    if (spoken.current.has(id)) return;
    spoken.current.add(id);
    playVoice(id);
  }, []);

  // Consigne d'accueil de la carte.
  useEffect(() => {
    setHint("Choisis une île, capitaine Basile !");
    speakOnce("pirates-choisis");
    later(() => setHint(null), 5000);
  }, [speakOnce, later]);

  // Vie sur la carte : mouette de temps en temps.
  useEffect(() => {
    if (phase !== "map") return;
    let cancelled = false;
    const schedule = () => {
      later(() => {
        if (cancelled) return;
        playSfx("mouette", 0.3);
        schedule();
      }, 9000 + Math.random() * 9000);
    };
    schedule();
    return () => {
      cancelled = true;
    };
  }, [phase, later]);

  const beginExpedition = useCallback(() => {
    // Nouvelle expédition : les cachettes redeviennent explorables.
    setPirates((p) => ({ ...p, expeditions: p.expeditions + 1, searched: {} }));
    treasureVoiceBudget.current = 0;
    speakOnce("pirates-abordage");
  }, [speakOnce]);

  const sailTo = useCallback(
    (id: IslandId) => {
      if (phase !== "map") return;
      const island = getIsland(id);
      beginExpedition();
      setHint(null);
      setArrived(false);
      setIslandId(id);
      setPhase("sailing");
      playSfx("depart", 0.5);
      setShipPos({ x: island.mapX, y: island.mapY - 3 });
      later(() => {
        setArrived(true);
        playSfx("surprise", 0.35);
      }, SAIL_MS);
      later(() => {
        setPhase("island");
        setArrived(false);
        playSfx("vagues", 0.3);
      }, SAIL_MS + 500);
    },
    [phase, beginExpedition, later],
  );

  const returnToPort = useCallback(() => {
    setPhase("map");
    setShipPos(PORT);
    setPop(null);
  }, []);

  const discover = useCallback(
    (island: Island, spot: IslandSpot) => {
      const key = `${island.id}:${spot.id}`;
      if (pirates.searched[key]) return;

      setPirates((p) => ({
        ...p,
        treasures: { ...p.treasures, [spot.treasure]: (p.treasures[spot.treasure] ?? 0) + 1 },
        searched: { ...p.searched, [key]: true },
        lastIsland: island.id,
      }));

      playSfx("tresor", 0.55);
      const token = ++popToken.current;
      setPop({ token, treasure: spot.treasure, x: spot.x, y: spot.y });
      later(() => setPop((cur) => (cur && cur.token === token ? null : cur)), 1200);

      // Voix : seulement la première découverte de l'expédition.
      if (treasureVoiceBudget.current === 0) {
        treasureVoiceBudget.current = 1;
        later(() => playVoice("pirates-tresor"), 300);
      } else {
        playSfx("surprise", 0.25);
      }
    },
    [pirates.searched, later],
  );

  const openChest = useCallback(() => {
    setShowChest(true);
    playSfx("coffre-ouvre", 0.5);
    speakOnce("pirates-tresors");
  }, [speakOnce]);

  const [poppedTreasure, setPoppedTreasure] = useState<TreasureId | null>(null);
  const openTreasure = useCallback(
    (t: Treasure) => {
      playSfx("surprise", 0.3);
      playVoice(t.voice);
      setPoppedTreasure(t.id);
      later(() => setPoppedTreasure((cur) => (cur === t.id ? null : cur)), 650);
    },
    [later],
  );

  const island = islandId ? getIsland(islandId) : null;

  return (
    <div className="screen screen--pirates">
      <header className="topbar pirates__topbar">
        <button
          type="button"
          className="btn btn--icon"
          onClick={() => (phase === "island" ? returnToPort() : onExit())}
          aria-label="Retour"
        >
          ⬅️
        </button>
        <h2 className="topbar__title">
          {phase === "island" && island ? island.name : "Le Port des Pirates"}
        </h2>
        <button type="button" className="btn btn--gold" onClick={openChest} aria-label="Mes trésors">
          🗝️ <span className="pirates__chest-label">Mes trésors</span>
        </button>
      </header>

      {phase !== "island" && (
        <div className="sea" aria-label="Carte maritime">
          <div className="sea__waves" aria-hidden="true" />
          <div className="sea__clouds" aria-hidden="true">
            <span className="sea__cloud sea__cloud--1" />
            <span className="sea__cloud sea__cloud--2" />
          </div>
          <div className="sea__gulls" aria-hidden="true">
            <span className="sea__gull">🕊️</span>
            <span className="sea__gull sea__gull--2">🕊️</span>
          </div>
          <div className="sea__fish" aria-hidden="true">
            <span className="sea__fish-1" />
            <span className="sea__fish-2" />
          </div>

          <div className="sea__port" style={{ left: `${PORT.x}%`, top: `${PORT.y}%` }} aria-hidden="true">
            <Lighthouse />
          </div>

          {ISLANDS.map((isl) => (
            <button
              key={isl.id}
              type="button"
              className="sea-island"
              style={{ left: `${isl.mapX}%`, top: `${isl.mapY}%` }}
              onClick={() => sailTo(isl.id)}
              aria-label={`Naviguer vers ${isl.name}`}
            >
              <IslandSilhouette id={isl.id} />
              <span className="sea-island__name">{isl.name}</span>
            </button>
          ))}

          <div
            className={`pirate-ship-wrap ${arrived ? "is-arrived" : ""}`}
            style={{ left: `${shipPos.x}%`, top: `${shipPos.y}%`, transitionDuration: `${SAIL_MS}ms` }}
            aria-hidden="true"
          >
            <PirateShip className="pirate-ship" />
          </div>

          <BasileMascot
            variant="guide"
            mood="happy"
            size="12vmin"
            position="inline"
            animated
            className="pirates__basile"
          />
        </div>
      )}

      {phase === "island" && island && (
        <div className={`island-scene island-scene--${island.id}`}>
          <IslandBackdrop island={island} />

          {hint && (
            <div className="pirates__bubble" role="status">
              {hint}
            </div>
          )}

          {island.spots.map((spot) => {
            const searched = Boolean(pirates.searched[`${island.id}:${spot.id}`]);
            return (
              <button
                key={spot.id}
                type="button"
                className={`island-spot ${searched ? "is-searched" : ""}`}
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  width: `${13 * spot.scale}vmin`,
                  height: `${13 * spot.scale}vmin`,
                }}
                onClick={() => discover(island, spot)}
                aria-label={searched ? `${spot.label} (déjà fouillé)` : `Explorer : ${spot.label}`}
              >
                <IslandSpotArt island={island.id} spotId={spot.id} searched={searched} />
              </button>
            );
          })}

          {pop && (
            <div
              className="island-pop"
              style={{ left: `${pop.x}%`, top: `${pop.y}%` }}
              aria-hidden="true"
            >
              <TreasureIcon id={pop.treasure} />
            </div>
          )}

          <BasileMascot
            variant="sidekick"
            mood="happy"
            size="12vmin"
            position="inline"
            animated
            className="island-scene__basile"
          />
        </div>
      )}

      {showChest && (
        <div className="pirates__chest-overlay" role="dialog" aria-modal="true" aria-label="Mes trésors">
          <header className="topbar">
            <button
              type="button"
              className="btn btn--icon"
              onClick={() => setShowChest(false)}
              aria-label="Fermer"
            >
              ✖️
            </button>
            <h2 className="topbar__title">Mes trésors</h2>
            <span className="pirates__expeditions">⚓ {pirates.expeditions}</span>
          </header>

          <div className="pirates__chest-grid">
            {TREASURES.map((t) => {
              const count = pirates.treasures[t.id];
              const found = count > 0;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`chest-item ${found ? "is-found" : ""} ${
                    poppedTreasure === t.id ? "is-popped" : ""
                  }`}
                  onClick={() => found && openTreasure(t)}
                  disabled={!found}
                  aria-label={found ? `${t.name}, ${count}` : "Trésor non découvert"}
                >
                  <span className="chest-item__art" aria-hidden="true">
                    {found ? <TreasureIcon id={t.id} /> : <span className="chest-item__lock">?</span>}
                  </span>
                  <span className="chest-item__name">{found ? t.name : "Mystère"}</span>
                  <span className={`chest-item__count ${t.rarity === "rare" ? "is-rare" : ""}`}>
                    ×{count}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="pirates__chest-hint">
            Ces trésors pourront décorer « Ma Cabane » plus tard 🏚️
          </p>
        </div>
      )}
    </div>
  );
}

function Lighthouse() {
  return (
    <svg viewBox="0 0 80 120">
      <rect x="30" y="40" width="20" height="70" rx="4" fill="#e8e2d2" />
      <rect x="28" y="34" width="24" height="10" rx="3" fill="#c0563f" />
      <rect x="30" y="56" width="20" height="8" fill="#c0563f" />
      <rect x="30" y="74" width="20" height="8" fill="#c0563f" />
      <rect x="34" y="20" width="12" height="16" rx="3" fill="#ffd34d" />
      <path d="M28 20 h24 l-4 -8 h-16 z" fill="#c0563f" />
      <path d="M40 20 q22 -8 30 6 l-6 4 q-8 -10 -24 -2 z" fill="#ffe08a" opacity="0.7" />
      <rect x="10" y="108" width="60" height="8" rx="3" fill="#8a5a2b" />
    </svg>
  );
}

function IslandSilhouette({ id }: { id: IslandId }) {
  return (
    <svg className="sea-island__silhouette" viewBox="0 0 120 90" aria-hidden="true">
      <ellipse cx="60" cy="80" rx="56" ry="12" fill="#f3dca0" />
      {id === "palmiers" && (
        <g>
          <ellipse cx="60" cy="72" rx="44" ry="12" fill="#f7e6b6" />
          <path d="M58 74 q-6 -30 2 -44 q2 -6 5 0 q-4 20 1 44 z" fill="#8a5a2b" />
          <g fill="#3f9a4a">
            <path d="M64 32 q-24 -14 -36 0 q18 0 32 10 z" />
            <path d="M64 32 q24 -14 36 0 q-18 0 -32 10 z" />
            <path d="M64 30 q-6 -20 -20 -22 q6 14 14 26 z" />
            <path d="M66 30 q6 -20 20 -22 q-6 14 -14 26 z" />
          </g>
        </g>
      )}
      {id === "volcan" && (
        <g>
          <ellipse cx="60" cy="72" rx="46" ry="12" fill="#7d6a55" />
          <path d="M26 74 L60 22 L94 74 z" fill="#5c4a3a" />
          <path d="M60 22 q-10 -4 -8 -14 q8 6 8 -2 q2 8 8 2 q-2 12 -8 14 z" fill="#9aa3b0" opacity="0.7" />
          <path d="M48 58 q6 6 12 2 q6 6 12 0 L94 74 L26 74 z" fill="#e8543f" opacity="0.7" />
        </g>
      )}
      {id === "mysterieuse" && (
        <g>
          <ellipse cx="60" cy="72" rx="46" ry="12" fill="#7f8f68" />
          <g fill="#b9b3a0">
            <rect x="30" y="40" width="12" height="34" rx="3" />
            <rect x="48" y="34" width="10" height="40" rx="3" />
            <rect x="72" y="44" width="10" height="30" rx="3" />
          </g>
          <path d="M30 38 h12 l-6 -8 z M48 32 h10 l-5 -8 z M72 42 h10 l-5 -8 z" fill="#a49e8c" />
        </g>
      )}
    </svg>
  );
}
