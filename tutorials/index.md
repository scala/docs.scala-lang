---
layout: index
title: Tutorials
---

<div class="span7">

	<div class="box">
	  <p><strong>Holy guacamole! This is a warning!</strong> Best check yo self, you’re not looking too good. Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</p>
	</div>

  <div class="page-header-index">
    <h1>Scala...</h1>
  </div>

  <ul>
    <li><a href="{{ site.baseurl }}/tutorials/scala-for-java-programmers.html">...From Java</a></li>
  </ul>
  
</div>

<div class="span9">
  <div class="page-header-index">
    <h1>A Tour of Scala <br /></h1><p class="under">Bite-size pieces of the essentials...</p>
  </div>
  {% for pg in site.pages %}
    {% if pg.tutorial == "scala-tour" and pg.outof %}
      {% assign totalPages = pg.outof %}  
    {% endif %}
  {% endfor %}

  {% if totalPages %}
    <ul>
    {% for i in (1..totalPages) %}
      {% for pg in site.pages %}
        {% if pg.tutorial == "scala-tour" and pg.num and pg.num == i %}
          <li class="tour-of-scala"><a href="{{ pg.url }}">{{ pg.title }}</a></li> 
        {% endif %}
      {% endfor %}
    {% endfor %}
    </ul>
  {% else %} **ERROR**. Couldn't find the total number of pages in this set of tutorial articles. Have you declared the `outof` tag in your YAML front matter?
  {% endif %}
</div>

