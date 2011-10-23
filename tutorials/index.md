---
layout: index
title: Tutorials
---

<div class="span8">

	<div class="box">
      <h2>New to Scala?</h2>
      <h3>Tutorials geared for people coming...</h3>
	  <ul>
		<li><a href="{{ site.baseurl }}/tutorials/scala-for-java-programmers.html">...from Java</a> <span class="label success">Available</span></li>
		<li><a href="#">...from Ruby</a> <span class="label warning">In Progress</span></li>
		<li><a href="#">...from Python</a> <span class="label warning">In Progress</span></li>		
 	  </ul>
	</div>
	
</div>

<div class="span8">
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

