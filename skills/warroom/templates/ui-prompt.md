# Template: docs/features/{slug}/ui-prompt.md

One paste-ready prompt per feature that designs every `pending` screen in
spec › Design: components, screens with their states, and the system-wide
preview. The user pastes it once into a design tool, runs it through the
Figma MCP, or gives it to a designer. Copy **Template**; follow **Rules**.

## Rules

All of [markdown-style.md](../references/markdown-style.md), plus:

- **Written** whenever a screen is `pending`: at the gate's Approve, on
  `/warroom ui {slug}`, and after a change request that touches a
  `pending` screen. Rewrite the whole file each time; never hand-edit. No
  `pending` screen → delete the file and its spec link.
- **One fenced `text` block.** Context, components, and preview appear
  once; each screen is a `Screen {n}` part inside it, in flow order.
- **English prompt.** On-screen strings are quoted exactly in the
  product's language, from the decisions. Text outside the block uses the
  docs language.
- **Start from what exists.** From the code and the design source in
  `docs/decisions.md`, name the platform, breakpoints, component library,
  tokens, icon set, the Figma file with its component, token, and preview
  pages, and the existing screens this feature links to. No design system
  → write `no existing design system; propose a clean, neutral one`.
- **A redesigned screen** (Source was a link before the change request)
  names its current frame link and says what changes.
- **Components before screens.** Existing components by library name,
  with the variants to add; new components with variants (one per state)
  and properties. Screens use instances only.
- **Spec only.** Fields, actions, states, rules, and copy come from Must
  show and its `D{n}`. Out of Scope goes under "Do not include".
- **Frames.**
  - No ADR sets a design-first scope
    ([design.md](../references/design.md)) → every state is a frame, at
    each breakpoint.
  - An ADR sets one → a frame for each screen and for each state that
    changes its layout (every state the row's At sync column doesn't
    name), at each breakpoint. The At sync states get no frame: list
    them in the screen's `Follow at code sync` line, so the designer
    knows they exist and leaves room for them.
- **`Follow at code sync` line** — only under a design-first scope ADR,
  and only for a screen with At sync states; those states leave its
  `States` line. Otherwise drop the line.
- **The preview extends the system's preview:** add this feature's
  screens to the existing preview page (create it if missing) and wire
  them to the existing screens they come from and return to, so the whole
  system plays as one prototype.
- **No `D{n}` inside the block.** The table above it cites them.
- **Last line:** bring the link back with `/warroom {slug}`.

## Template

````markdown
# UI prompt: {feature slug}

{Docs language, one line: paste the block below once into a design tool,
or in Claude Code with the Figma MCP say "design
docs/features/{slug}/ui-prompt.md in {Figma file link}"; then bring the
link back with `/warroom {slug}`.}

| # | Screen | User stories | Decisions | Now |
|---|---|---|---|---|
| 1 | {Contact list} | 1 | D2 | new |
| 2 | {Contact form} | 1, 3 | D2, D4 | [redesign]({current frame link}) |

```text
Design the {feature} screens of {product: what it is, who uses it}. Steps, in order: 1 Components, 2 Screens, 3 Preview.

Context
- Platform: {web app / iOS / Android}; breakpoints: {mobile 375, desktop 1440}.
- Design system: {library and version}; tokens: {primary #…, font …, radius …}; icons: {set}.
- Figma file: {name or link}; components on "{page}", tokens on "{page}", preview on "{page}".
- Existing screens this feature connects to: "{screen}" ({link}), "{screen}" ({link}). Match their look.
- Language on screen: {Thai}. Use the copy below exactly.
- Accessibility: WCAG 2.2 AA contrast, visible focus, a label on every input, touch targets ≥ 44px.

Step 1 — Components
- Reuse: "{Area}/{Component}" — add variants {…}; "{Area}/{Component}" as is.
- New: "{Area}/{Component}" — variants {default, hover, disabled, error, …}; properties {label, icon, …}.
- Auto layout everywhere; colour, type, spacing, and radius bound to the tokens; each state is a variant.

Step 2 — Screens (one section per screen)
Frame names: "{screen} / {state} / {breakpoint}"; realistic sample data in {Thai}; instances only.

Screen 1 — {Contact list} (new)
- Goal: {actor} wants to {goal}. Comes from "{existing screen}" via {action}; goes to Screen 2 via {action}.
- Content:
  - {field}: {type, required/optional, format, rule}; label "{exact}", placeholder "{exact}".
  - Button "{exact}": {what it does}; disabled when {…}.
  - Message "{exact}": shown when {…}.
- States: 1 Default. 2 Empty: "{exact}", with {call to action}. 3 Loading: {where}. 4 Error: {which} → "{exact}" {inline / banner}. 5 No permission: {hidden or read-only} — "{exact}". 6 Success: "{exact}".
- Follow at code sync (no frame now; built from existing components, drawn later from the code): {Loading: {where}. Error: {which} → "{exact}".}

Screen 2 — {Contact form} (redesign of {current frame link}: {what changes})
- …

Step 3 — Preview
- On the existing preview page "{page}", add each screen's default frame in flow order, its state frames under it, at each breakpoint.
- Prototype links: "{existing screen}" {action} → Screen 1; Screen 1 {action} → Screen 2; Screen 2 {action} → "{existing screen}"; …
- Every action named in step 2 leads to a frame. The system's existing start frame stays the start.

Do not include
- {Out of Scope item}.
- Any field, step, screen, or feature not listed above.

Deliver: the components made or changed, the screen frames, and the preview's start link.
```
````
