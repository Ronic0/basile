# Les aventures des Alphas de Basile — V1

Mini-jeu local React + TypeScript + Vite pour apprendre à reconnaître les
Alphas du prénom **BASILE** (botte, monsieur a, serpent, madame i, limace,
madame e).

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir l'URL affichée (par défaut http://localhost:5173).

## Exposer sur le Wi-Fi local (iPad Pro)

```bash
npm run dev -- --host
```

Le terminal affiche une adresse du type `http://192.168.1.x:5173`.
Ouvrir cette adresse dans Safari sur l'iPad (même réseau Wi-Fi).

Pour le build de production (recommandé pour iPad) :

```bash
npm run build
npm run preview
```

`npm run preview` expose déjà le serveur sur le réseau (`--host`).

## Où déposer les ressources

- Images des Alphas : `public/assets/alphas/` (voir le README du dossier)
- Consignes audio : `public/audio/fr/` (voir le README du dossier)

Le jeu démarre même si ces fichiers sont absents.

## Voix françaises (générées localement)

Les consignes audio sont générées avec la voix locale de macOS (commande `say`)
au format **AIFF LPCM** (nativement supporté par Safari / iPadOS) :

```bash
npm run voices
```

Pour changer de voix ou de débit :

```bash
ALPHAS_VOICE="Flo (Français (France))" ALPHAS_RATE=150 npm run voices
```

Pour remplacer un fichier par votre propre enregistrement, écrasez simplement
le `.aiff` correspondant dans `public/audio/fr/`. L'architecture (`src/lib/audio.ts`)
permet aussi de basculer toutes les extensions (ex. `m4a`) en une ligne.

## Fonctionnalités

- Phase de **découverte des Alphas** progressive (2 au départ, jusqu'aux 6 de BASILE).
- Univers **Pirates** : bateau, île, coffres qui s'ouvrent, pièces et trésor.
- Univers **Dragons** : ciel, nuages, montagnes et dragon animé qui vole vers le
  bon Alpha.
- Sauvegarde locale (`localStorage`) et espace parent.

