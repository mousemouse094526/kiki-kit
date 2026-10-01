# TDD — the red → green loop

From Matt Pocock's `tdd` ([mattpocock/skills](https://github.com/mattpocock/skills),
MIT). The glossary is `CONTEXT.md`; the seams come from the warroom spec.

This is the reference that makes the loop produce tests worth keeping. Every
section applies on every cycle: consult it before and during the loop, not
after.

## What a good test is

Tests verify behaviour through public interfaces, not implementation
details. Code can change entirely; tests shouldn't. A good test reads like a
specification: "user can checkout with valid cart" says exactly what
capability exists, and it survives refactors because it doesn't care about
internal structure.

Examples in [tests.md](tests.md); mocking in [mocking.md](mocking.md).

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you
observe behaviour without reaching inside. Tests live at seams, never
against internals.

**Test only at pre-agreed seams.** In a warroom feature they were agreed at
the gate — spec.md › Seams, named in the ticket's Covers. No test is written
at an unconfirmed seam.

## Anti-patterns

- **Implementation-coupled** — mocks internal collaborators, tests private
  methods, or verifies through a side channel (querying the database instead
  of using the interface). The tell: the test breaks on a refactor that
  didn't change behaviour.
- **Tautological** — the assertion recomputes the expected value the way the
  code does (`expect(add(a, b)).toBe(a + b)`), so it passes by construction.
  Expected values come from an independent source: a known-good literal, a
  worked example, the spec.
- **Horizontal slicing** — all tests first, then all code. Bulk tests verify
  imagined behaviour. Work in vertical slices: one test → one implementation
  → repeat, each test a tracer bullet that responds to what the last cycle
  taught you.

## Rules of the loop

- **Red before green.** Write the failing test, watch it fail for the right
  reason (an assertion, not an import error), then only enough code to pass
  it. No speculative features.
- **One slice at a time.** One seam, one test, one minimal implementation per
  cycle.
- **Refactoring is not part of the loop.** It belongs to the review stage.
- **Stay in the ticket.** Behaviour that belongs to another ticket is not
  built here, even when it sits next to the code you're touching.
- **Browser / end-to-end tests come after the behaviour works**, not first —
  too slow for red → green. The project's `CLAUDE.md` overrides this.
- **No independent truth, no loop.** Pure wiring, config, type annotations:
  there is nothing to assert that doesn't restate the code. Let the
  typecheck and the seam tests of the behaviour it wires cover it.
