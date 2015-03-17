---
layout: sip-landing
title: List of SIPs and SLIPs
---

### Completed SLIPs ###
<ul class="post-list">
  {% for post in site.categories.completed %}
    {% if post.layout == 'slip' %}
      <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a> <span class="date">( {{ post.date | date: "%b %Y" }} )</span></li>
    {% endif %}
  {% endfor %}
</ul>

### Rejected SLIPs ###
<ul class="post-list">
  {% for post in site.categories.rejected %}
    {% if post.layout == 'slip' %}
      <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a> <span class="date">( {{ post.date | date: "%b %Y" }} )</span></li>
    {% endif %}
  {% endfor %}
</ul>

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

