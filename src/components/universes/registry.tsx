import type { ComponentType, ReactNode } from "react";
import type { UniverseId } from "../../data/universes";
import type { BoardProps } from "../boards/types";
import { PirateBoard } from "../boards/PirateBoard";
import { DragonBoard } from "../boards/DragonBoard";
import { JurassicBoard } from "../boards/JurassicBoard";
import { RacingBoard } from "../boards/RacingBoard";
import { CreatureBoard } from "../boards/CreatureBoard";
import { WorkshopBoard } from "../boards/WorkshopBoard";
import { RescueBoard } from "../boards/RescueBoard";
import { HeroBoard } from "../boards/HeroBoard";
import { PirateScene } from "../scenes/PirateScene";
import { DragonScene } from "../scenes/DragonScene";
import { JurassicScene } from "../scenes/JurassicScene";
import { RacingScene } from "../scenes/RacingScene";
import { CreatureScene } from "../scenes/CreatureScene";
import { WorkshopScene } from "../scenes/WorkshopScene";
import { RescueScene } from "../scenes/RescueScene";
import { HeroScene } from "../scenes/HeroScene";

interface UniverseView {
  Scene: ComponentType<{ children: ReactNode }>;
  Board: ComponentType<BoardProps>;
}

/**
 * Association décor + plateau pour chaque univers.
 * Ajouter un univers = ajouter une entrée ici (+ décor et plateau).
 */
export const UNIVERSE_VIEWS: Record<UniverseId, UniverseView> = {
  pirates: { Scene: PirateScene, Board: PirateBoard },
  dragons: { Scene: DragonScene, Board: DragonBoard },
  jurassic: { Scene: JurassicScene, Board: JurassicBoard },
  racing: { Scene: RacingScene, Board: RacingBoard },
  creatures: { Scene: CreatureScene, Board: CreatureBoard },
  workshop: { Scene: WorkshopScene, Board: WorkshopBoard },
  rescue: { Scene: RescueScene, Board: RescueBoard },
  hero: { Scene: HeroScene, Board: HeroBoard },
};
