---
layout: index
title: Guides and Overviews
---

<div class="page-header-index">
  <h1>Core <small>The essentials...</small></h1>
</div>

{% for post in site.categories.core %}
* [{{ post.title }}]({{ site.baseurl }}{{ post.url }}) {% if post.label %}<span class="label {{ post.label-color }}">{{ post.label-text }}</span>{% endif %}
{% if post.parent-dir %}
  <ul>
  {% for page in site.categories.core %}
    <li>+1</li>
  {% endfor %}
  </ul>
{% endif %}
{% endfor %}      
* Swing <span class="label important">In Progress</span>

