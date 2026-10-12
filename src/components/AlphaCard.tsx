import { useState } from "react";
import type { Alpha } from "../data/alphas";

type CardState = "idle" | "correct" | "wrong" | "dim";

interface Props {
  alpha: Alpha;
  onPick?: () => void;
  state?: CardState;
  disabled?: boolean;
  showName?: boolean;
}

export function AlphaCard({
  alpha,
  onPick,
  state = "idle",
  disabled = false,
  showName = false,
}: Props) {
  const sources = [alpha.image, alpha.imageFallback];
  const [srcIndex, setSrcIndex] = useState(0);
  const failed = srcIndex >= sources.length;

  const classes = ["alpha-card", `is-${state}`];
  if (disabled) classes.push("is-disabled");

  return (
    <button
      type="button"
      className={classes.join(" ")}
      onClick={onPick}
      disabled={disabled}
      style={
        {
          "--alpha-color": alpha.color,
          "--alpha-color-dark": alpha.colorDark,
        } as React.CSSProperties
      }
      aria-label={alpha.name}
    >
      <div className="alpha-card__frame">
        {!failed ? (
          <img
            className="alpha-card__img"
            src={sources[srcIndex]}
            alt={alpha.name}
            draggable={false}
            onError={() => setSrcIndex((i) => i + 1)}
          />
        ) : (
          <div className="alpha-card__placeholder">
            <span className="alpha-card__placeholder-icon" aria-hidden="true">
              🖼️
            </span>
            <span className="alpha-card__placeholder-name">{alpha.name}</span>
            <span className="alpha-card__placeholder-tag">image à venir</span>
          </div>
        )}
      </div>
      {showName && <span className="alpha-card__name">{alpha.name}</span>}
      <span className="alpha-card__badge" aria-hidden="true">
        {state === "correct" ? "✅" : state === "wrong" ? "🤔" : ""}
      </span>
    </button>
  );
}
