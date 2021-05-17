---
layout: inner-page-parent
title: Scala 3 のガイド
language: ja
scala3: true


guides:
  - title: "Scala 2 から Scala 3 への移行"
    icon: suitcase
    url: "https://scalacenter.github.io/scala-3-migration-guide"
    description: "Scala 3 との互換性と移行について知っておくべきことすべて"
  - title: マクロ
    by: Nicolas Stucki
    icon: magic
    url: "/scala3/guides/macros"
    description: "Scala 3 のマクロの書き方に関係する全ての機能をカバーする詳しいチュートリアル"
    label-text: feature
  - title: TASTyの概要
    by: Alvin Alexander
    icon: birthday-cake
    url: "/scala3/guides/tasty-overview.html"
    description: "Scala のエンドユーザー向けの TASTy のフォーマットの概要"
---

<section class="full-width">
	<div class="wrap">
    <div class="content-primary overviews">
      <div class="inner-box toc-context">
        <h2>概要とガイド</h2>
        <p>
          Scala 3 とその機能についての詳しいガイド
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


