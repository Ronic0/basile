import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { playSfx, playVoice } from "../lib/audio";
import { getWord, type WordId } from "../data/words";
import { lettersForWord, shuffle, type GameLetter } from "../lib/wordGame";

/**
 * Mini-jeu facultatif « Jouer avec le mot ».
 *
 * Basile replace les lettres mobiles pour reconstituer le mot.
 *  - Mode découverte (défaut) : modèle visible, emplacements guidés (lettre
 *    fantôme), lettres dans l'ordre, bouton Aide.
 *  - Mode défi doux : lettres mélangées, modèle masqué (visible sur demande),
 *    emplacements neutres, recommencer à volonté.
 *
 * Aucune pénalité, aucun chronomètre. Toucher une lettre lit son NOM ; le mot
 * complet n'est jamais épelé lettre à lettre.
 */

type Mode = "decouverte" | "defi";

interface Board {
  slots: (string | null)[];
  pool: string[];
}

interface DragInfo {
  tileId: string;
  from: "pool" | number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  moved: boolean;
  pointerId: number;
}

interface Props {
  word: WordId;
  onClose: () => void;
}

export function WordPlayground({ word, onClose }: Props) {
  const entry = getWord(word);
  const letters = useMemo<GameLetter[]>(() => lettersForWord(word), [word]);
  const byId = useMemo(() => {
    const map: Record<string, GameLetter> = {};
    for (const l of letters) map[l.id] = l;
    return map;
  }, [letters]);
  const target = useMemo(() => letters.map((l) => l.char), [letters]);

  const buildBoard = useCallback(
    (mode: Mode): Board => {
      const ids = letters.map((l) => l.id);
      return {
        slots: Array(ids.length).fill(null) as (string | null)[],
        pool: mode === "defi" ? shuffle(ids) : ids,
      };
    },
    [letters],
  );

  const [mode, setMode] = useState<Mode>("decouverte");
  const [board, setBoard] = useState<Board>(() => buildBoard("decouverte"));
  const [selected, setSelected] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [showModel, setShowModel] = useState(true);
  const [dragPos, setDragPos] = useState<{ tileId: string; x: number; y: number; moved: boolean } | null>(
    null,
  );

  const dragRef = useRef<DragInfo | null>(null);
  const modelTimer = useRef<number | null>(null);

  // (Ré)initialise le plateau quand le mot ou le mode change.
  useEffect(() => {
    setBoard(buildBoard(mode));
    setSelected(null);
    setSolved(false);
    setShowModel(mode === "decouverte");
  }, [buildBoard, mode]);

  // Prononce le mot complet à l'ouverture (jamais lettre à lettre).
  useEffect(() => {
    playVoice(entry.voice);
  }, [entry.voice]);

  useEffect(() => {
    return () => {
      if (modelTimer.current !== null) window.clearTimeout(modelTimer.current);
    };
  }, []);

  const correct = useMemo(
    () =>
      board.slots.length > 0 &&
      board.slots.every((id, i) => id !== null && byId[id].char === target[i]),
    [board.slots, byId, target],
  );

  // Réussite : animation + mot complet prononcé.
  useEffect(() => {
    if (correct && !solved) {
      setSolved(true);
      setSelected(null);
      playVoice(entry.voice);
    }
  }, [correct, solved, entry.voice]);

  const playLetter = useCallback(
    (tileId: string) => {
      const base = byId[tileId]?.base;
      if (base) playVoice(`lettre-${base}`);
    },
    [byId],
  );

  const placeInSlot = useCallback((slot: number, tileId: string) => {
    setBoard((b) => {
      const slots = [...b.slots];
      let pool = b.pool.filter((id) => id !== tileId);
      const fromSlot = slots.indexOf(tileId);
      if (fromSlot >= 0) slots[fromSlot] = null;
      const occupant = slots[slot];
      if (occupant) pool = [...pool, occupant];
      slots[slot] = tileId;
      return { slots, pool };
    });
    setSelected(null);
    playSfx("emboite", 0.3);
  }, []);

  const pickUp = useCallback((tileId: string) => {
    setBoard((b) => {
      const slots = [...b.slots];
      const fromSlot = slots.indexOf(tileId);
      if (fromSlot >= 0) slots[fromSlot] = null;
      const pool = b.pool.includes(tileId) ? b.pool : [...b.pool, tileId];
      return { slots, pool };
    });
  }, []);

  const reset = useCallback(() => {
    setBoard(buildBoard(mode));
    setSelected(null);
    setSolved(false);
    setShowModel(mode === "decouverte");
  }, [buildBoard, mode]);

  /** Aide (mode découverte) : replace la prochaine lettre attendue. */
  const giveHint = useCallback(() => {
    setBoard((b) => {
      const slots = [...b.slots];
      let pool = [...b.pool];
      for (let i = 0; i < slots.length; i++) {
        const cur = slots[i];
        if (cur && byId[cur].char === target[i]) continue;
        let candidate = pool.find((id) => byId[id].char === target[i]);
        if (!candidate) {
          for (let j = 0; j < slots.length; j++) {
            const id = slots[j];
            if (id && j !== i && byId[id].char === target[i]) {
              candidate = id;
              slots[j] = null;
              break;
            }
          }
        }
        if (candidate) {
          if (cur) pool = [...pool, cur];
          pool = pool.filter((id) => id !== candidate);
          slots[i] = candidate;
        }
        break;
      }
      return { slots, pool };
    });
    setSelected(null);
    playSfx("emboite", 0.3);
  }, [byId, target]);

  const revealModel = useCallback(() => {
    setShowModel(true);
    if (modelTimer.current !== null) window.clearTimeout(modelTimer.current);
    modelTimer.current = window.setTimeout(() => setShowModel(false), 2600);
  }, []);

  /* ---------- Toucher / glisser une lettre ---------- */

  const onTileDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>, tileId: string, from: "pool" | number) => {
      if (solved) return;
      e.stopPropagation();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* capture non supportée */
      }
      dragRef.current = {
        tileId,
        from,
        startX: e.clientX,
        startY: e.clientY,
        x: e.clientX,
        y: e.clientY,
        moved: false,
        pointerId: e.pointerId,
      };
      setDragPos({ tileId, x: e.clientX, y: e.clientY, moved: false });
    },
    [solved],
  );

  const onTileMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    d.x = e.clientX;
    d.y = e.clientY;
    if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 8) d.moved = true;
    setDragPos({ tileId: d.tileId, x: d.x, y: d.y, moved: d.moved });
  }, []);

  const onTileUp = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d || d.pointerId !== e.pointerId) return;
      dragRef.current = null;
      setDragPos(null);

      if (d.moved) {
        // Glisser-déposer : dépôt sur un emplacement, sinon retour au pool.
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const slotEl = el?.closest("[data-slot]") as HTMLElement | null;
        if (slotEl) placeInSlot(Number(slotEl.dataset.slot), d.tileId);
        else pickUp(d.tileId);
        return;
      }

      // Simple toucher.
      if (d.from === "pool") {
        playLetter(d.tileId);
        setSelected((cur) => (cur === d.tileId ? null : d.tileId));
      } else if (selected) {
        placeInSlot(d.from, selected);
      } else {
        pickUp(d.tileId);
        setSelected(d.tileId);
        playLetter(d.tileId);
      }
    },
    [placeInSlot, pickUp, playLetter, selected],
  );

  const onSlotClick = useCallback(
    (i: number) => {
      if (solved || !selected) return;
      placeInSlot(i, selected);
    },
    [solved, selected, placeInSlot],
  );

  const tileVmin = Math.max(8, Math.min(12, 84 / Math.max(letters.length, 3)));

  const tileButton = (tileId: string, from: "pool" | number) => {
    const letter = byId[tileId];
    return (
      <button
        key={tileId}
        type="button"
        className={`wordplay__tile ${selected === tileId ? "is-selected" : ""} ${
          dragPos?.tileId === tileId ? "is-dragging" : ""
        }`}
        aria-label={`Lettre ${letter.char}`}
        onPointerDown={(e) => onTileDown(e, tileId, from)}
        onPointerMove={onTileMove}
        onPointerUp={onTileUp}
        onPointerCancel={onTileUp}
        onClick={(e) => e.stopPropagation()}
      >
        {letter.char}
      </button>
    );
  };

  return (
    <div
      className={`wordplay ${solved ? "is-solved" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Jouer avec le mot ${entry.label}`}
      style={{ "--wg-tile": `${tileVmin}vmin` } as React.CSSProperties}
      onClick={(e) => e.stopPropagation()}
    >
      <header className="wordplay__topbar">
        <button type="button" className="btn btn--icon" onClick={onClose} aria-label="Quitter le jeu">
          ⬅️
        </button>
        <h2 className="wordplay__title">Joue avec le mot</h2>
        <div className="wordplay__modes" role="group" aria-label="Mode de jeu">
          <button
            type="button"
            className={`wordplay__mode ${mode === "decouverte" ? "is-active" : ""}`}
            onClick={() => setMode("decouverte")}
            aria-pressed={mode === "decouverte"}
          >
            Découverte
          </button>
          <button
            type="button"
            className={`wordplay__mode ${mode === "defi" ? "is-active" : ""}`}
            onClick={() => setMode("defi")}
            aria-pressed={mode === "defi"}
          >
            Défi doux
          </button>
        </div>
      </header>

      <div className={`wordplay__model ${showModel ? "is-visible" : ""}`} aria-hidden={!showModel}>
        {Array.from(entry.label).map((c, i) => (
          <span key={i} className="wordplay__model-letter">
            {c}
          </span>
        ))}
      </div>

      <div className="wordplay__board">
        <div className="wordplay__slots" role="group" aria-label="Emplacements">
          {board.slots.map((tileId, i) => {
            const isGuided = mode === "decouverte" && !tileId;
            return (
              <div
                key={i}
                data-slot={i}
                role="button"
                tabIndex={0}
                className={`wordplay__slot ${tileId ? "is-filled" : ""} ${
                  isGuided ? "is-guided" : ""
                } ${selected && !tileId ? "is-ready" : ""}`}
                onClick={() => onSlotClick(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSlotClick(i);
                  }
                }}
                aria-label={
                  tileId
                    ? `Emplacement ${i + 1}, lettre ${byId[tileId].char}`
                    : `Emplacement ${i + 1}, vide`
                }
              >
                {tileId ? (
                  tileButton(tileId, i)
                ) : (
                  <span className="wordplay__ghost" aria-hidden="true">
                    {isGuided ? target[i] : ""}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="wordplay__pool" role="group" aria-label="Lettres disponibles">
          {board.pool.map((tileId) => tileButton(tileId, "pool"))}
        </div>
      </div>

      <footer className="wordplay__actions">
        <button type="button" className="btn btn--sound" onClick={() => playVoice(entry.voice)}>
          🔊 Écouter le mot
        </button>
        {mode === "decouverte" ? (
          <button type="button" className="btn btn--ghost" onClick={giveHint}>
            💡 Aide
          </button>
        ) : (
          <button type="button" className="btn btn--ghost" onClick={revealModel}>
            👀 Voir le mot
          </button>
        )}
        <button type="button" className="btn btn--ghost" onClick={reset}>
          🔁 Recommencer
        </button>
        <button type="button" className="btn btn--play" onClick={onClose}>
          ✅ Terminer
        </button>
      </footer>

      {solved && (
        <div className="wordplay__win" role="status">
          <span className="wordplay__win-emoji" aria-hidden="true">
            🌟
          </span>
          <span>Bravo ! {entry.label} !</span>
        </div>
      )}

      {dragPos?.moved && (
        <span
          className="wordplay__drag-ghost"
          style={{ left: dragPos.x, top: dragPos.y }}
          aria-hidden="true"
        >
          {byId[dragPos.tileId].char}
        </span>
      )}
    </div>
  );
}
