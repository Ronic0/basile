/**
 * Tests légers (Node natif, aucune dépendance) des invariants du catalogue
 * de mots « MISSION 1 — Les mots vivants ».
 *
 * Couvre : mot ↔ objet, accents exacts, présence des audios, cohérence
 * manifeste ↔ voice-lines, et branchement des trois événements.
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

/** Libellés attendus : orthographe française exacte, accents compris. */
const EXPECTED_LABELS = {
  piece: "PIÈCE",
  coquillage: "COQUILLAGE",
  rubis: "RUBIS",
  emeraude: "ÉMERAUDE",
  perle: "PERLE",
  carte: "CARTE",
  tournesol: "TOURNESOL",
  fraise: "FRAISE",
  carotte: "CAROTTE",
  voiture: "VOITURE",
  robot: "ROBOT",
  fusee: "FUSÉE",
  dragon: "DRAGON",
  pomme: "POMME",
  poisson: "POISSON",
  eau: "EAU",
  balle: "BALLE",
  lampe: "LAMPE",
  coffre: "COFFRE",
  tapis: "TAPIS",
  fenetre: "FENÊTRE",
};

function parseWords() {
  const text = read("src/data/words.ts");
  const entries = [];
  const re = /id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*voice:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text))) entries.push({ id: m[1], label: m[2], voice: m[3] });
  return entries;
}

test("le catalogue couvre exactement les mots attendus, sans doublon", () => {
  const entries = parseWords();
  assert.equal(entries.length, Object.keys(EXPECTED_LABELS).length, "nombre de mots");
  const ids = entries.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, "identifiants uniques");
  assert.deepEqual([...ids].sort(), Object.keys(EXPECTED_LABELS).sort());
});

test("chaque mot correspond exactement à l'objet (accents corrects)", () => {
  for (const { id, label } of parseWords()) {
    assert.equal(label, EXPECTED_LABELS[id], `libellé de ${id}`);
  }
});

test("chaque mot possède un audio français présent", () => {
  for (const { id, voice } of parseWords()) {
    const file = `public/audio/fr/${voice}.wav`;
    assert.ok(existsSync(join(ROOT, file)), `audio manquant pour ${id} : ${file}`);
  }
});

test("les nouvelles voix mot-* sont déclarées au manifeste et textuelles", () => {
  const manifest = read("src/data/audioManifest.ts");
  const lines = JSON.parse(read("scripts/voice-lines.json")).lines;
  for (const { voice, id } of parseWords()) {
    if (!voice.startsWith("mot-")) continue;
    assert.match(manifest, new RegExp(`id:\\s*"${voice}"\\s*,\\s*kind:\\s*"voice"`), `manifeste : ${voice}`);
    assert.ok(lines[voice], `texte manquant : ${voice}`);
  }
});

test("les trois événements branchés affichent la carte mot", () => {
  const cases = [
    ["src/components/PiratesScreen.tsx", "TREASURE_WORDS"],
    ["src/components/JardinMagiqueScreen.tsx", "PLANT_WORDS"],
    ["src/components/AtelierScreen.tsx", "BUILDABLE_WORDS"],
  ];
  for (const [file, mapping] of cases) {
    const text = read(file);
    assert.match(text, /WordRevealCard/, `${file} : WordRevealCard`);
    assert.match(text, new RegExp(mapping), `${file} : ${mapping}`);
  }
});
