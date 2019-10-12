---
title: IDE and Build Tool Contributions
layout: inner-page-no-masthead
# permalink: /contribute/tools/
includeTOC: true

# Projects list:
projects:
  - title: sbt
    description: Interactive build tool.
    icon: http://www.scala-sbt.org/assets/typesafe_sbt_svg.svg
    link: https://github.com/sbt/sbt
    homeLink: http://www.scala-sbt.org/
    issuesLink: https://github.com/sbt/sbt#issues-and-pull-requests
    readmeLink: https://github.com/sbt/sbt/blob/0.13/README.md
    contributingLink: https://github.com/sbt/sbt/blob/0.13/CONTRIBUTING.md
  - title: Scaladoc Tool
    description: (Contribute through scala/scala)
    icon: https://avatars1.githubusercontent.com/u/57059?v=3&s=200
    link: https://github.com/scala/scala
    homeLink: http://www.scala-lang.org/api
    issuesLink: https://github.com/scala/bug/labels/scaladoc
    readmeLink: https://github.com/scala/scala#welcome
    contributingLink: http://scala-lang.org/contribute/guide.html
  - title: Scala IDE
    description: Interactive build tool.
    icon: https://avatars2.githubusercontent.com/u/1026788?v=3&s=200
    link: https://github.com/scala-ide/scala-ide
    homeLink: http://scala-ide.org/
    issuesLink: http://scala-ide-portfolio.assembla.com/spaces/scala-ide/support/tickets
    readmeLink: https://github.com/scala-ide/scala-ide/blob/master/README.md
    contributingLink: https://github.com/scala-ide/scala-ide/blob/master/CONTRIBUTING.md
  - title: DBuild
    description: Multi-project build tool.
    icon: https://avatars3.githubusercontent.com/u/784923?v=3&s=200
    link: https://github.com/lightbend/dbuild
    homeLink: http://lightbend.github.io/dbuild
    issuesLink: https://github.com/lightbend/dbuild/issues
    readmeLink: https://github.com/lightbend/dbuild/blob/master/README.md
    contributingLink: https://github.com/lightbend/dbuild/blob/master/README.md#get-involved
  - title: Partest
    description: Scala Compiler/Library Testing
    icon: https://avatars1.githubusercontent.com/u/57059?v=3&s=200
    link: https://github.com/scala/scala-partest
    homeLink: http://docs.scala-lang.org/tutorials/partest-guide.html
    issuesLink: https://github.com/scala/scala-partest/issues
    readmeLink: https://github.com/scala/scala-partest/blob/1.1.x/README.md
    contributingLink:
  - title: Scoverage
    description: Scala code coverage tool
    icon: https://avatars1.githubusercontent.com/u/5998302?v=3&s=200
    link: https://github.com/scoverage/scalac-scoverage-plugin
    homeLink: http://scoverage.org/
    issuesLink: https://github.com/scoverage/scalac-scoverage-plugin/issues
    readmeLink: https://github.com/scoverage/scalac-scoverage-plugin/blob/master/README.md
    contributingLink: https://groups.google.com/forum/#!forum/scala-code-coverage-tool

projectsInNeed:
  - title: Scalariform
    description: Scala source code formatter
    icon: /resources/img/white-line.png
    link: https://github.com/mdr/scalariform
    homeLink: https://github.com/mdr/scalariform/wiki/Command-line-tool
    issuesLink: https://github.com/mdr/scalariform/issues
    readmeLink: https://github.com/mdr/scalariform/blob/master/README.rst
---
## Contributing to IDE and Build Tools

The links below are to a number of Scala build and IDE related projects that are important in the larger Scala space, and which welcome contributions.

Since these tools are in separate projects, they may (and likely will) have their own rules and guidelines for contributing. The [Hacker Guide](/contribute/hacker-guide.html) and [Bug-fixing](/contribute/guide.html) pages will likely have much in the way of related information on how to contribute to these projects, and are recommended reading. You should also check the README.md and (if it's present) CONTRIBUTING.md files from the actual projects before contributing to them.

Typically, issues for these projects will be reported and kept in the GitHub project issue tracker for that project rather than in the Scala bug tracker.
Many of these projects have a <a href="https://gitter.im">gitter</a> channel (usually listed in the README or CONTRIBUTING documents) which is a great place to discuss proposed work before commencing.

There are some projects in this section that are in
[particular need](#projects-in-particular-need) so please check those out
if you would like to help revive them.

### Broken Links?

Stuff changes. Found a broken link or something that needs updating on this page? Please, consider [submitting a documentation pull request](/contribute/documentation.html#updating-scala-langorg) to fix it.

### Projects

{% include contributions-projects-list.html collection=page.projects %}

### Projects in Particular Need

The following projects are important to the Scala community but are particularly in need of contributors to continue their development.

{% include contributions-projects-list.html collection=page.projectsInNeed %}
