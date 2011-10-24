---
layout: index
title: Scala Style Guide
---

<div class="span16">
  <div class="page-header-index">
    <h1>The Scala Style Guide</h1>
  </div>
  {% for pg in site.pages %}
    {% if pg.partof == "style-guide" and pg.outof %}
      {% assign totalPages = pg.outof %}  
    {% endif %}
  {% endfor %}

  {% if totalPages %}
    <ul>
    {% for i in (1..totalPages) %}
      {% for pg in site.pages %}
        {% if pg.partof == "style-guide" and pg.num and pg.num == i %}
          <li class="tour-of-scala"><a href="{{ pg.url }}">{{ pg.title }}</a></li> 
        {% endif %}
      {% endfor %}
    {% endfor %}
    </ul>
  {% else %} **ERROR**. Couldn't find the total number of pages in this set of tutorial articles. Have you declared the `outof` tag in your YAML front matter?
  {% endif %}
</div>

