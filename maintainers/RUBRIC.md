# Review rubric

**Internal. Delete the `maintainers/` directory before sharing the repo with
candidates, or keep it in a separate private repo — see `SETUP.md`.**

Score each dimension 0–4, multiply by the weight, and total out of 100. Two
reviewers score independently before comparing. Record evidence, not
impressions: a line reference beats an adjective.

| # | Dimension | Weight |
| --- | --- | --- |
| 1 | Code structure and boundaries | 20 |
| 2 | Data layer and state | 20 |
| 3 | Correctness against the brief | 15 |
| 4 | Testing | 15 |
| 5 | TypeScript | 10 |
| 6 | UI states and accessibility | 10 |
| 7 | Communication (NOTES.md, commits) | 10 |

Band meaning: **0** absent · **1** attempted, not working · **2** works, no
particular thought · **3** solid, would pass code review · **4** better than the
team's current standard.

---

## 1. Code structure and boundaries — 20

Whether someone joining the codebase could find things and extend them.

- **4** — Clear split between shared UI and feature code; components have one
  job; the folder layout would still hold if a second feature landed tomorrow.
- **3** — Sensible structure, minor misplacements, no leaking of feature
  concerns into shared components.
- **2** — Everything in a couple of large components, but readable.
- **1** — One file, or structure copied without meaning (empty folders,
  layers that pass values straight through).
- **0** — No discernible organisation.

Watch for: shared components that know about cars; a `utils.ts` that became a
junk drawer; prop drilling through four levels where composition would do.

## 2. Data layer and state — 20

- **4** — Fetching isolated in hooks; deliberate handling of the post-mutation
  list update with a stated reason; no redundant queries; derived state derived
  rather than stored.
- **3** — `useCars()` exists and is clean; mutation updates the list; maybe one
  unnecessary refetch.
- **2** — Works, but `useQuery` sits in the component, or state is duplicated
  between a hook and its caller.
- **1** — Data fetching entangled with rendering; list goes stale after create.
- **0** — No working data layer.

The strongest signal here is how they reconcile the list after `CreateCar`:
`refetchQueries` is acceptable; a cache update with a reason is better; both at
once suggests they did not check.

Also watch for: two queries fetching overlapping data because filtered and
unfiltered results were needed separately, which nearly doubles requests.

## 3. Correctness against the brief — 15

Seven required items. Score on what works when run, not on what the README
claims.

- **4** — All required items work, plus at least one optional item, without the
  core feeling rushed.
- **3** — All required items work.
- **2** — Five or six work.
- **1** — The list renders and little else.
- **0** — Does not run after `npm install && npm run dev`.

The responsive-image item is the one most often faked. Resize the window and
confirm the served image actually changes — the placeholders are labelled. A
CSS-hidden triple render, or `window.innerWidth` read once without a resize
listener, is a 2 at best on this item.

## 4. Testing — 15

- **4** — Tests describe user-visible behaviour, cover at least one failure
  path, and would catch a real regression. Queries are role- or text-based.
- **3** — Meaningful coverage of the main components and hooks, happy path only.
- **2** — Tests exist but assert implementation detail, or mock so aggressively
  that nothing real is exercised.
- **1** — One trivial render test.
- **0** — None, or the suite fails.

**Run the suite yourself.** A submission whose own tests fail is a significant
negative — it means `npm run verify` was never run, which the README asks for.

Mocking a child component to test its parent is fine. Mocking the hook under
test is not.

## 5. TypeScript — 10

- **4** — Types express the domain; no `any`; inference used rather than
  fought; generics only where they earn their place.
- **3** — Properly typed, one or two loose spots.
- **2** — Typed enough to compile.
- **1** — `any` or `@ts-ignore` used to move past problems.
- **0** — Types stripped or the build fails.

Check that `npm run typecheck` and `npm run lint` are clean. Both are wired
into CI, so a red pipeline on their own repo is worth asking about.

## 6. UI states and accessibility — 10

- **4** — Loading, error, empty and validation-failure all handled distinctly
  and usefully; keyboard operable; form controls labelled; images have alt text.
- **3** — All four states handled; accessibility basics mostly present.
- **2** — Loading and error only.
- **1** — Happy path only; a blank screen on failure.
- **0** — Errors surface as a crash.

Empty state after filtering to nothing is the most commonly missed case.

## 7. Communication — 10

- **4** — NOTES.md names real trade-offs and what they would do next; commit
  history tells a story.
- **3** — Notes completed thoughtfully.
- **2** — Notes present but thin.
- **1** — Template left unfilled.
- **0** — Nothing.

A smaller scope with a clear explanation of what was cut and why beats a larger
scope delivered silently. Weight it that way.

---

## Totals

| Band | Total | Action |
| --- | --- | --- |
| Strong hire | 80+ | Progress; focus the interview on system design |
| Hire | 65–79 | Progress; probe the weakest dimension |
| Borderline | 50–64 | Discuss between reviewers before deciding |
| No | < 50 | Decline |

Hard stops regardless of total: the app does not run from a clean clone; the
submitted test suite fails; work is plainly not the candidate's own.

## Calibration notes

Things seen in a real submission to an earlier version of this exercise, and
how they were scored:

- A test asserting error text that the component never renders — the suite
  failed on a clean run. Capped dimension 4 at 1.
- A `useMemo` whose dependency array omitted two of the values it read, so
  filtering lagged a keystroke behind. Dimension 2, a 2 rather than a 3.
- A typo in a GraphQL operation name (`GetFilterdCars`) carried through three
  files. Cosmetic, but a signal about review habits — mention it, do not
  deduct.
- Thoughtful architectural commentary in the README explaining why a feature
  was scoped as `cars/` rather than `vehicles/`. Dimension 7, a 4.
