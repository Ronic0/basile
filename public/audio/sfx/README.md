# Bruitages (effets sonores)

Fichiers **WAV PCM 16 bits mono 44,1 kHz**, générés localement sans dépendance
externe (Python standard library uniquement) :

```bash
npm run sfx
# ou
python3 scripts/generate-sfx.py
```

Fichiers générés :

- `coffre.wav` — ouverture du coffre (craquement + coup sourd)
- `piece.wav` — pièces / jingle métallique
- `etoile.wav` — étoile magique (arpège aigu)
- `dragon.wav` — battement d'ailes + grondement
- `reussite.wav` — fanfare de fin de session
- `eclosion.wav` — éclosion d'œuf (Jurassic Basile)
- `moteur.wav` — moteur de course (Turbo Basile)
- `capture.wav` — capture de créature (Les Créatures)
- `construction.wav` — construction (Bricolo Basile)
- `sirene.wav` — sirène douce (Mission Sauvetage)
- `pouvoir.wav` — super-pouvoir (Super Basile)

Pour vos propres sons : remplacez le `.wav` (même nom). Pour changer
d'extension, modifiez `SFX_EXT` dans `src/data/audioManifest.ts`.

Volume distinct des voix : voir `DEFAULT_SFX_VOLUME` dans `src/lib/audio.ts`.
