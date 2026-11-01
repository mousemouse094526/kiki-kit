# Template: docs/features/{slug}/ui-prompt.md

**One** paste-ready prompt that designs every screen whose Source in spec ›
Design is `pending` — a component set, every screen and state, and a
clickable preview of the whole flow — so the user pastes once into any
design tool (Figma Make, Claude, v0, Stitch, Lovable), asks for it through
the Figma MCP, or hands it to a designer. Copy the skeleton under
**Template**; follow **Rules**.

## Rules

All of [markdown-style.md](../references/markdown-style.md), plus:

- **Written when** any screen is `pending`: at the gate's Approve (spec
  final), on `/warroom ui {slug}`, and again whenever a change request
  edits a `pending` screen's row. Rewritten whole each time — never
  hand-edited. No `pending` screen left → delete the file and its link.
- **`/warroom ui {slug} all`** writes it for every screen in spec › Design,
  designed or not — a redesign. Sources, the board, and Blocked rows stay
  as they are; the intro line says it is a redesign. The next pending-only
  rewrite replaces it.
- **One prompt for all the screens:** a single fenced `text` block, so
  pasting it once is enough. Shared context, the component rules, and the
  preview are written once at the top; each screen is a `Screen {n}` part
  inside the same block, in flow order (the order a user meets them).
- **Prompt language: English** (design tools follow it best). Every
  on-screen string — labels, buttons, messages — is quoted exactly in the
  product's language, from the decisions; never translated or invented.
  Everything outside the block is in the docs language.
- **Facts from the code, not guesses.** Look up the platform, breakpoints,
  component library, colour and type tokens, icon set, the Figma file and
  its component or token pages, and an existing screen to match (by name,
  for the user to attach a screenshot of). None in the project → say
  `no existing design system; propose a clean, neutral one`.
- **Components first.** The block asks for the component set before any
  screen: list the components the screens need — existing ones by their
  name in the library (reuse, add variants), new ones with their variants
  (one per state) and properties. Screens are built only from instances.
- **Only what the spec says.** Fields, actions, states, rules, and copy
  come from spec › Design › Must show and the `D{n}` it cites — no extra
  fields, steps, or features. Out of Scope items are listed under "Do not
  include".
- **Every state is a frame.** Ask for the default plus each state Must
  show names (empty, loading, error, no permission, success), at each
  breakpoint the project supports.
- **The preview covers everything made:** every screen frame in flow order,
  wired as a prototype from the entry screen through each action named in
  Content, plus every state frame placed beside its screen.
- **No `D{n}` inside the block** — a design tool can't read them. The
  screen table above the block cites them.
- **End with how to bring it back:** paste the Figma link or image path
  with `/warroom {slug}`.

## Template

````markdown
# UI prompt: {feature slug}

{One line in the docs language: these screens are `pending` (or: a redesign
of every screen); copy the one block below into a design tool — or in
Claude Code with the Figma MCP, say "design docs/features/{slug}/ui-prompt.md
in {Figma file link}" — then bring the result back with `/warroom {slug}`.}

| # | Screen | User stories | Decisions |
|---|---|---|---|
| 1 | {Contact list} | 1 | D2 |
| 2 | {Contact form} | 1, 3 | D2, D4 |

```text
Design the {feature} screens of {product: one line on what it is and who uses it}. Work in three steps, in this order: 1 Components, 2 Screens, 3 Preview.

Context
- Platform: {web app / iOS / Android}; breakpoints: {mobile 375, desktop 1440}.
- Design system: {component library and version, tokens: primary #…, font …, radius …, icon set}. {Figma file "…", its token and component pages.} Match the look of the existing "{screen name}" screen (screenshot attached).
- Language on screen: {Thai}. Use the copy below exactly.
- Accessibility: WCAG 2.2 AA contrast, visible focus, labels on every input, touch targets ≥ 44px.

Step 1 — Components (page "Components")
- Reuse before you create: {existing component} — add variants {…}; {existing component} as is.
- New: {component} — variants {default, hover, disabled, error, …}; properties {label text, icon, …}.
- Every component uses auto layout, binds colour, type, spacing, and radius to the tokens above (no raw values), and is named "{Area}/{Component}"; each state is a variant, not a copy.
- Screens in step 2 use only instances of these components.

Step 2 — Screens (page "Screens", one section per screen)
Frames are named "{screen} / {state} / {breakpoint}", one per state per breakpoint, filled with realistic sample data in {Thai}.

Screen 1 — {Contact list}
- Who and why: {actor} wants to {goal}, so that {benefit}. Arrives from {entry point}; goes to Screen 2 on {action}.
- Content:
  - {field}: {type, required/optional, format, validation rule} — label "{exact label}", placeholder "{…}".
  - {action}: button "{exact text}" — {what it does; disabled when …}.
  - {rule shown on screen}: "{exact message}".
- States:
  1. Default.
  2. Empty: "{exact empty message}", with {call to action}.
  3. Loading: {skeleton / spinner where}.
  4. Error: {which error} → "{exact message}" shown {inline under the field / as a banner}.
  5. No permission: {what is hidden or read-only} — "{exact message}".
  6. Success: {what changes} — "{exact message}".

Screen 2 — {Contact form}
- …

Step 3 — Preview (page "Preview")
- Place every screen's default frame left to right in flow order: {Screen 1} → {Screen 2} → …, each with its state frames stacked under it, at each breakpoint.
- Wire a clickable prototype starting at "{Screen 1} / Default / {desktop}": {action} → {Screen 2}; {action} → {state or screen}; … Every action named in step 2 leads somewhere.

Do not include
- {Out of Scope item}.
- Any field, step, screen, or feature not listed above.

Deliver: the three pages above; a list of every component made or changed; and the prototype's start link.
```
````
