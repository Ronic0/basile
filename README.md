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

### Lisibilité des images

Les PNG sources ont de grandes marges transparentes. On génère des versions
recadrées (sans déformer ni retoucher les couleurs) :

```bash
npm run alphas   # python3 scripts/prepare-alphas.py (requiert Pillow)
```

Sortie dans `public/assets/alphas/optimized/`. Le composant `AlphaCard` utilise
`object-fit: contain`, un fond clair neutre, un cadre à la couleur de l'Alpha et
de petites animations (flottement, apparition, saut à la réussite).

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

## Le Monde de Basile (portail d'accueil)

L'écran d'accueil est un portail illustré (jardin, soleil, nuages, cabane,
chemin, fleurs, papillons, petit dragon endormi) vers **six grandes activités**.
« Le Jardin des Alphas » ouvre l'intégralité du jeu pédagogique déjà existant
(8 univers + boss + découverte progressive) ; les autres activités sont des
espaces libres. « La Nurserie des dragons » et « Le Jardin magique » sont jouables (voir
ci-dessous) ; « Atelier », « Port des pirates » et « Ma cabane » sont affichées
comme extensions futures (désactivées).

### Le Jardin magique (V1)

Activité de jardinage libre (aucun questionnaire, aucune pénalité) : trois
graines (tournesol, fraisier, carotte) à planter dans **quatre parcelles**,
arrosoir pour faire grandir (chaque arrosage = une étape, jusqu'à maturité),
puis récolte (fleur / fraise / carotte) qui remplit le panier et libère la
parcelle. Scène SVG/CSS (`src/components/jardin/`) : ciel, soleil, nuages,
arbres, cabanon, fleurs, papillons. Réactions surprises : papillon qui se pose,
coccinelle qui traverse, tournesol qui tourne vers le soleil. Bruitages et
voix locales (`public/audio/sfx/plantation|eau|croissance|recolte|papillon.wav`,
`public/audio/fr/jardin-*.wav`). Sauvegarde dédiée
`alphas-de-basile/jardin/v1` (`src/lib/garden.ts`), additive et non destructive.

### La Nurserie des dragons (V1)

Petite expérience de jeu libre (aucune question sur les Alphas) : un bébé
dragon original (`src/components/nurserie/BabyDragon.tsx`, SVG/CSS animés)
que Basile peut **nourrir, faire boire, caresser** (toucher/glisser sur le
dragon), **faire jouer, endormir et réveiller**. Trois jauges douces (Faim,
Bonheur, Énergie) sans dégradation punitive ni horloge temps réel ; le dragon
exprime une envie quand une jauge est basse. Réactions surprises aléatoires
(éternuement avec flamme, pirouette, bâillement, tortillement). Bruitages et
consignes locales (`public/audio/sfx/`, `public/audio/fr/nurserie-*.wav`),
sauvegarde dédiée `alphas-de-basile/nurserie/v1` (`src/lib/nursery.ts`),
additive et non destructive.

Données : `src/data/activities.ts`. Les illustrations du portail sont des SVG
originaux dans `src/components/home/`. Navigation par état dans `App.tsx`
(`selectActivity`), sans dépendance ajoutée.

Chaque activité est **annoncée oralement** (noms générés dans
`public/audio/fr/activite-*.wav`) : survol de 350 ms à la souris (sans boucle,
annulé si la souris repart), **deux touchers** sur iPad (le premier sélectionne
et prononce, le second ouvre), bouton 🔊 sur la carte pour réécouter, et
annonce au focus clavier avec ouverture directe par Entrée/Espace. Les
activités « bientôt » sont annonçables mais jamais ouvrables. Audio via
`playVoice`/`stopVoice` (+ `isVoicePlaying` pour éviter les relances inutiles).

## Catalogue des Alphas (extensible)

Le catalogue vit dans `src/data/alphas.ts` (30 personnages présents sur le
disque, correspondance nom ↔ graphème issue de `public/assets/alphas/alphas.json`).
Les six personnages de BASILE gardent leurs identifiants historiques ; le boss
BASILE reste figé sur ces six personnages, indépendamment du reste.

- **Groupes** (`ALPHA_GROUPS`) : BASILE, O·M·R·U, F·V·N·T, P·C·D·J, G·H·K·Q,
  W·X·Y·Z, et un groupe « spécial » (digramme `ch` et variantes `é/è/ê`, jamais
  proposés par défaut).
- **Par défaut** : seuls les six BASILE sont activés ; aucune nouveauté n'est
  débloquée automatiquement.
- **Espace Parent** : activer/désactiver un personnage, le débloquer, choisir
  l'ordre de découverte, consulter les confusions fréquentes, réinitialiser les
  progrès pédagogiques (avec confirmation). Les réglages de difficulté existants
  sont conservés.
- **Album des Alphas** : accessible depuis « Choisis ton univers » (bouton
  Album). Personnages découverts interactifs (nom prononcé + animation),
  personnages à venir en silhouette.
- **Moteur commun** : les huit univers puisent dans les personnages
  découverts ∩ activés (mêmes règles : 2 choix par défaut, passage adaptatif à 3,
  sans doublon, révision des personnages difficiles). Le boss BASILE est
  inchangé.
- **Sauvegarde** : `decouverts`, `actifs`, `ordre`, `confusions` ajoutés à
  `alphas-de-basile/stats/v1` avec migration rétro-compatible (ancien champ
  numérique `decouverte` → liste d'ids). Aucune donnée existante n'est écrasée.

## Fonctionnalités

- **8 univers jouables** (moteur pédagogique commun, 2 ou 3 choix par manche) :
  1. **Les Pirates** — coffre au trésor
  2. **Les Dragons** — dragon qui vole vers l'Alpha
  3. **Jurassic Basile** — œuf qui éclôt et bébé dinosaure
  4. **Turbo Basile** — course de voiture
  5. **Les Créatures** — capture et album de 5 créatures SVG
  6. **Bricolo Basile** — construction progressive (robot/fusée/château)
  7. **Mission Sauvetage** — véhicule de secours et pont
  8. **Super Basile** — super-héros qui soulève un rocher
- **Difficulté adaptative** : deux choix par défaut, passage à trois choix
  lorsque trois Alphas sont réellement connus (réussites autonomes, jamais
  après une réponse aidée), retour à deux après des difficultés répétées.
  Réglage « Toujours 2 / Adaptatif / Toujours 3 » dans l'espace Parent.
- **Boss du prénom — « Le Mystère du prénom BASILE »** : un dragon original a
  mélangé les six Alphas de BASILE. Étape A : retrouver chaque Alpha et allumer
  sa pierre magique. Étape B : reconstituer B-A-S-I-L-E (tap tactile, jamais de
  clavier) avec trois niveaux d'aide (débutant / intermédiaire / avancé).
  Étape C : château qui s'ouvre, dragon qui s'envole, confettis et médaille
  enregistrée dans `localStorage`. Rejouable à volonté, avec vérification réelle
  de l'image de Madame i (aucune substitution).
- Phase de **découverte des Alphas** progressive (2 au départ, jusqu'aux 6 de BASILE).
- Sauvegarde locale (`localStorage`) : statistiques + collections isolées
  (`alphas-de-basile/creatures|builds|explored`, additives et non destructives).
- Espace parent (stats + test audio) et mascotte **Basile** animée.

## Ajouter un univers

1. Créer un **décor** (`src/components/scenes/`) et un **plateau**
   (`src/components/boards/`, props `BoardProps`).
2. Déclarer le monde dans `src/data/universes.ts` (`UniverseId`, `UNIVERSES`,
   `correctSfx`/`accentSfx`).
3. Ajouter l'entrée dans `src/components/universes/registry.tsx`.
Le moteur (manches, score, consignes, progression) est réutilisé automatiquement.

