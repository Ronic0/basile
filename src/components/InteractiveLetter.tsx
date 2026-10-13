import { useCallback, useEffect, useRef, useState } from "react";
import { playVoice } from "../lib/audio";
import type { LetterToy } from "../data/letters";

/**
 * Lettre-jouet interactive : grosse typographie, animation de repos, réaction
 * au toucher, son du nom de la lettre, déplacement tactile avec retour doux à
 * la position de repos. Aucun score, aucun échec, pas de questionnaire.
 *
 * Pointer Events uniquement (souris + tactile iPad), un seul audio à la fois.
 */

const REACTIONS = ["jump", "wobble", "spin"] as const;
type Reaction = (typeof REACTIONS)[number];

interface Props {
  letter: LetterToy;
  /** Position de repos dans le conteneur parent, en pourcentage. */
  x: number;
  y: number;
  /** Taille CSS (largeur = hauteur), par défaut adaptée à l'iPad. */
  size?: string;
  /** Déplacement tactile autorisé. */
  draggable?: boolean;
  /** Change de valeur pour forcer un retour immédiat à la position de repos. */
  resetKey?: number;
  /** Réaction du décor (dragon, etc.) déclenchée à chaque toucher. */
  onInteract?: () => void;
  className?: string;
}

interface DragState {
  id: number;
  sx: number;
  sy: number;
  ox: number;
  oy: number;
  moved: boolean;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export function InteractiveLetter({
  letter,
  x,
  y,
  size = "22vmin",
  draggable = true,
  resetKey = 0,
  onInteract,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const drag = useRef<DragState | null>(null);
  const reactTimer = useRef<number | null>(null);
  const phaseTimer = useRef<number | null>(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState<"idle" | "dragging" | "returning">("idle");
  const [reaction, setReaction] = useState<{ kind: Reaction; n: number } | null>(null);

  // Retour immédiat si le parent le demande (changement de lettre, etc.).
  useEffect(() => {
    setOffset({ x: 0, y: 0 });
    setPhase("idle");
  }, [resetKey]);

  useEffect(() => {
    return () => {
      if (reactTimer.current !== null) window.clearTimeout(reactTimer.current);
      if (phaseTimer.current !== null) window.clearTimeout(phaseTimer.current);
    };
  }, []);

  const speak = useCallback(() => {
    // Le nom de la lettre (jamais le mot complet) ; une seule voix à la fois.
    playVoice(letter.audio);
  }, [letter.audio]);

  const doReact = useCallback(() => {
    const kind = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
    setReaction((r) => ({ kind, n: (r?.n ?? 0) + 1 }));
    if (reactTimer.current !== null) window.clearTimeout(reactTimer.current);
    reactTimer.current = window.setTimeout(() => setReaction(null), 720);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      const el = ref.current;
      if (!el) return;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* capture non supportée : le geste reste local */
      }
      const rect = el.getBoundingClientRect();
      const parent = el.offsetParent as HTMLElement | null;
      const pr = parent?.getBoundingClientRect();
      // Rectangle de repos (offset retiré) + bornes pour ne pas sortir du parent.
      const bounds = pr
        ? {
            minX: pr.left - (rect.left - offset.x),
            maxX: pr.right - (rect.right - offset.x),
            minY: pr.top - (rect.top - offset.y),
            maxY: pr.bottom - (rect.bottom - offset.y),
          }
        : { minX: 0, maxX: 0, minY: 0, maxY: 0 };

      drag.current = {
        id: e.pointerId,
        sx: e.clientX,
        sy: e.clientY,
        ox: offset.x,
        oy: offset.y,
        moved: false,
        bounds,
      };
      setPhase("dragging");

      // Toucher : réaction + audio une seule fois.
      speak();
      doReact();
      onInteract?.();
    },
    [offset.x, offset.y, speak, doReact, onInteract],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (!d || d.id !== e.pointerId) return;
      const dx = e.clientX - d.sx;
      const dy = e.clientY - d.sy;
      if (!d.moved && Math.hypot(dx, dy) > 6) d.moved = true;
      if (!draggable) return;
      const nx = Math.max(d.bounds.minX, Math.min(d.bounds.maxX, d.ox + dx));
      const ny = Math.max(d.bounds.minY, Math.min(d.bounds.maxY, d.oy + dy));
      setOffset({ x: nx, y: ny });
    },
    [draggable],
  );

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    try {
      ref.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    drag.current = null;
    const wasTap = !d.moved;

    // Un simple toucher : on laisse la réaction se terminer (pas de coupe).
    if (!wasTap) {
      setReaction(null);
      if (reactTimer.current !== null) window.clearTimeout(reactTimer.current);
    }

    // Retour doux vers la position de repos (atterrissage).
    setPhase("returning");
    setOffset({ x: 0, y: 0 });
    if (phaseTimer.current !== null) window.clearTimeout(phaseTimer.current);
    phaseTimer.current = window.setTimeout(() => setPhase("idle"), 520);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      speak();
      doReact();
      onInteract?.();
    },
    [speak, doReact, onInteract],
  );

  const bodyClass = ["interactive-letter__body"];
  if (reaction) bodyClass.push(`is-react-${reaction.kind}`);
  else if (phase === "returning") bodyClass.push("is-landing");
  else if (phase === "idle") bodyClass.push("is-idle");

  const classes = [
    "interactive-letter",
    `interactive-letter--${letter.char.toLowerCase()}`,
    phase === "dragging" ? "is-dragging" : "",
    phase === "returning" ? "is-returning" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={classes}
      role="button"
      tabIndex={0}
      aria-label={`Lettre ${letter.char}, se prononce « ${letter.name} »`}
      style={
        {
          left: `${x}%`,
          top: `${y}%`,
          "--iletter-size": size,
          "--dx": `${offset.x}px`,
          "--dy": `${offset.y}px`,
        } as React.CSSProperties
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
    >
      <div key={reaction ? `r${reaction.n}` : phase} className={bodyClass.join(" ")}>
        <span
          className="interactive-letter__glyph"
          style={{ color: letter.color, textShadow: `0 0.6vmin 0 ${letter.colorDark}` }}
        >
          {letter.char}
        </span>
      </div>
    </div>
  );
}
