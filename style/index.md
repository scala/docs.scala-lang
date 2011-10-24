---
layout: index
title: Scala Style Guide
---

<div class="span8">
  <div class="page-header-index">
    <h1>Contents</h1>
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
  {% else %} <b>ERROR</b>. Couldn't find the total number of pages in this set of tutorial articles. Have you declared the `outof` tag in your YAML front matter?
  {% endif %}
</div>

<div class="span8">

  <div class="page-header-index">
    <h1>About</h1>
  </div>

  <p>This document is intended to outline some basic Scala stylistic guidelines which should be followed with more or less fervency. Wherever possible, this guide attempts to detail why a particular style is encouraged and how it relates to other alternatives. As with all style guides, treat this document as a list of rules to be broken. There are certainly times when alternative styles should be preferred over the ones given here.</p>

</div>