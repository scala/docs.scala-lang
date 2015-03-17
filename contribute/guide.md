---
layout: page
title: Contributing guide
---

<div class="container">
  <div class="row">
    <div class="span4 doc-block">
      <h3><a href="http://groups.google.com/group/scala-internals">Scala Internals</a></h3>
      <p>Get a peek into the inners of the Scala compiler.</p>
    </div>
    <div class="span4 doc-block">
      <h3><a href="{{ site.baseurl }}/contribute/bug-reporting-guide.html">Report an issue</a></h3>
      <p>File a bug report or a feature request.</p>
    </div>
  </div>

  <div class="row">
    <div class="span4 doc-block">
      <h3><a href="{{ site.baseurl }}/contribute/#community_tickets">Community issues</a></h3>
      <p>Get cracking on some easy to approach issues.</p>
    </div>
    <div class="span4 doc-block">
      <h3><a href="{{ site.baseurl }}/contribute/hacker-guide.html">Hacker's guide</a></h3>
      <p>Learn to write good code and improve your chances of contributing to the Scala galaxy.</p>
    </div>
  </div>
</div>



### Why contribute a patch to Scala?

Just to name a few common reasons:

* contributing a patch is the best way to make sure your desired changes will be available in the next Scala version
* Scala is written in Scala, so going through the source code and patching it will improve your Scala-fu
* last but not least, you will make it into the [Scala Contributor Hall of Fame](scala-fame.html).

The main Scala project consists of the standard Scala library, the Scala reflection and macros library,
the Scala compiler and the Scaladoc tool. This means there's plenty to choose from when deciding what to work on.
Typically the scaladoc tool provides a low entry point for new committers, so it is a good first step into contributing.

On the Scala bug tracker you will find many bugs that are [marked as good starting points to contributing ("community" bugs)](https://issues.scala-lang.org/secure/IssueNavigator.jspa?requestId=12111) or [that are not currently assigned](https://issues.scala-lang.org/secure/IssueNavigator.jspa?requestId=12112) and that you could pick up. Once you decided on a ticket to look at, see the next step on how to proceed further.

If you are interested in contributing code, we ask you to sign the
[Scala Contributor License Agreement](http://typesafe.com/contribute/cla/scala),
which allows us to ensure that all code submitted to the project is
unencumbered by copyrights or patents.

### Bug-fix Check List

This is the impatient developer's checklist for the steps to submit a bug-fix pull request to the Scala project. For more information, description and justification for the steps, follow the links in that step. Further specific instructions for the release of Scala you are targeting can be found in the `CONTRIBUTING.md` file for that [github branch](https://github.com/scala/scala)

1. [Select a bug to fix from JIRA](/contribute/index.html#community_tickets), or if you found the bug yourself and want to fix it, [create a JIRA issue](./bug-reporting-guide.html) (but please 
[make sure it's not a duplicate](./bug-reporting-guide.html#reporting_confirmed_bugs_is_a_sin)).
2. Optional ([but recommended](./scala-internals.html#why_its_a_good_idea)), announce your intention to work on the bug on [scala-internals](./scala-internals.html). After all, don't you want to work on a team with 
[these friendly people](./hacker-guide.html#connect) - it's one of the perks of contributing.
3. [Fork the Scala repository](./hacker-guide.html#fork) and clone your fork (if you haven't already).
4. [Create a feature branch](./hacker-guide.html#branch) to work on: use the branch name `issue/NNNN` where NNNN is the JIRA issue number.
5. [Fix the bug, or implement the new small feature](./hacker-guide.html#implement), include new tests (yes, for bug fixes too).
6. [Test, rinse](./hacker-guide.html#test) and [test some more](./partest-guide.html) until [all the tests pass](./hacker-guide.html#verify).
7. [Commit your changes](./hacker-guide.html#commit) to your feature branch in your fork. Please choose your commit message based on the [Git Hygiene](https://github.com/scala/scala#user-content-git-hygiene) section of the Scala project README.
8. If necessary [re-write git history](http://git-scm.com/book/en/Git-Branching-Rebasing) so that [commits are organized by major steps to the fix/feature](
https://github.com/scala/scala#git-hygiene). For bug fixes, a single commit is requested, for features several commits may be desirable (but each separate commit must compile and pass all tests)
9. [Submit a pull request](./hacker-guide.html#submit) following the [Scala project pull-request guidelines](http://docs.scala-lang.org/scala/pull-request-policy.html).
10. [Work with a reviewer](https://github.com/scala/scala#reviewing) to [get your pull request merged in](./hacker-guide.html#review).
11. Celebrate!

Need more information or a little more hand-holding for the first one? We got you covered: take a read through the entire [Hacker Guide](./hacker-guide.html) for an example of implementing a new feature (some of the steps can be skipped for bug fixes, this will be obvious from reading it, but many of the steps here will help with bug fixes too).

### Larger Changes, New Features

For larger, more ambitious changes (e.g. new language features), the first step to making a change is to discuss it with the community at large, to make sure everyone agrees on the idea
and on the implementation plan. Announce the change
on the [scala-internals](http://groups.google.com/group/scala-internals) mailing list and get developer feedback. For really complex changes, a [Scala Improvement Process (SIP)](http://docs.scala-lang.org/sips/) document might be required, but the first step is always to discuss it on the mailing list and if a SIP is required, that will be discussed on the mailing list.

Contributions, big or small, simple or complex, controversial or undisputed, need to materialize as patches against
the Scala project source tree. The [hacker guide](hacker-guide.html) will explain how to materialize your idea into a full-fledged pull request against the Scala code base.

