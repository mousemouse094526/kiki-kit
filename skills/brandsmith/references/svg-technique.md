# SVG technique reference

Math and code patterns for the brandsmith pipeline. Defaults — deviate only with a
reason.

## Choosing the font — license first

- **Default: an open-licensed font** — SIL OFL 1.1 or Apache 2.0. Most of Google Fonts qualifies: Inter, Poppins, Manrope,
  and for Thai Noto Sans Thai, IBM Plex Sans Thai, Sarabun, Prompt, Kanit.
- **Never a system font** (Arial, Helvetica, SF Pro, Thonburi, Sukhumvit…).
- **The user's own commercial font** → only after they confirm their license covers
  logo or trademark use. Record "license confirmed by the user" in the concept doc.
- **Vendor it:** download the `.ttf` from the official source (the
  [google/fonts](https://github.com/google/fonts) repo or the foundry's own) into
  `brand/tools/fonts/`, together with its license file (`OFL.txt`, `LICENSE`). The
  generators load it from there, never from a system path.
- **Record it** in the concept doc: font name, version, license, source URL.

## Extracting font glyphs as paths (fontTools)

Needs `fonttools` (`pip install fonttools` into a venv if the system python lacks it).

```python
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

font = TTFont(FONT_PATH)          # vendored, e.g. brand/tools/fonts/Inter-Bold.ttf (OFL)
cmap = font.getBestCmap()
glyf = font.getGlyphSet()

# kern table (old-style 'kern'; variable/OTF fonts may need GPOS instead)
kern = {}
if "kern" in font:
    for t in font["kern"].kernTables:
        if hasattr(t, "kernTable"):
            kern.update(t.kernTable)

x, prev, cmds = 0.0, None, []
for ch in text:
    g = cmap[ord(ch)]
    if prev is not None:
        x += kern.get((prev, g), 0)
    pen = SVGPathPen(glyf)
    # font coords are y-up; SVG is y-down -> flip with Transform(1,0,0,-1,x,0)
    glyf[g].draw(TransformPen(pen, Transform(1, 0, 0, -1, x, 0)))
    cmds.append(pen.getCommands())
    x += glyf[g].width
    prev = g
# " ".join(cmds) is the word as one path; x is total advance width in font units
```

Cap height: measure from the actual 'B'/'H' glyph bbox, not OS/2 metrics. Scale factor to get cap height
`H` px = `H / cap_units`.

**Complex scripts (Thai, Arabic, Devanagari…):** don't use the cmap+kern walk above.
Shape with `uharfbuzz` first (it returns positioned glyph ids with
x/y offsets), then draw each glyph through SVGPathPen at its shaped position.
`pip install uharfbuzz` alongside fonttools. Use a vendored open-licensed Thai
font (see Choosing the font), not the macOS system Thai fonts.

## Container geometry (1024 tile)

| Container | mark cap-height | vertical center of main letter |
|---|---|---|
| rounded square / full-bleed square | 57% | 54.5% of tile height |
| circle | 52% | 54.5% |
| square with text label below | 40% | 42%, label baseline ≈ 80% |

Optical center on the main letter: compute translate offsets from the letterform's
own bbox and place ornaments (sprout, accent, antenna) relative to it, not from the
combined bbox.

```python
scale = (TILE * cap_frac) / letter_bbox_height
ox = TILE/2 - (letter_left + letter_right)/2 * scale
oy = TILE * center_frac - (letter_top + letter_bottom)/2 * scale
```

## Circular-crop safety

Any point (x, y) survives the inscribed-circle crop of a 1024 tile iff
`(x-512)² + (y-512)² ≤ 512²`. Practical check for text: at text row y, the half-chord
is `sqrt(512² - (y-512)²)`; keep `text_width/2 + margin(≈20px)` under it. Check the
*longest* string you'll ever render, including descenders (g, y, p).

## Negative-space cutouts

To punch a shape out of a letter (fish in a counter, star in an O): draw the cutout
as a subpath wound the same direction inside the letter path and set
`fill-rule="evenodd"` — one path, no masks.

## Theming variants (minimum set)

| variant | background | mark |
|---|---|---|
| primary | white / light | brand color (accent may differ) |
| on-dark | dark ink (very dark, tinted with brand hue, not pure #000) | white + brand-color accent |
| mono-black | any light | #000 only |
| mono-white | any dark | #FFF only |
| brand-color | brand-color bg | white |

Tint dark ink toward the brand hue (e.g. green brand → `#14261A`).

## PDF concept doc

Embed the generated SVGs with `reportlab` + `svglib`. Thai/non-Latin text in the PDF
needs a TTF registered via `pdfmetrics.registerFont(TTFont(...))` — use the vendored
font in `brand/tools/fonts/`. Keep every doc string in the build script so the PDF
regenerates from one command.
