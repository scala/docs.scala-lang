---
layout: default
type: sip
title: Completed SIP list
---

### Completed SIPs ###
<ul class="post-list">
  {% for post in site.categories.completed %}
    <li><a href="/scala-docs/sips/{{ post.url }}">{{ post.title }}</a> <span class="date">( {{ post.date | date: "%b %Y" }} )</span></li>
  {% endfor %}      
</ul>

### Rejected SIPs ###
<ul class="post-list">
  {% for post in site.categories.rejected %}
    <li><a href="/scala-docs/sips/{{ post.url }}">{{ post.title }}</a> <span class="date">( {{ post.date | date: "%b %Y" }} )</span></li>
  {% endfor %}      
</ul>
