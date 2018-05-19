---
layout: multipage-overview
title: Roadmap

discourse: true

partof: macros
overview-name: Macros

num: 12

languages: [ja]
permalink: /overviews/macros/:title.html
---

<span class="tag" style="float: right;">EXPERIMENTAL</span>

The functionality and APIs provided by Scala macros has remained mostly
unchanged since 2.11. There are no plans to extend current def macros with new
functionality. There is ongoing work to develop a macro system for Dotty, which
is planned to be released as Scala 3 by early 2020. Read the announcement of
Scala 3 [here](http://www.scala-lang.org/blog/2018/04/19/scala-3.html).

If you need to write macros today, it is recommended to use the def macros that
are documented
[here](https://docs.scala-lang.org/overviews/macros/overview.html) and are
included with the Scala compiler. Widely used libraries like ScalaTest, sbt and
Play Framework use def macros even if they are still labeled as experimental.
