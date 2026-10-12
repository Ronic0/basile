import { useState, type CSSProperties } from "react";

export type BasileVariant = "hero" | "guide" | "sidekick" | "reward";
export type BasileMood = "idle" | "happy" | "celebrate";
export type BasilePosition =
  | "inline"
  | "center"
  | "bottom-left"
  | "bottom-right"
  | "top-right";

interface Props {
  /** Rôle visuel (taille + comportement par défaut). */
  variant?: BasileVariant;
  /** Humeur animée. */
  mood?: BasileMood;
  /** Active les animations (idle / célébration). */
  animated?: boolean;
  /** Taille CSS explicite, ex. "30vmin". Prioritaire sur la variante. */
  size?: string;
  /** Placement automatique dans l'écran. */
  position?: BasilePosition;
  /** Force/retire les étoiles et halos. */
  showEffects?: boolean;
  className?: string;
  alt?: string;
}

const EFFECTS = ["✨", "⭐", "🌟", "💫", "✨"];

const SRC = `${import.meta.env.BASE_URL}assets/basile/basile.png`;

/**
 * Mascotte Basile, réutilisable sur tous les écrans.
 * Si l'image est absente, le composant ne rend rien (aucun crash).
 * Toujours `pointer-events: none` pour ne jamais gêner les interactions.
 */
export function BasileMascot({
  variant = "sidekick",
  mood = "idle",
  animated = true,
  size,
  position,
  showEffects,
  className = "",
  alt = "Basile",
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  const classes = ["basile", `basile--${variant}`, `basile--mood-${mood}`];
  if (animated) classes.push("is-animated");
  if (position) classes.push(`basile--pos-${position}`);
  if (className) classes.push(className);

  const style = size
    ? ({ "--basile-size": size } as CSSProperties)
    : undefined;

  const effectsOn =
    showEffects ?? (variant === "reward" || mood === "celebrate");

  return (
    <div className={classes.join(" ")} style={style} aria-hidden={alt === ""}>
      {effectsOn && (
        <div className="basile__effects">
          {EFFECTS.map((glyph, i) => (
            <span key={i} className={`basile__effect basile__effect--${i + 1}`}>
              {glyph}
            </span>
          ))}
        </div>
      )}

      <div className="basile__body">
        <div className="basile__halo" />
        <img
          className="basile__img"
          src={SRC}
          alt={alt}
          draggable={false}
          onError={() => {
            console.warn("[basile] image absente :", SRC);
            setFailed(true);
          }}
        />
      </div>

      <div className="basile__shadow" />
    </div>
  );
}
