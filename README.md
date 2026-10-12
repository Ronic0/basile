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

## Audio (voix + bruitages)

Tout l'audio est **local et généré automatiquement** (aucune API, aucun service
payant, aucune intervention manuelle) :

```bash
npm run voices   # voix FR via macOS `say`           -> public/audio/fr/*.aiff
npm run sfx      # bruitages via Python (stdlib)      -> public/audio/sfx/*.wav
npm run audio    # les deux
```

- La **voix française** est choisie automatiquement parmi celles présentes sur
  votre Mac (préférence : Thomas, Amélie, Jacques, puis première `fr_FR`, puis
  `fr_CA`). Forcez-en une avec `ALPHAS_VOICE="..." npm run voices`.
- Les voix et les bruitages sont des **WAV PCM 16 bits mono** (voix via
  `say` + `afconvert`), décodables **par Safari et Chrome** (l'AIFF, non
  supporté par Chrome, a été abandonné).
- **Anti-superposition** : une seule consigne vocale est jouée à la fois.
- **Volumes distincts** voix / effets : `src/lib/audio.ts`.
- **Autoplay iOS** : l'audio est déverrouillé au premier tap (`primeAudio`).
- **Manifeste** : `src/data/audioManifest.ts` (un seul endroit pour tout
  remplacer par vos propres enregistrements).
- **Test audio** : dans l'écran **Parent** (bouton « Tout tester » + statut
  présent/absent de chaque fichier).

Dossiers exacts :

- Voix : `public/audio/fr/` (voir le README du dossier)
- Bruitages : `public/audio/sfx/` (voir le README du dossier)

## Mascotte Basile

Déposez le portrait détouré ici :

```text
public/assets/basile/basile.png   (PNG, fond transparent)
```

Le composant `src/components/BasileMascot.tsx` l'affiche de façon récurrente :

| Variante   | Écran                         | Rendu                                   |
| ---------- | ----------------------------- | --------------------------------------- |
| `hero`     | Accueil                       | Grand, flottement doux + halo           |
| `guide`    | Choix d'univers, Découverte, Parent | Petit / à côté de l'Alpha, flotte  |
| `sidekick` | Mini-jeux                     | Compagnon discret, saute à la réussite  |
| `reward`   | Récompense                    | Mis en avant, bounce + étoiles          |

Props : `variant`, `mood` (`idle` / `happy` / `celebrate`), `animated`, `size`,
`position`, `showEffects`, `className`. Animations CSS uniquement
(`transform` / `opacity`), `pointer-events: none` (n'empiète jamais sur les
zones tactiles) et respect de `prefers-reduced-motion`. Si `basile.png` est
absent : aucun affichage, aucun crash (warning console).

## Fonctionnalités

- Phase de **découverte des Alphas** progressive (2 au départ, jusqu'aux 6 de BASILE).
- Univers **Pirates** : bateau, île, coffres qui s'ouvrent, pièces et trésor.
- Univers **Dragons** : ciel, nuages, montagnes et dragon animé qui vole vers le
  bon Alpha.
- Sauvegarde locale (`localStorage`) et espace parent.

