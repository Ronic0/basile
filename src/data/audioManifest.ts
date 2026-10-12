/**
 * Manifeste audio central. Un seul endroit à modifier pour remplacer
 * les voix ou les bruitages par vos propres enregistrements.
 *
 * - `id`    : nom du fichier sans extension.
 * - `kind`  : canal de lecture (voix ou effet sonore).
 * - `label` : libellé affiché dans le test audio de l'espace Parent.
 *
 * Dossiers :
 *   voix      -> public/audio/fr/<id>.wav
 *   bruitages -> public/audio/sfx/<id>.wav
 */

export type AudioKind = "voice" | "sfx";

export interface AudioDef {
  id: string;
  kind: AudioKind;
  label: string;
}

export const VOICE_DIR = "audio/fr";
export const VOICE_EXT = "wav";
export const SFX_DIR = "audio/sfx";
export const SFX_EXT = "wav";

export const VOICES: AudioDef[] = [
  { id: "trouve-la-botte", kind: "voice", label: "Consigne · La botte" },
  { id: "trouve-monsieur-a", kind: "voice", label: "Consigne · Monsieur a" },
  { id: "trouve-le-serpent", kind: "voice", label: "Consigne · Le serpent" },
  { id: "trouve-madame-i", kind: "voice", label: "Consigne · Madame i" },
  { id: "trouve-la-limace", kind: "voice", label: "Consigne · La limace" },
  { id: "trouve-madame-e", kind: "voice", label: "Consigne · Madame e" },
  { id: "alpha-botte", kind: "voice", label: "Découverte · La botte" },
  { id: "alpha-monsieur-a", kind: "voice", label: "Découverte · Monsieur a" },
  { id: "alpha-serpent", kind: "voice", label: "Découverte · Le serpent" },
  { id: "alpha-madame-i", kind: "voice", label: "Découverte · Madame i" },
  { id: "alpha-limace", kind: "voice", label: "Découverte · La limace" },
  { id: "alpha-madame-e", kind: "voice", label: "Découverte · Madame e" },
  { id: "bravo", kind: "voice", label: "Encouragement · Bravo" },
  { id: "bien-joue", kind: "voice", label: "Encouragement · Bien joué" },
  { id: "reessaie", kind: "voice", label: "Encouragement · Essaie encore" },
];

export const SFX: AudioDef[] = [
  { id: "coffre", kind: "sfx", label: "Coffre qui s'ouvre" },
  { id: "piece", kind: "sfx", label: "Pièces" },
  { id: "etoile", kind: "sfx", label: "Étoile" },
  { id: "dragon", kind: "sfx", label: "Dragon" },
  { id: "reussite", kind: "sfx", label: "Réussite (fanfare)" },
  { id: "eclosion", kind: "sfx", label: "Éclosion d'œuf" },
  { id: "moteur", kind: "sfx", label: "Moteur de course" },
  { id: "capture", kind: "sfx", label: "Capture de créature" },
  { id: "construction", kind: "sfx", label: "Construction" },
  { id: "sirene", kind: "sfx", label: "Sirène douce" },
  { id: "pouvoir", kind: "sfx", label: "Super-pouvoir" },
];

export const ALL_AUDIO: AudioDef[] = [...VOICES, ...SFX];
