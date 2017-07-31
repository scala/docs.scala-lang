---
layout: singlepage-overview
title: Tutorials and FAQs

permalink: /tutorials/index.html
---

Here you'll find a list of all tutorial series hosted on
[docs.scala-lang.org](http://docs.scala-lang.org) as well as a series of
frequently asked questions and their answers, graciously provided by Daniel
Sobral.

<div class="two-columns">
  <div class="first">
    <h2>Tutorials</h2>
    <ul>
      <li><a href="/getting-started.html">Getting Started series</a></li>
      <li><a href="/tutorials/scala-for-java-programmers.html">Scala for Java Programmers</a></li>
      <li><a href="/tour/tour-of-scala.html">The Tour of Scala</a></li>
      <li><a href="/tutorials/scala-with-maven.html">Scala with Maven</a></li>
    </ul>
  </div>
  <div class="second">
    <h2>Sala FAQs</h2>
    <ul>
      {% assign overviews = site.overviews | sort: 'num' %}
      {% for pg in overviews %}
        {% if pg.partof == "FAQ" %}
        <li><a href="{{ pg.url }}">{{ pg.title }}</a></li>
        {% endif %}
      {% endfor %}
    </ul>
  </div>
</div>
