---
layout: inner-page-parent
title: Guides on Scala 3
language: zh-cn
scala3: true

guides:
  - title: "从 Scala 2 到 Scala 3 的迁移"
    icon: suitcase
    url: "/scala3/guides/migration/compatibility-intro.html"
    description: "迁移至 Scala 3 的兼容性须知"
  - title: 宏
    by: Nicolas Stucki
    icon: magic
    url: "/scala3/guides/macros"
    description: "覆盖 Scala 3 中涉及到编写宏的所有特性的详细导引"
    label-text: 特性
  - title: TASTy 概览
    by: Alvin Alexander
    icon: birthday-cake
    url: "/scala3/guides/tasty-overview.html"
    description: "针对 Scala 语言最终用户的 TASTy 格式概览"
  - title: "贡献指南"
    by: Jamie Thompson, Anatolii Kmetiuk
    icon: cogs
    url: "/scala3/guides/contribution/contribution-intro.html"
    description: "Scala 3 编译器指南及如何贡献代码"
  - title: Scaladoc
    by: Krzysztof Romanowski, Aleksander Boruch-Gruszecki, Andrzej Ratajczak, Kacper Korban, Filip Zybała
    icon: book
    url: "/scala3/guides/scaladoc"
    description: "Scala 的 API 文档生成工具"
---

<section class="full-width">
	<div class="wrap">
    <div class="content-primary overviews">
      <div class="inner-box toc-context">
        <h2>概览与导引</h2>
        <p>
          Scala 3 语言及其特性的详细导引
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
