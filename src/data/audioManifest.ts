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

import { ALPHAS } from "./alphas";

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

const CORE_VOICES: AudioDef[] = [
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
  { id: "pirates-choisis", kind: "voice", label: "Pirates · Choisis une île" },
  { id: "pirates-abordage", kind: "voice", label: "Pirates · À l'abordage" },
  { id: "pirates-tresor", kind: "voice", label: "Pirates · Trésor trouvé" },
  { id: "pirates-tresors", kind: "voice", label: "Pirates · Regardons tes trésors" },
  { id: "tresor-piece", kind: "voice", label: "Trésor · Pièces d'or" },
  { id: "tresor-coquillage", kind: "voice", label: "Trésor · Coquillage" },
  { id: "tresor-rubis", kind: "voice", label: "Trésor · Rubis" },
  { id: "tresor-emeraude", kind: "voice", label: "Trésor · Émeraude" },
  { id: "tresor-perle", kind: "voice", label: "Trésor · Perle" },
  { id: "tresor-carte", kind: "voice", label: "Trésor · Carte ancienne" },
  { id: "atelier-bienvenue", kind: "voice", label: "Atelier · Bienvenue" },
  { id: "atelier-reussi", kind: "voice", label: "Atelier · Construction terminée" },
  { id: "jardin-bienvenue", kind: "voice", label: "Jardin · Bienvenue" },
  { id: "jardin-bravo", kind: "voice", label: "Jardin · Belle récolte" },
  { id: "nurserie-nourrir", kind: "voice", label: "Nurserie · Nourris ton dragon" },
  { id: "nurserie-boire", kind: "voice", label: "Nurserie · Donne-lui à boire" },
  { id: "nurserie-caresser", kind: "voice", label: "Nurserie · Caresse ton dragon" },
  { id: "nurserie-dormir", kind: "voice", label: "Nurserie · Il a sommeil" },
  { id: "nurserie-content", kind: "voice", label: "Nurserie · Bravo, ton dragon est content" },
  { id: "activite-jardin-alphas", kind: "voice", label: "Portail · Le Jardin des Alphas" },
  { id: "activite-nurserie", kind: "voice", label: "Portail · La Nurserie des Dragons" },
  { id: "activite-jardin-magique", kind: "voice", label: "Portail · Le Jardin Magique" },
  { id: "activite-atelier", kind: "voice", label: "Portail · L'Atelier de Construction" },
  { id: "activite-port-pirates", kind: "voice", label: "Portail · Le Port des Pirates" },
  { id: "activite-cabane", kind: "voice", label: "Portail · Ma Cabane" },
  { id: "bravo", kind: "voice", label: "Encouragement · Bravo" },
  { id: "bien-joue", kind: "voice", label: "Encouragement · Bien joué" },
  { id: "reessaie", kind: "voice", label: "Encouragement · Essaie encore" },
  { id: "boss-intro", kind: "voice", label: "Boss · Introduction du dragon" },
  { id: "boss-pierre", kind: "voice", label: "Boss · Bravo, une pierre de plus" },
  { id: "boss-lettre-b", kind: "voice", label: "Boss · Lettre B" },
  { id: "boss-lettre-a", kind: "voice", label: "Boss · Lettre A" },
  { id: "boss-lettre-s", kind: "voice", label: "Boss · Lettre S" },
  { id: "boss-lettre-i", kind: "voice", label: "Boss · Lettre I" },
  { id: "boss-lettre-l", kind: "voice", label: "Boss · Lettre L" },
  { id: "boss-lettre-e", kind: "voice", label: "Boss · Lettre E" },
  { id: "boss-indice", kind: "voice", label: "Boss · Indice" },
  { id: "boss-victoire", kind: "voice", label: "Boss · Victoire" },
];

/** Voix du catalogue étendu, dérivées de `alphas.ts` (hors six BASILE déjà listés). */
const CHARACTER_VOICES: AudioDef[] = ALPHAS.filter((a) => a.group !== "basile").flatMap(
  (a) => [
    { id: a.discoveryAudio, kind: "voice" as const, label: `Album · ${a.name}` },
    { id: a.audioName, kind: "voice" as const, label: `Consigne · ${a.name}` },
  ],
);

export const VOICES: AudioDef[] = [...CORE_VOICES, ...CHARACTER_VOICES];

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
  { id: "dragon-content", kind: "sfx", label: "Dragon content" },
  { id: "ronflement", kind: "sfx", label: "Petit ronflement" },
  { id: "mastication", kind: "sfx", label: "Mastication" },
  { id: "gorgee", kind: "sfx", label: "Gorgée d'eau" },
  { id: "ailes", kind: "sfx", label: "Battements d'ailes" },
  { id: "flamme", kind: "sfx", label: "Petite flamme" },
  { id: "balle", kind: "sfx", label: "Rebond de balle" },
  { id: "plantation", kind: "sfx", label: "Plantation" },
  { id: "eau", kind: "sfx", label: "Eau qui coule" },
  { id: "croissance", kind: "sfx", label: "Croissance magique" },
  { id: "recolte", kind: "sfx", label: "Récolte" },
  { id: "papillon", kind: "sfx", label: "Papillon" },
  { id: "emboite", kind: "sfx", label: "Pièce emboîtée" },
  { id: "construit", kind: "sfx", label: "Construction terminée" },
  { id: "robot", kind: "sfx", label: "Robot" },
  { id: "fusee", kind: "sfx", label: "Fusée" },
  { id: "depart", kind: "sfx", label: "Départ du bateau" },
  { id: "vagues", kind: "sfx", label: "Vagues" },
  { id: "mouette", kind: "sfx", label: "Mouette" },
  { id: "tresor", kind: "sfx", label: "Découverte d'un trésor" },
  { id: "coffre-ouvre", kind: "sfx", label: "Ouverture de coffre" },
  { id: "surprise", kind: "sfx", label: "Petite surprise" },
];

export const ALL_AUDIO: AudioDef[] = [...VOICES, ...SFX];
