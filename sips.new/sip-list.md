---
layout: sip
title: List of SIPs
---

### Completed SIPs ###
<ul class="post-list">
  {% for post in site.categories.completed %}
    <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a> <span class="date">( {{ post.date | date: "%b %Y" }} )</span></li>
  {% endfor %}      
</ul>

### Rejected SIPs ###
<ul class="post-list">
  {% for post in site.categories.rejected %}
    <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a> <span class="date">( {{ post.date | date: "%b %Y" }} )</span></li>
  {% endfor %}      
</ul>
