/**
 * Tests légers (Node natif) du mini-jeu « Jouer avec le mot » — MISSION 3.
 *
 * Couvre : mots activés/refusés, identifiants uniques pour lettres répétées,
 * accents, modes, audio du mot complet (jamais lettre à lettre), absence de
 * pénalité/chronomètre, et ouverture facultative via WordRevealCard.
 *
 * Lancer : npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

const WORDS = read("src/data/words.ts");
const GAME = read("src/lib/wordGame.ts");
const PLAY = read("src/components/WordPlayground.tsx");
const CARD = read("src/components/WordRevealCard.tsx");

test("les mots proposés sont activés uniquement s'ils existent au catalogue", () => {
  // Catalogue de la mission 1.
  for (const id of ["eau", "robot", "pomme", "perle", "rubis"]) {
    assert.match(WORDS, new RegExp(`id: "${id}"`), `catalogue : ${id}`);
  }
  // ÎLE et OR n'ont pas d'objet dans le catalogue → non activés.
  assert.doesNotMatch(WORDS, /id: "ile"/, "pas de mot ile");
  assert.doesNotMatch(WORDS, /id: "or"/, "pas de mot or");
  // Le jeu dérive des mots du catalogue.
  assert.match(GAME, /PLAYABLE_WORD_IDS: WordId\[\] = WORDS\.map/);
});

test("chaque occurrence reçoit un identifiant unique (lettres répétées)", () => {
  assert.match(GAME, /id: `\$\{word\}-\$\{i\}`/, "id unique par index");
  assert.match(PLAY, /key=\{tileId\}/, "clé par identifiant de tuile");
});

test("les accents sont conservés à l'écrit et normalisés pour l'audio", () => {
  // Affichage : caractère brut du libellé (accents conservés).
  assert.match(GAME, /char,/);
  // Audio : lettre de base (é → e) via décomposition NFD.
  assert.match(GAME, /normalize\("NFD"\)/);
  assert.match(PLAY, /lettre-\$\{base\}/);
});

test("le mot est prononcé en entier, jamais épelé lettre à lettre", () => {
  assert.match(PLAY, /playVoice\(entry\.voice\)/);
  // Aucune concaténation de noms de lettres pour former le mot.
  assert.doesNotMatch(PLAY, /lettre-[\s\S]{0,40}\.join/);
});

test("les deux modes existent, découverte par défaut, sans pénalité ni chrono", () => {
  assert.match(PLAY, /useState<Mode>\("decouverte"\)/);
  assert.match(PLAY, /"defi"/);
  assert.match(PLAY, /Découverte/);
  assert.match(PLAY, /Défi doux/);
  assert.match(PLAY, /Aide/);
  assert.match(PLAY, /Recommencer/);
  // Pas de minuteur de jeu ni de score : on inspecte le CODE, pas les commentaires.
  const code = PLAY.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  assert.doesNotMatch(code, /setInterval|score|chrono|penal|pénal/i);
});

test("le mini-jeu n'est ouvert que sur action (pas automatiquement)", () => {
  assert.match(CARD, /isPlayableWord/);
  assert.match(CARD, /WordPlayground/);
  assert.match(CARD, /onClick=\{startPlay\}/);
  // startPlay n'est jamais déclenché dans un effet.
  const effects = CARD.match(/useEffect\([\s\S]*?\}, \[[^\]]*\]\);/g) ?? [];
  for (const block of effects) {
    assert.doesNotMatch(block, /startPlay/, "pas d'ouverture automatique");
  }
});
