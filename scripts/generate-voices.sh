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

# Catalogue étendu — noms des personnages (découverte + album)
generate alpha-monsieur-o             "Monsieur o."
generate alpha-monstre                "Le monstre."
generate alpha-robinet                "Le robinet."
generate alpha-mademoiselle-u         "Mademoiselle u."
generate alpha-fuse-aigue             "La fusée."
generate alpha-vent                   "Le vent."
generate alpha-nez                    "Le nez."
generate alpha-toupie                 "La toupie."
generate alpha-perroquet              "Le perroquet."
generate alpha-cornichon              "Le cornichon."
generate alpha-dame                   "La dame."
generate alpha-jet-deau               "Le jet d'eau."
generate alpha-gulu                   "Le gulu."
generate alpha-hutte                  "La hutte."
generate alpha-kangourou              "Le kangourou."
generate alpha-quille                 "La quille."
generate alpha-wagon                  "Le wagon."
generate alpha-xiou                   "Le xiou."
generate alpha-monsieur-y             "Monsieur y."
generate alpha-zibulus                "Le zibulus."
generate alpha-chat                   "Le chat."
generate alpha-madame-e-aigu          "Madame é."
generate alpha-madame-e-grave         "Madame è."
generate alpha-madame-e-circonflexe   "Madame ê."

# Catalogue étendu — consignes de jeu (ids alignés sur le catalogue)
generate trouve-monsieur-o            "Trouve monsieur o."
generate trouve-monstre               "Trouve le monstre."
generate trouve-robinet               "Trouve le robinet."
generate trouve-mademoiselle-u        "Trouve mademoiselle u."
generate trouve-fuse-aigue            "Trouve la fusée."
generate trouve-vent                  "Trouve le vent."
generate trouve-nez                   "Trouve le nez."
generate trouve-toupie                "Trouve la toupie."
generate trouve-perroquet             "Trouve le perroquet."
generate trouve-cornichon             "Trouve le cornichon."
generate trouve-dame                  "Trouve la dame."
generate trouve-jet-deau              "Trouve le jet d'eau."
generate trouve-gulu                  "Trouve le gulu."
generate trouve-hutte                 "Trouve la hutte."
generate trouve-kangourou             "Trouve le kangourou."
generate trouve-quille                "Trouve la quille."
generate trouve-wagon                 "Trouve le wagon."
generate trouve-xiou                  "Trouve le xiou."
generate trouve-monsieur-y            "Trouve monsieur y."
generate trouve-zibulus               "Trouve le zibulus."
generate trouve-chat                  "Trouve le chat."
generate trouve-madame-e-aigu         "Trouve madame é."
generate trouve-madame-e-grave        "Trouve madame è."
generate trouve-madame-e-circonflexe  "Trouve madame ê."

# Ma cabane
generate cabane-bienvenue "Bienvenue dans ta cabane, Basile !"
generate cabane-dehors    "Regarde dehors !"
generate cabane-lumiere   "La lumière !"

# Port des pirates
generate pirates-choisis   "Choisis une île, capitaine Basile !"
generate pirates-abordage  "À l'abordage !"
generate pirates-tresor    "Bravo, tu as trouvé un trésor !"
generate pirates-tresors   "Regardons tes trésors !"
generate tresor-piece      "Des pièces d'or."
generate tresor-coquillage "Un coquillage."
generate tresor-rubis      "Un rubis."
generate tresor-emeraude   "Une émeraude."
generate tresor-perle      "Une perle."
generate tresor-carte      "Une carte ancienne."

# Mots du Monde de Basile (catalogue src/data/words.ts)
generate mot-piece     "Une pièce."
generate mot-carte     "Une carte."
generate mot-tournesol "Un tournesol."
generate mot-fraise    "Une fraise."
generate mot-carotte   "Une carotte."
generate mot-voiture   "Une voiture."
generate mot-robot     "Un robot."
generate mot-dragon    "Un dragon."
generate mot-pomme     "Une pomme."
generate mot-poisson   "Un poisson."
generate mot-eau       "De l'eau."
generate mot-balle     "Une balle."
generate mot-lampe     "Une lampe."
generate mot-coffre    "Un coffre."
generate mot-tapis     "Un tapis."
generate mot-fenetre   "Une fenêtre."

# Atelier de construction
generate atelier-bienvenue "Bienvenue dans l'atelier de Basile ! Choisis un objet à construire."
generate atelier-reussi    "Bravo ! Ta construction est terminée !"

# Jardin magique
generate jardin-bienvenue "Bienvenue dans ton jardin, Basile ! Plante une graine !"
generate jardin-bravo     "Bravo, belle récolte !"

# Nurserie des dragons
generate nurserie-nourrir  "Nourris ton dragon !"
generate nurserie-boire    "Donne-lui à boire !"
generate nurserie-caresser "Caresse ton dragon !"
generate nurserie-dormir   "Il a sommeil !"
generate nurserie-content  "Bravo Basile, ton dragon est content !"

# Portail du Monde de Basile (noms d'activités)
generate activite-jardin-alphas  "Le Jardin des Alphas."
generate activite-nurserie       "La Nurserie des Dragons."
generate activite-jardin-magique "Le Jardin Magique."
generate activite-atelier        "L'Atelier de Construction."
generate activite-port-pirates   "Le Port des Pirates."
generate activite-cabane         "Ma Cabane."

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

# Boss du prénom
generate boss-intro        "Oh non ! Le dragon a mélangé les Alphas de ton prénom. Aide Basile à retrouver B A S I L E !"
generate boss-pierre       "Bravo Basile ! Une pierre de plus !"
generate boss-lettre-b     "Trouve le B. C'est la botte."
generate boss-lettre-a     "Trouve le A. C'est monsieur a."
generate boss-lettre-s     "Trouve le S. C'est le serpent."
generate boss-lettre-i     "Trouve le I. C'est madame i."
generate boss-lettre-l     "Trouve le L. C'est la limace."
generate boss-lettre-e     "Trouve le E. C'est madame e."
generate boss-indice       "Indice : regarde bien la forme de la lettre."
generate boss-victoire     "Bravo Basile ! Tu as retrouvé ton prénom !"

echo "Terminé : $(ls -1 "$OUT"/*.wav 2>/dev/null | wc -l | tr -d ' ') fichiers WAV."
