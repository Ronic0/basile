# Voix neuronales locales (Kokoro / MLX) — outil de développement

Ce dossier contient `voice-generator.py`, un générateur de voix françaises
**local**, qui ne fait **pas** partie du jeu : aucun modèle n'est embarqué dans
l'application, et le jeu final fonctionne hors-ligne sans lui.

- `scripts/generate-voices.sh` — solution historique macOS `say` (repli, inchangée).
- `scripts/voice-lines.json` — **source de vérité** des textes prononcés et de
  leur rôle, alignée sur les ids du manifeste `src/data/audioManifest.ts`.
- `scripts/voice-generator.py` — nouveau générateur (Kokoro MLX + repli `say`).

## Prérequis (Apple Silicon)

- macOS sur Apple Silicon (M1 ou plus récent).
- Python 3.10–3.12 (testé avec 3.12.6). **Python 3.13+ n'est pas supporté**
  (incompatibilités spacy/pydantic de la chaîne `mlx-audio`).
- Aucun Homebrew n'est nécessaire : la lib `espeak-ng` est fournie par le paquet
  Python `espeakng_loader`.

## Installation (environnement isolé)

```bash
npm run voices:setup
# équivaut à :
#   python3 -m venv scripts/.venv-kokoro
#   scripts/.venv-kokoro/bin/python -m pip install --upgrade pip
#   scripts/.venv-kokoro/bin/python -m pip install mlx-audio 'misaki[en]'
```

Le venv `scripts/.venv-kokoro/` est ignoré par git. Les **dépendances du jeu ne
sont jamais touchées** (aucun paquet dans `package.json`).

Le premier appel télécharge le modèle `mlx-community/Kokoro-82M-bf16` (~320 Mo)
dans le cache Hugging Face. Les générations suivantes sont **hors-ligne**.

## Moteur et voix

- Modèle : **Kokoro-82M** via **MLX** (Apple Silicon).
- Langue : code `f` (français), G2P `espeak` fr-fr.
- **Une seule voix française native : `ff_siwis`** (réf. `VOICES.md` de
  Kokoro-82M). Il n'existe donc pas plusieurs voix FR pour comparer entre elles.

### Différenciation par rôle

Faute de voix FR multiples, les rôles sont différenciés par la **vitesse**,
définie dans `scripts/voice-lines.json` → `roles` :

| Rôle       | Voix      | Vitesse | Usage                             |
| ---------- | --------- | ------- | --------------------------------- |
| narratrice | `ff_siwis`| 1.00    | consignes, découverte, activités  |
| victoire   | `ff_siwis`| 1.06    | encouragements, réussites         |
| personnage | `ff_siwis`| 0.96    | noms d'Alphas (album)             |

Pour utiliser une autre voix FR, changez `voice` dans `roles` (impossible
aujourd'hui avec Kokoro FR) ou passez par une autre famille de modèles.

## Utilisation

```bash
# Vérifier que les textes couvrent exactement le manifeste (sans écrire)
npm run voices:check

# Lister ids, textes et rôles
scripts/.venv-kokoro/bin/python scripts/voice-generator.py --list

# Générer les 5 phrases de comparaison + page HTML dans tmp/voice-comparison/
npm run voices:samples

# Générer une seule voix vers un dossier de test (ne touche pas la prod)
scripts/.venv-kokoro/bin/python scripts/voice-generator.py --id bravo --out tmp/voice-test

# Générer tout le catalogue (REMPLACE la production — à faire après validation)
scripts/.venv-kokoro/bin/python scripts/voice-generator.py --all

# Rapport des prononciations à vérifier
npm run voices:report
```

Options utiles : `--engine auto|kokoro|say`, `--force`, `--no-fallback`,
`--say-voice "..."`, `--report [chemin]`.

Par défaut, **aucune écriture** : il faut `--all`, `--id …` ou `--comparison`.
La sortie par défaut est `public/audio/fr/` (mêmes ids que le jeu).

## Format audio

- Kokoro : **WAV PCM 16 bits mono 24000 Hz** — fréquence **native** du modèle,
  aucun rééchantillonnage à basse fréquence (bonne qualité pour iPad).
- Repli `say` : WAV PCM 16 bits mono 22050 Hz (format historique du jeu).
- Les deux formats sont décodés par Safari et Chrome.

## Cache et repli

- **Cache** : `.voice-cache.json` dans le dossier de sortie. Une voix dont le
  texte, la voix, la vitesse et le moteur n'ont pas changé n'est pas régénérée
  (`--force` pour forcer).
- **Repli** : si Kokoro est indisponible, `--engine auto` bascule sur macOS
  `say`. En cas d'échec ponctuel d'une ligne, le repli `say` s'applique et est
  journalisé (`--no-fallback` pour désactiver).

## Limites connues

1. **Une seule voix FR** : Kokoro-82M n'expose que `ff_siwis`. Pas de panel de
   voix FR, donc pas de vraie comparaison entre voix neuronales FR.
2. **Chunking** : `mlx-audio` ne gère pas le découpage automatique pour les
   langues espeak ; le générateur découpe lui-même aux ponctuations fortes
   (limite ~180 caractères) pour éviter les troncatures.
3. **Homebrew cassé sur ce Mac** : `brew install espeak-ng` échoue
   (`Bad CPU type in executable` — Homebrew x86 sous Rosetta sans Rosetta
   fonctionnel). **Sans impact** : `espeakng_loader` (pip) fournit la lib.
4. **Prononciation heuristique** : le rapport (`--report`) signale des cas
   suspects (noms de lettres, mots inventés, épellation) mais ne prouve pas une
   mauvaise prononciation ; l'écoute reste nécessaire.
5. `ffmpeg` absent : non requis (écriture WAV via la stdlib Python).
