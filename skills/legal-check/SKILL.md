---
name: legal-check
description: >-
  Engineering-level legal and compliance scan for one feature: identify which
  risk zones the feature touches (personal data, payments, minors, marketing,
  health, KYC, content liability), research the governing law for the
  project's jurisdiction with web sources, and write the findings to
  docs/features/{slug}/legal.md — every claim carrying a source URL and
  access date. Produces build obligations (what the code must do) and
  lawyer questions (what engineering cannot settle). Run standalone as
  /legal-check {feature-slug or description}, and warroom runs it on every
  feature before its build gate. Not legal advice.
---

# Legal Check — what the law wants from this feature

Answer one question in engineering terms: **what must this feature's code do
(or never do) to stay inside the law, and what needs a real lawyer?** You are
not a lawyer and the output says so — the value is catching the obligation
while it is still a design decision, not after it ships.

## Input

Accept either a feature slug (read `docs/features/{slug}/spec.md` and
`flow.md` if they exist) or a plain description in the invocation. When run
from warroom, the interview's decisions are already in context — do not
re-interview; scan what is already decided.

## Step 1 — Sweep the risk zones

Check the feature against every zone, and say which ones it touches — a
sweep that only reports the hits can't be told apart from a sweep that
skipped the rest:

- **Personal data** — collects, stores, or shares anything identifying a
  person (name, phone, email, location, device IDs, photos, behaviour).
- **Payments & money** — moves money, stores card/bank data, wallets,
  refunds, subscriptions.
- **Minors** — used by or marketed to under-18s / under-13s.
- **Marketing & messaging** — sends SMS/email/push, tracks for ads,
  cookies/consent banners.
- **Health & sensitive data** — health, biometrics, religion, criminal
  records — the special-category tier of data law.
- **KYC / identity** — verifies identity, national ID handling.
- **Content & liability** — user-generated content, moderation duties,
  copyright takedowns.

No zone touched → write no file, report "no legal surface found" in one
line, done. A `legal.md` for a button-color change is noise that teaches
readers to ignore the real ones.

## Step 2 — Pin the jurisdiction (knob, once per project)

The governing law follows where the system operates and who it serves, not
where the developer sits. If the project's docs or an earlier `legal.md`
already state the jurisdiction, reuse it and don't re-ask. Otherwise ask the
user once (AskUserQuestion): where does this run, who are the users —
Thailand only / Thailand + international / other. Record the answer in
`legal.md` so the next run inherits it.

- Thailand → PDPA (B.E. 2562), Computer Crime Act, ETDA rules; BOT
  regulations when money moves; consumer-protection law for e-commerce.
- EU users in scope → add GDPR. Other markets → their regimes.

## Step 3 — Research with sources, not memory

For each touched zone, verify the current requirement with WebSearch /
WebFetch — laws amend, thresholds change, and a confidently remembered rule
that was repealed last year is exactly the failure this step exists to
catch. Prefer the regulator's own site (pdpc.or.th, bot.or.th, edpb.europa.eu)
over blog summaries.

**Every claim in the output carries its source URL and the access date.**
An uncited legal claim is a rumor with formatting. If the web is
unreachable, write the claim anyway, mark it `UNVERIFIED — from model
knowledge, verify before relying`, and say so in the reply.

## Step 4 — Write legal.md

`docs/features/{slug}/legal.md`, English, one section per touched zone:

```markdown
# Legal: {feature}
Jurisdiction: Thailand (decided 2026-09-07, see D-refs if any)

## Personal data — PDPA
- Phone number is personal data; OTP flow processes it → needs a lawful
  basis; consent is the practical one here.
  Source: https://www.pdpc.or.th/... (accessed 2026-09-07)

### Build obligations
- [ ] Consent checkbox before requesting OTP, unticked by default
- [ ] Retention: purge OTP logs after N days (pick N in spec)

### Lawyer questions
- Is "performance of contract" arguable instead of consent here?
```

- **Build obligations** are the payload — concrete, checkable, phrased so
  the build (and a later test skill) can verify each one. An obligation the
  code can't be checked against is a worry, not an obligation.
- **Lawyer questions** hold everything engineering cannot settle. Never
  guess across that line: write the question, flag it in the reply, move on.
- End the file with: *"Engineering compliance notes, not legal advice."*

## Reporting back

Reply with: zones touched (and zones cleared), the obligation count, any
UNVERIFIED claims, any lawyer questions, and the file path. When warroom
invoked this, that summary feeds its Gate 1 — the user approves the build
with the legal picture in view, which is the whole reason warroom runs this
before the gate and not after.

## Operating rules

- Scan every feature it is pointed at — the skip decision belongs to Step 1's
  zone sweep, never to a hunch that a feature "looks harmless".
- Cite or mark UNVERIFIED. No third state.
- Engineering reading only: obligations and questions, never "this is
  legal" / "this is illegal" verdicts — those are the lawyer's sentence to
  write.
- English file, chat in the conversation's language, same split as every
  skill in this plugin.
