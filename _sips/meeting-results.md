---
layout: sips
title: SIP Meeting Results
redirect_from: /sips/minutes-list.html
---

This page lists the results of every SIP meeting, starting from July 2016.

### Meetings ###

<ul class="minute-list">
  {% assign sips = site.sips | sort: 'date' | reverse %}
  {% for page in sips %}
    {% if page.partof == 'results' %}
      <li><a href="{{ site.baseurl }}{{ page.url }}">{{ page.date  | date_to_long_string }}</a></li>
    {% endif %}
  {% endfor %}
</ul>

### Meeting Minutes ###

Before 2022, we hosted the complete meeting notes (minutes). Some
meetings were also [recorded on YouTube](https://www.youtube.com/channel/UCn_8OeZlf5S6sqCqntAvaIw/videos?view=2&sort=dd&shelf_id=1&live_view=502).

<ul class="minute-list">
  {% assign sips = site.sips | sort: 'date' | reverse %}
  {% for pg in sips %}
    {% if pg.partof == 'minutes' %}
      <li><a href="{{ site.baseurl }}{{ pg.url }}">{{ pg.title }}</a></li>
    {% endif %}
  {% endfor %}
</ul>
