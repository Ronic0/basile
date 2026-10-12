import { useCallback, useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { UniverseScreen } from "./components/UniverseScreen";
import { DiscoveryScreen } from "./components/DiscoveryScreen";
import { GameScreen } from "./components/GameScreen";
import { RewardScreen } from "./components/RewardScreen";
import { ParentScreen } from "./components/ParentScreen";
import { ALPHAS } from "./data/alphas";
import { getUniverse, type UniverseId } from "./data/universes";
import { playAudio } from "./lib/audio";
import { loadStats, resetStats, saveStats, type Stats } from "./lib/storage";

type Screen = "home" | "discovery" | "universes" | "game" | "reward" | "parent";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [universeId, setUniverseId] = useState<UniverseId>("pirates");
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [lastResult, setLastResult] = useState({ bonnes: 0, erreurs: 0 });

  const universe = getUniverse(universeId);
  const discoveryAlphas = ALPHAS.slice(0, stats.decouverte);

  const goPlay = useCallback(() => {
    if (stats.decouverte < ALPHAS.length) {
      setScreen("discovery");
    } else {
      playAudio("bien-joue");
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
    setScreen("game");
  }, []);

  const finishSession = useCallback(
    (result: { bonnes: number; erreurs: number }) => {
      setLastResult(result);
      setStats((prev) => {
        const next: Stats = {
          parties: prev.parties + 1,
          bonnes: prev.bonnes + result.bonnes,
          erreurs: prev.erreurs + result.erreurs,
          dernierUnivers: universeId,
          decouverte: prev.decouverte,
        };
        saveStats(next);
        return next;
      });
      setScreen("reward");
    },
    [universeId],
  );

  const handleReset = useCallback(() => {
    resetStats();
    setStats(loadStats());
  }, []);

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
        <UniverseScreen onSelect={selectUniverse} onBack={() => setScreen("home")} />
      )}

      {screen === "game" && (
        <GameScreen
          universe={universe}
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
          onReset={handleReset}
          onBack={() => setScreen("home")}
        />
      )}
    </div>
  );
}
