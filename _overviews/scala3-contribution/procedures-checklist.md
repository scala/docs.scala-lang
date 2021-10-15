---
title: Pull Request Checklist
type: section
description: This page describes a checklist before opening a Pull Request to the Scala 3 compiler.
num: 11
previous-page: procedures-testing
next-page: arch-intro
---

Once you solved an issue, you likely want to see your change added to the [Scala 3 repo][lampepfl/dotty].
To do that, you need to prepare a [pull request][pull-request] with your changes. We recommend you
follow these guidelines, [also consult the full requirements][full-list]:

### 1. Sign the CLA

Make sure you have signed the [Scala CLA][cla], if not, sign it.

### 2: Is It Relevant?

Before starting to work on a feature or a fix, it's good practice to ensure that:
1. There is a ticket for your work in the project's [issue tracker][issues];
2. The ticket has been discussed and there is desire for it to be implemented by the
Scala 3 core maintainers.

### 3: Add Tests
Add at least one test that replicates the problem in the issue, and that shows it is now resolved.

You may of course add variations of the test code to try and eliminate edge cases.
[Become familiar with testing in Scala 3][testing].

### 4: Add Documentation
Please ensure that all code is documented to explain its use, even if only internal
changes are made.


[pull-request]: https://docs.github.com/en?query=pull+requests
[lampepfl/dotty]: https://github.com/lampepfl/dotty
[cla]: http://typesafe.com/contribute/cla/scala
[issues]: https://github.com/lampepfl/dotty/issues
[full-list]: https://github.com/lampepfl/dotty/blob/master/CONTRIBUTING.md
[testing]: {% link _overviews/scala3-contribution/procedures-testing.md %}
