#!/usr/bin/env bash
#
# Génère les consignes audio françaises avec la voix locale de macOS (say).
# Les fichiers produits sont des AIFF (nativement supportés par Safari/iPadOS).
#
# Usage :
#   ./scripts/generate-voices.sh
#
# Personnalisation :
#   ALPHAS_VOICE="Flo (Français (France))" ./scripts/generate-voices.sh
#   ALPHAS_RATE=150 ./scripts/generate-voices.sh
#
# Pour remplacer un fichier par votre propre enregistrement : écrasez
# simplement le .aiff correspondant dans public/audio/fr/ (même nom de fichier).
set -euo pipefail

VOICE="${ALPHAS_VOICE:-Thomas}"
RATE="${ALPHAS_RATE:-170}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/audio/fr"
mkdir -p "$OUT"

if ! command -v say >/dev/null 2>&1; then
  echo "La commande 'say' est introuvable (macOS requis)." >&2
  exit 1
fi

generate() {
  local file="$1"
  shift
  local text="$*"
  rm -f "$OUT/$file.aiff"
  say -v "$VOICE" -r "$RATE" -o "$OUT/$file.aiff" \
    --file-format=AIFF --data-format=BEI16@22050 "$text"
  echo "  ✓ $file.aiff  ← \"$text\""
}

echo "Voix : $VOICE (rate $RATE)"
echo "Dossier : $OUT"

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

echo "Terminé : $(ls -1 "$OUT"/*.aiff | wc -l | tr -d ' ') fichiers AIFF."
