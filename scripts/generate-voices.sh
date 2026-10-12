#!/usr/bin/env bash
#
# Génère les consignes audio françaises avec la voix locale de macOS (say),
# puis les convertit en WAV PCM 16 bits mono (compatibles Safari ET Chrome).
#
# Usage :
#   ./scripts/generate-voices.sh
#   npm run voices
#
# Personnalisation :
#   ALPHAS_VOICE="Flo (Français (France))" ./scripts/generate-voices.sh
#   ALPHAS_RATE=150 ./scripts/generate-voices.sh
#
# Pour remplacer un fichier par votre propre enregistrement : écrasez
# simplement le .wav correspondant dans public/audio/fr/ (même nom de fichier).
#
# Remarque : les anciens fichiers .aiff présents ne sont PAS supprimés.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/audio/fr"
RATE="${ALPHAS_RATE:-170}"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

for bin in say afconvert; do
  if ! command -v "$bin" >/dev/null 2>&1; then
    echo "La commande '$bin' est introuvable (macOS requis)." >&2
    exit 1
  fi
done

# Choisit automatiquement une voix française disponible sur ce Mac.
pick_voice() {
  if [ -n "${ALPHAS_VOICE:-}" ]; then
    printf '%s' "$ALPHAS_VOICE"
    return
  fi

  local listing
  listing="$(say -v '?' 2>/dev/null || true)"

  local preferred
  for preferred in "Thomas" "Amélie" "Jacques" "Flo (Français (France))"; do
    if printf '%s\n' "$listing" | grep -qF "$preferred"; then
      printf '%s' "$preferred"
      return
    fi
  done

  local name
  name="$(printf '%s\n' "$listing" | awk '/fr_FR/ {sub(/[ \t]+fr_FR.*$/, ""); print; exit}')"
  if [ -n "$name" ]; then
    printf '%s' "$name"
    return
  fi

  name="$(printf '%s\n' "$listing" | awk '/fr_CA/ {sub(/[ \t]+fr_CA.*$/, ""); print; exit}')"
  printf '%s' "$name"
}

VOICE="$(pick_voice)"

if [ -z "$VOICE" ]; then
  cat >&2 <<'MSG'
Aucune voix française n'a été trouvée sur ce Mac.
Installez-en une dans : Réglages Système > Accessibilité > Contenu énoncé > Voix système > Gérer les voix > Français.
Puis relancez : npm run voices
MSG
  exit 1
fi

mkdir -p "$OUT"

generate() {
  local file="$1"
  shift
  local text="$*"
  local tmp="$TMP_DIR/$file.aiff"
  local out="$OUT/$file.wav"

  say -v "$VOICE" -r "$RATE" -o "$tmp" \
    --file-format=AIFF --data-format=BEI16@22050 "$text"
  rm -f "$out"
  afconvert -f WAVE -d LEI16@22050 -c 1 "$tmp" "$out"
  echo "  ✓ $file.wav  ← \"$text\""
}

echo "Voix sélectionnée : $VOICE (débit $RATE)"
echo "Dossier : $OUT"
echo "Format : WAV PCM 16 bits, mono, 22050 Hz"

# Consignes de jeu
generate trouve-la-botte    "Trouve la botte."
generate trouve-monsieur-a  "Trouve monsieur a."
generate trouve-le-serpent  "Trouve le serpent."
generate trouve-madame-i    "Trouve madame i."
generate trouve-la-limace   "Trouve la limace."
generate trouve-madame-e    "Trouve madame e."

# Feedback
generate bravo      "Bravo !"
generate bien-joue  "Bien joué !"
generate reessaie   "Essaie encore !"

# Phase de découverte
generate alpha-botte       "La botte."
generate alpha-monsieur-a  "Monsieur a."
generate alpha-serpent     "Le serpent."
generate alpha-madame-i    "Madame i."
generate alpha-limace      "La limace."
generate alpha-madame-e    "Madame e."

echo "Terminé : $(ls -1 "$OUT"/*.wav 2>/dev/null | wc -l | tr -d ' ') fichiers WAV."
