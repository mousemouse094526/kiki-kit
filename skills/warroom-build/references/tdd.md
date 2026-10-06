# TDD — the red → green loop

From Matt Pocock's `tdd` ([mattpocock/skills](https://github.com/mattpocock/skills),
MIT). Methodology every project shares; which runner, which mocking
library, and where tests live come from the project's conventions skill
(`patterns/testing.md`) and spec.md › Testing decisions — on tooling, the
project wins. Examples use TypeScript only to illustrate.

## What a good test is

A test verifies behaviour through a public interface, so the code under it
can change entirely and the test still holds. It reads like a
specification: "user can checkout with a valid cart" says what capability
exists.

```typescript
// BAD: verifies through a side channel — breaks on any storage change
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  expect(await db.query("SELECT * FROM users WHERE name = ?", ["Alice"])).toBeDefined();
});

// GOOD: verifies through the interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  expect((await getUser(user.id)).name).toBe("Alice");
});
```

## Seams: where tests go

A **seam** is the public boundary you observe behaviour at. Tests live at
seams, never against internals — and only at **pre-agreed** seams:
spec.md › Seams, named in the ticket's Covers. Agreeing them once, at the
gate, is what stops every build from inventing its own.

## Anti-patterns

- **Implementation-coupled** — mocks internal collaborators, tests private
  methods, asserts call counts, or checks through a side channel. The tell:
  it breaks on a refactor that changed no behaviour.
- **Tautological** — the expected value is computed the way the code
  computes it, so it passes by construction. Use an independent literal:
  `expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15)`.
- **Horizontal slicing** — all tests first, then all code. Bulk tests
  verify imagined behaviour; one test → one implementation lets each cycle
  learn from the last.

## Mock only at system boundaries

External APIs, time, randomness, sometimes the database or file system —
never your own modules. At a boundary, pass the dependency in, and prefer
one function per external operation (`api.getUser`, `api.createOrder`) over
one generic `fetch`, so each mock returns one shape.

## Rules of the loop

- **Red before green.** Watch the test fail for the right reason (an
  assertion, not an import error), then write only enough code to pass.
- **One slice at a time.** One seam, one test, one minimal implementation.
- **Refactoring is not part of the loop.** It belongs to the review.
- **Stay in the ticket.** Another ticket's behaviour is not built here,
  even when it sits next to the code you're touching.
- **End-to-end tests come after the behaviour works** — too slow for
  red → green.
- **No independent truth, no loop.** Pure wiring, config, and types have
  nothing to assert that doesn't restate the code; the typecheck and the
  seam tests of the behaviour they wire cover them.
