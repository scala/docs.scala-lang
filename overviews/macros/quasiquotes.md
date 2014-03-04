---
layout: overview-large
title: Quasiquotes

disqus: true

partof: macros
num: 8
languages: [ja]
---
<span class="label warning" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako**

Quasiquotes are shipped with recent milestone builds of Scala 2.11, starting from 2.11.0-M4. They are also available in Scala 2.10 with the macro paradise plugin. Follow the instructions at the ["Macro Paradise"](/overviews/macros/paradise.html) page to download and use our compiler plugin.

Note that both in 2.10.x and in 2.11, quasiquotes don't bring transitive dependencies on macro paradise,
which means that you can write macros using quasiquotes from macro paradise for 2.10.x, and people will be able
to use them with vanilla 2.10.x.
Neither your code that uses quasiquotes from macro paradise, nor the users of such code will need to have macro paradise
on their classpath at runtime.

<span class="label success">NEW</span> There's a new, work-in-progress quasiquote guide for Scala 2.11.0 that lives at [http://den.sh/quasiquotes.html](http://den.sh/quasiquotes.html). Behavior of quasiquotes in macro paradise for 2.10.x might differ from what's described in the guide, but that's something that we plan to fix in paradise 2.0.0-final somewhen around the final release of Scala 2.11.0.