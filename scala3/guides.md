---
layout: inner-page-parent
title: Guides on Scala 3

guides:
  - title: "Migration from Scala 2 to Scala 3"
    icon: suitcase
    url: "https://scalacenter.github.io/scala-3-migration-guide"
    description: "Everything you need to know about compatibility and migration to Scala 3."
  - title: Macros
    by: Nicolas Stucki
    icon: magic
    url: "/scala3/guides/macros"
    description: "A detailed tutorial to cover all the features involved in writing macros in Scala 3."
    label-text: feature
  - title: An Overview of TASTy
    by: Alvin Alexander
    icon: birthday-cake
    url: "/scala3/guides/tasty-overview.html"
    description: "An overview over the TASTy format aimed at end-users of the Scala language."
---

<section class="full-width">
	<div class="wrap">
    <div class="content-primary overviews">
      <div class="inner-box toc-context">
        <h2>Overviews and Guides</h2>
        <p>
          Detailed guides about the Scala 3 language and its features.
        </p>
        <div class="card-group">
          {% for overview in page.guides %}
          <div class="white-card">
            <div class="card-wrap">
              <div class="card-header">
                {% if overview.icon %}
                <div class="card-avatar">
                  <div class="icon"><i class="fa fa-{{ overview.icon }}" aria-hidden="true"></i></div>
                </div>
                {% endif %}
                <a href="{{ overview.url }}"><h3>{{ overview.title }}</h3></a>
              </div>
              <div class="card-content">
                {% if overview.label-text %}<div class="tag" {% if overview.label-color %}style ="background: {{ overview.label-color }}"{% endif %}>{{ overview.label-text }}</div>{% endif %}
                {% if overview.by %}<div class="by">By {{ overview.by }}</div>{% endif %}
                {% if overview.description %}<p>{{ overview.description }}</p>{% endif %}
                {% if overview.subdocs %}
                <strong>Contents</strong>
                <ul class="subdocs">
                  {% for doc in overview.subdocs %}
                  <li><a href="{{ doc.url }}">{{ doc.title }}</a></li>
                  {% endfor %}
                </ul>
                {% endif %}
              </div>
            </div>
            <div class="card-footer">
              <a class="go-btn" href="{{ overview.url }}"><i class="fa fa-arrow-right" aria-hidden="true"></i> Read</a>
            </div>
          </div>
          {% endfor %}
        </div>
      </div>
    </div>
  </div>
</section>
