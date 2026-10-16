# Re-opening a feature — a change request or Blocked rows

`docs/features/{slug}/spec.md` exists → this is a change, not a new plan.
The agenda is one of:

- **A change request** — the user brings a change to this feature (a new
  case, a rule tightened, more countries). Agenda: that change only.
  Answers are `From: change request`.
- **Blocked rows** — rows in `docs/progress/{slug}/progress.md` that are
  `open` with Needs `/warroom {slug}`, plus the spec's own Open Questions.
  Answers are `From: blocked #{n}`.

Then:

1. Set the spec back to `draft` and the board row to `planning`.
2. Read the feature folder and its progress folder. Interview only on the
   agenda.
3. Record each answer as a new `D{n}` with its index row. An answer that
   changes an older `D{n}` supersedes it
   ([templates/decisions.md](../templates/decisions.md) › Append-only). Edit
   the spec sections it touches.
4. Run the legal check on the items it touches (it updates those verdicts
   in legal.md and keeps the rest).
5. Give it to The Breaker alone instead of the full red team, then go to
   the gate.
6. On Approve, set each Blocked row's Status to `→ D{n}`. Re-cut when an
   answer changes a ticket not yet `done` or needs new work — a change
   request always does; `done` tickets stay as they are
   ([tickets.md](tickets.md)). Otherwise the build
   simply resumes. Update the board row and end with its Next command.
