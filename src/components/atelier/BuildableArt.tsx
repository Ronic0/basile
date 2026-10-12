import type { ReactNode } from "react";
import { getBuildable, type BuildableId } from "../../data/buildables";

/** Rendu SVG (coordonnées absolues 0..200) d'une pièce. */
export function renderBuildPart(type: BuildableId, partId: string): ReactNode {
  const key = `${type}:${partId}`;
  switch (key) {
    // ---------- Voiture ----------
    case "voiture:aileron":
      return (
        <g>
          <rect className="atelier-dark" x="46" y="96" width="7" height="20" rx="3" />
          <path className="atelier-color" d="M30 88 q4 -8 12 -8 h38 q8 0 10 8 q-30 6 -60 0 z" />
        </g>
      );
    case "voiture:carrosserie":
      return (
        <g>
          <path
            className="atelier-color"
            d="M64 114 v-16 q2 -10 14 -10 h54 q12 0 18 12 l10 14 z"
          />
          <path className="atelier-glass" d="M86 104 q4 -8 12 -8 h18 v8 z" />
          <path className="atelier-glass" d="M124 96 h12 q8 1 12 8 h-24 z" />
        </g>
      );
    case "voiture:chassis":
      return (
        <g>
          <rect className="atelier-dark" x="34" y="112" width="136" height="28" rx="10" />
          <rect className="atelier-metal" x="160" y="118" width="10" height="10" rx="3" />
          <circle className="atelier-accent" cx="48" cy="126" r="4" />
        </g>
      );
    case "voiture:roues":
      return (
        <g>
          <g className="atelier-spin">
            <circle className="atelier-rubber" cx="72" cy="142" r="22" />
            <circle className="atelier-hub" cx="72" cy="142" r="9" />
            <rect className="atelier-hub" x="70.5" y="124" width="3" height="36" />
            <rect className="atelier-hub" x="54" y="140.5" width="36" height="3" />
          </g>
          <g className="atelier-spin">
            <circle className="atelier-rubber" cx="142" cy="142" r="22" />
            <circle className="atelier-hub" cx="142" cy="142" r="9" />
            <rect className="atelier-hub" x="140.5" y="124" width="3" height="36" />
            <rect className="atelier-hub" x="124" y="140.5" width="36" height="3" />
          </g>
        </g>
      );

    // ---------- Robot ----------
    case "robot:jambes":
      return (
        <g>
          <rect className="atelier-color" x="76" y="130" width="18" height="46" rx="7" />
          <rect className="atelier-color" x="106" y="130" width="18" height="46" rx="7" />
          <ellipse className="atelier-dark" cx="85" cy="178" rx="13" ry="7" />
          <ellipse className="atelier-dark" cx="115" cy="178" rx="13" ry="7" />
        </g>
      );
    case "robot:corps":
      return (
        <g>
          <rect className="atelier-color" x="66" y="80" width="68" height="54" rx="14" />
          <rect className="atelier-glass" x="82" y="94" width="36" height="28" rx="8" />
          <circle className="atelier-accent" cx="100" cy="108" r="5" />
          <rect className="atelier-accent" x="76" y="86" width="10" height="5" rx="2" />
          <rect className="atelier-accent" x="114" y="86" width="10" height="5" rx="2" />
        </g>
      );
    case "robot:bras":
      return (
        <g>
          <rect className="atelier-color atelier-arm" x="40" y="84" width="20" height="48" rx="9" />
          <circle className="atelier-dark atelier-arm" cx="50" cy="136" r="11" />
          <rect className="atelier-color atelier-arm" x="140" y="84" width="20" height="48" rx="9" />
          <circle className="atelier-dark atelier-arm" cx="150" cy="136" r="11" />
        </g>
      );
    case "robot:tete":
      return (
        <g>
          <rect className="atelier-dark" x="98" y="20" width="4" height="18" />
          <circle className="atelier-accent" cx="100" cy="18" r="7" />
          <rect className="atelier-color" x="76" y="34" width="48" height="46" rx="13" />
          <rect className="atelier-glass" x="84" y="44" width="32" height="26" rx="9" />
          <circle className="atelier-shine" cx="92" cy="54" r="4.5" />
          <circle className="atelier-shine" cx="108" cy="54" r="4.5" />
          <circle className="atelier-dark" cx="93" cy="55" r="2.2" />
          <circle className="atelier-dark" cx="107" cy="55" r="2.2" />
          <path className="atelier-mouth" d="M92 64 q8 5 16 0" />
        </g>
      );

    // ---------- Fusée ----------
    case "fusee:nez":
      return (
        <g>
          <path className="atelier-color" d="M100 14 q18 20 18 44 h-36 q0 -24 18 -44 z" />
          <path className="atelier-shine" d="M96 30 q4 -8 4 -14 q-8 10 -8 22 h4 z" />
        </g>
      );
    case "fusee:corps":
      return (
        <g>
          <rect className="atelier-color" x="80" y="56" width="40" height="80" rx="9" />
          <circle className="atelier-glass" cx="100" cy="86" r="13" />
          <circle className="atelier-shine" cx="95" cy="81" r="4" />
          <rect className="atelier-accent" x="80" y="112" width="40" height="9" />
        </g>
      );
    case "fusee:ailes":
      return (
        <g>
          <path className="atelier-color" d="M80 106 L52 154 Q70 148 80 138 z" />
          <path className="atelier-color" d="M120 106 L148 154 Q130 148 120 138 z" />
        </g>
      );
    case "fusee:moteur":
      return (
        <g>
          <path className="atelier-metal" d="M84 132 h32 l-6 22 h-20 z" />
          <g className="atelier-flame">
            <path className="atelier-flame__outer" d="M92 154 q8 20 8 30 q0 -10 8 -30 q-8 6 -16 0 z" />
            <path className="atelier-flame__inner" d="M96 156 q4 12 4 20 q0 -8 4 -20 q-4 3 -8 0 z" />
          </g>
        </g>
      );
    default:
      return null;
  }
}

interface ArtProps {
  type: BuildableId;
  color?: string;
  placed?: Set<string>;
  ghost?: boolean;
  animate?: boolean;
  className?: string;
}

export function BuildableArt({ type, color, placed, ghost = false, animate = false, className = "" }: ArtProps) {
  const buildable = getBuildable(type);
  const renderIds = ghost
    ? buildable.parts.map((p) => p.id)
    : buildable.parts.filter((p) => placed?.has(p.id)).map((p) => p.id);

  const classes = ["buildable-art", `buildable-art--${type}`];
  if (ghost) classes.push("is-ghost");
  if (animate) classes.push("is-animate");
  if (className) classes.push(className);

  return (
    <svg
      className={classes.join(" ")}
      viewBox="0 0 200 200"
      style={color ? ({ "--obj-color": color } as React.CSSProperties) : undefined}
    >
      {renderIds.map((id) => (
        <g key={id} className="buildable-part" data-part={id}>
          {renderBuildPart(type, id)}
        </g>
      ))}
    </svg>
  );
}

/** Icône isolée d'une pièce (recadrée sur sa zone). */
export function PartIcon({ type, partId, color }: { type: BuildableId; partId: string; color?: string }) {
  const part = getBuildable(type).parts.find((p) => p.id === partId);
  const z = part?.zone ?? { x: 0, y: 0, w: 200, h: 200 };
  const pad = 26;
  const viewBox = `${z.x * 2 - pad} ${z.y * 2 - pad} ${z.w * 2 + pad * 2} ${z.h * 2 + pad * 2}`;
  return (
    <svg
      className="part-icon"
      viewBox={viewBox}
      style={color ? ({ "--obj-color": color } as React.CSSProperties) : undefined}
    >
      <g className="buildable-part">{renderBuildPart(type, partId)}</g>
    </svg>
  );
}
