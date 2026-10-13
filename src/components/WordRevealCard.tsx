import { useCallback, useEffect, useRef, useState } from "react";
import { playVoice, stopVoice } from "../lib/audio";
import { firstLetter, getWord, restOfWord, type WordId } from "../data/words";
import { isPlayableWord } from "../lib/wordGame";
import { WordPlayground } from "./WordPlayground";
import { WordArt } from "./words/WordArt";

interface Props {
  word: WordId;
  onClose: () => void;
  /**
   * Délai avant fermeture automatique (0 = fermeture manuelle uniquement).
   * Empêche la carte de masquer durablement le jeu.
   */
  autoCloseMs?: number;
}

/**
 * Carte animée de découverte d'un mot : illustration, mot en grandes lettres,
 * première lettre mise en évidence, bouton haut-parleur. Toucher le mot le
 * réécoute. La carte prononce uniquement le mot complet (jamais les lettres).
 */
export function WordRevealCard({ word, onClose, autoCloseMs = 9000 }: Props) {
  const entry = getWord(word);
  const playable = isPlayableWord(word);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const timer = useRef<number | null>(null);
  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  /** (Re)programme la fermeture automatique (jamais pendant le mini-jeu). */
  const scheduleClose = useCallback(() => {
    clearTimer();
    if (autoCloseMs > 0 && !playingRef.current) {
      timer.current = window.setTimeout(() => closeRef.current(), autoCloseMs);
    }
  }, [autoCloseMs, clearTimer]);

  /** Prononce le mot complet et (re)programme la fermeture automatique. */
  const sayWord = useCallback(() => {
    playVoice(entry.voice);
    scheduleClose();
  }, [entry.voice, scheduleClose]);

  useEffect(() => {
    sayWord();
    return () => {
      clearTimer();
      stopVoice();
    };
  }, [sayWord, clearTimer]);

  const handleClose = useCallback(() => {
    clearTimer();
    stopVoice();
    closeRef.current();
  }, [clearTimer]);

  /** Ouvre le mini-jeu : la carte reste derrière, la fermeture auto est suspendue. */
  const startPlay = useCallback(() => {
    playingRef.current = true;
    clearTimer();
    stopVoice();
    setPlaying(true);
  }, [clearTimer]);

  /** Quitte le mini-jeu et revient à la carte. */
  const exitPlay = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    scheduleClose();
  }, [scheduleClose]);

  const letter = firstLetter(entry.label);
  const rest = restOfWord(entry.label);

  return (
    <div
      className="word-card"
      role="dialog"
      aria-modal="true"
      aria-label={`Mot : ${entry.label}`}
      onClick={handleClose}
    >
      <div className="word-card__panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="word-card__close"
          onClick={handleClose}
          aria-label="Fermer"
        >
          ✖️
        </button>

        <div className="word-card__art" aria-hidden="true">
          <WordArt id={word} />
        </div>

        <button
          type="button"
          className="word-card__word"
          onClick={sayWord}
          aria-label={`Réécouter le mot ${entry.label}`}
        >
          <span className="word-card__letter">{letter}</span>
          <span className="word-card__rest">{rest}</span>
        </button>

        <div className="word-card__actions">
          <button
            type="button"
            className="word-card__speaker"
            onClick={sayWord}
            aria-label={`Écouter ${entry.label}`}
          >
            <SpeakerIcon />
          </button>
          {playable && (
            <button type="button" className="btn word-card__play" onClick={startPlay}>
              🧩 Jouer avec le mot
            </button>
          )}
          <button type="button" className="btn btn--play word-card__continue" onClick={handleClose}>
            Continuer
          </button>
        </div>
      </div>

      {playing && <WordPlayground word={word} onClose={exitPlay} />}
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 18 h8 l10 -9 v30 l-10 -9 h-8 z" fill="currentColor" />
      <path
        d="M32 16 q6 8 0 16 M37 11 q10 13 0 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
