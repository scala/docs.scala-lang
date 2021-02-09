---
layout: singlepage-overview
overview-name: "Scala 3 Documentation"
title: Contributing to the Docs
---
## Overview
There are several ongoing efforts to produce high quality documentation for
Scala 3. In particular there are the following documents:

- Scala 3 book
- Macros tutorial
- Migration guide
- Scala 3 language reference

We welcome contributions from the community to every aspect of the documentation.


### How can I contribute?
In general, there is many different ways you could help us:

- **Confused about something in any of the docs?** Open an issue.
- **Found something not up-to-date?** Open an issue or create a PR.
- **Typos and other small text enhancements?** Create a PR.
- **Want to add something new or make larger changes?** Great! Please open an issue and let us discuss this.

Typically, each of the different documentation projects contain links (and so does this document, in the table-of-contents pane - so far only visible in the desktop view) to edit and improve them. Additionally, below we provide you with the necessary information to get started.

## Scala 3 Book
The [Scala 3 Book][scala3-book] is being written by Alvin Alexander and provides an overview over all the important features of Scala 3. It targets readers, which are new to Scala.

- [Sources](https://github.com/scala/docs.scala-lang/tree/master/_overviews/scala3-book)
- [Issues](https://github.com/scala/docs.scala-lang/issues)

## Macros Tutorial
The [Macros Tutorial](/scala3/guides/macros) is being written by Nicolas Stucki and contains detailed information about macros in Scala 3 and best-practices.

- [Sources](https://github.com/scala/docs.scala-lang/tree/master/_overviews/scala3-macros)
- [Issues](https://github.com/scala/docs.scala-lang/issues)

## Migration Guide
The [Scala 3 Migration Guide](https://scalacenter.github.io/scala-3-migration-guide/)
contains an comprehensive overview over compatibility between Scala 2 and Scala 3,
a tour presenting the migration tools, and detailed migration guides.

- [Contribution Overview](https://scalacenter.github.io/scala-3-migration-guide/docs/contributing.html)
- [Source](https://github.com/scalacenter/scala-3-migration-guide)
- [Issues](https://github.com/scalacenter/scala-3-migration-guide/issues)


## Scala 3 Language Reference
The [Dotty reference](https://dotty.epfl.ch/docs/reference/overview.html) will evolve into the Scala 3 language, containing  a formal presentation and detailed technical information about the various features of the language.

- [Sources](https://github.com/lampepfl/dotty/tree/master/docs/docs/reference)
- [Issues](https://github.com/lampepfl/dotty/issues)


[scala3-book]: {% link _overviews/scala3-book/introduction.md %}

[best-practices]: {% link _overviews/scala3-macros/best-practices.md %}
[compiletime]: {% link _overviews/scala3-macros/tutorial/compiletime.md %}
[cross-compilation]: https://scalacenter.github.io/scala-3-migration-guide/docs/macros/migration-tutorial.html#cross-building
[inline]: {% link _overviews/scala3-macros/tutorial/inline.md %}
[macros]: {% link _overviews/scala3-macros/tutorial/macros.md %}
[migration-status]: https://scalacenter.github.io/scala-3-migration-guide/docs/macros/macro-libraries.html#macro-libraries
[quotes]: {% link _overviews/scala3-macros/tutorial/quotes.md %}
[tasty]: {% link _overviews/scala3-macros/tutorial/reflection.md %}
[reflection-api]: https://dotty.epfl.ch/api/scala/quoted.html
