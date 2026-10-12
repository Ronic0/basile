#!/usr/bin/env python3
"""Génère des bruitages originaux (WAV) pour le jeu, sans dépendance externe.

Bibliothèque standard uniquement : wave, struct, math, random, os.

Usage :
    python3 scripts/generate-sfx.py
    npm run sfx
"""
from __future__ import annotations

import math
import os
import random
import struct
import wave

RATE = 44100
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "sfx")


def _count(duration: float) -> int:
    return int(duration * RATE)


def _clamp(value: float) -> float:
    return max(-1.0, min(1.0, value))


def write_wav(path: str, samples: list[float], rate: int = RATE) -> None:
    frames = bytearray()
    for sample in samples:
        frames += struct.pack("<h", int(_clamp(sample) * 32000))
    with wave.open(path, "w") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(rate)
        handle.writeframes(bytes(frames))


def silence(duration: float) -> list[float]:
    return [0.0] * _count(duration)


def tone(
    freq: float,
    duration: float,
    amp: float = 0.6,
    attack: float = 0.005,
    decay: float | None = None,
) -> list[float]:
    n = _count(duration)
    if decay is None:
        decay = duration
    out = [0.0] * n
    for i in range(n):
        t = i / RATE
        a = min(1.0, t / attack) if attack > 0 else 1.0
        out[i] = amp * a * math.exp(-t / decay) * math.sin(2 * math.pi * freq * t)
    return out


def glide(
    start: float,
    end: float,
    duration: float,
    amp: float = 0.6,
    decay: float | None = None,
) -> list[float]:
    n = _count(duration)
    if decay is None:
        decay = duration
    out = [0.0] * n
    phase = 0.0
    for i in range(n):
        t = i / RATE
        freq = start + (end - start) * (i / max(1, n - 1))
        phase += 2 * math.pi * freq / RATE
        out[i] = amp * math.exp(-t / decay) * math.sin(phase)
    return out


def noise(duration: float, amp: float = 0.5, decay: float | None = None) -> list[float]:
    n = _count(duration)
    if decay is None:
        decay = duration
    out = [0.0] * n
    for i in range(n):
        t = i / RATE
        out[i] = amp * math.exp(-t / decay) * (random.random() * 2 - 1)
    return out


def lowpass(buffer: list[float], alpha: float = 0.15) -> list[float]:
    out: list[float] = []
    previous = 0.0
    for sample in buffer:
        previous += alpha * (sample - previous)
        out.append(previous)
    return out


def whoosh(duration: float, amp: float = 0.5, peak: float = 0.2, spread: float = 0.12) -> list[float]:
    raw = lowpass(noise(duration, 1.0), 0.09)
    out = [0.0] * len(raw)
    for i, sample in enumerate(raw):
        t = i / RATE
        envelope = math.exp(-((t - peak) ** 2) / (2 * spread**2))
        out[i] = amp * envelope * sample
    return out


def mix(*buffers: list[float]) -> list[float]:
    n = max(len(b) for b in buffers)
    out = [0.0] * n
    for buffer in buffers:
        for i, sample in enumerate(buffer):
            out[i] += sample
    return out


def concat(*buffers: list[float]) -> list[float]:
    out: list[float] = []
    for buffer in buffers:
        out.extend(buffer)
    return out


def gain(buffer: list[float], factor: float) -> list[float]:
    return [sample * factor for sample in buffer]


def at(buffer: list[float], delay: float) -> list[float]:
    return silence(delay) + buffer


def build_coffre() -> list[float]:
    creak = lowpass(glide(240, 90, 0.4, amp=0.5, decay=0.6), 0.25)
    thud = tone(62, 0.5, amp=0.9, attack=0.001, decay=0.14)
    clank = concat(
        tone(900, 0.05, amp=0.25, decay=0.03),
        silence(0.02),
        tone(1350, 0.05, amp=0.2, decay=0.03),
    )
    return mix(at(creak, 0.0), at(thud, 0.33), at(gain(clank, 0.6), 0.33))


def _coin() -> list[float]:
    return concat(
        tone(1318.5, 0.07, amp=0.5, decay=0.05),
        tone(1975.5, 0.18, amp=0.45, decay=0.10),
    )


def build_piece() -> list[float]:
    return concat(_coin(), silence(0.05), gain(_coin(), 0.8))


def build_etoile() -> list[float]:
    notes = [1046.5, 1318.5, 1568.0, 2093.0]
    parts = [tone(freq, 0.12, amp=0.4, decay=0.08) for freq in notes]
    return concat(*parts)


def build_dragon() -> list[float]:
    flap = whoosh(0.55, amp=0.55, peak=0.18, spread=0.13)
    growl = mix(
        tone(88, 0.7, amp=0.4, decay=0.45),
        tone(132, 0.7, amp=0.25, decay=0.45),
    )
    return mix(flap, at(growl, 0.12))


def build_reussite() -> list[float]:
    notes = [523.25, 659.25, 783.99, 1046.5]
    arpeggio = concat(*[tone(freq, 0.15, amp=0.42, decay=0.11) for freq in notes])
    chord = mix(
        tone(523.25, 0.55, amp=0.28, decay=0.42),
        tone(659.25, 0.55, amp=0.28, decay=0.42),
        tone(783.99, 0.55, amp=0.28, decay=0.42),
        tone(1046.5, 0.55, amp=0.24, decay=0.42),
    )
    return concat(arpeggio, chord)


def build_eclosion() -> list[float]:
    crack = concat(
        tone(2400, 0.03, amp=0.3, decay=0.02),
        silence(0.02),
        tone(2800, 0.03, amp=0.25, decay=0.02),
    )
    pop = tone(680, 0.14, amp=0.5, decay=0.09)
    cheep = concat(
        tone(1450, 0.09, amp=0.32, decay=0.05),
        tone(1850, 0.11, amp=0.28, decay=0.06),
    )
    return concat(crack, pop, cheep)


def build_moteur() -> list[float]:
    rev = glide(90, 240, 0.6, amp=0.42, decay=0.5)
    rumble = lowpass(noise(0.6, 0.5, decay=0.5), 0.06)
    return mix(rev, rumble, at(gain(rev, 0.3), 0.25))


def build_capture() -> list[float]:
    pwing = glide(320, 900, 0.22, amp=0.5, decay=0.16)
    chimes = concat(
        tone(1320, 0.08, amp=0.3, decay=0.05),
        tone(1760, 0.12, amp=0.26, decay=0.07),
    )
    return concat(pwing, chimes)


def _hammer_hit(freq: float) -> list[float]:
    return mix(
        tone(freq, 0.06, amp=0.5, decay=0.03),
        lowpass(noise(0.06, 0.35, decay=0.03), 0.35),
    )


def build_construction() -> list[float]:
    chime = concat(
        tone(783.99, 0.12, amp=0.32, decay=0.09),
        tone(1174.7, 0.16, amp=0.28, decay=0.11),
    )
    return concat(
        _hammer_hit(320),
        silence(0.09),
        _hammer_hit(360),
        silence(0.05),
        chime,
    )


def build_sirene() -> list[float]:
    up = glide(620, 900, 0.35, amp=0.32, decay=1.2)
    down = glide(900, 620, 0.35, amp=0.32, decay=1.2)
    return concat(up, down, up, down)


def build_pouvoir() -> list[float]:
    w = whoosh(0.45, amp=0.4, peak=0.16, spread=0.1)
    power = glide(180, 1100, 0.7, amp=0.4, decay=0.55)
    return mix(w, power)


def build_dragon_content() -> list[float]:
    return concat(
        tone(680, 0.10, amp=0.34, decay=0.06),
        tone(900, 0.12, amp=0.32, decay=0.07),
        tone(1180, 0.16, amp=0.28, decay=0.10),
    )


def build_ronflement() -> list[float]:
    def puff() -> list[float]:
        return mix(
            tone(120, 0.35, amp=0.34, decay=0.28),
            lowpass(noise(0.35, 0.24, decay=0.28), 0.08),
        )

    return concat(puff(), silence(0.26), puff(), silence(0.2), gain(puff(), 0.8))


def build_mastication() -> list[float]:
    def crunch(freq: float) -> list[float]:
        return concat(
            tone(freq, 0.05, amp=0.4, decay=0.03),
            lowpass(noise(0.05, 0.3, decay=0.03), 0.4),
        )

    return concat(
        crunch(300),
        silence(0.10),
        crunch(260),
        silence(0.09),
        crunch(330),
        silence(0.10),
        crunch(280),
    )


def build_gorgee() -> list[float]:
    return concat(
        glide(320, 180, 0.16, amp=0.34, decay=0.12),
        silence(0.06),
        glide(290, 160, 0.16, amp=0.3, decay=0.12),
    )


def build_ailes() -> list[float]:
    return whoosh(0.4, amp=0.5, peak=0.14, spread=0.1)


def build_flamme() -> list[float]:
    return mix(
        lowpass(noise(0.3, 0.5, decay=0.18), 0.15),
        glide(520, 180, 0.3, amp=0.3, decay=0.2),
    )


def build_balle() -> list[float]:
    return concat(
        tone(520, 0.10, amp=0.4, decay=0.07),
        silence(0.06),
        tone(400, 0.12, amp=0.34, decay=0.09),
        silence(0.07),
        tone(300, 0.16, amp=0.28, decay=0.12),
    )


def build_plantation() -> list[float]:
    thud = tone(150, 0.2, amp=0.42, decay=0.12)
    rustle = lowpass(noise(0.28, 0.3, decay=0.16), 0.2)
    return mix(at(thud, 0.0), at(rustle, 0.05))


def build_eau() -> list[float]:
    pour = lowpass(noise(0.75, 0.34, decay=0.6), 0.28)
    drops = concat(
        tone(940, 0.06, amp=0.2, decay=0.04),
        silence(0.08),
        tone(1120, 0.05, amp=0.18, decay=0.03),
        silence(0.1),
        tone(820, 0.05, amp=0.16, decay=0.03),
    )
    return mix(pour, at(drops, 0.12))


def build_croissance() -> list[float]:
    notes = [659.25, 783.99, 987.77, 1318.5]
    return concat(*[tone(freq, 0.12, amp=0.34, decay=0.09) for freq in notes])


def build_recolte() -> list[float]:
    pluck = glide(540, 260, 0.16, amp=0.4, decay=0.12)
    sparkle = concat(
        tone(1568.0, 0.07, amp=0.28, decay=0.04),
        tone(2093.0, 0.10, amp=0.24, decay=0.06),
    )
    return concat(pluck, sparkle)


def build_papillon() -> list[float]:
    return concat(
        tone(1760.0, 0.06, amp=0.22, decay=0.04),
        silence(0.05),
        tone(2093.0, 0.06, amp=0.2, decay=0.04),
        silence(0.06),
        tone(1760.0, 0.08, amp=0.18, decay=0.05),
    )


def build_emboite() -> list[float]:
    click = tone(640, 0.04, amp=0.4, decay=0.02)
    snap = mix(
        tone(240, 0.09, amp=0.4, decay=0.05),
        lowpass(noise(0.07, 0.3, decay=0.04), 0.4),
    )
    return concat(click, snap)


def build_construit() -> list[float]:
    notes = [523.25, 659.25, 783.99, 1046.5]
    return concat(*[tone(freq, 0.14, amp=0.4, decay=0.1) for freq in notes])


def build_robot() -> list[float]:
    seq = [440.0, 554.37, 659.25, 554.37, 440.0]
    return concat(*[tone(freq, 0.09, amp=0.32, decay=0.05) for freq in seq])


def build_fusee() -> list[float]:
    w = whoosh(0.7, amp=0.5, peak=0.2, spread=0.18)
    rumble = lowpass(noise(1.0, 0.4, decay=0.9), 0.05)
    return mix(w, rumble, at(glide(120, 320, 0.9, amp=0.3, decay=0.8), 0.1))


def build_depart() -> list[float]:
    horn = mix(
        tone(170, 0.6, amp=0.34, decay=0.5),
        tone(255, 0.6, amp=0.22, decay=0.5),
    )
    w = whoosh(0.9, amp=0.4, peak=0.32, spread=0.22)
    return mix(horn, at(w, 0.1))


def build_vagues() -> list[float]:
    swell = lowpass(noise(1.4, 0.34, decay=1.6), 0.05)
    return mix(swell, at(gain(lowpass(noise(1.0, 0.28, decay=1.1), 0.04), 0.8), 0.3))


def build_mouette() -> list[float]:
    return concat(
        glide(1250, 720, 0.18, amp=0.3, decay=0.16),
        silence(0.05),
        glide(1450, 820, 0.15, amp=0.26, decay=0.13),
    )


def build_tresor() -> list[float]:
    notes = [659.25, 880.0, 1174.66, 1567.98]
    return concat(*[tone(freq, 0.13, amp=0.36, decay=0.09) for freq in notes])


def build_coffre_ouvre() -> list[float]:
    creak = lowpass(glide(220, 380, 0.35, amp=0.3, decay=0.3), 0.2)
    thunk = tone(140, 0.2, amp=0.4, decay=0.12)
    sparkle = concat(
        tone(1320, 0.08, amp=0.28, decay=0.05),
        tone(1760, 0.1, amp=0.24, decay=0.06),
        tone(2093, 0.12, amp=0.2, decay=0.07),
    )
    return concat(creak, thunk, silence(0.05), sparkle)


def build_surprise() -> list[float]:
    return concat(
        tone(880, 0.06, amp=0.3, decay=0.04),
        silence(0.04),
        tone(1320, 0.1, amp=0.26, decay=0.07),
    )


def build_lumiere() -> list[float]:
    return concat(
        tone(300, 0.04, amp=0.35, decay=0.02),
        silence(0.03),
        tone(960, 0.06, amp=0.3, decay=0.04),
    )


def build_rideau() -> list[float]:
    return whoosh(0.4, amp=0.34, peak=0.15, spread=0.12)


SOUNDS = {
    "coffre": build_coffre,
    "dragon-content": build_dragon_content,
    "ronflement": build_ronflement,
    "mastication": build_mastication,
    "gorgee": build_gorgee,
    "ailes": build_ailes,
    "flamme": build_flamme,
    "balle": build_balle,
    "piece": build_piece,
    "etoile": build_etoile,
    "dragon": build_dragon,
    "reussite": build_reussite,
    "eclosion": build_eclosion,
    "moteur": build_moteur,
    "capture": build_capture,
    "construction": build_construction,
    "sirene": build_sirene,
    "pouvoir": build_pouvoir,
    "plantation": build_plantation,
    "eau": build_eau,
    "croissance": build_croissance,
    "recolte": build_recolte,
    "papillon": build_papillon,
    "emboite": build_emboite,
    "construit": build_construit,
    "robot": build_robot,
    "fusee": build_fusee,
    "depart": build_depart,
    "vagues": build_vagues,
    "mouette": build_mouette,
    "tresor": build_tresor,
    "coffre-ouvre": build_coffre_ouvre,
    "surprise": build_surprise,
    "lumiere": build_lumiere,
    "rideau": build_rideau,
}


def main() -> None:
    output = os.path.abspath(OUT_DIR)
    os.makedirs(output, exist_ok=True)
    random.seed(20261012)

    print(f"Dossier : {output}")
    for name, builder in SOUNDS.items():
        samples = builder()
        path = os.path.join(output, f"{name}.wav")
        write_wav(path, samples)
        duration = len(samples) / RATE
        print(f"  ✓ {name}.wav  ({duration:.2f}s)")

    print(f"Terminé : {len(SOUNDS)} bruitages WAV.")


if __name__ == "__main__":
    main()
