---
name: brandsmith
description: Create a complete brand logo package — wordmark, app icons, profile marks, PNG exports, and a concept document — as clean path-based SVG with light/dark theme variants. Use this whenever the user wants a logo, wordmark, lettermark, brand identity, app icon, avatar, or profile image for a brand, company, product, shop, or team, even if they only say things like "ทำโลโก้", "ออกแบบแบรนด์", "make me a logo", "I need an app icon", or asks to restyle/extend an existing logo. Also use when the user wants role- or name-labeled profile images derived from an existing brand mark.
---

# Brandsmith — brand logo package generator

Interview first, check the landscape, generate as *code* (everything regenerable),
verify visually, document the concept. Output goes under `brand/` in the directory
where the skill is invoked.

## Phase 0 — Interview (always first)

Ask before designing, with the AskUserQuestion tool. Two questions are mandatory, in
this order:

1. **What is the logo about?** — brand name, what the brand does, feeling it should
   give (e.g. fresh / premium / playful / technical). If the user already said this in
   their request, confirm your reading instead of re-asking.
2. **Color** — offer 3–4 palette choices appropriate to the brand's field (each option
   = primary hex + short rationale), and remind the user they can type their own hex
   in "Other". Whatever they pick, the package must work on **both light and dark
   backgrounds**.

Also ask (same call or second call, batch to max 4 questions):

3. **Style** — offer as choices:
   - *Wordmark with a hidden symbol* — full brand name; one letter carries an embedded
     image or negative-space element (Spotify/FedEx school)
   - *Lettermark* — single initial as the mark (like a favicon-first brand)
   - *Abstract symbol + wordmark* — separate icon and text lockup
4. Anything genuinely ambiguous about scope (e.g. does "logo" include app icons?).

No user available to answer (non-interactive / subagent) → pick sensible defaults, and
record every one in the concept document under a "Decisions taken by default" heading.

## Phase 1 — Similarity check (don't skip)

Before committing to a concept, image-search (web search or the browser tool) the
planned motif plus the brand's industry. Look for:

- **Famous direct clashes** — same letter + same motif + same color family at a known
  brand. If found, change the motif, not just the color.
- **Stock-template crowding** — exact concept sold as templates everywhere →
  distinctiveness must come from a *specific combination* (placement, negative space,
  a second motif). Note this in the concept doc.

Tell the user what you found in one short paragraph before building.

## Phase 2 — Build as generators, not hand-drawn files

Never hand-write final SVGs. Write Python generator scripts into `brand/tools/` that
emit every variant, so every later change is an edit + rerun.

Folder layout to produce:

```
brand/
├── concept/    logo-concept.md + logo-concept.pdf (both, always)
├── logo/
│   ├── svg/    wordmark variants: primary, on-dark, mono-black, mono-white, brand-color
│   ├── icon/   app icons: rounded-square, circle, dark  (1024×1024 viewBox)
│   └── mark/   standalone marks for profiles: transparent + full-bleed bg (+ png/)
├── preview/    preview.html — all variants on light AND dark strips side by side
└── tools/      the generator scripts + README with regen order
    └── fonts/  the vendored font file(s) + their license file
```

Technique rules (details and math in
[references/svg-technique.md](references/svg-technique.md)):

- **Path-based text only.** Convert wordmark text to outlines (fontTools glyph
  extraction). `<text>` renders differently on every machine.
- **A font licensed for logo use, vendored.** Open-licensed (OFL / Apache) by
  default, never a system font; the file and its license live in
  `brand/tools/fonts/`. A commercial font only once the user confirms their license
  covers logos. Rules in
  [references/svg-technique.md](references/svg-technique.md) › Choosing the font.
- **Geometry by container.** Square tile ≈ 57% cap-height, circle ≈ 52%, leave room
  below (~40%) when a text label joins the mark. Center optically on the main
  letterform, not the bounding box of letter + ornament.
- **Full-bleed profile images get square corners.** Platforms apply their own crop.
- **Anything meant for profile pictures must survive a circular crop.** Check the
  extreme points against the inscribed circle before shipping.
- **Light/dark pairs are mandatory:** every deliverable set includes an on-light and
  an on-dark variant, and preview.html shows both strips.
- **Generated files must pass the project's own checks.** `brand/` lands in the user's
  repo, so its linter and CI read it too (Biome, ESLint, Prettier, html-validate…).
  preview.html is real, accessible HTML: `<!doctype html>`, `<html lang="…">` in the
  brand's language, a `<title>`, `<meta charset>` and viewport, and a descriptive `alt`
  on **every** `<img>` (e.g. `alt="SKOPIA wordmark, on dark"` — never empty, never the
  file name). Any HTML or JSON the generators emit follows the same rule.

## Phase 3 — Export PNG

Export 1024×1024 PNGs of every profile-facing asset with
`scripts/export_png.sh <in.svg> <out.png>` (bundled — tries rsvg-convert, ImageMagick,
then headless Chrome; transparent variants keep their alpha).

## Phase 4 — Verify with your own eyes, then document

1. Render PNGs and Read them as images. Check: nothing clipped, negative space reads
   at a glance, dark variant actually legible on dark. Fix and re-render — do not
   ship unviewed assets.
2. Run the project's linter and formatter on `brand/` when the repo has one (look
   for `biome.json`, `.eslintrc*`, `.prettierrc*`, a `lint` script in
   `package.json`). A finding → fix the **generator** and rerun, never hand-edit the
   output. Don't silence a rule or exclude `brand/` without asking the user.
3. Write `brand/concept/logo-concept.md`: the concept story (what is hidden where and
   why), color table with hex + usage, font (name, version, license, source URL),
   variant/file table, geometry constants used,
   similarity-check findings, and how to regenerate. Then **always build the PDF
   version too**. `reportlab` + `svglib` are rarely preinstalled: install them into
   the package venv (the same one used for fonttools —
   `python3 -m venv brand/tools/venv && brand/tools/venv/bin/pip install reportlab svglib`)
   and keep the PDF build as a script in `brand/tools/` so it regenerates. Add
   `brand/tools/venv/` to the repo's `.gitignore` — it must never be committed or
   linted.
   Skip the PDF only if the install itself fails (e.g. offline) — in that case tell
   the user exactly the two commands to run later.
   Non-Latin doc text (Thai etc.) needs a registered TTF — see the PDF section of
   [references/svg-technique.md](references/svg-technique.md).
4. Show the user the result (render preview or key PNGs) and offer the natural next
   iterations: tweak motif, add role/name-labeled profile variants, favicon sizes.

## Iterating later (same brand, follow-up sessions)

When asked for additions (new color, role labels, new size), extend the generators in
`brand/tools/` and rerun — never edit emitted SVGs. If a change alters concept-level
facts (new variant family, new geometry constant), update logo-concept.md (and the PDF
if it exists) in the same turn.
