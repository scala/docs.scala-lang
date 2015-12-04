---
layout: page-full-width
title: Scala Contributor Hall of Fame
---

A big thank you to everyone who has contributed over the years to:
 - [the Scala library and compiler](https://github.com/scala/scala/contributors)
 - [the Scala documentation website](https://github.com/scala/scala.github.com/contributors)

What follows are the commit totals, to the 2.12.x branch of the scala/scala repo only,
for last month.  (For a commit to be counted, it must have been both committed and merged
in the same month.)

For a more detailed view of recent activity, see the repo's
[GitHub Pulse page](https://github.com/scala/scala/pulse/monthly).

{% for data in site.categories.scala-fame-data limit:1 %}
  {% assign famedata = data %}
  {% include render-scala-fame.html %}
{% endfor %}
