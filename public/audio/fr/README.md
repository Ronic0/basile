# Consignes audio (français)

Ces fichiers sont des **AIFF LPCM 16 bits** (format nativement supporté par
Safari / iPadOS). Ils sont générés automatiquement avec la voix locale de
macOS :

```bash
npm run voices
# ou, en personnalisant :
ALPHAS_VOICE="Flo (Français (France))" ALPHAS_RATE=150 npm run voices
```

Liste des fichiers (noms attendus par le jeu) :

- `trouve-la-botte.aiff`
- `trouve-monsieur-a.aiff`
- `trouve-le-serpent.aiff`
- `trouve-madame-i.aiff`
- `trouve-la-limace.aiff`
- `trouve-madame-e.aiff`
- `bravo.aiff`
- `bien-joue.aiff`
- `reessaie.aiff`
- `alpha-botte.aiff` (phase de découverte)
- `alpha-monsieur-a.aiff`
- `alpha-serpent.aiff`
- `alpha-madame-i.aiff`
- `alpha-limace.aiff`
- `alpha-madame-e.aiff`

## Remplacer par vos propres enregistrements

Écrasez simplement le `.aiff` correspondant (même nom de fichier). Vous pouvez
aussi utiliser un `.m4a`/`.mp3` : dans ce cas, modifiez l'extension dans
`src/lib/audio.ts` (variable `EXT`). Aucun autre changement n'est nécessaire.

Si un fichier est absent, le jeu continue sans planter (fallback silencieux,
message discret dans la console du navigateur).
