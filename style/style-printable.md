---
layout: printable
title: Style Guide One Page
---

{% assign pages = site.pages | sort: "num"  %}
{% for page in pages %}
  {% if page.partof == "style-guide" %}
  <div>
    <h1>{{ page.title }}</h1>
    {{ page.content | markdownify }}
  </div>
  {% endif %}
{% endfor %}
