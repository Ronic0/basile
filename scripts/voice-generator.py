#!/usr/bin/env python3
"""
Générateur de voix françaises pour « Le Monde de Basile ».

Deux moteurs :
  - kokoro : synthèse neuronale locale via MLX (Apple Silicon), voix FR `ff_siwis`.
  - say    : repli sur la voix macOS (`say` + `afconvert`), comme l'ancien script.

Le script lit :
  - le manifeste du jeu      : src/data/audioManifest.ts (ids des voix)
  - la source des textes     : scripts/voice-lines.json  (texte + rôle par id)

Il ne remplace JAMAIS un fichier sans sélection explicite (`--all` ou `--id`).
Par défaut, aucune génération n'est lancée : `--check`/`--list` sont sans effet
de bord.

Exemples :
  # Vérifier la cohérence manifeste <-> textes (aucune écriture)
  scripts/.venv-kokoro/bin/python scripts/voice-generator.py --check

  # Générer un seul son de test
  ... --id bravo --out tmp/voice-comparison/kokoro

  # Générer tout le catalogue avec Kokoro (remplace la production)
  ... --all --engine kokoro

  # Générer les 5 phrases de démonstration + page HTML de comparaison
  ... --comparison tmp/voice-comparison

Le venv isolé attendu est scripts/.venv-kokoro (voir scripts/README-voices.md).
Aucun modèle n'est embarqué dans l'application : la génération est un outil de
développement, hors du jeu.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import wave
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Optional

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "src" / "data" / "audioManifest.ts"
ALPHAS = ROOT / "src" / "data" / "alphas.ts"
LINES_FILE = ROOT / "scripts" / "voice-lines.json"
DEFAULT_OUT = ROOT / "public" / "audio" / "fr"

KOKORO_MODEL = "mlx-community/Kokoro-82M-bf16"
KOKORO_LANG = "f"
KOKORO_RATE = 24000  # fréquence native du modèle (pas de rééchantillonnage)
SAY_RATE = 22050

# Voix macOS proposées pour la comparaison (sous-chaînes, ordre de préférence).
SAY_PREFERRED = ["Thomas (Français (France))", "Amélie", "Jacques", "Flo (Français (France))"]


# --------------------------------------------------------------------------- #
# Lecture du manifeste et des textes
# --------------------------------------------------------------------------- #
def manifest_voice_ids() -> list[str]:
    """Reconstruit la liste des ids de voix du manifeste, sans runtime JS.

    - ids littéraux de CORE_VOICES (audioManifest.ts)
    - ids dérivés de ALPHAS (src/data/alphas.ts) pour CHARACTER_VOICES
    """
    ids: list[str] = []
    seen: set[str] = set()

    def add(i: str) -> None:
        if i not in seen:
            seen.add(i)
            ids.append(i)

    text = MANIFEST.read_text(encoding="utf-8")
    for m in re.finditer(r'id:\s*"([^"]+)"\s*,\s*kind:\s*"voice"', text):
        add(m.group(1))

    alpha_text = ALPHAS.read_text(encoding="utf-8")
    for line in alpha_text.splitlines():
        m = re.search(r'\{\s*id:\s*"([^"]+)"', line)
        if not m:
            continue
        aid = m.group(1)
        gm = re.search(r'group:\s*"([^"]+)"', line)
        group = gm.group(1) if gm else "basile"
        if group == "basile":
            continue  # déjà couverts par CORE_VOICES
        am = re.search(r'audioName:\s*"([^"]+)"', line)
        dm = re.search(r'discoveryAudio:\s*"([^"]+)"', line)
        add(dm.group(1) if dm else f"alpha-{aid}")
        add(am.group(1) if am else f"trouve-{aid}")
    return ids


@dataclass
class Line:
    id: str
    text: str
    role: str


def load_lines() -> tuple[dict[str, Line], dict[str, dict]]:
    data = json.loads(LINES_FILE.read_text(encoding="utf-8"))
    roles = data.get("roles", {})
    lines: dict[str, Line] = {}
    for lid, entry in data["lines"].items():
        lines[lid] = Line(id=lid, text=entry["text"], role=entry.get("role", "narratrice"))
    return lines, roles


def check_manifest(lines: dict[str, Line]) -> int:
    manifest = manifest_voice_ids()
    missing = [i for i in manifest if i not in lines]
    extra = [i for i in lines if i not in manifest]
    print(f"Manifeste      : {len(manifest)} voix")
    print(f"voice-lines    : {len(lines)} textes")
    if missing:
        print(f"\n✗ {len(missing)} id(s) du manifeste sans texte :")
        for i in missing:
            print(f"    - {i}")
    if extra:
        print(f"\n✗ {len(extra)} texte(s) sans entrée au manifeste :")
        for i in extra:
            print(f"    - {i}")
    if not missing and not extra:
        print("\n✓ Couverture complète manifeste <-> textes.")
        return 0
    return 1


# --------------------------------------------------------------------------- #
# Écriture WAV (PCM 16 bits mono), sans dépendance externe
# --------------------------------------------------------------------------- #
def write_wav(path: Path, samples, rate: int) -> None:
    import numpy as np

    arr = np.asarray(samples, dtype=np.float32).reshape(-1)
    peak = float(np.max(np.abs(arr))) if arr.size else 0.0
    if peak > 1.0:
        arr = arr / peak  # évite la saturation, sans toucher aux voix déjà douces
    ints = np.clip(arr * 32767.0, -32768, 32767).astype("<i2")
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(ints.tobytes())


# --------------------------------------------------------------------------- #
# Moteur Kokoro (MLX)
# --------------------------------------------------------------------------- #
class KokoroEngine:
    def __init__(self) -> None:
        from mlx_audio.tts.utils import load_model  # import paresseux

        self._model = load_model(KOKORO_MODEL)
        self.rate = KOKORO_RATE

    @staticmethod
    def _chunks(text: str, limit: int = 180) -> list[str]:
        """Découpe aux ponctuations fortes (le chunking FR n'est pas géré par MLX)."""
        parts = re.split(r"(?<=[.!?])\s+", text.strip())
        out: list[str] = []
        for p in parts:
            while len(p) > limit:
                cut = p.rfind(" ", 0, limit)
                cut = cut if cut > 0 else limit
                out.append(p[:cut].strip())
                p = p[cut:].strip()
            if p:
                out.append(p)
        return out or [text]

    def synth(self, text: str, voice: str, speed: float):
        import numpy as np

        segs = []
        for chunk in self._chunks(text):
            for result in self._model.generate(
                text=chunk, voice=voice, speed=speed, lang_code=KOKORO_LANG
            ):
                segs.append(np.asarray(result.audio).reshape(-1))
        if not segs:
            raise RuntimeError("Kokoro n'a produit aucun échantillon")
        if len(segs) == 1:
            return segs[0], self.rate
        gap = np.zeros(int(self.rate * 0.12), dtype=np.float32)
        merged = []
        for i, s in enumerate(segs):
            if i:
                merged.append(gap)
            merged.append(s)
        return np.concatenate(merged), self.rate


# --------------------------------------------------------------------------- #
# Moteur macOS say (repli)
# --------------------------------------------------------------------------- #
def say_available() -> bool:
    return shutil.which("say") is not None and shutil.which("afconvert") is not None


def say_catalog() -> list[tuple[str, str]]:
    """Renvoie [(nom, locale), ...] d'après `say -v ?`."""
    try:
        listing = subprocess.run(
            ["say", "-v", "?"], capture_output=True, text=True, check=False
        ).stdout
    except OSError:
        return []
    catalog: list[tuple[str, str]] = []
    for ln in listing.splitlines():
        if not ln.strip():
            continue
        # Ligne : "<nom> <locale> # <exemple>" — le nom peut contenir des espaces
        # et des parenthèses (ex. « Thomas (Français (France)) »).
        m = re.match(r"^(.*?)\s+([a-z]{2}[-_][A-Za-z]{2,})\s+#", ln.strip())
        if m:
            catalog.append((m.group(1).strip(), m.group(2).strip()))
            continue
        fields = re.split(r"\s{2,}", ln.strip())
        if fields and fields[0]:
            catalog.append((fields[0].strip(), ""))
    return catalog


def say_voices() -> list[str]:
    return [name for name, _ in say_catalog()]


def pick_say_voice(explicit: Optional[str] = None) -> Optional[str]:
    if explicit:
        return explicit
    env = os.environ.get("ALPHAS_VOICE")
    if env:
        return env
    catalog = say_catalog()
    for pref in SAY_PREFERRED:
        for name, _locale in catalog:
            if pref in name:
                return name
    for name, locale in catalog:
        if locale.startswith("fr"):
            return name
    return catalog[0][0] if catalog else None


def demo_say_voices(limit: int = 4) -> list[str]:
    """Sélectionne des voix FR distinctes pour la page de comparaison."""
    catalog = say_catalog()
    chosen: list[str] = []
    for pref in SAY_PREFERRED:
        for name, locale in catalog:
            if pref in name and locale.startswith("fr") and name not in chosen:
                chosen.append(name)
                break
    if not chosen:
        for name, locale in catalog:
            if locale.startswith("fr") and name not in chosen:
                chosen.append(name)
                break
    return chosen[:limit]


def say_synth(text: str, voice: str, out: Path, rate: int = SAY_RATE) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        aiff = Path(td) / "clip.aiff"
        subprocess.run(
            [
                "say", "-v", voice, "-r", os.environ.get("ALPHAS_RATE", "170"),
                "-o", str(aiff), "--file-format=AIFF", f"--data-format=BEI16@{rate}", text,
            ],
            check=True,
        )
        if out.exists():
            out.unlink()
        subprocess.run(
            ["afconvert", "-f", "WAVE", "-d", f"LEI16@{rate}", "-c", "1", str(aiff), str(out)],
            check=True,
        )


# --------------------------------------------------------------------------- #
# Cache : ne pas régénérer les fichiers inchangés
# --------------------------------------------------------------------------- #
class Cache:
    def __init__(self, out_dir: Path) -> None:
        self.path = out_dir / ".voice-cache.json"
        self.data: dict[str, dict] = {}
        if self.path.exists():
            try:
                self.data = json.loads(self.path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                self.data = {}

    @staticmethod
    def key(engine: str, voice: str, speed: float, text: str) -> str:
        raw = f"{engine}|{voice}|{speed:.3f}|{text}".encode("utf-8")
        return hashlib.sha1(raw).hexdigest()

    def is_current(self, lid: str, key: str, out: Path) -> bool:
        rec = self.data.get(lid)
        return bool(rec and rec.get("key") == key and out.exists())

    def update(self, lid: str, key: str, engine: str, voice: str, speed: float, out: Path) -> None:
        self.data[lid] = {
            "key": key, "engine": engine, "voice": voice,
            "speed": speed, "file": out.name,
        }

    def save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(self.data, indent=2, ensure_ascii=False), encoding="utf-8")


# --------------------------------------------------------------------------- #
# Rapport de prononciation (heuristique)
# --------------------------------------------------------------------------- #
INVENTED = {"basile", "xiou", "zibulus", "gulu", "alphas", "kangourou"}
LETTER_NAMES = re.compile(r"\b(monsieur|madame|mademoiselle)\s+([a-zéèê])\b", re.IGNORECASE)


def pron_flags(text: str, phonemes: Optional[str]) -> list[str]:
    flags: list[str] = []
    if re.search(r"\d", text):
        flags.append("chiffre présent (espeak lit en toutes lettres, à vérifier)")
    if re.search(r"\b[A-Z](?:\s+[A-Z])+\b", text):
        flags.append("épellation isolée (suite de lettres majuscules) : rythme/prononciation incertains")
    for w in re.findall(r"[A-Za-zÀ-ÿ']+", text.lower()):
        if w in INVENTED:
            flags.append(f"mot inventé/nom propre « {w} » : à écouter")
    if LETTER_NAMES.search(text):
        flags.append("nom de lettre (« monsieur a », « madame é »…) : souvent lu comme une syllabe")
    if "\u2019" in text:
        flags.append("apostrophe typographique (’) : normalisée en apostrophe droite")
    if phonemes is not None:
        p = phonemes.strip()
        if not p:
            flags.append("G2P vide : aucun phonème produit")
        elif p.lower() == text.strip().lower():
            flags.append("G2P identique au texte : non converti (échec probable)")
        elif re.search(r"[A-Z0-9']", phonemes):
            flags.append("G2P suspect : contient des caractères non phonétiques (majuscules/chiffres/apostrophe)")
    return flags


def build_report(lines: dict[str, Line], out_path: Path, use_g2p: bool) -> int:
    g2p = None
    if use_g2p:
        try:
            from misaki import espeak

            g2p = espeak.EspeakG2P(language="fr-fr")
        except Exception as exc:  # pragma: no cover
            print(f"[rapport] G2P indisponible ({exc}); analyse textuelle seule.", file=sys.stderr)

    flagged: list[tuple[str, str, list[str]]] = []
    for lid in sorted(lines):
        line = lines[lid]
        phon = None
        if g2p is not None:
            try:
                phon, _ = g2p(line.text)
            except Exception:
                phon = None
        flags = pron_flags(line.text, phon)
        if flags:
            flagged.append((lid, line.text, flags))

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        f.write("# Rapport de prononciation française (heuristique)\n\n")
        f.write(f"Textes analysés : {len(lines)} — signalés : {len(flagged)}\n\n")
        if g2p is None:
            f.write("> Analyse phonétique indisponible : rapport textuel uniquement.\n\n")
        for lid, text, flags in flagged:
            f.write(f"## {lid}\n")
            f.write(f"« {text} »\n\n")
            for fl in flags:
                f.write(f"  - {fl}\n")
            f.write("\n")
    print(f"Rapport écrit : {out_path} ({len(flagged)} texte(s) signalé(s))")
    return len(flagged)


# --------------------------------------------------------------------------- #
# Génération « production »
# --------------------------------------------------------------------------- #
def slug(text: str, n: int) -> str:
    import unicodedata

    norm = unicodedata.normalize("NFKD", text)
    norm = "".join(c for c in norm if not unicodedata.combining(c))
    s = re.sub(r"[^a-z0-9]+", "-", norm.lower()).strip("-")
    return s[:40] or f"line-{n}"


def generate(args, lines: dict[str, Line], roles: dict[str, dict]) -> int:
    out_dir = Path(args.out).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    # Sélection explicite uniquement : aucune écriture par défaut.
    if args.all:
        selected = sorted(lines)
    elif args.id:
        unknown = [i for i in args.id if i not in lines]
        if unknown:
            print(f"✗ id inconnu(s) : {', '.join(unknown)}", file=sys.stderr)
            return 2
        selected = args.id
    else:
        print("Rien à générer : précisez --all ou --id (voir --help).", file=sys.stderr)
        return 2

    engine = args.engine
    kokoro = None
    say_voice = pick_say_voice(args.say_voice)

    if engine in ("auto", "kokoro"):
        try:
            kokoro = KokoroEngine()
            print(f"Moteur : Kokoro MLX ({KOKORO_MODEL}, voix FR ff_siwis)")
        except Exception as exc:
            if engine == "kokoro":
                print(f"✗ Kokoro indisponible : {exc}", file=sys.stderr)
                return 3
            print(f"[repli] Kokoro indisponible ({exc}) → macOS say", file=sys.stderr)

    if kokoro is None:
        if not say_available():
            print("✗ Ni Kokoro ni macOS say disponibles.", file=sys.stderr)
            return 3
        if not say_voice:
            print("✗ Aucune voix macOS trouvée. Installez une voix française.", file=sys.stderr)
            return 3
        print(f"Moteur : macOS say (voix « {say_voice} »)")

    cache = Cache(out_dir)
    made = skipped = failed = 0
    for lid in selected:
        line = lines[lid]
        role = roles.get(line.role, {})
        voice = role.get("voice", "ff_siwis")
        speed = float(role.get("speed", 1.0))
        dest = out_dir / f"{lid}.wav"

        if kokoro is not None:
            eng_name, key = "kokoro", Cache.key("kokoro", voice, speed, line.text)
        else:
            eng_name, key = "say", Cache.key("say", say_voice, 0.0, line.text)

        if not args.force and cache.is_current(lid, key, dest):
            skipped += 1
            continue

        try:
            if kokoro is not None:
                samples, rate = kokoro.synth(line.text, voice=voice, speed=speed)
                write_wav(dest, samples, rate)
            else:
                say_synth(line.text, say_voice, dest)
            cache.update(lid, key, eng_name, voice if kokoro else say_voice, speed, dest)
            made += 1
            print(f"  ✓ {lid}.wav  ← « {line.text} » [{line.role}]")
        except Exception as exc:
            failed += 1
            print(f"  ✗ {lid} : {exc}", file=sys.stderr)
            if kokoro is not None and not args.no_fallback and say_available():
                try:
                    say_synth(line.text, say_voice, dest)
                    k2 = Cache.key("say", say_voice, 0.0, line.text)
                    cache.update(lid, k2, "say", say_voice, 0.0, dest)
                    failed -= 1
                    made += 1
                    print(f"    ↳ repli say OK pour {lid}")
                except Exception as exc2:
                    print(f"    ↳ repli say échoué : {exc2}", file=sys.stderr)

    cache.save()
    print(f"\nBilan : {made} généré(s), {skipped} inchangé(s), {failed} échec(s) → {out_dir}")
    return 1 if failed else 0


# --------------------------------------------------------------------------- #
# Mode comparaison : échantillons + page HTML
# --------------------------------------------------------------------------- #
DEMO = [
    ("bienvenue", "Bienvenue dans le monde de Basile !"),
    ("serpent", "Trouve le serpent !"),
    ("bravo-reussi", "Bravo Basile ! Tu as réussi !"),
    ("dragon-oeuf", "Oh non ! Le dragon a perdu son œuf !"),
    ("dragon-envole", "Le petit dragon s'envole dans le ciel."),
]


def comparison(args, roles: dict[str, dict]) -> int:
    out_dir = Path(args.comparison).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    entries: list[dict] = []

    # 1) macOS say : plusieurs voix, mêmes phrases.
    say_voice_list = demo_say_voices()
    for voice in say_voice_list:
        vslug = slug(voice, 0)
        for n, (s, text) in enumerate(DEMO, 1):
            dest = out_dir / "say" / vslug / f"{n:02d}-{s}.wav"
            try:
                say_synth(text, voice, dest)
                entries.append({"group": f"macOS say · {voice}", "engine": "say",
                                "voice": voice, "text": text, "file": str(dest.relative_to(out_dir))})
            except Exception as exc:
                print(f"  ✗ say {voice} / {s} : {exc}", file=sys.stderr)

    # 2) Kokoro ff_siwis : une seule voix FR native, déclinée par rôle (vitesse).
    try:
        kokoro = KokoroEngine()
        for role_name, cfg in roles.items():
            voice = cfg.get("voice", "ff_siwis")
            speed = float(cfg.get("speed", 1.0))
            for n, (s, text) in enumerate(DEMO, 1):
                dest = out_dir / "kokoro" / f"{n:02d}-{s}-{role_name}.wav"
                samples, rate = kokoro.synth(text, voice=voice, speed=speed)
                write_wav(dest, samples, rate)
                entries.append({"group": f"Kokoro · {voice} ({role_name}, ×{speed})",
                                "engine": "kokoro", "voice": voice,
                                "text": text, "file": str(dest.relative_to(out_dir))})
    except Exception as exc:
        print(f"✗ Kokoro indisponible pour la comparaison : {exc}", file=sys.stderr)

    write_comparison_html(out_dir, entries)
    print(f"\nComparaison écrite : {out_dir / 'index.html'} ({len(entries)} échantillons)")
    return 0


def write_comparison_html(out_dir: Path, entries: list[dict]) -> None:
    groups: dict[str, list[dict]] = {}
    for e in entries:
        groups.setdefault(e["group"], []).append(e)

    rows = []
    for group, items in groups.items():
        items.sort(key=lambda e: e["file"])
        rows.append(f'<h2>{html.escape(group)}</h2><div class="grid">')
        for e in items:
            rows.append(
                '<figure class="card">'
                f'<figcaption>« {html.escape(e["text"])} »</figcaption>'
                f'<audio controls preload="none" src="{html.escape(e["file"])}"></audio>'
                f'<code>{html.escape(Path(e["file"]).name)}</code>'
                "</figure>"
            )
        rows.append("</div>")

    doc = f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Le Monde de Basile — comparaison des voix</title>
<style>
  :root {{ color-scheme: light dark; }}
  body {{ font-family: -apple-system, system-ui, sans-serif; margin: 2rem auto; max-width: 960px; padding: 0 1rem; }}
  h1 {{ font-size: 1.4rem; }}
  h2 {{ font-size: 1.05rem; margin-top: 2rem; border-bottom: 1px solid #8884; padding-bottom: .3rem; }}
  .notice {{ background: #f0b42922; border-left: 4px solid #f0b429; padding: .6rem .9rem; border-radius: 6px; }}
  .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: .8rem; }}
  .card {{ margin: 0; padding: .7rem; border: 1px solid #8883; border-radius: 10px; display: flex; flex-direction: column; gap: .45rem; }}
  figcaption {{ font-weight: 600; }}
  audio {{ width: 100%; }}
  code {{ font-size: .72rem; opacity: .7; word-break: break-all; }}
</style>
</head>
<body>
<h1>Comparaison des voix — Le Monde de Basile</h1>
<div class="notice">
  Kokoro-82M ne fournit qu'<strong>une seule voix française native</strong>
  (<code>ff_siwis</code>). La « comparaison entre plusieurs voix FR » se limite
  donc à Kokoro <code>ff_siwis</code> (déclinée par rôle via la vitesse) face aux
  voix macOS existantes. Réf. : <code>VOICES.md</code> de Kokoro-82M.
</div>
{''.join(rows)}
<p style="margin-top:2rem;opacity:.7;font-size:.8rem">
  Audio local uniquement (aucun réseau). Ouvrir ce fichier directement
  (<code>file://</code>) dans Safari/Chrome. Dossier : <code>tmp/voice-comparison/</code>.
</p>
</body>
</html>
"""
    (out_dir / "index.html").write_text(doc, encoding="utf-8")


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #
def main(argv: Optional[Iterable[str]] = None) -> int:
    p = argparse.ArgumentParser(description="Générateur de voix FR (Kokoro MLX / macOS say)")
    p.add_argument("--check", action="store_true", help="vérifie manifeste <-> voice-lines.json")
    p.add_argument("--list", action="store_true", help="liste les ids, textes et rôles")
    p.add_argument("--all", action="store_true", help="génère toutes les voix")
    p.add_argument("--id", action="append", default=[], help="génère un id (répétable)")
    p.add_argument("--out", default=str(DEFAULT_OUT), help=f"dossier de sortie (défaut {DEFAULT_OUT})")
    p.add_argument("--engine", choices=["auto", "kokoro", "say"], default="auto")
    p.add_argument("--say-voice", default=None, help="voix macOS de repli")
    p.add_argument("--no-fallback", action="store_true", help="pas de repli say en cas d'échec Kokoro")
    p.add_argument("--force", action="store_true", help="régénère même si inchangé")
    p.add_argument("--report", nargs="?", const=str(ROOT / "tmp" / "voice-pronunciation-report.txt"),
                   default=None, help="écrit un rapport de prononciation")
    p.add_argument("--no-g2p", action="store_true", help="rapport sans analyse phonétique")
    p.add_argument("--comparison", default=None, help="génère des échantillons + page HTML dans ce dossier")
    args = p.parse_args(list(argv) if argv is not None else None)

    lines, roles = load_lines()

    if args.list:
        for lid in sorted(lines):
            ln = lines[lid]
            print(f"{lid:28s} [{ln.role:10s}] {ln.text}")
        return 0

    if args.check:
        return check_manifest(lines)

    if args.report is not None:
        build_report(lines, Path(args.report), use_g2p=not args.no_g2p)
        if not (args.comparison or args.all or args.id):
            return 0

    # Sélection explicite ou comparaison : sinon, on ne touche à rien.
    if args.comparison:
        return comparison(args, roles)
    if args.all or args.id:
        return generate(args, lines, roles)

    p.print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
