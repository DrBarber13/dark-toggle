"""Generate the extension's PNG icons with no third-party dependencies.

off: a circle outline with the left half filled (contrast symbol).
on:  a solid crescent moon.
icon: the crescent on a dark rounded square (for the extensions list).
"""
import math, struct, sys, zlib
from pathlib import Path

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "extension/icons")
SS = 4  # supersampling factor for anti-aliasing


def png(path, size, pixel):
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            acc = [0, 0, 0, 0]
            for sy in range(SS):
                for sx in range(SS):
                    u = (x + (sx + 0.5) / SS) / size
                    v = (y + (sy + 0.5) / SS) / size
                    r, g, b, a = pixel(u, v)
                    acc[0] += r * a; acc[1] += g * a; acc[2] += b * a; acc[3] += a
            n = SS * SS
            a = acc[3] / n
            rgb = [int(c / acc[3]) if acc[3] else 0 for c in acc[:3]]
            row += bytes(rgb + [int(a)])
        rows.append(bytes(row))
    raw = b"".join(rows)
    chunk = lambda t, d: struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d))
    data = (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9))
            + chunk(b"IEND", b""))
    path.write_bytes(data)


INK = (40, 40, 40)
CLEAR = (0, 0, 0, 0)


def contrast(u, v):
    d = math.hypot(u - 0.5, v - 0.5)
    if 0.36 <= d <= 0.44 or (d < 0.36 and u < 0.5):
        return (*INK, 255)
    return CLEAR


def in_moon(u, v):
    return math.hypot(u - 0.5, v - 0.5) <= 0.42 and math.hypot(u - 0.68, v - 0.36) > 0.32


def moon(u, v):
    return (*INK, 255) if in_moon(u, v) else CLEAR


def app_icon(u, v):
    # Rounded square background.
    m, r = 0.04, 0.22
    cx = min(max(u, m + r), 1 - m - r)
    cy = min(max(v, m + r), 1 - m - r)
    if math.hypot(u - cx, v - cy) > r:
        return CLEAR
    s = 0.62  # scale moon into the middle
    mu, mv = (u - 0.5) / s + 0.5, (v - 0.5) / s + 0.5
    return (245, 214, 120, 255) if in_moon(mu, mv) else (30, 34, 48, 255)


OUT.mkdir(parents=True, exist_ok=True)
for size in (16, 32):
    png(OUT / f"off-{size}.png", size, contrast)
    png(OUT / f"on-{size}.png", size, moon)
for size in (48, 96, 128, 512):
    png(OUT / f"icon-{size}.png", size, app_icon)
print("wrote icons to", OUT)
