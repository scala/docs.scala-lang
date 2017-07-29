---
layout: overviews
title: Guides and Overviews
#languages: [ja, zh-cn, es]
permalink: /overviews/:title.html
---

{% for category in site.data.overviews %}
  <h2>{{ category.category }}</h2>
  {% if category.description %}<p>{{ category.description }}</p>{% endif %}
  <div class="card-group">
    {% for overview in category.overviews %}
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
          <div class="expand-btn"><i class="fa fa-plus" aria-hidden="true"></i> Expand</div>
          <div class="go-btn" style="display: none;" href="{{ overview.url }}"><i class="fa fa-arrow-right" aria-hidden="true"></i> Read</div>          
        </div>        
      </div>
    {% endfor %}  
  </div>    
{% endfor %}
