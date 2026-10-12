import { useCallback, useEffect, useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { UniverseScreen } from "./components/UniverseScreen";
import { DiscoveryScreen } from "./components/DiscoveryScreen";
import { GameScreen, type SessionResult } from "./components/GameScreen";
import { RewardScreen } from "./components/RewardScreen";
import { ParentScreen } from "./components/ParentScreen";
import { BossScreen } from "./components/BossScreen";
import { NurserieScreen } from "./components/NurserieScreen";
import { JardinMagiqueScreen } from "./components/JardinMagiqueScreen";
import { AtelierScreen } from "./components/AtelierScreen";
import { PiratesScreen } from "./components/PiratesScreen";
import { CabaneScreen } from "./components/CabaneScreen";
import { AlbumScreen } from "./components/AlbumScreen";
import { BASILE_ALPHAS, BASILE_ALPHA_IDS, type Alpha } from "./data/alphas";
import type { ActivityId } from "./data/activities";
import { getUniverse, type UniverseId } from "./data/universes";
import { playVoice, primeAudio } from "./lib/audio";
import {
  loadStats,
  resetStats,
  saveStats,
  type AideBoss,
  type DifficulteMode,
  type Stats,
} from "./lib/storage";
import {
  markDiscovered,
  moveInOrder,
  nextToDiscover,
  playableAlphas,
  resetPedagogy,
  setActive,
  unlockAlpha,
} from "./lib/catalogue";
import { markExplored, saveLastActivity } from "./lib/collection";

type Screen =
  | "home"
  | "discovery"
  | "universes"
  | "game"
  | "reward"
  | "parent"
  | "boss"
  | "nurserie"
  | "jardin-magique"
  | "atelier"
  | "pirates"
  | "cabane"
  | "album";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [universeId, setUniverseId] = useState<UniverseId>("pirates");
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [lastResult, setLastResult] = useState({ bonnes: 0, erreurs: 0 });
  const [discoveryTarget, setDiscoveryTarget] = useState<Alpha | null>(null);

  const universe = getUniverse(universeId);

  const playable = playableAlphas(stats);
  // Toujours au moins deux propositions pour pouvoir jouer.
  const gamePool = playable.length >= 2 ? playable : BASILE_ALPHAS;

  useEffect(() => {
    const unlock = () => primeAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const goPlay = useCallback(() => {
    const target = nextToDiscover(stats);
    if (target) {
      setDiscoveryTarget(target);
      setScreen("discovery");
    } else {
      playVoice("bien-joue");
      setScreen("universes");
    }
  }, [stats]);

  /**
   * Portail « Le Monde de Basile ».
   * Le Jardin des Alphas ouvre le moteur pédagogique existant ; les autres
   * activités seront branchées ici au fil des étapes.
   */
  const selectActivity = useCallback(
    (id: ActivityId) => {
      saveLastActivity(id);
      switch (id) {
        case "jardin-alphas":
          goPlay();
          break;
        case "nurserie":
          setScreen("nurserie");
          break;
        case "jardin-magique":
          setScreen("jardin-magique");
          break;
        case "atelier":
          setScreen("atelier");
          break;
        case "port-pirates":
          setScreen("pirates");
          break;
        case "cabane":
          setScreen("cabane");
          break;
        default:
          break;
      }
    },
    [goPlay],
  );

  const finishDiscovery = useCallback(() => {
    if (discoveryTarget) {
      setStats((prev) => {
        const next = markDiscovered(prev, discoveryTarget.id);
        saveStats(next);
        return next;
      });
    }
    setDiscoveryTarget(null);
    setScreen("universes");
  }, [discoveryTarget]);

  const selectUniverse = useCallback((id: UniverseId) => {
    setUniverseId(id);
    markExplored(id);
    setScreen("game");
  }, []);

  const finishSession = useCallback(
    (result: SessionResult) => {
      setLastResult({ bonnes: result.bonnes, erreurs: result.erreurs });
      setStats((prev) => {
        const maitrise = { ...prev.maitrise };
        for (const [id, value] of Object.entries(result.maitrise)) {
          maitrise[id] = Math.max(maitrise[id] ?? 0, value);
        }
        const confusions = { ...prev.confusions };
        for (const [key, value] of Object.entries(result.confusions)) {
          confusions[key] = (confusions[key] ?? 0) + value;
        }
        const next: Stats = {
          ...prev,
          parties: prev.parties + 1,
          bonnes: prev.bonnes + result.bonnes,
          erreurs: prev.erreurs + result.erreurs,
          bonnesSansAide: prev.bonnesSansAide + result.sansAide,
          bonnesAvecAide: prev.bonnesAvecAide + result.avecAide,
          maitrise,
          confusions,
          dernierUnivers: universeId,
        };
        saveStats(next);
        return next;
      });
      setScreen("reward");
    },
    [universeId],
  );

  const updateStats = useCallback((patch: Partial<Stats>) => {
    setStats((prev) => {
      const next = { ...prev, ...patch };
      saveStats(next);
      return next;
    });
  }, []);

  /** Applique une transformation pure du catalogue puis sauvegarde. */
  const applyCatalogue = useCallback((transform: (s: Stats) => Stats) => {
    setStats((prev) => {
      const next = transform(prev);
      saveStats(next);
      return next;
    });
  }, []);

  const setDifficulte = useCallback(
    (difficulte: DifficulteMode) => updateStats({ difficulte }),
    [updateStats],
  );

  const setAideBoss = useCallback(
    (aideBoss: AideBoss) => updateStats({ aideBoss }),
    [updateStats],
  );

  const handleReset = useCallback(() => {
    resetStats();
    setStats(loadStats());
  }, []);

  const bossReady = BASILE_ALPHA_IDS.every((id) => stats.decouverts.includes(id));

  const openBoss = useCallback(() => {
    if (bossReady) {
      setScreen("boss");
      return;
    }
    const missing = BASILE_ALPHAS.find((a) => !stats.decouverts.includes(a.id));
    if (missing) {
      setDiscoveryTarget(missing);
      setScreen("discovery");
    } else {
      setScreen("universes");
    }
  }, [bossReady, stats]);

  return (
    <div className="app">
      {screen === "home" && (
        <HomeScreen
          onSelectActivity={selectActivity}
          onParent={() => setScreen("parent")}
          stats={stats}
        />
      )}

      {screen === "discovery" && (
        <DiscoveryScreen
          alphas={discoveryTarget ? [discoveryTarget] : []}
          onDone={finishDiscovery}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "universes" && (
        <UniverseScreen
          onSelect={selectUniverse}
          onSelectBoss={openBoss}
          onSelectAlbum={() => setScreen("album")}
          bossReady={bossReady}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "album" && (
        <AlbumScreen stats={stats} onBack={() => setScreen("universes")} />
      )}

      {screen === "game" && (
        <GameScreen
          universe={universe}
          discovered={gamePool}
          difficulte={stats.difficulte}
          maitrise={stats.maitrise}
          onExit={() => setScreen("universes")}
          onFinish={finishSession}
        />
      )}

      {screen === "reward" && (
        <RewardScreen
          universe={universe}
          bonnes={lastResult.bonnes}
          erreurs={lastResult.erreurs}
          onReplay={() => setScreen("game")}
          onHome={() => setScreen("home")}
        />
      )}

      {screen === "parent" && (
        <ParentScreen
          stats={stats}
          onSetDifficulte={setDifficulte}
          onSetAideBoss={setAideBoss}
          onToggleActive={(id, active) => applyCatalogue((s) => setActive(s, id, active))}
          onUnlock={(id) => applyCatalogue((s) => unlockAlpha(s, id))}
          onMove={(id, delta) => applyCatalogue((s) => moveInOrder(s, id, delta))}
          onResetPedagogy={() => applyCatalogue(resetPedagogy)}
          onReset={handleReset}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "boss" && (
        <BossScreen
          alphas={BASILE_ALPHAS}
          aideBoss={stats.aideBoss}
          onExit={() => setScreen("universes")}
        />
      )}

      {screen === "nurserie" && <NurserieScreen onExit={() => setScreen("home")} />}

      {screen === "jardin-magique" && (
        <JardinMagiqueScreen onExit={() => setScreen("home")} />
      )}

      {screen === "atelier" && <AtelierScreen onExit={() => setScreen("home")} />}

      {screen === "pirates" && <PiratesScreen onExit={() => setScreen("home")} />}

      {screen === "cabane" && <CabaneScreen onExit={() => setScreen("home")} />}
    </div>
  );
}
