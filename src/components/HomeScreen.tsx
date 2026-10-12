import { useCallback, useEffect, useRef, useState } from "react";
import type { Stats } from "../lib/storage";
import { ACTIVITIES, type Activity, type ActivityId } from "../data/activities";
import { isVoicePlaying, playVoice, stopVoice } from "../lib/audio";
import { BasileMascot } from "./BasileMascot";
import { GardenDecor } from "./home/GardenDecor";
import { ActivityIcon } from "./home/ActivityIcon";
import { SleepyDragon } from "./home/SleepyDragon";

interface Props {
  onSelectActivity: (id: ActivityId) => void;
  onParent: () => void;
  stats: Stats;
}

/** Délai de survol avant d'annoncer une activité (ms). */
const HOVER_DELAY = 350;

type PointerKind = "mouse" | "touch" | "pen";

export function HomeScreen({ onSelectActivity, onParent, stats }: Props) {
  const [selectedId, setSelectedId] = useState<ActivityId | null>(null);
  const pointerKind = useRef<PointerKind>("mouse");
  /** Évite de considérer un focus consécutif à un appui comme un focus clavier. */
  const pointerFocus = useRef(false);
  const hoverTimer = useRef<number | null>(null);
  const hoverId = useRef<ActivityId | null>(null);
  const focusTimer = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    if (focusTimer.current) {
      window.clearTimeout(focusTimer.current);
      focusTimer.current = null;
    }
    hoverId.current = null;
  }, []);

  useEffect(() => {
    // Toute sortie d'écran annule les temporisations obsolètes.
    return () => clearTimers();
  }, [clearTimers]);

  /** Prononce le nom d'une activité sans relancer un audio déjà en cours. */
  const speak = useCallback((voice: string) => {
    if (isVoicePlaying(voice)) return;
    playVoice(voice);
  }, []);

  const stop = useCallback(() => {
    clearTimers();
    stopVoice();
  }, [clearTimers]);

  const openActivity = useCallback(
    (activity: Activity) => {
      clearTimers();
      // Une activité « bientôt » s'annonce mais ne s'ouvre jamais.
      if (activity.status === "soon") {
        setSelectedId(activity.id);
        speak(activity.voice);
        return;
      }
      stopVoice();
      onSelectActivity(activity.id);
    },
    [clearTimers, speak, onSelectActivity],
  );

  const selectActivity = useCallback(
    (activity: Activity) => {
      clearTimers();
      setSelectedId(activity.id);
      speak(activity.voice);
    },
    [clearTimers, speak],
  );

  // --- Souris : annonce après un court survol, jamais en boucle ---
  const handlePointerEnter = useCallback(
    (activity: Activity, e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
      hoverId.current = activity.id;
      hoverTimer.current = window.setTimeout(() => {
        if (hoverId.current === activity.id) speak(activity.voice);
      }, HOVER_DELAY);
    },
    [speak],
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (hoverTimer.current) {
        window.clearTimeout(hoverTimer.current);
        hoverTimer.current = null;
      }
      hoverId.current = null;
    },
    [],
  );

  // --- Clavier / technologies d'assistance : annonce au focus ---
  const handleFocus = useCallback(
    (activity: Activity) => {
      if (pointerFocus.current) {
        pointerFocus.current = false;
        return;
      }
      if (focusTimer.current) window.clearTimeout(focusTimer.current);
      focusTimer.current = window.setTimeout(() => speak(activity.voice), HOVER_DELAY);
    },
    [speak],
  );

  const handleBlur = useCallback(() => {
    if (focusTimer.current) {
      window.clearTimeout(focusTimer.current);
      focusTimer.current = null;
    }
  }, []);

  const handlePointerDown = useCallback((kind: PointerKind) => {
    pointerKind.current = kind || "mouse";
    // Un focus consécutif à un appui n'est pas un focus clavier.
    pointerFocus.current = true;
    window.setTimeout(() => {
      pointerFocus.current = false;
    }, 500);
  }, []);

  // --- Activation : clic souris direct ; deux touches sur iPad ---
  const handleActivate = useCallback(
    (activity: Activity) => {
      if (pointerKind.current === "mouse") {
        openActivity(activity);
        return;
      }
      if (selectedId === activity.id) openActivity(activity);
      else selectActivity(activity);
    },
    [openActivity, selectActivity, selectedId],
  );

  const handleKeyDown = useCallback(
    (activity: Activity, e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        openActivity(activity);
      }
    },
    [openActivity],
  );

  const handleParent = useCallback(() => {
    stop();
    onParent();
  }, [stop, onParent]);

  return (
    <div className="screen screen--world">
      <GardenDecor />

      <header className="world__header">
        <BasileMascot
          variant="hero"
          mood="happy"
          position="inline"
          size="24vmin"
          className="world__basile"
        />
        <div className="world__titles">
          <h1 className="world__title">
            Bienvenue dans le
            <br />
            monde de Basile&nbsp;!
          </h1>
          <p className="world__subtitle">Choisis une activité</p>
        </div>
      </header>

      <main className="world__activities">
        {ACTIVITIES.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            selected={selectedId === activity.id}
            progress={activity.id === "jardin-alphas" ? stats.decouverts.length : undefined}
            onSpeak={() => speak(activity.voice)}
            onEnter={(e) => handlePointerEnter(activity, e)}
            onLeave={handlePointerLeave}
            onFocus={() => handleFocus(activity)}
            onBlur={handleBlur}
            onPointerDown={(kind) => handlePointerDown(kind)}
            onActivate={() => handleActivate(activity)}
            onKeyDown={(e) => handleKeyDown(activity, e)}
          />
        ))}
      </main>

      <SleepyDragon className="world__dragon" />

      <button
        type="button"
        className="btn btn--ghost world__parent"
        onClick={handleParent}
        onFocus={handleBlur}
      >
        Parent
      </button>
    </div>
  );
}

interface CardProps {
  activity: Activity;
  selected: boolean;
  progress?: number;
  onSpeak: () => void;
  onEnter: (e: React.PointerEvent) => void;
  onLeave: (e: React.PointerEvent) => void;
  onFocus: () => void;
  onBlur: () => void;
  onPointerDown: (kind: PointerKind) => void;
  onActivate: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

function ActivityCard({
  activity,
  selected,
  progress,
  onSpeak,
  onEnter,
  onLeave,
  onFocus,
  onBlur,
  onPointerDown,
  onActivate,
  onKeyDown,
}: CardProps) {
  const soon = activity.status === "soon";
  const label = `${activity.title}${soon ? " (bientôt disponible)" : ""}`;

  return (
    <div
      className={`activity-card ${soon ? "is-soon" : ""} ${selected ? "is-selected" : ""}`}
      style={
        {
          background: activity.background,
          "--accent": activity.accent,
        } as React.CSSProperties
      }
    >
      {soon && (
        <span className="activity-card__ribbon" aria-hidden="true">
          bientôt
        </span>
      )}

      <button
        type="button"
        className="activity-card__open"
        aria-label={label}
        onClick={onActivate}
        onKeyDown={onKeyDown}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onPointerDown={(e) => onPointerDown(e.pointerType as PointerKind)}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <span className="activity-card__icon" aria-hidden="true">
          <ActivityIcon id={activity.id} />
        </span>

        <span className="activity-card__title">{activity.title}</span>
        <span className="activity-card__tagline">{activity.tagline}</span>

        {!soon && progress !== undefined && (
          <span className="activity-card__progress" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className={i < progress ? "is-on" : ""} />
            ))}
          </span>
        )}
      </button>

      <button
        type="button"
        className="activity-card__sound"
        aria-label={`Écouter : ${activity.title}`}
        onClick={onSpeak}
      >
        🔊
      </button>
    </div>
  );
}
