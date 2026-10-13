/**
 * Tests légers (Node natif) des lettres-jouets « MISSION 2 ».
 *
 * Couvre : un audio `lettre-*` unique par caractère, présence des fichiers,
 * cohérence manifeste ↔ voice-lines, point de départ BASILE, distinction
 * nom / phonème / Alpha, et branchement des deux activités.
 *
 * Lancer : npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

test("un seul audio de nom de lettre par caractère (lettre-a … lettre-z)", () => {
  const data = read("src/data/letters.ts");
  assert.match(data, /audio: `lettre-\$\{letter\}`/, "id construit par gabarit");
  for (const letter of ALPHABET) {
    const id = `lettre-${letter}`;
    // Présence explicite dans le manifeste et les textes.
    assert.match(read("src/data/audioManifest.ts"), new RegExp(`id: "${id}"`), `manifeste ${id}`);
    const lines = JSON.parse(read("scripts/voice-lines.json")).lines;
    assert.ok(lines[id], `texte ${id}`);
    assert.ok(existsSync(join(ROOT, `public/audio/fr/${id}.wav`)), `wav ${id}`);
  }
});

test("aucune lettre ne réutilise un audio de mot complet", () => {
  const manifest = read("src/data/audioManifest.ts");
  for (const letter of ALPHABET) {
    const id = `lettre-${letter}`;
    assert.match(manifest, new RegExp(`id: "${id}", kind: "voice", label: "Lettre`), `${id} étiqueté Lettre`);
  }
  // Les ids de mots sont préfixés mot-/tresor- : aucun ne doit servir de lettre.
  assert.doesNotMatch(read("src/data/letters.ts"), /audio:\s*"(mot-|tresor-|alpha-)/);
});

test("les lettres du prénom BASILE sont le point de départ", () => {
  const data = read("src/data/letters.ts");
  assert.match(data, /BASILE_LETTERS = \["b", "a", "s", "i", "l", "e"\]/);
});

test("nom, phonème et personnage Alpha restent distincts", () => {
  const data = read("src/data/letters.ts");
  for (const field of ["name:", "phoneme:", "alphaId:", "alphaName:"]) {
    assert.ok(data.includes(field), `champ ${field}`);
  }
});

test("les deux activités intègrent InteractiveLetter", () => {
  for (const file of [
    "src/components/NurserieScreen.tsx",
    "src/components/JardinMagiqueScreen.tsx",
  ]) {
    assert.match(read(file), /InteractiveLetter/, `${file} : InteractiveLetter`);
  }
});

test("le composant utilise l'audio du moteur (une seule voix à la fois)", () => {
  const c = read("src/components/InteractiveLetter.tsx");
  assert.match(c, /playVoice\(letter\.audio\)/);
  assert.match(c, /onPointerDown|onPointerMove|onPointerUp/);
});
