---
name: warroom-legal
description: >-
  Answer "can we do this under Thai law?" for each item the user asks about:
  research the governing law with web sources, then give one verdict per
  item — ALLOWED (just the citation, no essay), NOT ALLOWED (the reason),
  or CONDITIONAL (exactly what is required to make it allowed). An ambiguous
  item is never guessed: it is split out and put to the user as
  AskUserQuestion choices with a proposal per option, then ruled. Writes
  exactly ONE markdown file per run — per-item verdicts, a summary table an
  AI can act on, numbered references at the bottom — and sends it for
  download. Companion to the warroom skill — warroom runs it on every
  feature before its approval gate; also runs standalone as
  /warroom-legal {items or feature-slug}. Not legal advice.
---

# Legal Check — can we do this under Thai law?

Answer each thing the user wants to do — no more, no less — with one of
three verdicts, each backed by a cited source:

- **ALLOWED** — say it is allowed and cite the reference. Nothing else.
- **NOT ALLOWED** — name the specific prohibition and cite it.
- **CONDITIONAL** — allowed only if requirements are met. List exactly
  what must exist or be done for the item to become ALLOWED: one concrete,
  checkable requirement per bullet.

**Ambiguous item → never guess a verdict.** Split it out and ask with
AskUserQuestion: concrete choices, each with your proposed verdict and its
consequence — e.g. "store the national ID number → (a) full number:
CONDITIONAL, needs consent + security measures, (b) masked/last-4:
ALLOWED, (c) don't store: ALLOWED". Rule after the answer.

## Input

- A plain list of things to check ("store customer phone numbers", "send
  marketing SMS", …) — one verdict per item. Don't add items the user
  didn't ask about.
- Or a feature slug — read `docs/features/{slug}/spec.md` (and `flow.md`
  if present) and take the legally relevant actions as the items.
- From warroom, the decisions are already in context — don't re-interview;
  take the items from what is decided.

Jurisdiction is **Thailand** unless the user or the project docs say
otherwise. Nothing legally relevant in the input → write no file, reply
"no legal surface found" in one line, done.

## Research — sources, not memory

Check every verdict against current law with WebSearch / WebFetch. Prefer
the regulator's own site (pdpc.or.th, bot.or.th, etda.or.th, ocpb.go.th,
krisdika.go.th, ratchakitcha.soc.go.th) over blog summaries. Typical Thai
regimes: PDPA (B.E. 2562), Computer Crime Act, BOT regulations when money
moves, consumer-protection and direct-sales law for e-commerce.

Every verdict cites a numbered reference listed at the bottom of the file.
If the web is unreachable, write the verdict anyway, mark it
`UNVERIFIED — from model knowledge, verify before relying`, and say so in
the reply. Cite or mark UNVERIFIED — no third state.

## Output — exactly one file

**One markdown file per run** — no companion, spec, or per-zone files. A
re-run on the same topic rewrites it; a re-run on a re-opened feature
updates only the items it was asked about and keeps every other verdict.

Path: `docs/features/{slug}/legal.md` when checking a feature (warroom
included); otherwise `docs/legal/{topic-slug}.md`.

Read [templates/legal.md](templates/legal.md) before writing, copy its
skeleton, and follow its rules. The **Summary table is the payload**.

After writing:

1. Run the self-check in
   [markdown-style.md](../warroom/references/markdown-style.md) against
   [templates/legal.md](templates/legal.md).
2. **Send the file with SendUserFile.**
3. Reply in chat, in the conversation's language: one line per item with
   its verdict — reasons only for NOT ALLOWED and CONDITIONAL — plus any
   UNVERIFIED marks and the file path.

## Operating rules

- One md file per run.
- Verdict only on what the user asked. Ambiguous → AskUserQuestion first.
- Cite `[n]` or mark UNVERIFIED.
- File and chat in the language the user writes in. Keep verdict words
  (ALLOWED / NOT ALLOWED / CONDITIONAL / UNVERIFIED), `[n]` citations, and
  law names as-is; translate the headings and prose.
- End the file with the disclaimer in the file's language — English:
  *"Engineering compliance notes, not legal advice."*
