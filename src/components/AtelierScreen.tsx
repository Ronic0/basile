import { useCallback, useEffect, useRef, useState } from "react";
import { playSfx, playVoice } from "../lib/audio";
import { BUILDABLES, OBJECT_COLORS, getBuildable, type BuildableId } from "../data/buildables";
import { loadAtelier, saveAtelier, type AtelierState } from "../lib/workshop";
import { BuildableArt, PartIcon } from "./atelier/BuildableArt";
import { WorkshopBackdrop } from "./atelier/WorkshopBackdrop";
import { BasileMascot } from "./BasileMascot";

interface Props {
  onExit: () => void;
}

interface DragState {
  type: BuildableId;
  partId: string;
  x: number;
  y: number;
}

export function AtelierScreen({ onExit }: Props) {
  const [atelier, setAtelier] = useState<AtelierState>(() => loadAtelier());
  const [phase, setPhase] = useState<"choose" | "build">("choose");
  const [current, setCurrent] = useState<BuildableId | null>(null);
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  const [color, setColor] = useState<string>(OBJECT_COLORS[0]);
  const [completed, setCompleted] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);

  const timers = useRef<number[]>([]);
  const dragRef = useRef<DragState | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragMoved = useRef(false);
  const completedRef = useRef(false);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    saveAtelier(atelier);
  }, [atelier]);

  useEffect(() => {
    return () => timers.current.forEach((id) => window.clearTimeout(id));
  }, []);

  // Consigne d'accueil (une fois).
  useEffect(() => {
    setHint("Bienvenue dans l'atelier ! Choisis un objet à construire.");
    playVoice("atelier-bienvenue");
    later(() => setHint(null), 6000);
  }, [later]);

  const buildable = current ? getBuildable(current) : null;

  const startBuild = useCallback(
    (type: BuildableId, fromCollection = false) => {
      const b = getBuildable(type);
      setCurrent(type);
      completedRef.current = fromCollection;
      setPlaced(fromCollection ? new Set(b.parts.map((p) => p.id)) : new Set());
      setColor(atelier.built[type] ?? OBJECT_COLORS[0]);
      setCompleted(fromCollection);
      setSelectedPart(null);
      setHint(null);
      setPhase("build");
    },
    [atelier.built],
  );

  const wrongDrop = useCallback(() => {
    setWrong(true);
    setHint("Pas tout à fait… essaie un autre emplacement !");
    later(() => setWrong(false), 500);
    later(() => setHint(null), 1700);
  }, [later]);

  const placePart = useCallback(
    (partId: string) => {
      if (!current) return;
      const b = getBuildable(current);
      if (placed.has(partId)) return;

      setPlaced((prev) => {
        const next = new Set(prev);
        next.add(partId);
        return next;
      });
      playSfx("emboite", 0.5);
      setSelectedPart(null);

      const willComplete = b.parts.every((p) => p.id === partId || placed.has(p.id));
      if (willComplete && !completedRef.current) {
        completedRef.current = true;
        later(() => {
          playSfx("construit", 0.5);
          playSfx(b.finishSfx, 0.45);
          playVoice("atelier-reussi");
          setCompleted(true);
          setHint("Bravo ! Ton objet est terminé ! 🌟");
          later(() => setHint(null), 4000);
          setAtelier((prev) => ({
            built: { ...prev.built, [current]: color },
            builds: prev.builds + 1,
          }));
        }, 350);
      }
    },
    [current, placed, color, later],
  );

  // --- Glisser-déposer (Pointer Events) ---
  const onPartDown = useCallback(
    (e: React.PointerEvent, partId: string) => {
      if (!current) return;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* capture non supportée */
      }
      dragMoved.current = false;
      dragStart.current = { x: e.clientX, y: e.clientY };
      const d: DragState = { type: current, partId, x: e.clientX, y: e.clientY };
      dragRef.current = d;
      setDrag(d);
      setSelectedPart(partId);
    },
    [current],
  );

  const onPartMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    if (Math.hypot(e.clientX - dragStart.current.x, e.clientY - dragStart.current.y) > 8) {
      dragMoved.current = true;
    }
    const next = { ...d, x: e.clientX, y: e.clientY };
    dragRef.current = next;
    setDrag(next);
  }, []);

  const onPartUp = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      dragRef.current = null;
      setDrag(null);
      if (!d) return;
      if (!dragMoved.current) return; // simple toucher : la pièce reste sélectionnée
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const zone = (el as HTMLElement | null)?.closest("[data-zone]") as HTMLElement | null;
      const target = zone?.dataset.zone ?? null;
      if (target === d.partId) placePart(d.partId);
      else wrongDrop();
    },
    [placePart, wrongDrop],
  );

  const handleZoneClick = useCallback(
    (zonePart: string) => {
      if (placed.has(zonePart)) return;
      if (!selectedPart) {
        setHint("Choisis d'abord une pièce !");
        later(() => setHint(null), 1600);
        return;
      }
      if (selectedPart === zonePart) placePart(selectedPart);
      else wrongDrop();
    },
    [placed, selectedPart, placePart, wrongDrop, later],
  );

  const chooseColor = useCallback(
    (c: string) => {
      setColor(c);
      if (current && completed) {
        setAtelier((prev) => ({ ...prev, built: { ...prev.built, [current]: c } }));
      }
    },
    [current, completed],
  );

  const allParts = buildable ? buildable.parts : [];

  return (
    <div className="screen screen--atelier">
      <header className="topbar atelier__topbar">
        <button type="button" className="btn btn--icon" onClick={onExit} aria-label="Retour">
          ⬅️
        </button>
        <h2 className="topbar__title">L'Atelier de Basile</h2>
        {phase === "build" ? (
          <button type="button" className="btn btn--ghost atelier__back" onClick={() => setPhase("choose")}>
            🧰 Mes objets
          </button>
        ) : (
          <span className="atelier__count" aria-label={`${atelier.builds} constructions`}>
            🏆 {atelier.builds}
          </span>
        )}
      </header>

      <main className="atelier__stage">
        <WorkshopBackdrop />

        {hint && (
          <div className="atelier__bubble" role="status">
            {hint}
          </div>
        )}

        {phase === "choose" && (
          <div className="atelier__choose">
            <div className="atelier__choose-row">
              {BUILDABLES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className="atelier__pick"
                  onClick={() => startBuild(b.id)}
                  aria-label={`Construire : ${b.name}`}
                >
                  <span className="atelier__pick-art" aria-hidden="true">
                    <BuildableArt
                      type={b.id}
                      color={atelier.built[b.id] ?? OBJECT_COLORS[0]}
                      placed={new Set(b.parts.map((p) => p.id))}
                    />
                  </span>
                  <span className="atelier__pick-name">{b.name}</span>
                  <span className="atelier__pick-parts">{b.parts.length} pièces</span>
                </button>
              ))}
            </div>

            <div className="atelier__shelf" aria-label="Étagère de collection">
              {BUILDABLES.map((b) => {
                const built = atelier.built[b.id];
                return (
                  <button
                    key={b.id}
                    type="button"
                    className={`atelier__shelf-slot ${built ? "is-built" : ""}`}
                    onClick={() => built && startBuild(b.id, true)}
                    disabled={!built}
                    aria-label={built ? `Voir ${b.name}` : "Objet pas encore construit"}
                  >
                    <span className="atelier__shelf-art" aria-hidden="true">
                      {built ? (
                        <BuildableArt type={b.id} color={built} placed={new Set(b.parts.map((p) => p.id))} />
                      ) : (
                        <span className="atelier__shelf-lock">?</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {phase === "build" && buildable && (
          <div className="atelier__build-wrap">
            <div className={`atelier__build ${wrong ? "is-wrong" : ""}`}>
              <BuildableArt type={buildable.id} ghost />
              <BuildableArt
                type={buildable.id}
                color={color}
                placed={placed}
                animate={completed}
              />

              {allParts.map((p) => {
                const filled = placed.has(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    data-zone={p.id}
                    className={`atelier__zone ${filled ? "is-filled" : ""} ${
                      !filled && selectedPart === p.id ? "is-hint" : ""
                    }`}
                    style={{
                      left: `${p.zone.x}%`,
                      top: `${p.zone.y}%`,
                      width: `${p.zone.w}%`,
                      height: `${p.zone.h}%`,
                    }}
                    onClick={() => handleZoneClick(p.id)}
                    aria-label={`Emplacement : ${p.label}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {phase === "build" && buildable && !completed && (
          <div className="atelier__tray" role="toolbar" aria-label="Pièces disponibles">
            {allParts.map((p) => {
              const done = placed.has(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`atelier__part ${done ? "is-done" : ""} ${
                    selectedPart === p.id ? "is-selected" : ""
                  }`}
                  disabled={done}
                  onPointerDown={(e) => onPartDown(e, p.id)}
                  onPointerMove={onPartMove}
                  onPointerUp={onPartUp}
                  onPointerCancel={onPartUp}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedPart(p.id);
                    }
                  }}
                  aria-label={`Pièce : ${p.label}`}
                >
                  <span className="atelier__part-icon" aria-hidden="true">
                    <PartIcon type={buildable.id} partId={p.id} color={color} />
                  </span>
                  <span className="atelier__part-label">{p.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {phase === "build" && buildable && completed && (
          <div className="atelier__done">
            <div className="atelier__colors" role="group" aria-label="Choisir une couleur">
              {OBJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`atelier__swatch ${color === c ? "is-active" : ""}`}
                  style={{ background: c }}
                  onClick={() => chooseColor(c)}
                  aria-label={`Couleur ${c}`}
                  aria-pressed={color === c}
                />
              ))}
            </div>
            <div className="atelier__done-actions">
              <button
                type="button"
                className="btn btn--huge btn--play"
                onClick={() => {
                  completedRef.current = false;
                  setPlaced(new Set());
                  setCompleted(false);
                  setSelectedPart(null);
                  setHint(null);
                }}
              >
                🔁 Reconstruire
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setPhase("choose")}>
                🧰 Autre objet
              </button>
            </div>
          </div>
        )}

        <BasileMascot
          variant="sidekick"
          position="inline"
          size="12vmin"
          mood={completed ? "happy" : "idle"}
          animated
          className="atelier__basile"
        />
      </main>

      {drag && (
        <div className="atelier__ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          <PartIcon type={drag.type} partId={drag.partId} color={color} />
        </div>
      )}
    </div>
  );
}
