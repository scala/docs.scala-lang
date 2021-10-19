---
layout: inner-page-parent
title: Tutorials

tutorials:
- title: "Getting Started with Scala in IntelliJ"
  url: "/getting-started/intellij-track/getting-started-with-scala-in-intellij.html"
  description: "Create a Scala project using IntelliJ IDE."
  icon: rocket
- title: "Getting Started with Scala and sbt"
  url: "/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html"
  description: "Create a Scala project using sbt and the command-line."
  icon: rocket
- title: "Scala for Java Programmers"
  url: "/tutorials/scala-for-java-programmers.html"
  description: "Quick introduction to the Scala language and compiler for people who already have some experience in Java."
  icon: coffee
- title: "Scala on Android"
  url: "/tutorials/scala-on-android.html"
  description: "Create an Android app in Scala."
  icon: robot
- title: "Scala with Maven"
  url: "/tutorials/scala-with-maven.html"
  description: "Create a Scala project with Maven."
  icon: code
---

<section class="full-width">
	<div class="wrap">
    <div class="content-primary overviews">
      <div class="inner-box toc-context">
        <h2>Tutorials</h2>
        <p>
          Tutorials take you by the hand through a series of steps to create Scala applications.
        </p>
        <div class="card-group">
          {% for tutorial in page.tutorials %}
          <div class="white-card">
            <div class="card-wrap">
              <div class="card-header">
                {% if tutorial.icon %}
                <div class="card-avatar">
                  <div class="icon"><i class="fa fa-{{ tutorial.icon }}" aria-hidden="true"></i></div>
                </div>
                {% endif %}
                <a href="{{ tutorial.url }}"><h3>{{ tutorial.title }}</h3></a>
              </div>
              <div class="card-content">
                {% if tutorial.by %}<div class="by">By {{ tutorial.by }}</div>{% endif %}
                {% if tutorial.description %}<p>{{ tutorial.description }}</p>{% endif %}
              </div>
            </div>
            <div class="card-footer">
              <a class="go-btn" href="{{ tutorial.url }}"><i class="fa fa-arrow-right" aria-hidden="true"></i> Read</a>
            </div>
          </div>
          {% endfor %}
        </div>
      </div>
    </div>
  </div>
</section>
