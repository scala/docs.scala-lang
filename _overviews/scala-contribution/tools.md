---
type: chapter
layout: multipage-overview
title: IDE and Build Tool Contributions
description: An introduction to contributing to IDE and Build Tools
partof: scala_contribution
overview-name: Scala Contribution
num: 10
outof: 11
previous-page: core-libs
next-page: scala-internals

# Projects list:
projects:
  - title: sbt
    description: The interactive build tool.
    icon: https://www.scala-sbt.org/assets/sbt-logo.svg
    link: https://github.com/sbt/sbt
    homeLink: https://www.scala-sbt.org/
    issuesLink: https://github.com/sbt/sbt#issues-and-pull-requests
    readmeLink: https://github.com/sbt/sbt/blob/0.13/README.md
    contributingLink: https://github.com/sbt/sbt/blob/0.13/CONTRIBUTING.md
  - title: Scaladoc Tool
    description: (Contribute through scala/scala)
    icon: https://avatars1.githubusercontent.com/u/57059?v=3&s=200
    link: https://github.com/scala/scala
    homeLink: https://www.scala-lang.org/api
    issuesLink: https://github.com/scala/bug/labels/scaladoc
    readmeLink: https://github.com/scala/scala#welcome
    contributingLink: /overviews/scala-contribution/bug-reporting-guide.html
  - title: Partest
    description: Scala Compiler/Library Testing (Contribute through scala/scala)
    icon: https://avatars1.githubusercontent.com/u/57059?v=3&s=200
    link: https://github.com/scala/scala
    homeLink: https://github.com/scala/scala
    issuesLink: https://github.com/scala/scala/issues
    readmeLink: https://github.com/scala/scala/blob/2.13.x/CONTRIBUTING.md#partest
    contributingLink:

projectsInNeed:
---
## Contributing to IDE and Build Tools

The links below are to a number of Scala build and IDE related projects that are important in the larger Scala space, and which welcome contributions.

Since these tools are in separate projects, they may (and likely will) have their own rules and guidelines for
contributing. The [Scala 2 Hacker's Guide][hackers] and [Bug-fixing][bug-fixes] pages will likely have much in the
way of related information on how to contribute to these projects, and are recommended reading.
You should also check the `README.md` and (if it's present) `CONTRIBUTING.md` files from the actual projects before contributing to them.

Typically, issues for these projects will be reported and kept in the GitHub project issue tracker for that project rather than in the Scala bug tracker.

Many of these projects have a chat room on Discord or Gitter (usually linked from their `README.md` or `CONTRIBUTING.md`
files) which is a great place to discuss proposed work before starting.

There are some projects in this section that are in
[particular need](#projects-in-particular-need) so please check those out
if you would like to help revive them.

### Broken Links?

Stuff changes. Found a broken link or something that needs updating on this page? Please, consider [submitting a documentation pull request][updating-scala-langorg] to fix it.

### Projects

{% include contributions-projects-list.html collection=page.projects %}

### Projects in Particular Need

The following projects are important to the Scala community but are particularly in need of contributors to continue
their development.

{% include contributions-projects-list.html collection=page.projectsInNeed %}

[bug-fixes]: {% link _overviews/scala-contribution/bug-fixes.md %}
[hackers]: {% link _overviews/scala2-hackers/hacking-introduction.md %}
[updating-scala-langorg]: {% link _overviews/scala-contribution/documentation.md %}#updating-scala-langorg
