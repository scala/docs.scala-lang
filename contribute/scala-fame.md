---
layout: page-full-width
title: Scala Contributor Hall of Fame
---

A big thank you to everyone who contributed to:
 - [the Scala library and compiler](https://github.com/scala/scala/contributors)
 - [the Scala documentation website](https://github.com/scala/scala.github.com/contributors)

{% for data in site.categories.scala-fame-data limit:1 %}
  {% assign famedata = data %}
  {% include render-scala-fame.html %}
{% endfor %}
