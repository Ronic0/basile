import type { Stats } from "../lib/storage";
import { ACTIVITIES, type Activity, type ActivityId } from "../data/activities";
import { BasileMascot } from "./BasileMascot";
import { GardenDecor } from "./home/GardenDecor";
import { ActivityIcon } from "./home/ActivityIcon";
import { SleepyDragon } from "./home/SleepyDragon";

interface Props {
  onSelectActivity: (id: ActivityId) => void;
  onParent: () => void;
  stats: Stats;
}

export function HomeScreen({ onSelectActivity, onParent, stats }: Props) {
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
            progress={activity.id === "jardin-alphas" ? stats.decouverte : undefined}
            onSelect={onSelectActivity}
          />
        ))}
      </main>

      <SleepyDragon className="world__dragon" />

      <button type="button" className="btn btn--ghost world__parent" onClick={onParent}>
        Parent
      </button>
    </div>
  );
}

interface CardProps {
  activity: Activity;
  progress?: number;
  onSelect: (id: ActivityId) => void;
}

function ActivityCard({ activity, progress, onSelect }: CardProps) {
  const soon = activity.status === "soon";
  return (
    <button
      type="button"
      className={`activity-card ${soon ? "is-soon" : ""}`}
      style={
        {
          background: activity.background,
          "--accent": activity.accent,
        } as React.CSSProperties
      }
      onClick={() => !soon && onSelect(activity.id)}
      disabled={soon}
      aria-label={`${activity.title}${soon ? " (bientôt disponible)" : ""}`}
    >
      {soon && (
        <span className="activity-card__ribbon" aria-hidden="true">
          bientôt
        </span>
      )}

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
  );
}
