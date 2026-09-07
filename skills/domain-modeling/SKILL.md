---
name: domain-modeling
description: >-
  Build and sharpen the project's domain model while designing: challenge
  terms that conflict with the CONTEXT.md glossary, replace fuzzy words with
  one canonical term (and ban the rest), stress-test concept boundaries with
  concrete scenarios, cross-check what the user says against what the code
  does, and record resolved terms in CONTEXT.md the moment they crystallise.
  Supports multi-context repos via CONTEXT-MAP.md. Offers a project-level ADR
  in docs/adr/ only for decisions that are hard to reverse, surprising
  without context, and a real trade-off. Use when discussing terminology,
  editing CONTEXT.md, or recording an ADR; warroom applies it during its
  interview.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is
the *active* discipline — challenging terms, inventing edge-case scenarios,
writing the glossary down as it crystallises. Merely *reading* `CONTEXT.md`
for vocabulary is not this skill; that's a one-line habit any skill can do.
This skill is for when the model is being changed, not consumed.

Based on Matt Pocock's domain-modeling skill (MIT); adapted to this plugin.

## Where the files live

- Single context (most repos): one `CONTEXT.md` at the repo root.
- Multiple contexts: `CONTEXT-MAP.md` at the root names each context, where
  its own `CONTEXT.md` lives, and how contexts relate. Infer which structure
  applies: a map file means multi-context; only a root `CONTEXT.md` means
  single; neither means create the root file lazily on the first resolved
  term. In a multi-context repo, infer which context the current topic
  belongs to — ask only when genuinely unclear.
- Formats for both, and the entry format (term, tight definition, `_Avoid_`
  list), are in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md) — read it when
  writing, not before.

## During the session

- **Challenge against the glossary.** When a term conflicts with what
  `CONTEXT.md` already says, call it out immediately: "Your glossary defines
  'cancellation' as X, but you seem to mean Y. Which is it?" A glossary that
  is never enforced is a notepad, not a contract.
- **Sharpen fuzzy language.** Vague or overloaded terms get a proposed
  canonical term on the spot: "You're saying 'account' — the Customer or the
  User? Those are different things." Pick one word; the losers go in the
  entry's `_Avoid_` list so they stay banned.
- **Stress-test with concrete scenarios.** When concept boundaries are being
  drawn, invent the edge case that forces precision: "A guest checkout — is
  that a Customer with no account, or something else?" Boundaries that were
  never probed are boundaries drawn by accident.
- **Cross-reference with code.** When the user states how something works,
  check whether the code agrees, and surface contradictions: "Your code
  cancels entire Orders, but you just said partial cancellation exists.
  Which is right?" A model that disagrees with the code is a bug you can
  catch while it is still a sentence.
- **Update CONTEXT.md inline.** A resolved term is written the moment it
  resolves — batching glossary updates is how they get lost. `CONTEXT.md`
  stays a pure glossary: no implementation details, no spec fragments, no
  scratch notes.

## ADRs — project level, offered sparingly

Offer to record an ADR in `docs/adr/` (format and numbering in
[ADR-FORMAT.md](./ADR-FORMAT.md), directory created lazily) only when ALL
three hold:

1. **Hard to reverse** — changing your mind later costs something real.
2. **Surprising without context** — a future reader would wonder "why on
   earth did they do it this way?"
3. **A real trade-off** — genuine alternatives existed and one was chosen
   for specific reasons.

Any of the three missing → skip it. An easy-to-reverse decision will just be
reversed; an unsurprising one nobody will question; a no-alternative one has
nothing to record beyond "we did the obvious thing."

**Boundary with warroom's decisions.md:** inside a warroom session, every
interview decision already lands in that feature's `decisions.md` — do not
duplicate them here. An ADR is for the decision that outlives any single
feature (architecture shape, cross-context contracts, lock-in technology
choices, constraints invisible in the code). Feature-scoped why lives with
the feature; project-scoped why lives in `docs/adr/`. One decision, one
home.

## Operating rules

- Glossary entries are opinionated: one canonical term, the alternatives
  listed under `_Avoid_`. Two blessed words for one concept is how drift
  starts.
- Project-specific concepts only. General programming vocabulary (timeout,
  retry, error type) stays out however often the project uses it.
- Chat follows the conversation's language; `CONTEXT.md`, `CONTEXT-MAP.md`,
  and ADRs are English — same artifact/reader split as the whole plugin.
