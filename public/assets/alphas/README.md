# Images des Alphas

Dépose ici les images (PNG, fond transparent conseillé) :

- `botte.png`
- `monsieur-a.png`
- `serpent.png`
- `madame-i.png`
- `limace.png`
- `madame-e.png`

## Optimisation (marges + cadrage)

Les fichiers sources contiennent souvent de grandes marges transparentes : le
personnage n'occupe que ~20 % de l'image. On génère des versions recadrées dans
le sous-dossier `optimized/` :

```bash
npm run alphas
# ou : python3 scripts/prepare-alphas.py   (nécessite Pillow)
```

Le script, pour chaque PNG :

1. détoure les marges transparentes (seuil alpha) ;
2. recadre le personnage **sans le déformer** ;
3. le replace centré sur un carré transparent avec une marge régulière de 7 % ;
4. écrit le résultat dans `optimized/` (les originaux sont **conservés**).

Aucune couleur ni aucun trait n'est modifié. Le jeu utilise `optimized/<nom>.png`
et bascule automatiquement sur l'original si un fichier optimisé est absent
(voir `imageFallback` dans `src/data/alphas.ts`).

Si un fichier est absent, le jeu affiche une carte de remplacement
(nom + « image à venir »). Aucun blocage.
