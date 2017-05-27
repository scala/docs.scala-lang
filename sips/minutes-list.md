---
layout: inner-page-no-masthead
title: Minutes
---

This page hosts all the meeting notes (minutes) of the SIP meetings, starting
from July 2016.

### Minutes ###
<ul class="post-list">
  {% for post in site.categories.minutes %}
    {% if post.layout == 'sip-landing' %}
      <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a> <span class="date">( {{ post.date | date: "%b %Y" }} )</span></li>
    {% endif %}
  {% endfor %}
</ul>
