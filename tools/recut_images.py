"""Recut and regrade the source illustrations into this version's own images.

Source: the main version's 3D illustration set (../assets/img/dashboard-NN-*.webp,
1254 x 1254). The user allowed them on 3 Oct 2026 on one condition: every
picture is recut and regraded so it belongs to this version. Nothing here
copies a source file as it is.

The grade pulls each picture into this version's palette: shadows lean to
midnight navy, highlights to warm milk, midtones take a touch of olive,
colour is calmed (the strong lilac and teal most of all) and the blacks
get a soft matte lift. A light
vignette keeps the eye on the faces.

Run from this folder:  python tools/recut_images.py   (add 'map' to redo only the map centre)
"""
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.normpath(os.path.join(HERE, '..', 'assets', 'img'))
OUT = os.path.join(HERE, 'assets', 'img')

NAVY = np.array([22, 34, 74]) / 255.0
MILK = np.array([247, 241, 226]) / 255.0
OLIVE = np.array([104, 114, 58]) / 255.0


def src(n):
    for f in os.listdir(SRC):
        if f.startswith('dashboard-%02d-' % n) and f.endswith('.webp'):
            return os.path.join(SRC, f)
    raise FileNotFoundError(n)


def grade(im, vignette=0.16):
    a = np.asarray(im.convert('RGB'), dtype=np.float64) / 255.0
    # quiet the source's strong lilac and teal: purples lose the most colour
    hsv = np.asarray(im.convert('RGB').convert('HSV'), dtype=np.float64) / 255.0
    hue, sat = hsv[..., 0:1], hsv[..., 1:2]
    purple = np.clip(1 - np.abs(hue - 0.80) / 0.09, 0, 1) * sat
    teal = np.clip(1 - np.abs(hue - 0.47) / 0.07, 0, 1) * sat
    lum = (a * [0.2126, 0.7152, 0.0722]).sum(axis=2, keepdims=True)
    keep = 0.78 - 0.30 * purple - 0.18 * teal
    a = lum + (a - lum) * keep                                   # calmer colour
    ws = np.clip((0.52 - lum) / 0.52, 0, 1) ** 1.3               # shadows to navy
    a = a * (1 - 0.42 * ws) + NAVY * 0.42 * ws
    wh = np.clip((lum - 0.55) / 0.45, 0, 1) ** 1.1               # highlights to milk
    a = a * (1 - 0.24 * wh) + MILK * 0.24 * wh
    wm = np.clip(1 - np.abs(lum - 0.5) * 2, 0, 1)                # midtones to olive
    a = a * (1 - 0.11 * wm) + OLIVE * 0.11 * wm
    a = 0.5 + (a - 0.5) * 1.08                                   # gentle contrast
    a = a * 0.93 + 0.05                                          # matte blacks
    h, w = a.shape[:2]
    y, x = np.mgrid[0:h, 0:w]
    r = np.sqrt(((x - w / 2) / (w / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2) / np.sqrt(2)
    a = a * (1 - vignette * np.clip(r - 0.35, 0, 1)[..., None] ** 1.6 * 2.2)
    return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))


def cut(n, box, size, vignette=0.16):
    """box = (x0, y0, w, h) in source pixels; size = (W, H) of the output."""
    x0, y0, w, h = box
    im = Image.open(src(n)).convert('RGB').crop((x0, y0, x0 + w, y0 + h))
    im = im.resize(size, Image.LANCZOS)
    return grade(im, vignette)


def cutout(path, box, size, vignette=0.08):
    """A transparent 3D character, recut and set on a milk-to-olive ground, then graded."""
    x0, y0, w, h = box
    fg = Image.open(path).convert('RGBA').crop((x0, y0, x0 + w, y0 + h)).resize(size, Image.LANCZOS)
    W, H = size
    y, x = np.mgrid[0:H, 0:W]
    r = np.clip(np.sqrt((x - W / 2) ** 2 + (y - H * 0.42) ** 2) / (W * 0.7), 0, 1)[..., None]
    ground = np.array([250, 244, 230]) * (1 - r) + np.array([214, 214, 184]) * r
    im = Image.fromarray(ground.astype(np.uint8)).convert('RGBA')
    im.alpha_composite(fg)
    return grade(im, vignette)


def save(im, name, q=80):
    im.save(os.path.join(OUT, name), 'WEBP', quality=q, method=6)


# Each picture: (name, source number, crop box, output size)
PLAN = [
    # Overview
    ('hero-couple.webp', 4, (0, 96, 1254, 690), (1254, 690)),
    ('hero-couple-m.webp', 4, (20, 100, 980, 1078), (720, 792)),   # phones
    ('people-easy.webp', 2, (150, 40, 880, 1100), (560, 700)),
    ('people-family.webp', 16, (190, 70, 880, 1100), (560, 700)),
    ('people-company.webp', 5, (250, 30, 880, 1100), (560, 700)),
    ('people-advice.webp', 8, (220, 40, 880, 1100), (560, 700)),
    ('people-phone.webp', 14, (200, 40, 880, 1100), (560, 700)),
    # One story picture per page head
    ('page-ecosystem.webp', 6, (0, 160, 1254, 1040), (960, 796)),
    ('page-network.webp', 17, (0, 150, 1254, 1040), (960, 796)),
    ('page-scenario.webp', 15, (130, 90, 1100, 912), (960, 796)),
    ('page-roadmap.webp', 19, (0, 150, 1254, 1040), (960, 796)),
    ('page-evidence.webp', 18, (0, 170, 1254, 1040), (960, 796)),
    ('page-data.webp', 20, (0, 150, 1254, 1040), (960, 796)),
    ('page-app.webp', 3, (90, 70, 1120, 928), (960, 796)),
    # Our Silver App
    ('app-welcome.webp', 1, (40, 30, 1040, 1040), (760, 760)),
    ('help-transport.webp', 10, (170, 110, 980, 980), (560, 560)),
    ('help-meals.webp', 11, (60, 120, 1080, 1080), (560, 560)),
    ('help-home.webp', 12, (120, 150, 980, 980), (560, 560)),
    ('help-health.webp', 9, (110, 150, 980, 980), (560, 560)),
    ('help-masjid.webp', 7, (120, 110, 980, 980), (560, 560)),
    ('help-company.webp', 13, (110, 140, 980, 980), (560, 560)),
]

# The map's centre: the 3D Pixar makcik (head and shoulders), asked for on 4 Oct 2026
MAP_ELDER = (os.path.join(SRC, 'elder-3d-avatar.png'), (226, 20, 860, 860), (320, 320))

if __name__ == '__main__':
    if 'map' in __import__('sys').argv[1:]:
        save(cutout(*MAP_ELDER), 'map-elder.webp', 84)
        print('wrote map-elder.webp')
        raise SystemExit
    save(cutout(*MAP_ELDER), 'map-elder.webp', 84)
    for name, n, box, size in PLAN:
        v = 0.10 if name.startswith(('help-', 'map-', 'app-')) else 0.16
        save(cut(n, box, size, v), name, 82 if name.startswith('hero') else 80)
        print('wrote', name)
