---
layout: sips
title: List of All SIPs

redirect_from:
  - "/sips/sip-list.html"
  - "/sips/pending/index.html"
---

{% assign sips = site.sips | sort: 'number' | reverse %}
{% assign sipData = site.data.sip-data %}

## Pending SIPs

For proposals that are at the design or implementation stage, and that are actively
discussed by the committee and the proposals' authors, please
refer to the [GitHub PR queue](https://github.com/scala/improvement-proposals/pulls?q=is%3Apr+is%3Aopen).

## Completed SIPs

Proposals that have been implemented in the compiler and that are available as a stable
feature of the compiler (shipped), or that will be available in the next minor release
of the compiler (accepted). Click on a proposal to read its content.

<div class="sip-list">
  <ul>
  {% for sip in sips %}
   {% if sip.stage == "completed" and sip.status == "shipped" %}
     <li class="no-fragmentation">
      <strong><a href="{{ sip.url }}">{{ sip.kind | default: 'SIP' }}-{{ sip.number }} - {{ sip.title }}</a></strong>
      <div class="tag" style="background-color: {{ sipData[sip.status].color }}">{{ sipData[sip.status].text }}</div>
     </li>
   {% endif %}
  {% endfor %}
  </ul>
</div>

## Rejected SIPs

Please refer to [GitHub](https://github.com/scala/improvement-proposals/pulls?q=is%3Apr+label%3Astatus%3Arejected) for proposals that have been rejected by the committee and the corresponding discussions.

## Withdrawn SIPs

Please refer to [GitHub](https://github.com/scala/improvement-proposals/pulls?q=is%3Apr+label%3Astatus%3Awithdrawn) for proposals that have been withdrawn
and the corresponding discussions.

## Pre-SIP Discussions

You can find so-called “pre-SIP discussions” in the Scala Contributors forum, under
the category [Scala Improvement Process](https://contributors.scala-lang.org/c/sip/13).
The goal of pre-SIP discussions is to gather initial community feedback and support.