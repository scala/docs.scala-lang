---
tabId: osx
tabLabel: macOS
language: ja
---
<div class="scala-in-action-content">
  <div class="scala-in-action-code">
    <div class="wrap">
      <div class="scala-text scala-text-large">
        {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-brew %}
        {% assign homebrewAlt = "または、Homebrewを使用しない場合は" %}
        {% capture homebrewDetail %}
        <div class="wrap">
          {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-default %}
        </div>
        {% endcapture %}
        {% include alt-details.html
          title=homebrewAlt
          detail=homebrewDetail
          targetId='macos-get-started-alt'
          extraClasses='scala-text-large alt-details-detail'
        %}
      </div>
    </div>
  </div>
</div>
