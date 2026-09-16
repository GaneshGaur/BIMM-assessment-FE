# Running this assessment

**Internal. Not for candidates.**

## Publishing the template

1. Create a repository under the BIMM org, e.g. `bimm/fullstack-assessment`.
2. **Delete `maintainers/` from it.** Keep this directory in a separate private
   repo (`bimm/fullstack-assessment-review`) so the rubric is never one clone
   away from the candidate. Deleting it in a later commit is not enough — it
   stays in the history.
3. Settings → check **Template repository**. Candidates then use "Use this
   template", which gives them a clean history rather than a fork that shows up
   on their profile and is visible to other candidates.
4. Commit `package-lock.json`. It is what makes `npm ci` work in CI and what
   stops a candidate losing an hour to a transitive dependency that shifted
   under them.

## Sending it out

Give candidates the repo link, the time expectation (three to four hours), and
a deadline with slack in it — a week to find an evening. Everything else lives
in the README.

If you want the CodeSandbox route as well, `.codesandbox/tasks.json` is already
configured: `https://codesandbox.io/p/github/<org>/<repo>/main` boots the dev
server automatically. Offer it as a convenience, not as the primary path — the
browser environment hides whether someone can get a project running locally,
and the exported result is harder to review.

## Reviewing

1. Clone fresh. `npm ci && npm run verify`. Note anything that fails before you
   read a line of code.
2. `npm run dev`, resize the window through all three breakpoints, add a car,
   submit the form empty, filter to an empty result.
3. Read `NOTES.md` before the code — it tells you what they were aiming at, and
   reviewing against their intent is fairer than against yours.
4. Score with `RUBRIC.md`. Two reviewers, independently, then compare.

Budget 45 minutes per submission. If you are past an hour, the answer is
usually already clear.

## Keeping it current

Dependencies are pinned exactly, which is deliberate: every candidate should
hit the same environment. Refresh them once a quarter, and re-run
`npm run verify` afterwards.

If you change the mock API contract, update `docs/schema.graphql` and
`docs/API.md` in the same commit. Candidates are told to treat the mock as
read-only, so a drifted contract reads as their bug rather than ours.

## A note on reuse

Anything sent to more than a handful of candidates ends up on GitHub. Assume
model solutions exist. That is a reason to weight `NOTES.md`, the interview
walkthrough, and the ability to extend the code live — not a reason to keep
inventing new exercises.

Ask every candidate who progresses to spend fifteen minutes of the follow-up
call adding a small feature to their own submission. It is the cheapest
authorship check available, and it tells you more about how they work than the
take-home does.
