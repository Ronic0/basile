# Consignes de voix (français)

Ces fichiers sont des **WAV PCM 16 bits mono 22050 Hz**, générés localement avec
la voix de macOS (`say`) puis convertis avec `afconvert` :

```bash
npm run voices
# personnalisation :
ALPHAS_VOICE="Flo (Français (France))" ALPHAS_RATE=150 npm run voices
```

Format choisi pour être décodable **à la fois par Safari (macOS/iPadOS) et
Chrome** (l'AIFF n'est pas supporté par Chrome).

Fichiers générés (`<id>.wav`) :

- `trouve-la-botte.wav`
- `trouve-monsieur-a.wav`
- `trouve-le-serpent.wav`
- `trouve-madame-i.wav`
- `trouve-la-limace.wav`
- `trouve-madame-e.wav`
- `bravo.wav`
- `bien-joue.wav`
- `reessaie.wav`
- `alpha-botte.wav` (découverte)
- `alpha-monsieur-a.wav`
- `alpha-serpent.wav`
- `alpha-madame-i.wav`
- `alpha-limace.wav`
- `alpha-madame-e.wav`

## Remplacer par vos propres enregistrements

Écrasez simplement le `.wav` correspondant (même nom). L'extension est définie
par `VOICE_EXT` dans `src/data/audioManifest.ts`.

## Anciens fichiers AIFF

Les `.aiff` générés précédemment peuvent encore être présents : ils ne sont
plus référencés par le jeu. Vous pouvez les supprimer en toute sécurité :

```bash
rm public/audio/fr/*.aiff
```
