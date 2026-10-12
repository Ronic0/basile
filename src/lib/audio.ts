import {
  SFX_DIR,
  SFX_EXT,
  VOICE_DIR,
  VOICE_EXT,
  type AudioDef,
  type AudioKind,
} from "../data/audioManifest";

/** Volumes distincts : voix intelligibles, bruitages plus discrets. */
export const DEFAULT_VOICE_VOLUME = 1;
export const DEFAULT_SFX_VOLUME = 0.5;

let voiceVolume = DEFAULT_VOICE_VOLUME;
let sfxVolume = DEFAULT_SFX_VOLUME;

export function setVoiceVolume(value: number): void {
  voiceVolume = Math.max(0, Math.min(1, value));
  if (currentVoice) currentVoice.volume = voiceVolume;
}

export function setSfxVolume(value: number): void {
  sfxVolume = Math.max(0, Math.min(1, value));
}

export function getVolumes(): { voice: number; sfx: number } {
  return { voice: voiceVolume, sfx: sfxVolume };
}

const voiceCache = new Map<string, HTMLAudioElement>();
let currentVoice: HTMLAudioElement | null = null;
/** Jeton de séquence : invalide toute lecture de voix devenue obsolète. */
let voiceSeq = 0;

function dirFor(kind: AudioKind): string {
  return kind === "sfx" ? SFX_DIR : VOICE_DIR;
}
function extFor(kind: AudioKind): string {
  return kind === "sfx" ? SFX_EXT : VOICE_EXT;
}

function pathFor(kind: AudioKind, id: string): string {
  return `${import.meta.env.BASE_URL}${dirFor(kind)}/${id}.${extFor(kind)}`;
}

/** URL publique d'une entrée du manifeste (utilisée par le diagnostic). */
export function urlFor(def: AudioDef): string {
  return `${import.meta.env.BASE_URL}${dirFor(def.kind)}/${def.id}.${extFor(def.kind)}`;
}

function describeError(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  return String(err);
}

function mediaErrorMessage(el: HTMLAudioElement): string {
  const code = el.error?.code;
  switch (code) {
    case 1:
      return "MEDIA_ERR_ABORTED";
    case 2:
      return "MEDIA_ERR_NETWORK";
    case 3:
      return "MEDIA_ERR_DECODE (format non supporté ?)";
    case 4:
      return "MEDIA_ERR_SRC_NOT_SUPPORTED (mauvais format/URL ?)";
    default:
      return "erreur inconnue";
  }
}

/** Attend que l'élément soit prêt à jouer, sans jamais bloquer indéfiniment. */
function whenReady(el: HTMLAudioElement): Promise<void> {
  if (el.readyState >= 1) return Promise.resolve();
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      el.removeEventListener("loadedmetadata", finish);
      el.removeEventListener("canplay", finish);
      el.removeEventListener("error", finish);
      resolve();
    };
    el.addEventListener("loadedmetadata", finish);
    el.addEventListener("canplay", finish);
    el.addEventListener("error", finish);
    window.setTimeout(finish, 2500);
    try {
      el.load();
    } catch {
      finish();
    }
  });
}

async function startPlayback(
  el: HTMLAudioElement,
  src: string,
  shouldPlay: () => boolean,
): Promise<void> {
  await whenReady(el);
  if (!shouldPlay()) return;
  if (el.readyState >= 1) {
    try {
      el.currentTime = 0;
    } catch {
      /* ignoré : currentTime non ajustable tant que les métadonnées manquent */
    }
  }
  try {
    await el.play();
    console.debug("[audio] lecture OK:", src);
  } catch (err) {
    console.warn(
      "[audio] échec lecture:",
      src,
      "→",
      describeError(err),
      "| média:",
      mediaErrorMessage(el),
    );
  }
}

/** Stoppe la consigne en cours (évite la superposition des voix). */
export function stopVoice(): void {
  voiceSeq++;
  if (!currentVoice) return;
  try {
    currentVoice.pause();
    currentVoice.currentTime = 0;
  } catch {
    /* ignore */
  }
}

/** Joue une consigne vocale. Une seule voix à la fois. */
export function playVoice(id: string): void {
  const src = pathFor("voice", id);
  let el = voiceCache.get(src);
  if (!el) {
    el = new Audio(src);
    el.preload = "auto";
    el.addEventListener("error", () => {
      console.warn(
        "[audio] voix introuvable/illisible:",
        src,
        "| média:",
        mediaErrorMessage(el!),
      );
    });
    voiceCache.set(src, el);
  }

  if (currentVoice && currentVoice !== el) {
    stopVoice();
  }
  currentVoice = el;
  el.volume = voiceVolume;

  const token = ++voiceSeq;
  try {
    el.pause();
  } catch {
    /* ignore */
  }
  void startPlayback(el, src, () => token === voiceSeq);
}

/** Joue un bruitage. Plusieurs effets peuvent se superposer. */
export function playSfx(id: string): void {
  const src = pathFor("sfx", id);
  try {
    const el = new Audio(src);
    el.preload = "auto";
    el.volume = sfxVolume;
    el.addEventListener("error", () => {
      console.warn(
        "[audio] bruitage introuvable/illisible:",
        src,
        "| média:",
        mediaErrorMessage(el),
      );
    });
    void startPlayback(el, src, () => true);
  } catch (err) {
    console.warn("[audio] erreur bruitage:", src, describeError(err));
  }
}

const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

let primed = false;

/**
 * Débloque l'audio sur iOS/Safari (et Chrome) : doit être appelé lors d'un
 * geste utilisateur (tap/clic) pour autoriser les lectures ultérieures.
 */
export function primeAudio(): void {
  if (primed) return;
  primed = true;
  try {
    const el = new Audio(SILENT_WAV);
    el.volume = 0;
    void startPlayback(el, "silence (déverrouillage)", () => true);
  } catch (err) {
    console.warn("[audio] prime impossible:", describeError(err));
  }
}

/** Vérifie qu'un fichier du manifeste est présent et décodable. */
export function probeAudio(def: AudioDef): Promise<boolean> {
  const src = urlFor(def);
  return new Promise((resolve) => {
    const el = new Audio();
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };
    el.addEventListener("loadedmetadata", () => finish(true), { once: true });
    el.addEventListener("error", () => finish(false), { once: true });
    window.setTimeout(() => finish(false), 2500);
    el.preload = "auto";
    el.src = src;
    try {
      el.load();
    } catch {
      finish(false);
    }
  });
}

export interface AudioDiagnostic {
  id: string;
  kind: AudioKind;
  url: string;
  status: number | null;
  contentType: string | null;
  decodable: boolean;
  playResult: "ok" | "echec" | "non testé";
  error: string | null;
}

/**
 * Diagnostic complet : requête HTTP (statut + Content-Type), décodage par le
 * navigateur, puis tentative de lecture silencieuse. Aucune boucle de retry.
 */
export async function diagnoseAudio(def: AudioDef): Promise<AudioDiagnostic> {
  const url = urlFor(def);
  const diag: AudioDiagnostic = {
    id: def.id,
    kind: def.kind,
    url,
    status: null,
    contentType: null,
    decodable: false,
    playResult: "non testé",
    error: null,
  };

  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    diag.status = res.status;
    diag.contentType = res.headers.get("content-type");
    if (!res.ok) diag.error = `HTTP ${res.status}`;
  } catch (err) {
    diag.error = describeError(err);
  }

  const el = new Audio(url);
  el.preload = "auto";
  diag.decodable = await new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };
    el.addEventListener("loadedmetadata", () => finish(true), { once: true });
    el.addEventListener("error", () => finish(false), { once: true });
    window.setTimeout(() => finish(false), 3000);
    try {
      el.load();
    } catch {
      finish(false);
    }
  });

  if (!diag.decodable) {
    diag.playResult = "echec";
    diag.error = diag.error ?? `décodage impossible (${mediaErrorMessage(el)})`;
    return diag;
  }

  try {
    el.volume = 0; // lecture silencieuse : on teste play() sans déranger
    await el.play();
    diag.playResult = "ok";
    window.setTimeout(() => {
      try {
        el.pause();
      } catch {
        /* ignore */
      }
    }, 300);
  } catch (err) {
    diag.playResult = "echec";
    diag.error = describeError(err);
  }

  return diag;
}
