---
layout: index
title: Tutorials
---

<div class="page-header-index">
  <h1>A Tour of Scala <small>Bite-size pieces of all of the essentials...</small></h1>
</div>
<ul>
{% for pg in site.pages %}
  {% if pg.tutorial == "scala-tour" %}
  <li><a href="{{ pg.url }}">{{ pg.title }}</a></li>
  {% endif %}
{% endfor %}
</ul>



