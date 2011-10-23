---
layout: index
title: Tutorials
---

<div class="page-header-index">
  <h1>A Tour of Scala <small>Bite-size pieces of all of the essentials...</small></h1>
</div>
{% for pg in site.pages %}
  {% if pg.tutorial == "scala-tour" and pg.outof %}
    {% assign totalPages = pg.outof %}  
  {% endif %}
{% endfor %}

{% if totalPages %}
  <ul>
  {% for i in (1..totalPages) %}
    {% for pg in site.pages %}
      {% if pg.tutorial == "scala-tour" and pg.num and pg.num == i %}
        <li><a href="{{ pg.url }}">{{ pg.title }}</a></li> 
      {% endif %}
    {% endfor %}
  {% endfor %}
  </ul>
{% else %} **ERROR**. Couldn't find the total number of pages in this set of tutorial articles. Have you declared the `outof` tag in your YAML front matter?
{% endif %}
