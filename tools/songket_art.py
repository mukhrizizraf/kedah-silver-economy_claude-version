"""Draw the songket art (assets/art/songket-*.svg).

Original patterns in the songket colours of Kedah: deep red, gold, cream
and a near-black ground. The band is the trim that edges the Overview's
photo and each chapter, like the border of a kain songket; the crest is
the tab icon. The four larger pattern cards are kept here as sources but
are not shipped.

Run from this folder:  python tools/songket_art.py
"""
import os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, 'assets', 'art')
RED, DEEP, GOLD, PALE, CREAM, INK = '#8c1a2b', '#5c0f1c', '#d9ad4f', '#f1d58a', '#f6efdf', '#130d09'
W, H = 200, 280


def svg(body, bg):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d">' % (W, H) +
            '<rect width="%d" height="%d" fill="%s"/>' % (W, H, bg) + body + '</svg>')


def diamond(cx, cy, r, fill):
    return '<path d="M%g %gl%g %gl%g %gl%g %gz" fill="%s"/>' % (cx, cy - r, r, r, -r, r, -r, -r, fill)


def border_band(y, h):
    out = '<rect y="%g" width="%d" height="%g" fill="%s"/>' % (y, W, h, GOLD)
    step = h
    for i in range(int(W / step) + 1):
        out += diamond(i * step + step / 2, y + h / 2, h / 2 - 3, DEEP)
        out += diamond(i * step + step / 2, y + h / 2, h / 6, PALE)
    return out


def rebung():
    """Pucuk rebung: rows of bamboo shoots between two diamond bands."""
    b = border_band(0, 28) + border_band(H - 28, 28)
    for row, y0 in enumerate((40, 112, 184)):
        for i in range(5):
            x = i * 40 + (20 if row % 2 else 0)
            for dx in (x, x - 200 if x > 160 else None):
                if dx is None:
                    continue
                b += '<path d="M%g %gL%g %gH%gZ" fill="%s"/>' % (dx + 20, y0, dx + 38, y0 + 64, dx + 2, GOLD)
                b += '<path d="M%g %gL%g %gH%gZ" fill="%s"/>' % (dx + 20, y0 + 22, dx + 30, y0 + 58, dx + 10, RED)
                b += diamond(dx + 20, y0 + 46, 5, PALE)
    return svg(b, RED)


def lattice():
    """A gold diamond lattice with a small four-petal flower at each crossing."""
    b = ''
    s = 40
    for k in range(-8, 12):
        b += '<path d="M%g 0L%g %d" stroke="%s" stroke-width="3"/>' % (k * s, k * s + H, H, GOLD)
        b += '<path d="M%g 0L%g %d" stroke="%s" stroke-width="3"/>' % (k * s, k * s - H, H, GOLD)
    for row in range(0, 15):
        for col in range(0, 7):
            cx = col * s + (s / 2 if row % 2 else 0)
            cy = row * s / 2
            b += '<circle cx="%g" cy="%g" r="7" fill="%s"/>' % (cx, cy, RED)
            for ang in (0, 90, 180, 270):
                b += '<ellipse cx="%g" cy="%g" rx="2.6" ry="6" fill="%s" transform="rotate(%d %g %g)"/>' % (cx, cy - 6, CREAM, ang, cx, cy)
            b += '<circle cx="%g" cy="%g" r="2.4" fill="%s"/>' % (cx, cy, GOLD)
    b += '<rect x="7" y="7" width="%d" height="%d" fill="none" stroke="%s" stroke-width="4" rx="6"/>' % (W - 14, H - 14, GOLD)
    return svg(b, INK)


def stars():
    """Eight-point stars in gold on deep red, a cream frame around them."""
    b = ''
    for row in range(6):
        for col in range(4):
            cx, cy = 26 + col * 50 + (25 if row % 2 else 0), 30 + row * 46
            b += '<rect x="%g" y="%g" width="26" height="26" fill="%s"/>' % (cx - 13, cy - 13, GOLD)
            b += '<rect x="%g" y="%g" width="26" height="26" fill="%s" transform="rotate(45 %g %g)"/>' % (cx - 13, cy - 13, GOLD, cx, cy)
            b += '<circle cx="%g" cy="%g" r="7" fill="%s"/>' % (cx, cy, RED)
            b += '<circle cx="%g" cy="%g" r="2.5" fill="%s"/>' % (cx, cy, PALE)
    b += '<rect x="6" y="6" width="%d" height="%d" fill="none" stroke="%s" stroke-width="5"/>' % (W - 12, H - 12, CREAM)
    return svg(b, DEEP)


def checker():
    """A turned gold and red check, each red square carrying a small cross."""
    b = '<g transform="rotate(45 100 140)">'
    s = 30
    for row in range(-6, 14):
        for col in range(-6, 12):
            x, y = col * s - 60, row * s - 60
            red = (row + col) % 2
            b += '<rect x="%g" y="%g" width="%d" height="%d" fill="%s"/>' % (x, y, s, s, RED if red else GOLD)
            if red:
                b += '<path d="M%g %gh8v-8h4v8h8v4h-8v8h-4v-8h-8z" fill="%s"/>' % (x + 5, y + 13, PALE)
    b += '</g>'
    return svg(b, GOLD)


def band():
    """A narrow songket border that repeats sideways: a gold diamond chain
    with red hearts on a deep red ground, between two gold rules."""
    w, h = 40, 22
    b = '<rect width="%d" height="%d" fill="%s"/>' % (w, h, DEEP)
    b += '<rect width="%d" height="2" fill="%s"/><rect y="%d" width="%d" height="2" fill="%s"/>' % (w, GOLD, h - 2, w, GOLD)
    b += diamond(20, 11, 7, GOLD) + diamond(20, 11, 3, RED)
    b += diamond(0, 11, 3, PALE) + diamond(40, 11, 3, PALE)
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d">%s</svg>' % (w, h, b)


def crest():
    """A small shield for the central card: a gold field with a red rebung."""
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 72">'
            '<path d="M4 4h56v30c0 18-14 30-28 36C18 64 4 52 4 34z" fill="%s"/>' % DEEP +
            '<path d="M10 10h44v24c0 14-10 24-22 29-12-5-22-15-22-29z" fill="%s"/>' % GOLD +
            '<path d="M32 16L44 50H20z" fill="%s"/><path d="M32 30l5 14H27z" fill="%s"/>' % (DEEP, GOLD) +
            '</svg>')


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for name, fn in (('band', band), ('crest', crest)):
        with open(os.path.join(OUT, 'songket-%s.svg' % name), 'w', encoding='utf-8') as f:
            f.write(fn())
        print('wrote songket-%s.svg' % name)
