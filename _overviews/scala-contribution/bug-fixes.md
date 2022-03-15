---
type: chapter
layout: multipage-overview
title: Bug Fixes
description: An introduction to contributing a bug fix
partof: scala_contribution
overview-name: Scala Contribution
num: 6
outof: 10
previous-page: documentation
next-page: code-review
---

<div class="container">
  <div class="row">
    <div class="span4 doc-block">
      <h3><a href="https://contributors.scala-lang.org/">Scala Contributors</a></h3>
      <p>Get a peek into the inners of the Scala compiler.</p>
    </div>
    <div class="span4 doc-block">
      <h3><a href="{% link _overviews/scala-contribution/bug-reporting-guide.md %}">Report an issue</a></h3>
      <p>File a bug report or a feature request.</p>
    </div>
  </div>

  <div class="row">
    <div class="span4 doc-block">
      <h3><a href="{% link _overviews/scala-contribution/introduction.md %}#community-tickets">Community issues</a></h3>
      <p>Get cracking on some easy to approach issues.</p>
    </div>
    <div class="span4 doc-block">
      <h3><a href="{% link _overviews/scala2-hackers/hacking-introduction.md %}">Hacker guide</a></h3>
      <p>Learn to write good code and improve your chances of contributing to the Scala galaxy.</p>
    </div>
  </div>
</div>



### Why contribute a patch to Scala?

Just to name a few common reasons:

* contributing a patch is the best way to make sure your desired changes will be available in the next Scala version
* Scala is written in Scala, so going through the source code and patching it will improve your Scala-fu
* last but not least, it only takes a few accepted commits to make it into the [Scala Contributor Hall of Fame](https://github.com/scala/scala/contributors).

The main Scala project consists of the standard Scala library, the Scala reflection and macros library,
the Scala compiler and the Scaladoc tool. This means there's plenty to choose from when deciding what to work on.
Typically the scaladoc tool provides a low entry point for new committers, so it is a good first step into contributing.

On the [Scala bug tracker](https://github.com/scala/bug) you will find the bugs that you could pick up. Once you decided on a ticket to look at, see the next step on how to proceed further.

If you are interested in contributing code, we ask you to sign the
[Scala Contributor License Agreement](https://www.lightbend.com/contribute/cla/scala),
which allows us to ensure that all code submitted to the project is
unencumbered by copyrights or patents.

### Bug-fix Check List

This is the impatient developer's checklist for the steps to submit a bug-fix pull request to the Scala project. For more information, description and justification for the steps, follow the links in that step. Further specific instructions for the release of Scala you are targeting can be found in the `CONTRIBUTING.md` file for that [GitHub branch](https://github.com/scala/scala)

1. [Select a bug to fix from GitHub][community-tickets], or if you found the bug yourself and want to fix it, [create a GitHub issue][bug-reporting-guide] (but please
[make sure it's not a duplicate][bug-reporting-guide-dupes]).
2. Optional ([but recommended][why-its-a-good-idea]), announce your intention to work on the bug on [Scala Contributors](https://contributors.scala-lang.org/). After all, don't you want to work on a team with
[these friendly people][hackers-connect] - it's one of the perks of contributing.
3. [Fork the Scala repository][hackers-fork] and clone your fork (if you haven't already).
4. [Create a feature branch][hackers-branch] to work on: use the branch name `issue/NNNN` where NNNN is the GitHub issue number.
5. [Fix the bug, or implement the new small feature][hackers-implement], include new tests (yes, for bug fixes too).
6. [Test, rinse][hackers-test] and [test some more][hacking-partest] until [all the tests pass][hackers-verify].
7. [Commit your changes][hackers-commit] to your feature branch in your fork. Please choose your commit message based on the [Git Hygiene](https://github.com/scala/scala#user-content-git-hygiene) section of the Scala project README.
8. If necessary [re-write git history](https://git-scm.com/book/en/Git-Branching-Rebasing) so that [commits are organized by major steps to the fix/feature](
https://github.com/scala/scala#git-hygiene). For bug fixes, a single commit is requested, for features several commits may be desirable (but each separate commit must compile and pass all tests)
9. [Submit a pull request][hackers-submit].
10. [Work with a reviewer](https://github.com/scala/scala#reviewing) to [get your pull request merged in][hackers-review].
11. Celebrate!

Need more information or a little more hand-holding for the first one? We got you covered: take a read through the entire [Hacker Guide][hackers] for an example of implementing a new feature (some of the steps can be skipped for bug fixes, this will be obvious from reading it, but many of the steps here will help with bug fixes too).

### Larger Changes, New Features

For larger, more ambitious changes (e.g. new language features), the first step to making a change is to discuss it with the community at large, to make sure everyone agrees on the idea
and on the implementation plan. Announce the change
on the [Scala Contributors](https://contributors.scala-lang.org/) mailing list and get developer feedback. For really complex changes, a [Scala Improvement Process (SIP)](https://docs.scala-lang.org/sips/) document might be required, but the first step is always to discuss it on the mailing list and if a SIP is required, that will be discussed on the mailing list.

Contributions, big or small, simple or complex, controversial or undisputed, need to materialize as patches against
the Scala project source tree. The [hacker guide][hackers] will explain how to materialize your idea into a full-fledged pull request against the Scala code base.

[community-tickets]: {% link _overviews/scala-contribution/introduction.md %}#community-tickets
[bug-reporting-guide]: {% link _overviews/scala-contribution/bug-reporting-guide.md %}
[bug-reporting-guide-dupes]: {% link _overviews/scala-contribution/bug-reporting-guide.md %}#reporting-confirmed-bugs-is-a-sin
[why-its-a-good-idea]: {% link _overviews/scala-contribution/scala-internals.md %}#why-its-a-good-idea
[hackers]: {% link _overviews/scala2-hackers/hacking-introduction.md %}
[hackers-connect]: {% link _overviews/scala2-hackers/hacking-introduction.md %}#1-connect
[hackers-fork]: {% link _overviews/scala2-hackers/hacking-introduction.md %}#fork
[hackers-branch]: {% link _overviews/scala2-hackers/hacking-introduction.md %}#branch
[hackers-implement]: {% link _overviews/scala2-hackers/hacking-introduction.md %}#implement
[hackers-test]: {% link _overviews/scala2-hackers/hacking-introduction.md %}#test
[hackers-verify]: {% link _overviews/scala2-hackers/hacking-introduction.md %}#verify
[hackers-commit]: {% link _overviews/scala2-hackers/hacking-introduction.md %}#commit
[hackers-submit]: {% link _overviews/scala2-hackers/hacking-introduction.md %}#submit
[hackers-review]: {% link _overviews/scala2-hackers/hacking-introduction.md %}#review
[hacking-partest]: {% link _overviews/scala2-hackers/partest-guide.md %}
