# Re-opening a feature — a change request or Blocked rows

`docs/features/{slug}/spec.md` exists → this is a change, not a new plan.
The agenda is one of:

- **A change request** — the user brings a change to this feature (a new
  case, a rule tightened, more countries). Agenda: that change only.
  Answers are `From: change request`.
- **Blocked rows** — rows in `docs/progress/{slug}/progress.md` that are
  `open` with Needs `/warroom {slug}`, plus the spec's own Open Questions.
  Answers are `From: blocked #{n}`.
- **A design link** — the user brings the design for `pending` screens,
  or asks for them to be made in Figma through the Figma MCP (then the
  link is the frame it made). Put each link in spec › Design › Source,
  set each `design: {screen}` Blocked row to `done`, update the board row
  (unless Manual `true`) — UI `🎨 {n}/{n}` when no screen is left `pending`, else `⏳` with the
  count — and end with the Next command.
  Remove those screens' prompts from `ui-prompt.md` (the whole file and
  its spec link when none is left `pending`).
  Nothing else: no interview, legal check, Breaker, or gate. The design
  adds something the spec doesn't have (a field, a step, a rule) → that
  part only is a change request, below.

For a change request or Blocked rows, then:

1. Set the spec back to `draft` and the board row to `planning`.
2. Read the feature folder and its progress folder. Interview only on the
   agenda.
3. Record each answer as a new `D{n}` with its index row. An answer that
   changes an older `D{n}` supersedes it
   ([templates/decisions.md](../templates/decisions.md) › Append-only); one
   with Used by or an ADR also follows
   [decisions-index.md](../templates/decisions-index.md) › Changing a
   decision someone uses. Edit the spec sections it touches. A `pending`
   screen's Design row changed → on Approve, rewrite `ui-prompt.md`
   ([templates/ui-prompt.md](../templates/ui-prompt.md)).
4. Run the legal check on the items it touches (it updates those verdicts
   in legal.md and keeps the rest).
5. Give it to The Breaker alone instead of the full red team, then go to
   the gate.
6. On Approve, set each Blocked row's Status to `→ D{n}`. Re-cut when an
   answer changes a ticket not yet `done` or needs new work — a change
   request always does; `done` tickets stay as they are
   ([tickets.md](tickets.md)). Otherwise the build
   simply resumes. Update the board row and end with its Next command.
