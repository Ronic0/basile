import { useEffect, useRef, useState } from "react";
import { ALL_AUDIO, type AudioDef } from "../data/audioManifest";
import {
  diagnoseAudio,
  playSfx,
  playVoice,
  probeAudio,
  type AudioDiagnostic,
} from "../lib/audio";

type Status = "unknown" | "ok" | "missing";

function play(def: AudioDef): void {
  if (def.kind === "sfx") {
    playSfx(def.id);
  } else {
    playVoice(def.id);
  }
}

export function AudioTestPanel() {
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [diags, setDiags] = useState<Record<string, AudioDiagnostic>>({});
  const [playing, setPlaying] = useState<string | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    ALL_AUDIO.forEach((def) => {
      probeAudio(def).then((ok) => {
        if (cancelled) return;
        setStatus((prev) => ({ ...prev, [def.id]: ok ? "ok" : "missing" }));
      });
    });
    return () => {
      cancelled = true;
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const handlePlay = (def: AudioDef) => {
    play(def);
    setPlaying(def.id);
    const delay = def.kind === "sfx" ? 900 : 1600;
    const t = window.setTimeout(() => {
      setPlaying((current) => (current === def.id ? null : current));
    }, delay);
    timers.current.push(t);
  };

  const testAll = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    let elapsed = 0;
    ALL_AUDIO.forEach((def) => {
      const t = window.setTimeout(() => handlePlay(def), elapsed);
      timers.current.push(t);
      elapsed += def.kind === "sfx" ? 1100 : 2200;
    });
  };

  const runDiagnostics = async () => {
    if (diagnosing) return;
    setDiagnosing(true);
    for (const def of ALL_AUDIO) {
      const result = await diagnoseAudio(def);
      setDiags((prev) => ({ ...prev, [def.id]: result }));
    }
    setDiagnosing(false);
  };

  return (
    <section className="audio-test">
      <div className="audio-test__head">
        <h3 className="audio-test__title">Test audio</h3>
        <div className="audio-test__actions">
          <button type="button" className="btn btn--ghost" onClick={testAll}>
            ▶ Tout tester
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={runDiagnostics}
            disabled={diagnosing}
          >
            {diagnosing ? "…" : "🩺 Diagnostiquer"}
          </button>
        </div>
      </div>

      <ul className="audio-test__list">
        {ALL_AUDIO.map((def) => {
          const state = status[def.id] ?? "unknown";
          const diag = diags[def.id];
          return (
            <li
              key={def.id}
              className={`audio-test__item is-${state} ${
                playing === def.id ? "is-playing" : ""
              }`}
            >
              <div className="audio-test__row">
                <button
                  type="button"
                  className="audio-test__play"
                  onClick={() => handlePlay(def)}
                  aria-label={`Écouter ${def.label}`}
                >
                  {playing === def.id ? "🔈" : "🔊"}
                </button>
                <span className="audio-test__label">{def.label}</span>
                <span className="audio-test__kind">
                  {def.kind === "sfx" ? "effet" : "voix"}
                </span>
                <span className="audio-test__status" aria-hidden="true">
                  {state === "ok" ? "✓" : state === "missing" ? "✕" : "…"}
                </span>
              </div>

              {diag && (
                <div className="audio-test__diag">
                  <span className="audio-test__diag-line">
                    HTTP <b>{diag.status ?? "—"}</b> · format{" "}
                    <b>{diag.contentType ?? "—"}</b> · décodage{" "}
                    <b>{diag.decodable ? "ok" : "échec"}</b> · play(){" "}
                    <b>{diag.playResult}</b>
                  </span>
                  <span className="audio-test__diag-url">{diag.url}</span>
                  {diag.error && (
                    <span className="audio-test__diag-error">{diag.error}</span>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="audio-test__hint">
        ✓ / ✕ = présence du fichier. « Diagnostiquer » vérifie URL, statut HTTP,
        format, décodage et lecture. 📁 <code>public/audio/fr/</code> ·{" "}
        <code>public/audio/sfx/</code>.
      </p>
    </section>
  );
}
