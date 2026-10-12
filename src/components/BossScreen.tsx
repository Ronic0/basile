import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Alpha } from "../data/alphas";
import { playSfx, playVoice } from "../lib/audio";
import type { AideBoss } from "../lib/storage";
import {
  loadBossReward,
  recordBossAttempt,
  recordBossVictory,
  type BossReward,
} from "../lib/collection";
import { AlphaCard } from "./AlphaCard";
import { BasileMascot } from "./BasileMascot";
import { BossDragon } from "./boss/BossDragon";
import { BossCastle } from "./boss/BossCastle";

const LETTERS = ["B", "A", "S", "I", "L", "E"];

const LETTER_AUDIO: Record<string, string> = {
  botte: "boss-lettre-b",
  "monsieur-a": "boss-lettre-a",
  serpent: "boss-lettre-s",
  "madame-i": "boss-lettre-i",
  limace: "boss-lettre-l",
  "madame-e": "boss-lettre-e",
};

type BossPhase = "intro" | "stones" | "build" | "victory";
type MiniPhase = "asking" | "correct" | "wrong";

interface Props {
  alphas: Alpha[];
  aideBoss: AideBoss;
  onExit: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function optionsFor(target: Alpha, pool: Alpha[], count: number): Alpha[] {
  const others = shuffle(pool.filter((a) => a.id !== target.id)).slice(0, count - 1);
  return shuffle([target, ...others]);
}

function loadWithFallback(alpha: Alpha): Promise<boolean> {
  return new Promise((resolve) => {
    const primary = new Image();
    primary.onload = () => resolve(true);
    primary.onerror = () => {
      const fallback = new Image();
      fallback.onload = () => resolve(true);
      fallback.onerror = () => resolve(false);
      fallback.src = alpha.imageFallback;
    };
    primary.src = alpha.image;
  });
}

/** Vérifie la disponibilité réelle des images (jamais de substitution). */
function useAlphaAvailability(alphas: Alpha[]) {
  const [state, setState] = useState<{ checking: boolean; missing: Alpha | null }>({
    checking: true,
    missing: null,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      alphas.map((a) => loadWithFallback(a).then((ok) => ({ a, ok }))),
    ).then((results) => {
      if (cancelled) return;
      const missing = results.find((r) => !r.ok)?.a ?? null;
      setState({ checking: false, missing });
    });
    return () => {
      cancelled = true;
    };
  }, [alphas]);

  return state;
}

export function BossScreen({ alphas, aideBoss, onExit }: Props) {
  const availability = useAlphaAvailability(alphas);
  const [phase, setPhase] = useState<BossPhase>("intro");

  const [reward, setReward] = useState<BossReward>(() => loadBossReward());

  // --- Étape A : les pierres magiques ---
  const [stoneIndex, setStoneIndex] = useState(0);
  const [stoneMini, setStoneMini] = useState<MiniPhase>("asking");
  const [stoneOptions, setStoneOptions] = useState<Alpha[]>(() =>
    alphas.length ? optionsFor(alphas[0], alphas, 2) : [],
  );
  const [pickedStoneId, setPickedStoneId] = useState<string | null>(null);
  const stoneTimer = useRef<number | null>(null);

  // --- Étape B : reconstituer BASILE ---
  const [placed, setPlaced] = useState<(string | null)[]>(() => Array(6).fill(null));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [modelVisible, setModelVisible] = useState(true);
  const [hintActive, setHintActive] = useState(false);
  const wrongTimer = useRef<number | null>(null);
  const modelTimer = useRef<number | null>(null);

  const choices = useMemo(() => shuffle(alphas), [alphas]);

  const confetti = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2.2,
        duration: 2.4 + Math.random() * 1.8,
        color: ["#ffd34d", "#e8543f", "#3aa34a", "#2f9bd6", "#c084fc", "#fff"][i % 6],
        size: 1 + Math.random() * 1.6,
      })),
    [],
  );

  const nextEmpty = placed.findIndex((p) => p === null);
  const allPlaced = nextEmpty === -1;
  const stoneCount = aideBoss === "debutant" ? 2 : 3;

  useEffect(() => {
    return () => {
      if (stoneTimer.current) window.clearTimeout(stoneTimer.current);
      if (wrongTimer.current) window.clearTimeout(wrongTimer.current);
      if (modelTimer.current) window.clearTimeout(modelTimer.current);
    };
  }, []);

  // Annonce introductive.
  useEffect(() => {
    if (phase === "intro" && availability.checking === false) {
      playVoice("boss-intro");
    }
  }, [phase, availability.checking]);

  const start = useCallback(() => {
    recordBossAttempt();
    setPhase("stones");
    setStoneIndex(0);
    setStoneMini("asking");
    setPickedStoneId(null);
    setStoneOptions(optionsFor(alphas[0], alphas, stoneCount));
  }, [alphas, stoneCount]);

  // --- Interactions étape A ---
  const handleStonePick = useCallback(
    (alpha: Alpha) => {
      if (stoneMini !== "asking") return;
      setPickedStoneId(alpha.id);

      if (alpha.id === alphas[stoneIndex].id) {
        setStoneMini("correct");
        playSfx("etoile");
        playVoice("boss-pierre");
        stoneTimer.current = window.setTimeout(() => {
          if (stoneIndex + 1 < alphas.length) {
            const next = stoneIndex + 1;
            setStoneIndex(next);
            setStoneOptions(optionsFor(alphas[next], alphas, stoneCount));
            setStoneMini("asking");
            setPickedStoneId(null);
          } else {
            setPhase("build");
          }
        }, 1500);
      } else {
        setStoneMini("wrong");
        playVoice("reessaie");
        stoneTimer.current = window.setTimeout(() => {
          setStoneMini("asking");
          setPickedStoneId(null);
        }, 1000);
      }
    },
    [stoneMini, stoneIndex, alphas, stoneCount],
  );

  // --- Étape B : présentation du modèle (avancé) ---
  useEffect(() => {
    if (phase !== "build") return;
    if (aideBoss === "avance") {
      setModelVisible(true);
      modelTimer.current = window.setTimeout(() => setModelVisible(false), 3200);
    } else {
      setModelVisible(true);
    }
    return () => {
      if (modelTimer.current) window.clearTimeout(modelTimer.current);
    };
  }, [phase, aideBoss]);

  // Consigne audio de la lettre active.
  useEffect(() => {
    if (phase !== "build" || nextEmpty < 0) return;
    if (aideBoss === "debutant" || hintActive) {
      playVoice(LETTER_AUDIO[alphas[nextEmpty].id]);
    }
  }, [phase, nextEmpty, aideBoss, hintActive, alphas]);

  const place = useCallback(
    (slot: number) => {
      setPlaced((prev) => {
        const next = [...prev];
        next[slot] = selectedId;
        return next;
      });
      setSelectedId(null);
      setWrongSlot(null);
      setHintActive(false);
      playSfx("etoile");
    },
    [selectedId],
  );

  const handleSelectAlpha = useCallback(
    (alpha: Alpha) => {
      if (phase !== "build" || allPlaced) return;

      if (aideBoss === "debutant") {
        // Mode doux : sélectionner le prochain Alpha demandé le place aussitôt.
        if (nextEmpty < 0) return;
        if (alpha.id === alphas[nextEmpty].id) {
          setPlaced((prev) => {
            const next = [...prev];
            next[nextEmpty] = alpha.id;
            return next;
          });
          setWrongSlot(null);
          setHintActive(false);
          playSfx("etoile");
        } else {
          setWrongSlot(nextEmpty);
          setSelectedId(null);
          playVoice("reessaie");
          if (wrongTimer.current) window.clearTimeout(wrongTimer.current);
          wrongTimer.current = window.setTimeout(() => setWrongSlot(null), 900);
        }
        return;
      }

      setSelectedId((prev) => (prev === alpha.id ? null : alpha.id));
    },
    [phase, allPlaced, aideBoss, nextEmpty, alphas],
  );

  const handleSlot = useCallback(
    (slot: number) => {
      if (phase !== "build" || placed[slot] !== null) return;
      if (!selectedId) {
        playVoice(LETTER_AUDIO[alphas[slot].id]);
        return;
      }
      if (selectedId === alphas[slot].id) {
        place(slot);
      } else {
        setWrongSlot(slot);
        playVoice("reessaie");
        if (wrongTimer.current) window.clearTimeout(wrongTimer.current);
        wrongTimer.current = window.setTimeout(() => setWrongSlot(null), 900);
      }
    },
    [phase, placed, selectedId, alphas, place],
  );

  const handleHint = useCallback(() => {
    setHintActive(true);
    setModelVisible(true);
    if (nextEmpty >= 0) playVoice(LETTER_AUDIO[alphas[nextEmpty].id]);
  }, [nextEmpty, alphas]);

  // --- Victoire ---
  useEffect(() => {
    if (phase === "build" && allPlaced) {
      setPhase("victory");
      setReward(recordBossVictory());
      playSfx("reussite");
      playVoice("boss-victoire");
    }
  }, [phase, allPlaced]);

  const replay = useCallback(() => {
    setStoneIndex(0);
    setStoneMini("asking");
    setPickedStoneId(null);
    setStoneOptions(alphas.length ? optionsFor(alphas[0], alphas, stoneCount) : []);
    setPlaced(Array(6).fill(null));
    setSelectedId(null);
    setWrongSlot(null);
    setHintActive(false);
    setModelVisible(true);
    recordBossAttempt();
    setPhase("stones");
  }, [alphas, stoneCount]);

  const litStones = phase === "build" || phase === "victory" ? LETTERS.length : stoneIndex;

  if (availability.checking) {
    return (
      <div className="screen screen--boss">
        <div className="boss-loading" role="status">
          <span className="boss-loading__spinner" aria-hidden="true">
            🐉
          </span>
          <p>Le dragon prépare ses farces…</p>
        </div>
      </div>
    );
  }

  if (availability.missing) {
    return (
      <div className="screen screen--boss">
        <header className="topbar">
          <button type="button" className="btn btn--icon" onClick={onExit} aria-label="Retour">
            ⬅️
          </button>
          <h2 className="topbar__title">Le Mystère du prénom BASILE</h2>
          <span className="topbar__spacer" />
        </header>
        <div className="boss-blocked" role="alert">
          <span className="boss-blocked__emoji" aria-hidden="true">
            🚧
          </span>
          <p>
            Impossible de lancer le boss : l'image de <strong>{availability.missing.name}</strong>{" "}
            est introuvable.
          </p>
          <p className="boss-blocked__hint">
            Déposez le fichier dans <code>public/assets/alphas/</code> puis relancez. Aucun autre
            personnage n'est utilisé à sa place.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen screen--boss">
      <div className="boss-sky" aria-hidden="true">
        <span className="boss-sky__moon">🌙</span>
        <span className="boss-sky__star boss-sky__star--1">✨</span>
        <span className="boss-sky__star boss-sky__star--2">⭐</span>
        <span className="boss-sky__star boss-sky__star--3">✨</span>
      </div>

      <header className="topbar topbar--game">
        <button type="button" className="btn btn--icon" onClick={onExit} aria-label="Retour">
          ⬅️
        </button>
        <h2 className="topbar__title boss-title">
          {phase === "intro" ? "Le Mystère du prénom BASILE" : "Retrouve ton prénom !"}
        </h2>
        <span className="topbar__spacer" />
      </header>

      <div className="boss-stones" aria-label="Pierres magiques">
        {LETTERS.map((letter, i) => (
          <span
            key={letter}
            className={`boss-stone ${i < litStones ? "is-lit" : ""}`}
            aria-label={`Pierre ${letter}${i < litStones ? " allumée" : ""}`}
          >
            {letter}
          </span>
        ))}
      </div>

      {phase === "intro" && (
        <main className="boss-intro">
          <BossDragon mood="silly" className="boss-intro__dragon" />
          <div className="boss-intro__bubble">
            <p>
              Le Dragon des prénoms a mélangé les six Alphas de BASILE ! Aide Basile à les
              retrouver.
            </p>
            {reward.medaille && (
              <p className="boss-intro__medal">🏅 Médaille déjà gagnée — tu peux rejouer !</p>
            )}
          </div>
          <div className="boss-intro__actions">
            <button type="button" className="btn btn--sound" onClick={() => playVoice("boss-intro")}>
              🔊
            </button>
            <button type="button" className="btn btn--huge btn--play" onClick={start}>
              ⚔️ Affronter le dragon
            </button>
          </div>
        </main>
      )}

      {phase === "stones" && (
        <main className="boss-stage">
          <div className="boss-dragon-row">
            <BossDragon
              mood={stoneMini === "correct" ? "happy" : "silly"}
              className="boss-stage__dragon"
            />
            <p className="boss-consigne">
              Trouve&nbsp;: <strong>{alphas[stoneIndex]?.name}</strong>
            </p>
            <button
              type="button"
              className="btn btn--sound"
              onClick={() => playVoice(alphas[stoneIndex]?.audioName ?? "")}
              aria-label="Rejouer la consigne"
            >
              🔊
            </button>
          </div>

          <div className="boss-choices">
            {stoneOptions.map((alpha) => {
              const isCorrect = stoneMini === "correct" && alpha.id === alphas[stoneIndex]?.id;
              const isWrong = stoneMini === "wrong" && alpha.id === pickedStoneId;
              const state = isCorrect ? "correct" : isWrong ? "wrong" : "idle";
              return (
                <AlphaCard
                  key={alpha.id}
                  alpha={alpha}
                  state={state}
                  onPick={() => handleStonePick(alpha)}
                  disabled={stoneMini !== "asking"}
                />
              );
            })}
          </div>
        </main>
      )}

      {phase === "build" && (
        <main className="boss-stage boss-stage--build">
          <div className="boss-slots" role="list" aria-label="Les lettres de BASILE">
            {LETTERS.map((letter, i) => {
              const filledId = placed[i];
              const filledAlpha = filledId ? alphas.find((a) => a.id === filledId) : null;
              const isNext = i === nextEmpty;
              const highlight = isNext && (aideBoss === "debutant" || hintActive);
              const showModel = modelVisible;
              return (
                <button
                  key={letter}
                  type="button"
                  role="listitem"
                  className={`boss-slot ${filledAlpha ? "is-filled" : ""} ${
                    highlight ? "is-next" : ""
                  } ${wrongSlot === i ? "is-wrong" : ""}`}
                  onClick={() => handleSlot(i)}
                  aria-label={`Emplacement ${i + 1}${filledAlpha ? ` : ${filledAlpha.name}` : ""}`}
                >
                  <span className="boss-slot__model" aria-hidden="true">
                    {showModel && alphas[i] ? (
                      <img
                        src={alphas[i].image}
                        alt=""
                        draggable={false}
                        onError={(e) => {
                          const el = e.currentTarget;
                          if (el.src !== alphas[i].imageFallback) el.src = alphas[i].imageFallback;
                        }}
                      />
                    ) : (
                      <span className="boss-slot__hidden">?</span>
                    )}
                  </span>
                  <span className="boss-slot__letter">{modelVisible ? letter : "?"}</span>
                  {filledAlpha && (
                    <span className="boss-slot__placed" aria-hidden="true">
                      <img
                        src={filledAlpha.image}
                        alt=""
                        draggable={false}
                        onError={(e) => {
                          const el = e.currentTarget;
                          if (el.src !== filledAlpha.imageFallback)
                            el.src = filledAlpha.imageFallback;
                        }}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="boss-build-tools">
            <button type="button" className="btn btn--ghost boss-hint" onClick={handleHint}>
              💡 Indice
            </button>
            <p className="boss-build-help">
              {aideBoss === "debutant"
                ? `Touche ${alphas[nextEmpty]?.name ?? "l'Alpha"} pour le placer.`
                : selectedId
                  ? "Touche l'emplacement de la lettre."
                  : "Touche un Alpha, puis son emplacement."}
            </p>
          </div>

          <div className="boss-choices boss-choices--build">
            {choices.map((alpha) => {
              const used = placed.includes(alpha.id);
              return (
                <AlphaCard
                  key={alpha.id}
                  alpha={alpha}
                  state={used ? "dim" : selectedId === alpha.id ? "correct" : "idle"}
                  onPick={() => handleSelectAlpha(alpha)}
                  disabled={used}
                />
              );
            })}
          </div>
        </main>
      )}

      {phase === "victory" && (
        <main className="boss-victory">
          <div className="boss-victory__scene">
            <BossCastle open className="boss-victory__castle" />
            <BossDragon mood="happy" flying className="boss-victory__dragon" />
            <div className="boss-victory__confetti" aria-hidden="true">
              {confetti.map((c) => (
                <span
                  key={c.id}
                  className="confetti"
                  style={
                    {
                      left: `${c.left}%`,
                      background: c.color,
                      width: `${c.size}vmin`,
                      height: `${c.size * 0.6}vmin`,
                      animationDelay: `${c.delay}s`,
                      animationDuration: `${c.duration}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          </div>

          <div className="boss-victory__banner">
            <BasileMascot
              variant="reward"
              mood="celebrate"
              position="inline"
              size="22vmin"
              showEffects
            />
            <h2 className="boss-victory__title">Bravo Basile&nbsp;!</h2>
            <p className="boss-victory__subtitle">Tu as retrouvé ton prénom&nbsp;!</p>
            <p className="boss-victory__medal">🏅 Trésor enregistré&nbsp;: la médaille du prénom</p>
            <div className="boss-victory__actions">
              <button type="button" className="btn btn--huge btn--play" onClick={replay}>
                🔁 Rejouer
              </button>
              <button type="button" className="btn btn--ghost" onClick={onExit}>
                🏠 Univers
              </button>
            </div>
          </div>
        </main>
      )}

      {(phase === "stones" || phase === "build") && (
        <BasileMascot
          variant="sidekick"
          position="bottom-left"
          mood={phase === "build" ? "happy" : "idle"}
          animated
        />
      )}
    </div>
  );
}
