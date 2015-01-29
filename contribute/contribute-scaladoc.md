---
layout: page
title: Contribute to API Documentation
---

This page is specific to API documentation contributions – that is, API
documentation for 
[Scala's standard library](http://scala-lang.org/api/current/#package) – 
sometimes referred to as Scaladoc contributions.

For contributions to tutorial and guide-style documentation on 
[docs.scala-lang.org](http://docs.scala-lang.org),
see the ["doc-site"'s contribution guide](http://docs.scala-lang.org/contribute.html).

*Please note, these instructions cover documentation contributions Scala core
libraries only. For other Scala projects please check those projects for the
contribution steps and guidelines. Thank you.*

## Overview

Since API documentation is located in Scala source code files, the
process for contributing API documentation is similar to that of contributing bug-fixes
to the Scala code base, but without the requirement that there be an issue filed on JIRA
first (when forking/branching, just use a `scaladoc/xxxx` branch name instead of `issue/NNNN`).
However, if an issue *does* exist, please use `issue/NNNN` (where NNNN is the ticket number)
instead.

If you would like to assist us by helping us find missing documentation and
submitting bug reports for existing documentation, 
[please read the following section](#contribute-api-documentation-bug-reports).
If you want to contribute new API documentation,
[jump down to the next section](#contribute-new-api-documentation).

## Contribute API Documentation Bug Reports

One good way to contribute is by helping us to identify missing documentation. To do
this, [browse the current API documentationn](http://www.scala-lang.org/api/current/)
and identify missing, incorrect or inadequate documentation. A good place to start is
is package objects for important packages (these often get overlooked for documentation 
and are a good place for API overviews).

If you find an issue, please log it in the [Scala issue tracker](https://issues.scala-lang.org)
**after making sure it is not already logged as an issue**. To help with
disambiguation, please use the following format for issue title:

* Use an action describing the work required. E.g. Add, Document, Correct, Remove
* Use the full package, class/trait/object name (or state package object if
  that is the case).
* Extremely short description of what to do.
* More detail can (and should) go into the issue description, including a short
  justification for the issue if it provides additional detail.

Here is an example of the title and description for an example API documentation issue:

`Document scala.concurrent.Future object, include code examples`

(note the explicit companion object called out in the title)

and the description:

`The methods on the Future companion object are critical`
`for using Futures effectively without blocking. Provide code`
`examples of how methods like sequence, transform, fold and`
`firstCompletedOf should be used.`

In addition to following these conventions, please add `documentation` and
`community` labels to the issue, and put them in the `Documentation and API`
component so that they show up in the correct issue filters.

## Contribute New API Documentation

### Required Reading

Please familiarize yourself with **all** of the following before contributing
new API documentation to save time, effort, mistakes and repetition.

* [Forking the Repo](./hacker-guide.html#set-up) follow setup steps through
  branch name. If providing new documentation related to an existing JIRA issue, use `issue/NNNN`
  or `ticket/NNNN` as the guide states. If providing API documentation with no associated
  JIRA issue, use `scaladoc/xxxx` instead, where xxxx is a descriptive but
  short branch name, e.g. `scaladoc/future-object`.
* [Scaladoc for library authors](http://docs.scala-lang.org/overviews/scaladoc/for-library-authors.html)
  covers the use of scaladoc tags, markdown and other features.
* [Scaladoc's interface](http://docs.scala-lang.org/overviews/scaladoc/interface.html)
  covers all of the features of Scaladoc's interface, e.g. switching between
  companions, browsing package object documentation, searching, token searches
  and so on.
* Prior to commit, be sure to read
  [A note about git commit messages](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).
* Also read the Scala [Pull Request Policy](https://github.com/scala/scala/wiki/Pull-Request-Policy).
  Some of this document will clearly not apply (like the sections on providing tests,
  however see below for some special requirements for documentation). Do still read
  the whole document though, and pay close attention to the title and commit
  message formats, noting *present tense*, *length limits* and that it must merge
  cleanly. Remember that the title of the pull request will become the commit
  message when merged. **Also**, be sure to assign one or more reviewers to the PR, list of
  reviewers is at the bottom of this document, but the quick version is to add
  `Review by @dickwall` **in the pull request comments**.

### Extra Requirements for Scaladoc Commits

Although some of the requirements for bug fix pull requests are not needed for
API documentation commits, here are the step by step requirements to ensure your API documentation
PR is merged in smoothly:

* Any and all code examples provided should *be correct, compile and run* as
  expected (ensure this in the REPL or your IDE).
* Spelling must be checked for all written language *and* code examples where
  possible. Most editors have some spell checking feature available. Obviously
  Scala code is likely to flag as mis-spelled sometimes, but any written language
  should be checked. If you can also use a grammar checker, even better. We
  *will* ask for spelling and grammar to be corrected before acceptance.
* You **must** also run `ant docs`, fix any problems and check the formatting and
  layout of your changes. Again, corrections will be required if formatting or
  layout are inadequate. After running `ant docs` the generated documents can be
  found under the `build/scaladoc/` folders (probably in the `library` folder
  but maybe under the others depending on what section of the Scala source you
  are working on).
* All of these steps are required to save time for both the reviewers and
  contributors. It benefits everyone to ensure that the PR to merge process is
  as smooth and streamlined as possible.

Thanks for helping us improve the Scaladoc API documentation!
