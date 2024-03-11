---
title: Contribute to API Documentation
num: 6
---

This page is specific to API documentation contributions – that is, API
documentation for
[Scala's standard library](https://scala-lang.org/api/current/#package) –
sometimes referred to as Scaladoc contributions.

For contributions to tutorial and guide-style documentation on
[docs.scala-lang.org][home],
see [Add New Guides/Tutorials][add-guides].

*Please note, these instructions cover documentation contributions Scala core
libraries only. For other Scala projects please check those projects for the
contribution steps and guidelines. Thank you.*

## Overview

Since API documentation is located in Scala source code files, the
process for contributing API documentation is similar to that of contributing bug-fixes
to the Scala code base, but without the requirement that there be an issue filed on GitHub
first. When forking/branching, it would help to use a `scaladoc/xxxx` branch name, where `xxxx` is a
descriptive, but short branch name (e.g. `scaladoc/future-object`).
However, if an issue *does* exist, please use `issue/NNNN`, where `NNNN` is the ticket number,
instead.

If you would like to assist us, you can
[report missing/incorrect API documentation](#contribute-api-documentation-bug-reports), or
[contribute new API documentation](#contribute-new-api-documentation).

## Contribute API Documentation Bug Reports

One good way to contribute is by helping us to identify missing documentation. To do
this, [browse the current API documentation](https://www.scala-lang.org/api/current/)
and identify missing, incorrect or inadequate documentation. A good place to start is
package objects for important packages (these often get overlooked for documentation
and are a good place for API overviews).

If you find an issue, please log it in the [Scala bug tracker](https://github.com/scala/bug),
(or else the [Scala 3 issue tracker](https://github.com/scala/scala3/issues) for Scala 3 library additions)
**after making sure it is not already logged as an issue**. To help with
disambiguation, please use the following format for issue title:

* Use an action describing the work required, e.g. **Add**, **Document**, **Correct**, **Remove**.
* Use the full package, class/trait/object/enum name (or state package object if
  that is the case).
* Extremely short description of what to do.
* More detail can (and should) go into the issue description, including a short
  justification for the issue if it provides additional detail.

Here is an example of the title and description for an example API documentation issue:

`Document scala.concurrent.Future object, include code examples`

(note the explicit companion object called out in the title)

and the description:

> The methods on the `Future` companion object are critical
> for using Futures effectively without blocking. Provide code
> examples of how methods like `sequence`, `transform`, `fold` and
> `firstCompletedOf` should be used.

In addition to following these conventions, please add `documentation` and
`community` labels to the issue, and put them in the `Documentation and API`
component so that they show up in the correct issue filters.

## Contribute New API Documentation

### Required Reading

Please familiarize yourself with the following before contributing
new API documentation to save time, effort, mistakes and repetition.

* [Forking the Repo][hackers-setup] - follow the setup steps through
  the Branch section. If providing new documentation related to an existing GitHub issue, use `issue/NNNN`
  or `ticket/NNNN` as the guide states. If providing API documentation with no associated
  GitHub issue, use `scaladoc/xxxx` instead.
* [Scaladoc for library authors][scaladoc-lib-authors]
  covers the use of scaladoc tags, markdown and other features.
* [Scaladoc's interface][scaladoc-interface]
  covers all the features of Scaladoc's interface, e.g. switching between
  companions, browsing package object documentation, searching, token searches
  and so on.
* Prior to commit, be sure to read
  [A note about git commit messages](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) and the [Scala Project & Developer Guidelines](https://github.com/scala/scala/blob/2.11.x/CONTRIBUTING.md).
  Some of this latter document will clearly not apply (like the sections on providing tests,
  however see below for some special requirements for documentation). Do still read
  the whole document though, and pay close attention to the title and commit
  message formats, noting *present tense*, *length limits* and that it must merge
  cleanly. Remember that the title of the pull request will become the commit
  message when merged. **Also**, be sure to assign one or more reviewers to the PR, if this is
  not possible for you, you could mention a user **in the pull request comments**.

### Extra Requirements for Scaladoc Documentation Commits

Although some requirements for bug fix pull requests are not needed for
API documentation commits, here are the step by step requirements to ensure your API documentation
PR is merged in smoothly:

* Any and all code examples provided should *be correct, compile and run* as
  expected (ensure this in the REPL or your IDE).
* Spelling must be checked for all written language *and* code examples where
  possible. Most editors have some spell checking feature available. Scala code
  itself is permitted to not pass a spell-checker, however any written language
  should be checked. If you can also use a grammar checker, it will help. We
  *will* ask for spelling and grammar to be corrected before acceptance.
* You **must** also run `sbt doc`, fix any problems and check the formatting and
  layout of your changes. Again, corrections will be required if formatting or
  layout are inadequate. After running `sbt doc` the generated documents can be
  found under the `build/scaladoc/` folders (probably in the `library` subdirectory
  but maybe under the others depending on what section of the Scala source you
  are working on).
* All of these steps are required to save time for both the reviewers and
  contributors. It benefits everyone to ensure that the PR to merge process is
  as smooth and streamlined as possible.

Thanks for helping us improve the Scaladoc API documentation!

[home]: {% link index.md %}
[add-guides]: {% link _overviews/contribute/add-guides.md %}
[hackers-setup]: {% link _overviews/contribute/hacker-guide.md %}#2-set-up
[scaladoc-lib-authors]: {% link _overviews/scaladoc/for-library-authors.md %}
[scaladoc-interface]: {% link _overviews/scaladoc/interface.md %}
