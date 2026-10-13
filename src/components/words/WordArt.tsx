/**
 * Illustration d'un mot du catalogue, en réutilisant les SVG déjà présents
 * dans le jeu (trésors, plantes, objets construits, icônes de la nurserie).
 * Les éléments de la Cabane (non exportés comme composants) ont ici une
 * illustration vectorielle dédiée, sans toucher à l'écran « Ma Cabane ».
 */
import type { ReactNode } from "react";
import type { WordId } from "../../data/words";
import { getBuildable, OBJECT_COLORS } from "../../data/buildables";
import { TreasureIcon } from "../pirates/TreasureIcon";
import { SeedPreview } from "../jardin/GardenIcons";
import { BuildableArt } from "../atelier/BuildableArt";
import { AppleIcon, BallIcon, FishIcon, WaterIcon } from "../nurserie/NurseryIcons";
import { BabyDragon } from "../nurserie/BabyDragon";

export function WordArt({ id }: { id: WordId }): ReactNode {
  switch (id) {
    // Port des Pirates
    case "piece":
    case "coquillage":
    case "rubis":
    case "emeraude":
    case "perle":
    case "carte":
      return <TreasureIcon id={id} />;

    // Jardin magique (le fraisier donne une FRAISE)
    case "tournesol":
      return <SeedPreview type="tournesol" />;
    case "fraise":
      return <SeedPreview type="fraisier" />;
    case "carotte":
      return <SeedPreview type="carotte" />;

    // Atelier de construction
    case "voiture":
    case "robot":
    case "fusee": {
      const placed = new Set(getBuildable(id).parts.map((p) => p.id));
      return <BuildableArt type={id} color={OBJECT_COLORS[0]} placed={placed} />;
    }

    // Nurserie des dragons
    case "dragon":
      return <BabyDragon state="idle" />;
    case "pomme":
      return <AppleIcon />;
    case "poisson":
      return <FishIcon />;
    case "eau":
      return <WaterIcon />;
    case "balle":
      return <BallIcon />;

    // Ma Cabane
    case "lampe":
      return <LampArt />;
    case "coffre":
      return <ChestArt />;
    case "tapis":
      return <RugArt />;
    case "fenetre":
      return <WindowArt />;

    default:
      return null;
  }
}

/* ---------- Illustrations Ma Cabane ---------- */

function LampArt() {
  return (
    <svg viewBox="0 0 60 90" aria-hidden="true">
      <path d="M30 0 v34" stroke="#5a3a2a" strokeWidth="4" />
      <path d="M12 34 h36 l-8 22 h-20 z" fill="#e0a72a" />
      <path d="M12 34 h36 l-2 6 h-32 z" fill="#ffd34d" />
      <circle cx="30" cy="62" r="8" fill="#fff3b0" />
      <path d="M20 70 h20 l-3 8 h-14 z" fill="#c48a12" />
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
    </svg>
  );
}

function RugArt() {
  return (
    <svg viewBox="0 0 120 70" aria-hidden="true">
      <rect x="6" y="14" width="108" height="42" rx="8" fill="#3a7fbf" />
      <rect x="14" y="22" width="92" height="26" rx="6" fill="#bcd8ea" />
      <path d="M14 35 h92" stroke="#2c639a" strokeWidth="3" />
      <g stroke="#2c639a" strokeWidth="2">
        <path d="M6 18 v34 M114 18 v34" />
      </g>
    </svg>
  );
}

function WindowArt() {
  return (
    <svg viewBox="0 0 140 130" aria-hidden="true">
      <rect x="6" y="6" width="128" height="118" rx="8" fill="#b5763c" />
      <rect x="14" y="14" width="112" height="102" rx="4" fill="#8ad0ff" />
      <circle cx="96" cy="40" r="14" fill="#ffe28a" />
      <ellipse cx="44" cy="46" rx="20" ry="10" fill="#ffffff" />
      <ellipse cx="60" cy="58" rx="14" ry="8" fill="#ffffff" />
      <path d="M14 92 q30 -14 56 0 q30 14 56 0 v24 h-112 z" fill="#5aa64a" />
      <path d="M70 14 V116 M14 64 H126" stroke="#b5763c" strokeWidth="5" />
    </svg>
  );
}
