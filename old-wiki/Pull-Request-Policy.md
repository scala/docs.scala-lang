Hi there, pull request submitter!

Your pull request should:
  - (... have been discussed on scala-internals)
  - merge cleanly
  - consist of commits with messages that clearly state which problem this commit resolves and how
    - it should be stated in the active, present tense
    - its subject should be 60 characters or less
    - [conventions](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
    - for a bug fix, the title must look like "SI-NNNN - don't crash when moon is in wrong phase"
    - overall, think of the first line of the commit as a description of the action performed by the commit on the code base, so use the present tense -- that also makes them easy to reuse in release notes
    - backports should be tagged as [backport], it's also nice to mention this when a commit purely refactors and is not intended to change behaviour
    - when working on maintenance branches (e.g., 2.10.x), include [nomerge] if this commit should not be merged forward into the next release branch
  - come with tests (included in the same commit as the functional change), or explain in detail why it cannot be tested (discuss this on scala-internals first). The tests itself should:
    - be minimal, deterministic, stable (unaffected by irrelevant changes), easy to understand and review
    - have minimal dependencies: a compiler bug should not depend on, e.g. the Scala library
    - typically fail before your fix is applied (so we see that you are fixing a legitimate bug) and should obviously pass after your fix
  - come with appropriate documentation
    - for example, any API additions should include Scaladoc
  - each commit must pass the test suite (checked automatically by the build bot by running approximately `ant test-opt`) 
     - a commit is considered a unit of useful change and must thus pass the test suite
       (this way we stand a chance running git bisect later)
  - be assigned to one or more reviewers (if you're not sure, see the list below or contact scala-internals)
     - to assign a reviewer, add a "review by @reviewer" to your PR description. NOTE: it's best not to @mention in commit messages, as github pings you every time a commit with your @name on it shuffles through the system (even in other repos, on merges,...)
  - get the green light from the reviewer ("LGTM" -- looks good to me)
     - review feedback may be addressed by pushing new commits to the request,
       if these commits stand on their own

Once all these conditions are met, and we agree with the change
(we are available on scala-internals to discuss this beforehand),
we will merge your changes.

Please note: you are responsible for meeting these criteria  (reminding your reviewer, for example).

### Pull request bot mechanics
* The build bot automatically builds commits as they appear in a PR. Click on the little x next to a commit sha to go to the overview of the PR validation job. To diagnose a failure, consult the console output of the job that failed.
  * 'PLS REBUILD ALL' will force the bot to rebuild (only necessary when a spurious failure occurred -- i.e., you expect a different validation outcome without changing the commit shas that make up the PR)

### List of reviewers by area:

* library: @phaller (Philipp Haller), @axel22 (Aleksander Prokopec -- concurrent & collection) 
* specialisation: @axel22 (Aleksander Prokopec), @vladureche (Vlad Ureche), @dragos (Iulian Dragos)
* named / default args, annotations, plugins: @lrytz (Lukas Rytz)
* macros, reflection, manifests, string interpolation: @xeno-by (Eugene Burmako), @cvogt (Christopher Vogt)
* type checker, inference: @odersky (Martin Odersky), @adriaanm (Adriaan Moors)
* Language specification, value classes: @odersky (Martin Odersky)
* new pattern matcher, implicit search: @adriaanm (Adriaan Moors)
* partest, Continuations Plugin: @phaller (Philipp Haller)
* error handling, lazy vals: @hubertp (Hubert Plociniczak)
* backend: @magarciaEPFL (Miguel Garcia), @gkossakowski (Grzegorz Kossakowski), @dragos (Iulian Dragos)
* repl, compiler performance: @retronym (Jason Zaugg)
* swing: @ingoem (Ingo Maier)
* scaladoc: @dickwall (Dick Wall)
* optimizer: @vladureche (Vlad Ureche), @magarciaEPFL (Miguel Garcia)
* build: @jsuereth (Josh Suereth)
* random compiler bugs: @lrytz, @adriaanm, @hubertp
* documentation: @heathermiller (Heather Miller), @dickwall (Dick Wall)
* cps: @TiarkRompf (Tiark Rompf)