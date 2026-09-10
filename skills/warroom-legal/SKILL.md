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

The user brings things they want to do. Answer each one — no more, no
less — with one of three verdicts, every verdict backed by a cited source:

- **ALLOWED** — say it is allowed and cite the reference. Nothing else: an
  allowed item needs no justification beyond its citation.
- **NOT ALLOWED** — name the specific prohibition and cite it.
- **CONDITIONAL** — allowed only if requirements are met. List exactly
  what must exist or be done for the item to become ALLOWED, as checkable
  bullets a build step can verify.

**Ambiguous item → never guess a verdict.** Split it out and ask the user
with AskUserQuestion: concrete choices, each option carrying your proposal
and its consequence — e.g. "store the national ID number → (a) full number:
CONDITIONAL, needs consent + security measures, (b) masked/last-4:
ALLOWED, (c) don't store: ALLOWED". Rule after the answer.

## Input

- A plain list of things to check ("store customer phone numbers", "send
  marketing SMS", …) — one verdict per item, exactly what the user asked.
  Do not invent extra items they did not ask about.
- Or a feature slug — read `docs/features/{slug}/spec.md` (and `flow.md`
  if present) and extract the legally relevant actions as the items.
- From warroom the interview's decisions are already in context — do not
  re-interview; derive the items from what is decided.

Jurisdiction is **Thailand** unless the user or the project docs say
otherwise. Nothing legally relevant in the input → write no file, reply
"no legal surface found" in one line, done.

## Research — sources, not memory

Verify every verdict with WebSearch / WebFetch against current law — laws
amend, and a confidently remembered rule repealed last year is exactly the
failure this step catches. Prefer the regulator's own site (pdpc.or.th,
bot.or.th, etda.or.th, ocpb.go.th, krisdika.go.th, ratchakitcha.soc.go.th)
over blog summaries. Typical Thai regimes: PDPA (B.E. 2562), Computer
Crime Act, BOT regulations when money moves, consumer-protection and
direct-sales law for e-commerce.

Every verdict cites a numbered reference resolved at the bottom of the
file. If the web is unreachable, write the verdict anyway, mark it
`UNVERIFIED — from model knowledge, verify before relying`, and say so in
the reply. Cite or mark UNVERIFIED — no third state.

## Output — exactly one file

**One markdown file per run.** No spec files, no companion files, no
per-zone files — everything lives in this one document. A re-run of the
same topic overwrites it.

Path: `docs/features/{slug}/legal.md` when checking a feature (warroom
included); otherwise `docs/legal/{topic-slug}.md`.

```markdown
# Legal check: {topic}
Jurisdiction: Thailand — checked 2026-09-10

## 1. Store customer phone numbers to send OTP
**Verdict: CONDITIONAL**
Required to be allowed:
- [ ] Lawful basis under PDPA before collecting — consent or contract [1]
- [ ] State a retention limit and purge after it [1]

## 2. Send transactional SMS notifications
**Verdict: ALLOWED** [2]

## 3. Sell the customer list to another company
**Verdict: NOT ALLOWED**
Disclosure to a third party without a lawful basis violates PDPA s.27 [1].

## Summary
| # | Item | Verdict | Required to be allowed |
|---|------|---------|------------------------|
| 1 | Store phone numbers for OTP | CONDITIONAL | consent/contract basis + retention limit |
| 2 | Transactional SMS | ALLOWED | — |
| 3 | Sell customer list | NOT ALLOWED | — |

## References
1. PDPA B.E. 2562 — https://www.pdpc.or.th/... (accessed 2026-09-10)
2. ... (accessed 2026-09-10)

*Engineering compliance notes, not legal advice.*
```

The **Summary table is the payload**: verdict and requirements per item,
written so a later AI or build step can act on it without re-reading the
prose. The **References section is the only place URLs appear** — verdicts
cite by `[n]`.

After writing, **send the file with SendUserFile** so the user can
download it. Then reply in chat, in the conversation's language: one line
per item with its verdict — reasons only for NOT ALLOWED and CONDITIONAL —
plus any UNVERIFIED marks and the file path.

## Operating rules

- One md file per run. Verdicts, summary, references — all in it.
- Verdict only on what the user asked. ALLOWED gets no reasoning dump;
  NOT ALLOWED gets the reason; ambiguous gets AskUserQuestion first.
- Cite `[n]` or mark UNVERIFIED. References numbered at the bottom.
- File structure in English (item titles may stay in the user's wording);
  chat in the conversation's language, same split as every skill in this
  plugin.
- End the file with: *"Engineering compliance notes, not legal advice."*
