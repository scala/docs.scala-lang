---
layout: sips
title: List of All SIPs

redirect_from: "/sips/sip-list.html"
redirect_from: "/sips/pending/index.html"
---


## Pending SIPs

<div class="pending">
  <ul>
  {% assign sips = site.sips | sort: date | reverse %}
  {% for sip in sips %}
   {% if sip.vote-status == "under-review" or sip.vote-status == "pending" or sip.vote-status == "under-revision" %}
     <li>
      <strong><a href="{{ sip.url }}">{{ sip.title }}</a></strong>
      <div class="date">{{ sip.date | date: '%B %Y' }}</div>
      <div class="tag" style="background-color: {{ site.data.sip-data[sip.vote-status].color }}">{{ site.data.sip-data[sip.vote-status].text }}</div>
     </li>
   {% endif %}
  {% endfor %}
  </ul>
</div>

<div class="other-sips">
  <div class="completed">
    <h2>Completed</h2>
    <ul>
    {% for sip in sips %}
     {% if sip.vote-status == "complete" or sip.vote-status == "accepted" %}
       <li>
        <strong><a href="{{ sip.url }}">{{ sip.title }}</a></strong>
        <div class="date">{{ sip.date | date: '%B %Y' }}</div>
        <div class="tag" style="background-color: {{ site.data.sip-data[sip.vote-status].color }}">{{ site.data.sip-data[sip.vote-status].text }}</div>
       </li>
     {% endif %}
    {% endfor %}    
    </ul>
  </div>
  <div class="dormant">
    <h2>Dormant</h2>
    <ul>
    {% for sip in sips %}
     {% if sip.vote-status == "dormant" %}
       <li>
        <strong><a href="{{ sip.url }}">{{ sip.title }}</a></strong>
        <div class="date">{{ sip.date | date: '%B %Y' }}</div>
        <div class="tag" style="background-color: {{ site.data.sip-data[sip.vote-status].color }}">{{ site.data.sip-data[sip.vote-status].text }}</div>
       </li>
     {% endif %}
    {% endfor %}
    </ul>
  </div>
  <div class="rejected">
    <h2>Rejected</h2>
    <ul>
    {% for sip in sips %}
     {% if sip.vote-status == "rejected" %}
       <li>
        <strong><a href="{{ sip.url }}">{{ sip.title }}</a></strong>
        <div class="date">{{ sip.date | date: '%B %Y' }}</div>
        <div class="tag" style="background-color: {{ site.data.sip-data[sip.vote-status].color }}">{{ site.data.sip-data[sip.vote-status].text }}</div>
       </li>
     {% endif %}
    {% endfor %}    
    </ul>    
  </div>
</div>
