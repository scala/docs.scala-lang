---
layout: guides-index
title: Guides and Overviews
---

<div class="page-header-index">
  <h1>Core <small>The essentials...</small></h1>
</div>

{% for post in site.categories.core %}
{% if post.partof %}
* {{ post.title }} <span class="label {{ post.label-color }}">{{ post.label-text }}</span>
  {% for pg in site.pages %}
    {% if pg.partof == post.partof and pg.outof %}
      {% assign totalPages = pg.outof %}  
    {% endif %}
  {% endfor %}

  {% if totalPages %}
  <ul>
  {% for i in (1..totalPages) %}
    {% for pg in site.pages %}
      {% if pg.partof == post.partof and pg.num and pg.num == i%}
        <li><a href="{{ pg.url }}">{{ pg.title }}</a></li>
      {% endif %}
    {% endfor %}
  {% endfor %}
  </ul>
  {% else %} **ERROR**. Couldn't find the total number of pages in this set of tutorial articles. Have you declared the `outof` tag in your YAML front matter?
  {% endif %}
{% else %}
* [{{ post.title }}]({{ site.baseurl }}{{ post.url }}) <span class="label {{ post.label-color }}">{{ post.label-text }}</span>
{% endif %}
{% endfor %} 
* Swing <span class="label important">In&nbsp;Progress</span>
