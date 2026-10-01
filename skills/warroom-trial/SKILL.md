---
name: warroom-trial
description: >-
  Let role-played users try a built warroom feature in the running app
  before release. Builds personas from the spec's actors plus the real-world
  roles the user names (a manager, a sales rep, a new employee), gives each
  one goals in their own words — never test steps — and has each persona, as
  a separate subagent that has not seen the code or the spec, use the app
  through the browser on a local dev server. A dev-lead pass then sorts every
  finding into bug, spec gap, friction, or works-as-intended and writes one
  trial report under docs/features/{slug}/trial/. Nothing is fixed without
  the user's pick: bugs go to warroom-debug, spec gaps to warroom, friction
  to new tickets. Invoke with /warroom-trial {slug}, after warroom-build has
  landed tickets someone can demo.
disable-model-invocation: true
---

# Warroom Trial — let the users try it before they do

Personas → goals → each persona uses the app alone → dev-lead triage → one
report → the user picks what to act on.

Tests prove the code does what the spec says. A trial asks whether the
spec was right: can a real kind of person reach their goal, and where do
they get stuck?

## 1. Before starting

- **Feature folder** `docs/features/{slug}/` with spec.md and tickets.
  Trial what is `done`; say which tickets are not built yet and leave their
  stories out.
- **The app runs locally.** Start it the project's way (a launch config, the
  `run` skill, the setup docs). Trials run **only on a local development
  host** (`localhost`, `127.0.0.1`, `*.localhost`, `*.test`) — never staging
  or production, never real user data.
- **Test accounts** come from the project's seed or fixture data, or are
  created in the local app for this trial. Write any you create into the
  project's seed or example config, not into chat.

## 2. Cast the personas

Read [references/personas.md](references/personas.md). Propose a cast:

- every actor in spec.md › User Stories (Admin, Employee, …);
- the real-world roles the user named or the domain implies — the ones who
  will judge the product (a manager checking on staff, a sales rep showing
  it to a client, a first-day employee, someone on a phone in a hurry).

Ask with AskUserQuestion (multiSelect, recommended ones first): which
personas to run. Three to five is usually enough.

## 3. Write the goals

For each persona, 3–6 **goals in the persona's own words** — what they want
done, not how: "I need to get the new hire into the system before she
starts Monday", not "click Create Employee". Draw them from User Stories,
Expected Outcome, and flow.md, plus one or two the spec never mentions but
the persona would plausibly try. Show the cast and goals in chat before
running.

## 4. Run each persona

One subagent per persona, **one at a time** (they share the browser). Each
gets only the brief from [references/personas.md](references/personas.md):
who they are, their goals, the app URL, their test account, the device.
**Never the code, the spec, or another persona's report** — a persona who
knows how it was built can't get lost the way a real user does.

Each persona uses the app like that person would — skims, guesses, misreads,
gives up when that person would — and returns the report format in the
brief. A phone persona uses the mobile viewport, or the simulator for the
mobile app.

## 5. Dev-lead triage

You are now the dev lead. Read every persona report against spec.md,
decisions.md, and the ADRs, and sort each finding:

| Kind | Meaning | Default next step |
|---|---|---|
| **bug** | the app contradicts the spec | `warroom-debug` |
| **spec gap** | the spec is silent or wrong for a real goal | `warroom` on this feature |
| **friction** | works as specified, but the persona struggled | a new ticket |
| **works as intended** | the persona expected something the docs ruled out | note it, cite the `D{n}` |

Merge duplicates across personas — the same finding from three personas is
one finding seen three times, and that count is its weight. Rank by
**blocked goal** first, then how many personas hit it.

## 6. Write the report

`docs/features/{slug}/trial/{YYYY-MM-DD}.md` from
[templates/trial-report.md](templates/trial-report.md). Run the self-check
in [markdown-style.md](../warroom/references/markdown-style.md).

## 7. The user picks

Show the ranked findings in chat, one line each with its kind and proposed
next step. Ask with AskUserQuestion (multiSelect) which to act on now:

- **bug** → call `warroom-debug` with the persona's steps as the repro.
- **spec gap** → recommend `/warroom` on this feature; don't edit the spec
  here.
- **friction** → write a new ticket after the highest number, in
  [warroom-tickets' template](../warroom-tickets/templates/ticket.md),
  `**Status:** ready-for-agent`.

Everything not picked stays in the report as `open`. No code, no branch,
no commit from this skill.

## Operating rules

- **Local only.** No staging, no production, no real user data.
- **Personas never see the code or the spec.** That blindness is the point.
- **Goals, not steps.** A goal written as clicks is a test, not a trial.
- **Personas run one at a time**, each in a fresh subagent.
- **Nothing is fixed without the user's pick.** The default is a report.
- **Report in the user's language**; kinds, status words, and `D{n}` stay
  in English.
