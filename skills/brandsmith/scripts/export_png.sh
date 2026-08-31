#!/bin/bash
# export_png.sh <in.svg> <out.png> [size]
# Renders an SVG to PNG (default 1024x1024), preserving alpha for transparent SVGs.
# Tries, in order: rsvg-convert, ImageMagick (magick/convert), headless Chrome.
set -euo pipefail

IN="$1"; OUT="$2"; SIZE="${3:-1024}"

if command -v rsvg-convert >/dev/null 2>&1; then
  rsvg-convert -w "$SIZE" -h "$SIZE" "$IN" -o "$OUT"
elif command -v magick >/dev/null 2>&1; then
  magick -background none "$IN" -resize "${SIZE}x${SIZE}" "$OUT"
elif command -v convert >/dev/null 2>&1; then
  convert -background none "$IN" -resize "${SIZE}x${SIZE}" "$OUT"
else
  for CH in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
            "$(command -v google-chrome || true)" \
            "$(command -v chromium || true)"; do
    if [ -n "$CH" ] && [ -x "$CH" ]; then
      ABS_IN="$(cd "$(dirname "$IN")" && pwd)/$(basename "$IN")"
      # --default-background-color=00000000 keeps transparency
      # --hide-scrollbars: without it Chrome paints scrollbars into the capture
      # when the SVG's intrinsic size differs from the window size
      "$CH" --headless --disable-gpu --screenshot="$OUT" \
        --window-size="$SIZE,$SIZE" --hide-scrollbars --force-device-scale-factor=1 \
        --default-background-color=00000000 \
        "file://$ABS_IN" 2>/dev/null
      exit 0
    fi
  done
  echo "no SVG->PNG renderer found (rsvg-convert / imagemagick / chrome)" >&2
  exit 1
fi
