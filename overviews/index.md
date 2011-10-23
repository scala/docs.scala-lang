---
layout: guides-index
title: Guides and Overviews
---

<div class="page-header-index">
  <h1>Core <small>The essentials...</small></h1>
</div>

{% for post in site.categories.core %}
* [{{ post.title }}]({{ site.baseurl }}{{ post.url }}) <span class="label {{ post.label-color }}">{{ post.label-text }}</span>
{% if post.partof %}
  <ul>
  {% for pg in site.pages %}
    {% if pg.partof == post.partof %}
    <li><a href="{{ pg.url }}">{{ pg.title }}</a></li>
    {% endif %}
  {% endfor %}
  </ul>
{% endif %}
{% endfor %} 
* Swing <span class="label important">In Progress</span>
