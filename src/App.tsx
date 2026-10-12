import { useCallback, useEffect, useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { UniverseScreen } from "./components/UniverseScreen";
import { DiscoveryScreen } from "./components/DiscoveryScreen";
import { GameScreen, type SessionResult } from "./components/GameScreen";
import { RewardScreen } from "./components/RewardScreen";
import { ParentScreen } from "./components/ParentScreen";
import { BossScreen } from "./components/BossScreen";
import { ALPHAS } from "./data/alphas";
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
import { markExplored } from "./lib/collection";

type Screen = "home" | "discovery" | "universes" | "game" | "reward" | "parent" | "boss";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [universeId, setUniverseId] = useState<UniverseId>("pirates");
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [lastResult, setLastResult] = useState({ bonnes: 0, erreurs: 0 });

  const universe = getUniverse(universeId);
  const discoveryAlphas = ALPHAS.slice(0, stats.decouverte);

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
    if (stats.decouverte < ALPHAS.length) {
      setScreen("discovery");
    } else {
      playVoice("bien-joue");
      setScreen("universes");
    }
  }, [stats.decouverte]);

  const finishDiscovery = useCallback(() => {
    setStats((prev) => {
      if (prev.decouverte >= ALPHAS.length) return prev;
      const next: Stats = { ...prev, decouverte: prev.decouverte + 1 };
      saveStats(next);
      return next;
    });
    setScreen("universes");
  }, []);

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
        const next: Stats = {
          ...prev,
          parties: prev.parties + 1,
          bonnes: prev.bonnes + result.bonnes,
          erreurs: prev.erreurs + result.erreurs,
          bonnesSansAide: prev.bonnesSansAide + result.sansAide,
          bonnesAvecAide: prev.bonnesAvecAide + result.avecAide,
          maitrise,
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

  const bossReady = stats.decouverte >= ALPHAS.length;

  const openBoss = useCallback(() => {
    if (stats.decouverte < ALPHAS.length) {
      setScreen("discovery");
      return;
    }
    setScreen("boss");
  }, [stats.decouverte]);

  return (
    <div className="app">
      {screen === "home" && (
        <HomeScreen onPlay={goPlay} onParent={() => setScreen("parent")} stats={stats} />
      )}

      {screen === "discovery" && (
        <DiscoveryScreen
          alphas={discoveryAlphas}
          onDone={finishDiscovery}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "universes" && (
        <UniverseScreen
          onSelect={selectUniverse}
          onSelectBoss={openBoss}
          bossReady={bossReady}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "game" && (
        <GameScreen
          universe={universe}
          discovered={ALPHAS.slice(0, stats.decouverte)}
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
          onReset={handleReset}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "boss" && (
        <BossScreen
          alphas={ALPHAS}
          aideBoss={stats.aideBoss}
          onExit={() => setScreen("universes")}
        />
      )}
    </div>
  );
}
