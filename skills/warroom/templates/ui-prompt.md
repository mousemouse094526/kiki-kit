# Template: docs/features/{slug}/ui-prompt.md

A paste-ready prompt for every screen whose Source in spec › Design is
`pending`, so the user can have the screens designed in any design tool
(Figma Make, Claude, v0, Stitch, Lovable) or hand it to a designer. Copy the
skeleton under **Template**; follow **Rules**.

## Rules

All of [markdown-style.md](../references/markdown-style.md), plus:

- **Written when** any screen is `pending`: at the gate's Approve (spec
  final), on `/warroom ui {slug}`, and again whenever a change request
  edits a `pending` screen's row. Rewritten whole each time — never
  hand-edited. No `pending` screen left → delete the file and its link.
- **One prompt per screen**, each a fenced `text` block that stands alone:
  the shared context is repeated inside every block, so pasting one block
  is enough. Screens that share a flow (a list and its form) may share one
  block — say so in its heading.
- **Prompt language: English** (design tools follow it best). Every
  on-screen string — labels, buttons, messages — is quoted exactly in the
  product's language, from the decisions; never translated or invented.
  The line above each block is in the docs language.
- **Facts from the code, not guesses.** Look up the platform, breakpoints,
  component library, colour and type tokens, icon set, and an existing
  screen to match (by name, for the user to attach a screenshot of). None
  in the project → say `no existing design system; propose a clean,
  neutral one`.
- **Only what the spec says.** Fields, actions, states, rules, and copy
  come from spec › Design › Must show and the `D{n}` it cites — no extra
  fields, steps, or features. Out of Scope items are listed under "Do not
  include".
- **Every state is a frame.** Ask for the default plus each state Must
  show names (empty, loading, error, no permission, success), at each
  breakpoint the project supports.
- **No `D{n}` inside a block** — a design tool can't read them. The line
  above the block cites them.
- **End with how to bring it back:** paste the Figma link or image path
  with `/warroom {slug}`.

## Template

````markdown
# UI prompts: {feature slug}

{One line in the docs language: these screens are `pending`; paste a block
into a design tool, then bring the result back with `/warroom {slug}`.}

| Screen | User stories | Prompt |
|---|---|---|
| {Contact form} | 1, 3 | [below](#contact-form) |

## {Contact form}

{One line in the docs language: what this screen is for, citing D2, D4.}

```text
Design the "{screen}" screen of {product: one line on what it is and who uses it}.

Context
- Platform: {web app / iOS / Android}; breakpoints: {mobile 375, desktop 1440}.
- Design system: {component library and version, tokens: primary #…, font …, radius …, icon set}. Match the look of the existing "{screen name}" screen (screenshot attached).
- Language on screen: {Thai}. Use the copy below exactly.
- Accessibility: WCAG 2.2 AA contrast, visible focus, labels on every input, touch targets ≥ 44px.

Who and why
- {actor} wants to {goal}, so that {benefit}.
- Arrives from {screen or entry point}; goes to {next screen} on {action}.

Content
- {field}: {type, required/optional, format, validation rule} — label "{exact label}", placeholder "{…}".
- {action}: button "{exact text}" — {what it does; disabled when …}.
- {rule shown on screen}: "{exact message}".

States — one frame each, at every breakpoint
1. Default, filled with realistic sample data in {Thai}.
2. Empty: "{exact empty message}", with {call to action}.
3. Loading: {skeleton / spinner where}.
4. Error: {which error} → "{exact message}" shown {inline under the field / as a banner}.
5. No permission: {what is hidden or read-only} — "{exact message}".
6. Success: {what changes} — "{exact message}".

Do not include
- {Out of Scope item}.
- Any field, step, or feature not listed above.

Deliver: one frame per state per breakpoint, named "{screen} / {state} / {breakpoint}", built from reusable components with auto layout.
```
````
