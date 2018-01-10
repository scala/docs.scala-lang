---
layout: sips
title: SIP Meeting Minutes
---

This page hosts all the meeting notes (minutes) of the SIP meetings, starting
from July 2016.

### Minutes ###
<ul class="minute-list">
  {% assign sips = site.sips | sort: 'date' | reverse %}
  {% for pg in sips %}
    {% if pg.partof == 'minutes' %}
      <li><a href="{{ site.baseurl }}{{ pg.url }}">{{ pg.title }}</a></li>
    {% endif %}
  {% endfor %}
</ul>
