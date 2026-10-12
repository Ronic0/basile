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


SOUNDS = {
    "coffre": build_coffre,
    "piece": build_piece,
    "etoile": build_etoile,
    "dragon": build_dragon,
    "reussite": build_reussite,
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
