#!/usr/bin/env python3
"""Prépare les images des Alphas pour une meilleure lisibilité.

Pour chaque PNG de public/assets/alphas/ :
  1. détoure les marges transparentes inutiles (bbox alpha) ;
  2. recadre le personnage sans le déformer ;
  3. le replace centré sur un carré transparent avec une petite marge régulière ;
  4. écrit le résultat dans public/assets/alphas/optimized/ (les originaux restent).

Aucune couleur, aucun trait, aucun filtre : seul le cadrage change.
Dépendance : Pillow (pip install Pillow).
"""
from __future__ import annotations

import os
import sys

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("Pillow est requis : python3 -m pip install Pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT, "public", "assets", "alphas")
OUT_DIR = os.path.join(SRC_DIR, "optimized")

ALPHA_THRESHOLD = 16  # ignore un halo quasi transparent
MARGIN_RATIO = 0.07  # marge régulière autour du personnage (7 %)


def alpha_bbox(img: Image.Image) -> tuple[int, int, int, int] | None:
    mask = img.getchannel("A").point(lambda a: 255 if a > ALPHA_THRESHOLD else 0)
    return mask.getbbox()


def process(path: str, out_path: str) -> tuple[int, int, int, int]:
    img = Image.open(path).convert("RGBA")
    bbox = alpha_bbox(img)
    if bbox is None:
        return (0, 0, 0, 0)

    crop = img.crop(bbox)
    cw, ch = crop.size
    side = max(cw, ch)
    canvas = round(side * (1 + 2 * MARGIN_RATIO))
    result = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    result.paste(crop, ((canvas - cw) // 2, (canvas - ch) // 2))
    result.save(out_path, "PNG", optimize=True)
    return (cw, ch, canvas, canvas)


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    files = sorted(
        f for f in os.listdir(SRC_DIR)
        if f.lower().endswith(".png") and os.path.isfile(os.path.join(SRC_DIR, f))
    )
    print(f"{'fichier':<26}{'source':>10}  {'perso':>10}  {'optimisé':>10}")
    for name in files:
        src = os.path.join(SRC_DIR, name)
        with Image.open(src) as im:
            w, h = im.size
        out = os.path.join(OUT_DIR, name)
        cw, ch, ow, oh = process(src, out)
        print(f"{name:<26}{f'{w}x{h}':>10}  {f'{cw}x{ch}':>10}  {f'{ow}x{oh}':>10}")
    print(f"\n{len(files)} images -> {OUT_DIR}")


if __name__ == "__main__":
    main()
