---
layout: inner-page-no-masthead-landing
title: List of SIPs
---

### Completed SIPs ###
<ul class="post-list">
  {% for post in site.categories.completed %}
    {% if post.layout == 'sip' %}
      <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a> <span class="date">( {{ post.date | date: "%b %Y" }} )</span></li>
    {% endif %}
  {% endfor %}
</ul>

### Rejected SIPs ###
<ul class="post-list">
  {% for post in site.categories.rejected %}
    {% if post.layout == 'sip' %}
      <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a> <span class="date">( {{ post.date | date: "%b %Y" }} )</span></li>
    {% endif %}
  {% endfor %}
</ul>

