---
layout: inner-page
title: Guides and Overviews
#languages: [ja, zh-cn, es]
---

{% for category in site.data.overviews %}
  <h2>{{ category.category }}</h2>
  <div class="card-group">
    {% for overview in category.overviews %}
      <div class="content-card">
        <a href="{{ overview.url }}"><h3>{% if overview.icon %}<i class="fa fa-{{ overview.icon }}" aria-hidden="true"></i> {% endif %}{{ overview.title }}</h3></a>
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
    {% endfor %}  
  </div>    
{% endfor %}
