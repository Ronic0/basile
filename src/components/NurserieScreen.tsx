import { useCallback, useEffect, useRef, useState } from "react";
import { playSfx, playVoice } from "../lib/audio";
import {
  clampGauge,
  loadNursery,
  saveNursery,
  type NurseryAction,
  type NurseryState,
} from "../lib/nursery";
import { BabyDragon, type DragonState, type DragonSurprise } from "./nurserie/BabyDragon";
import { NurseryBackdrop } from "./nurserie/NurseryBackdrop";
import {
  AppleIcon,
  AwakeIcon,
  BallIcon,
  FishIcon,
  MoonIcon,
  PetIcon,
  WaterIcon,
} from "./nurserie/NurseryIcons";
import { BasileMascot } from "./BasileMascot";

interface Props {
  onExit: () => void;
}

type FoodKind = "apple" | "fish";
interface Heart {
  id: number;
  x: number;
  y: number;
}

const SURPRISES: DragonSurprise[] = ["sneeze", "yawn", "spin", "wiggle"];

export function NurserieScreen({ onExit }: Props) {
  const [nursery, setNursery] = useState<NurseryState>(() => loadNursery());
  const [dragonState, setDragonState] = useState<DragonState>("idle");
  const [surprise, setSurprise] = useState<DragonSurprise>(null);
  const [food, setFood] = useState<FoodKind | null>(null);
  const [ball, setBall] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const nurseryRef = useRef(nursery);
  nurseryRef.current = nursery;

  const stageRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);
  const sleepInterval = useRef<number | null>(null);
  const surpriseTimer = useRef<number | null>(null);
  const running = useRef(false);
  const petting = useRef(false);
  const lastHeart = useRef(0);
  const petCount = useRef(0);
  const heartId = useRef(0);
  const spoken = useRef<Set<string>>(new Set());

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const speakOnce = useCallback((id: string) => {
    if (spoken.current.has(id)) return;
    spoken.current.add(id);
    playVoice(id);
  }, []);

  const beginAction = useCallback(() => {
    running.current = true;
    setBusy(true);
  }, []);
  const endAction = useCallback(() => {
    running.current = false;
    setBusy(false);
  }, []);

  // Persistance à chaque changement d'état.
  useEffect(() => {
    saveNursery(nursery);
  }, [nursery]);

  // Nettoyage complet en quittant la nurserie.
  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      if (sleepInterval.current) window.clearInterval(sleepInterval.current);
      if (surpriseTimer.current) window.clearTimeout(surpriseTimer.current);
    };
  }, []);

  const sleeping = dragonState === "sleeping";

  const updateGauges = useCallback(
    (delta: Partial<Record<"faim" | "bonheur" | "energie", number>>, action: NurseryAction) => {
      setNursery((prev) => ({
        ...prev,
        faim: clampGauge(prev.faim + (delta.faim ?? 0)),
        bonheur: clampGauge(prev.bonheur + (delta.bonheur ?? 0)),
        energie: clampGauge(prev.energie + (delta.energie ?? 0)),
        interactions: prev.interactions + 1,
        derniereAction: action,
      }));
    },
    [],
  );

  const spawnHeart = useCallback((clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const id = heartId.current++;
    setHearts((prev) => [...prev.slice(-14), { id, x, y }]);
    later(() => setHearts((prev) => prev.filter((h) => h.id !== id)), 1200);
  }, [later]);

  // --- Nourrir ---
  const feed = useCallback(
    (kind: FoodKind) => {
      if (sleeping || running.current) return;
      beginAction();
      setFood(kind);
      playSfx("ailes", 0.3);
      later(() => setFood(null), 650);
      later(() => {
        setDragonState("eating");
        playSfx("mastication", 0.5);
        updateGauges({ faim: 22, bonheur: 8 }, "nourrir");
        speakOnce("nurserie-nourrir");
      }, 700);
      later(() => {
        setDragonState("happy");
        playSfx("dragon-content", 0.5);
      }, 2350);
      later(() => {
        endAction();
        setDragonState("idle");
      }, 3200);
    },
    [sleeping, beginAction, endAction, later, updateGauges, speakOnce],
  );

  // --- Boire ---
  const drink = useCallback(() => {
    if (sleeping || running.current) return;
    beginAction();
    setDragonState("drinking");
    playSfx("gorgee", 0.5);
    updateGauges({ faim: 8, energie: 6, bonheur: 6 }, "boire");
    speakOnce("nurserie-boire");
    later(() => {
      setDragonState("happy");
      playSfx("dragon-content", 0.5);
    }, 1500);
    later(() => {
      endAction();
      setDragonState("idle");
    }, 2400);
  }, [sleeping, beginAction, endAction, later, updateGauges, speakOnce]);

  // --- Jouer ---
  const playBall = useCallback(() => {
    if (sleeping || running.current) return;
    beginAction();
    setBall(true);
    setDragonState("playing");
    playSfx("balle", 0.5);
    updateGauges({ energie: -14, bonheur: 14 }, "jouer");
    later(() => {
      setDragonState("happy");
      playSfx("dragon-content", 0.45);
    }, 1800);
    later(() => {
      setBall(false);
      endAction();
      setDragonState("idle");
    }, 2800);
  }, [sleeping, beginAction, endAction, later, updateGauges]);

  // --- Dormir / Réveiller ---
  const stopSleepInterval = useCallback(() => {
    if (sleepInterval.current) {
      window.clearInterval(sleepInterval.current);
      sleepInterval.current = null;
    }
  }, []);

  const goSleep = useCallback(() => {
    if (running.current) return;
    running.current = false;
    setDragonState("sleeping");
    setHint(null);
    playSfx("ronflement", 0.45);
    speakOnce("nurserie-dormir");
    updateGauges({}, "dormir");
    stopSleepInterval();
    sleepInterval.current = window.setInterval(() => {
      const cur = nurseryRef.current;
      if (cur.energie >= 100) {
        stopSleepInterval();
        return;
      }
      setNursery((prev) => ({ ...prev, energie: clampGauge(prev.energie + 4) }));
    }, 700);
  }, [speakOnce, updateGauges, stopSleepInterval]);

  const wake = useCallback(() => {
    stopSleepInterval();
    beginAction();
    // Il bâille et s'étire au réveil.
    setDragonState("waking");
    setHint(null);
    playSfx("dragon-content", 0.5);
    updateGauges({ bonheur: 5 }, "reveiller");
    later(() => {
      endAction();
      setDragonState("idle");
    }, 1700);
  }, [stopSleepInterval, beginAction, endAction, updateGauges, later]);

  // --- Caresser (toucher / glissement) ---
  const handleDragonDown = useCallback(
    (e: React.PointerEvent) => {
      if (sleeping) {
        wake();
        return;
      }
      if (running.current) return;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* capture non supportée : le glissement reste local */
      }
      petting.current = true;
      petCount.current = 0;
      setDragonState("beingPetted");
      spawnHeart(e.clientX, e.clientY);
      lastHeart.current = Date.now();
    },
    [sleeping, wake, spawnHeart],
  );

  const handleDragonMove = useCallback(
    (e: React.PointerEvent) => {
      if (!petting.current) return;
      const now = Date.now();
      if (now - lastHeart.current < 170) return;
      lastHeart.current = now;
      spawnHeart(e.clientX, e.clientY);
      petCount.current += 1;
      if (petCount.current % 4 === 0) updateGauges({ bonheur: 5 }, "caresser");
      if (petCount.current % 6 === 0) playSfx("dragon-content", 0.35);
    },
    [spawnHeart, updateGauges],
  );

  const handleDragonUp = useCallback(() => {
    if (!petting.current) return;
    petting.current = false;
    updateGauges({ bonheur: 6, energie: 3 }, "caresser");
    speakOnce("nurserie-caresser");
    later(() => {
      if (!petting.current) setDragonState("idle");
    }, 900);
  }, [updateGauges, speakOnce, later]);

  /** Caresser depuis le bouton (sans glissement). */
  const petButton = useCallback(() => {
    if (sleeping) {
      wake();
      return;
    }
    if (running.current) return;
    setDragonState("beingPetted");
    const rect = stageRef.current?.getBoundingClientRect();
    if (rect) {
      for (let i = 0; i < 3; i++) {
        later(() => {
          spawnHeart(
            rect.left + rect.width / 2 + (Math.random() * 90 - 45),
            rect.top + rect.height * 0.52,
          );
        }, i * 130);
      }
    }
    updateGauges({ bonheur: 8 }, "caresser");
    speakOnce("nurserie-caresser");
    later(() => {
      if (!petting.current) setDragonState("idle");
    }, 1200);
  }, [sleeping, wake, later, spawnHeart, updateGauges, speakOnce]);

  // --- Envie douce quand une jauge est basse ---
  useEffect(() => {
    if (dragonState !== "idle") return;
    if (nursery.faim < 35) {
      setHint(`${nursery.name} a un petit creux 🤤`);
      speakOnce("nurserie-nourrir");
    } else if (nursery.energie < 30) {
      setHint(`${nursery.name} bâille… il a sommeil 😴`);
      speakOnce("nurserie-dormir");
    } else if (nursery.bonheur < 35) {
      setHint(`${nursery.name} veut un câlin 🥰`);
      speakOnce("nurserie-caresser");
    } else {
      setHint(null);
    }
  }, [dragonState, nursery.faim, nursery.energie, nursery.bonheur, nursery.name, speakOnce]);

  // --- Récompense vocale quand le dragon est très content ---
  useEffect(() => {
    if (nursery.bonheur >= 90) speakOnce("nurserie-content");
  }, [nursery.bonheur, speakOnce]);

  // --- Surprises aléatoires au repos ---
  useEffect(() => {
    if (dragonState !== "idle") {
      if (surpriseTimer.current) {
        window.clearTimeout(surpriseTimer.current);
        surpriseTimer.current = null;
      }
      return;
    }
    surpriseTimer.current = window.setTimeout(
      () => {
        const pick = SURPRISES[Math.floor(Math.random() * SURPRISES.length)];
        setSurprise(pick);
        if (pick === "sneeze") playSfx("flamme", 0.4);
        if (pick === "spin") playSfx("ailes", 0.3);
        later(() => setSurprise(null), 1700);
      },
      9000 + Math.random() * 9000,
    );
    return () => {
      if (surpriseTimer.current) window.clearTimeout(surpriseTimer.current);
    };
  }, [dragonState, later]);

  const handleBack = useCallback(() => {
    onExit();
  }, [onExit]);

  return (
    <div className="screen screen--nurserie">
      <header className="topbar nurserie__topbar">
        <button type="button" className="btn btn--icon" onClick={handleBack} aria-label="Retour">
          ⬅️
        </button>

        <div className="nurserie__title">
          <span className="nurserie__name">{nursery.name}</span>
          <span className="nurserie__subtitle">La Nurserie des dragons</span>
        </div>

        <div className="nurserie__gauges">
          <Gauge icon="🍎" value={nursery.faim} color="#e8543f" label="Faim" />
          <Gauge icon="💛" value={nursery.bonheur} color="#f0b429" label="Bonheur" />
          <Gauge icon="⚡" value={nursery.energie} color="#3aa34a" label="Énergie" />
        </div>
      </header>

      <main className="nurserie__stage" ref={stageRef}>
        <NurseryBackdrop />

        {hint && (
          <div className="nurserie__bubble" role="status">
            {hint}
          </div>
        )}

        <div className="nurserie__nest" aria-hidden="true">
          <svg viewBox="0 0 320 140">
            <ellipse cx="160" cy="118" rx="150" ry="20" fill="rgba(0,0,0,0.12)" />
            <path d="M20 70 q30 -50 140 -50 q110 0 140 50 q-20 44 -140 44 q-120 0 -140 -44 z" fill="#b5763c" />
            <path d="M20 70 q140 34 280 0 q-6 44 -140 44 q-134 0 -140 -44 z" fill="#8a5a2b" />
            <g stroke="#6b4410" strokeWidth="3" fill="none" opacity="0.55">
              <path d="M40 74 q120 40 240 0" />
              <path d="M56 58 q104 34 208 0" />
            </g>
            <ellipse cx="160" cy="66" rx="118" ry="26" fill="#d9a86a" opacity="0.85" />
          </svg>
        </div>

        <div
          className="nurserie__dragon"
          onPointerDown={handleDragonDown}
          onPointerMove={handleDragonMove}
          onPointerUp={handleDragonUp}
          onPointerCancel={handleDragonUp}
          role="button"
          tabIndex={0}
          aria-label={`Caresser ${nursery.name}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (sleeping) wake();
              else {
                updateGauges({ bonheur: 8 }, "caresser");
                speakOnce("nurserie-caresser");
              }
            }
          }}
        >
          <BabyDragon state={dragonState} surprise={surprise} />
        </div>

        {food && (
          <div className={`nurserie__food nurserie__food--${food}`} aria-hidden="true">
            {food === "apple" ? <AppleIcon /> : <FishIcon />}
          </div>
        )}

        {ball && (
          <div className="nurserie__ball" aria-hidden="true">
            <BallIcon />
          </div>
        )}

        <div className="nurserie__hearts" aria-hidden="true">
          {hearts.map((h) => (
            <span key={h.id} className="nurserie__heart" style={{ left: h.x, top: h.y }}>
              💗
            </span>
          ))}
        </div>

        <BasileMascot
          variant="sidekick"
          position="inline"
          size="15vmin"
          mood={dragonState === "happy" ? "happy" : "idle"}
          animated
          className="nurserie__basile"
        />
      </main>

      <footer className="nurserie__actions">
        <ActionButton label="Pomme" onClick={() => feed("apple")} disabled={sleeping || busy}>
          <AppleIcon />
        </ActionButton>
        <ActionButton label="Poisson" onClick={() => feed("fish")} disabled={sleeping || busy}>
          <FishIcon />
        </ActionButton>
        <ActionButton label="À boire" onClick={drink} disabled={sleeping || busy}>
          <WaterIcon />
        </ActionButton>
        <ActionButton label="Caresser" onClick={petButton} disabled={sleeping || busy}>
          <PetIcon />
        </ActionButton>
        <ActionButton label="Jouer" onClick={playBall} disabled={sleeping || busy}>
          <BallIcon />
        </ActionButton>
        {sleeping ? (
          <ActionButton label="Réveiller" onClick={wake} highlight>
            <AwakeIcon />
          </ActionButton>
        ) : (
          <ActionButton label="Dormir" onClick={goSleep}>
            <MoonIcon />
          </ActionButton>
        )}
      </footer>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled = false,
  highlight = false,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`nurserie__action ${highlight ? "is-highlight" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <span className="nurserie__action-icon" aria-hidden="true">
        {children}
      </span>
      <span className="nurserie__action-label">{label}</span>
    </button>
  );
}

function Gauge({
  icon,
  value,
  color,
  label,
}: {
  icon: string;
  value: number;
  color: string;
  label: string;
}) {
  return (
    <div className="nurserie__gauge" aria-label={`${label} : ${value} sur 100`}>
      <span className="nurserie__gauge-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="nurserie__gauge-track">
        <span
          className="nurserie__gauge-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </span>
    </div>
  );
}
