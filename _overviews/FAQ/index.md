---
layout: singlepage-overview
title: Scala FAQs

discourse: true

permalink: /tutorials/FAQ/index.html
---

A collection of frequently asked questions and their answers! Graciously
provided by Daniel Sobral, adapted from his StackOverflow posts.

## FAQs

{% assign overviews = site.overviews | sort: 'num' %}
<ul>
{% for overview in overviews %}
  {% if overview.partof == "FAQ" %}
    <li><a href="{{ site.baseurl }}{{ overview.url }}">{{ overview.title }}</a></li>
  {% endif %}
{% endfor %}
</ul>
