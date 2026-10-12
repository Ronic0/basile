import { useCallback, useEffect, useRef, useState } from "react";
import { playSfx, playVoice } from "../lib/audio";
import { CURTAINS, RUGS, WALLS } from "../data/cabane";
import { loadCabane, saveCabane, type CabaneState } from "../lib/cabane";
import { loadPirates } from "../lib/pirates";
import { TREASURES, type Treasure, type TreasureId } from "../data/pirates";
import { BUILDABLES, getBuildable, type BuildableId } from "../data/buildables";
import { loadAtelier } from "../lib/workshop";
import { BuildableArt } from "./atelier/BuildableArt";
import { PLANT_TYPES, loadGarden } from "../lib/garden";
import { Plant } from "./jardin/GardenPlants";
import { loadNursery } from "../lib/nursery";
import { getAlphaSafe } from "../data/alphas";
import { loadStats } from "../lib/storage";
import { BabyDragon, type DragonState } from "./nurserie/BabyDragon";
import { TreasureIcon } from "./pirates/TreasureIcon";
import { BasileMascot } from "./BasileMascot";

interface Props {
  onExit: () => void;
}

export function CabaneScreen({ onExit }: Props) {
  const [cabane, setCabane] = useState<CabaneState>(() => loadCabane());
  const [pirates] = useState(() => loadPirates());
  const [atelier] = useState(() => loadAtelier());
  const [garden] = useState(() => loadGarden());
  const [nursery] = useState(() => loadNursery());
  const [stats] = useState(() => loadStats());

  const [showChest, setShowChest] = useState(false);
  const [playing, setPlaying] = useState<BuildableId | null>(null);
  const [poppedTreasure, setPoppedTreasure] = useState<TreasureId | null>(null);
  const [bird, setBird] = useState(false);
  const [catMood, setCatMood] = useState<DragonState>("idle");
  const [hint, setHint] = useState<string | null>(null);

  const timers = useRef<number[]>([]);
  const spoken = useRef<Set<string>>(new Set());
  const catMoodRef = useRef<DragonState>("idle");

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    saveCabane(cabane);
  }, [cabane]);

  useEffect(() => {
    return () => timers.current.forEach((id) => window.clearTimeout(id));
  }, []);

  const speakOnce = useCallback((id: string) => {
    if (spoken.current.has(id)) return;
    spoken.current.add(id);
    playVoice(id);
  }, []);

  useEffect(() => {
    setHint("Bienvenue dans ta cabane, Basile !");
    speakOnce("cabane-bienvenue");
    later(() => setHint(null), 5000);
  }, [speakOnce, later]);

  const wall = WALLS[cabane.wall] ?? WALLS[0];
  const rug = RUGS[cabane.rug] ?? RUGS[0];
  const curtain = CURTAINS[cabane.curtain] ?? CURTAINS[0];

  const toggleLamp = useCallback(() => {
    const next = !cabane.lampOn;
    setCabane((c) => ({ ...c, lampOn: next }));
    playSfx("lumiere", 0.5);
    if (next) speakOnce("cabane-lumiere");
  }, [cabane.lampOn, speakOnce]);

  const openWindow = useCallback(() => {
    playSfx("mouette", 0.4);
    setBird(true);
    later(() => setBird(false), 2600);
    speakOnce("cabane-dehors");
  }, [later, speakOnce]);

  const openChest = useCallback(() => {
    setShowChest(true);
    playSfx("coffre-ouvre", 0.5);
    speakOnce("pirates-tresors");
  }, [speakOnce]);

  const petCat = useCallback(() => {
    playSfx("surprise", 0.3);
    catMoodRef.current = "happy";
    setCatMood("happy");
    later(() => {
      catMoodRef.current = "idle";
      setCatMood("idle");
    }, 1200);
  }, [later]);

  const playBuild = useCallback(
    (id: BuildableId) => {
      playSfx(getBuildable(id).finishSfx, 0.45);
      setPlaying(id);
      later(() => setPlaying((cur) => (cur === id ? null : cur)), 2200);
    },
    [later],
  );

  const openTreasure = useCallback(
    (t: Treasure) => {
      playSfx("surprise", 0.3);
      playVoice(t.voice);
      setPoppedTreasure(t.id);
      later(() => setPoppedTreasure((cur) => (cur === t.id ? null : cur)), 650);
    },
    [later],
  );

  const builtIds = BUILDABLES.filter((b) => atelier.built[b.id]);
  const discoveredAlphas = stats.decouverts.slice(0, 6);
  const gardenHarvests = PLANT_TYPES.filter((t) => garden.harvests[t] > 0);

  return (
    <div className="screen screen--cabane">
      <header className="topbar cabane__topbar">
        <button type="button" className="btn btn--icon" onClick={onExit} aria-label="Retour">
          ⬅️
        </button>
        <h2 className="topbar__title">Ma Cabane</h2>
        <button type="button" className="btn btn--gold" onClick={openChest} aria-label="Mon coffre à trésors">
          🧰 <span className="cabane__chest-label">Mon coffre</span>
        </button>
      </header>

      <main
        className={`cabane__room ${cabane.lampOn ? "is-lit" : "is-dark"}`}
        style={
          {
            "--wall": wall.color,
            "--wall-accent": wall.accent,
            "--rug": rug.color,
            "--rug-accent": rug.accent,
            "--curtain": curtain.color,
            "--curtain-accent": curtain.accent,
          } as React.CSSProperties
        }
      >
        {hint && (
          <div className="cabane__bubble" role="status">
            {hint}
          </div>
        )}

        {/* Mur */}
        <div className="cabane__wall">
          <button type="button" className="cabane__window" onClick={openWindow} aria-label="Ouvrir la fenêtre">
            <WindowArt curtain={curtain.color} />
          </button>

          <button
            type="button"
            className={`cabane__lamp ${cabane.lampOn ? "is-on" : "is-off"}`}
            onClick={toggleLamp}
            aria-label={cabane.lampOn ? "Éteindre la lampe" : "Allumer la lampe"}
          >
            <LampArt />
          </button>

          <div className="cabane__shelf" aria-label="Étagère de constructions">
            {builtIds.length === 0 ? (
              <span className="cabane__shelf-empty">?</span>
            ) : (
              builtIds.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className="cabane__shelf-item"
                  onClick={() => playBuild(b.id)}
                  aria-label={`Voir ${b.name}`}
                >
                  <BuildableArt
                    type={b.id}
                    color={atelier.built[b.id]}
                    placed={new Set(b.parts.map((p) => p.id))}
                    animate={playing === b.id}
                  />
                </button>
              ))
            )}
          </div>

          <div className="cabane__frames">
            <div className="cabane__frame" aria-label="Photo de tes Alphas">
              {discoveredAlphas.length === 0 ? (
                <span className="cabane__frame-empty">📖</span>
              ) : (
                <div className="cabane__alphas">
                  {discoveredAlphas.map((id) => {
                    const a = getAlphaSafe(id);
                    return a ? <img key={id} src={a.image} alt="" draggable={false} /> : null;
                  })}
                </div>
              )}
            </div>
            <div className="cabane__frame" aria-label="Photo de ton dragon">
              <div className="cabane__dragon">
                <BabyDragon state="idle" />
              </div>
              <span className="cabane__dragon-name">{nursery.name}</span>
            </div>
          </div>

          <div className="cabane__clock" aria-hidden="true">
            <ClockArt />
          </div>
        </div>

        {/* Sol */}
        <div className="cabane__floor">
          <div className="cabane__rug" />

          <button type="button" className="cabane__chest" onClick={openChest} aria-label="Ouvrir le coffre">
            <ChestArt />
          </button>

          <button type="button" className="cabane__cat" onClick={petCat} aria-label="Caresser le chat">
            <CatArt happy={catMood === "happy"} />
          </button>

          <div className="cabane__vase" aria-label="Fleurs du jardin">
            {gardenHarvests.length === 0 ? (
              <span className="cabane__vase-empty">🪴</span>
            ) : (
              gardenHarvests.map((t) => (
                <span key={t} className="cabane__vase-plant">
                  <Plant type={t} stage={3} />
                </span>
              ))
            )}
          </div>
        </div>

        {bird && (
          <span className="cabane__bird" aria-hidden="true">
            <BirdArt />
          </span>
        )}

        <div className="cabane__night" aria-hidden="true" />

        <BasileMascot
          variant="sidekick"
          position="inline"
          size="12vmin"
          mood="happy"
          animated
          className="cabane__basile"
        />
      </main>

      <footer className="cabane__decor-bar" aria-label="Décorer la cabane">
        <DecorGroup
          title="Mur"
          options={WALLS}
          selected={cabane.wall}
          onSelect={(i) => {
            setCabane((c) => ({ ...c, wall: i }));
            playSfx("surprise", 0.28);
          }}
        />
        <DecorGroup
          title="Tapis"
          options={RUGS}
          selected={cabane.rug}
          onSelect={(i) => {
            setCabane((c) => ({ ...c, rug: i }));
            playSfx("surprise", 0.28);
          }}
        />
        <DecorGroup
          title="Rideaux"
          options={CURTAINS}
          selected={cabane.curtain}
          onSelect={(i) => {
            setCabane((c) => ({ ...c, curtain: i }));
            playSfx("rideau", 0.35);
          }}
        />
      </footer>

      {showChest && (
        <div className="cabane__chest-overlay" role="dialog" aria-modal="true" aria-label="Mon coffre à trésors">
          <header className="topbar">
            <button type="button" className="btn btn--icon" onClick={() => setShowChest(false)} aria-label="Fermer">
              ✖️
            </button>
            <h2 className="topbar__title">Mon coffre</h2>
            <span className="cabane__expeditions">⚓ {pirates.expeditions}</span>
          </header>
          <div className="cabane__chest-grid">
            {TREASURES.map((t) => {
              const count = pirates.treasures[t.id] ?? 0;
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
                  <span className={`chest-item__count ${t.rarity === "rare" ? "is-rare" : ""}`}>×{count}</span>
                </button>
              );
            })}
          </div>
          <p className="cabane__chest-hint">
            {builtIds.length > 0
              ? `Constructions sur l'étagère : ${builtIds.length}`
              : "Tes constructions apparaîtront sur l'étagère."}
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------- Barre de décoration ---------- */
function DecorGroup({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: { id: string; label: string; color: string }[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="cabane__decor-group">
      <span className="cabane__decor-title">{title}</span>
      <div className="cabane__swatches">
        {options.map((o, i) => (
          <button
            key={o.id}
            type="button"
            className={`cabane__swatch ${selected === i ? "is-active" : ""}`}
            style={{ background: o.color }}
            onClick={() => onSelect(i)}
            aria-label={`${title} : ${o.label}`}
            aria-pressed={selected === i}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Illustrations ---------- */
function WindowArt({ curtain }: { curtain: string }) {
  return (
    <svg viewBox="0 0 140 130" aria-hidden="true">
      <rect x="6" y="6" width="128" height="118" rx="8" fill="#b5763c" />
      <rect x="14" y="14" width="112" height="102" rx="4" fill="#8ad0ff" />
      <circle cx="96" cy="40" r="14" fill="#ffe28a" />
      <ellipse cx="44" cy="46" rx="20" ry="10" fill="#ffffff" />
      <ellipse cx="60" cy="58" rx="14" ry="8" fill="#ffffff" />
      <path d="M14 92 q30 -14 56 0 q30 14 56 0 v24 h-112 z" fill="#5aa64a" />
      <path d="M70 14 V116 M14 64 H126" stroke="#b5763c" strokeWidth="5" />
      <g>
        <path d="M6 6 q-14 40 0 78 q-4 -40 0 -78 z" fill={curtain} />
        <path d="M134 6 q14 40 0 78 q4 -40 0 -78 z" fill={curtain} />
        <path d="M6 6 h128 v-4 h-128 z" fill="#e0a72a" />
      </g>
    </svg>
  );
}

function LampArt() {
  return (
    <svg viewBox="0 0 60 90" aria-hidden="true">
      <path d="M30 0 v34" stroke="#5a3a2a" strokeWidth="4" />
      <path d="M12 34 h36 l-8 22 h-20 z" fill="#e0a72a" />
      <path d="M12 34 h36 l-2 6 h-32 z" fill="#ffd34d" />
      <circle className="cabane__lamp-bulb" cx="30" cy="62" r="8" fill="#fff3b0" />
    </svg>
  );
}

function ClockArt() {
  return (
    <svg viewBox="0 0 70 70" aria-hidden="true">
      <circle cx="35" cy="35" r="30" fill="#e6cfa0" stroke="#8a5a2b" strokeWidth="4" />
      <circle cx="35" cy="35" r="24" fill="#fff8ec" />
      <line className="cabane__clock-hand" x1="35" y1="35" x2="35" y2="18" stroke="#3a3f4a" strokeWidth="3" strokeLinecap="round" />
      <line className="cabane__clock-hand cabane__clock-hand--slow" x1="35" y1="35" x2="48" y2="35" stroke="#3a3f4a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ChestArt() {
  return (
    <svg viewBox="0 0 100 90" aria-hidden="true">
      <ellipse cx="50" cy="84" rx="40" ry="7" fill="rgba(0,0,0,0.16)" />
      <rect x="12" y="42" width="76" height="40" rx="5" fill="#8a5a2b" />
      <path d="M12 46 q38 -28 76 0 z" fill="#a06a34" />
      <rect x="12" y="58" width="76" height="8" fill="#6b4410" />
      <rect x="44" y="50" width="12" height="18" rx="3" fill="#ffd34d" />
      <circle cx="50" cy="58" r="3" fill="#b98612" />
      <circle className="cabane__chest-gem" cx="78" cy="46" r="6" fill="#e8543f" />
    </svg>
  );
}

function CatArt({ happy }: { happy: boolean }) {
  return (
    <svg className={happy ? "is-happy" : ""} viewBox="0 0 100 80" aria-hidden="true">
      <ellipse cx="50" cy="72" rx="34" ry="7" fill="rgba(0,0,0,0.14)" />
      <path d="M20 70 q-6 -30 30 -30 q36 0 30 30 z" fill="#8a6a4a" />
      <circle cx="50" cy="46" r="20" fill="#a07d58" />
      <path d="M36 30 l-4 -12 l12 6 z" fill="#a07d58" />
      <path d="M64 30 l4 -12 l-12 6 z" fill="#a07d58" />
      <circle cx="43" cy="46" r="3" fill="#22303a" />
      <circle cx="57" cy="46" r="3" fill="#22303a" />
      <path d="M50 52 l-3 3 h6 z" fill="#e8543f" />
      <path d="M50 55 q-4 4 -8 1 M50 55 q4 4 8 1" stroke="#22303a" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

function BirdArt() {
  return (
    <svg viewBox="0 0 60 40" aria-hidden="true">
      <path d="M6 26 q12 -16 24 0 q12 -16 24 0" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
