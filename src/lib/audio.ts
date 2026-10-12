const cache = new Map<string, HTMLAudioElement>();

/** Extension des fichiers audio. Modifiable pour vos propres enregistrements. */
const EXT = "aiff";

function audioUrl(file: string): string {
  return `${import.meta.env.BASE_URL}audio/fr/${file}.${EXT}`;
}

/** Joue un fichier audio local. Silencieux si absent ou non supporté. */
export function playAudio(file: string): void {
  const src = audioUrl(file);
  try {
    let el = cache.get(src);
    if (!el) {
      el = new Audio(src);
      el.preload = "auto";
      el.addEventListener("error", () => {
        console.debug("[audio] fichier absent ou illisible:", src);
      });
      cache.set(src, el);
    }
    el.currentTime = 0;
    const p = el.play();
    if (p && typeof p.catch === "function") {
      p.catch((err) => {
        console.debug("[audio] lecture impossible:", src, err?.message ?? err);
      });
    }
  } catch (err) {
    console.debug("[audio] erreur:", src, err);
  }
}
