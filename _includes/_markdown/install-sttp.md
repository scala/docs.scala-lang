{% altDetails install-info-box 'Installing sttp' %}

{% tabs sttp-install-methods class=tabs-build-tool%}
{% tab 'Scala CLI' %}
You can install the entire toolkit in a single line:
```scala
//> using toolkit "latest"
```

Alternatively, you can install a specific version of sttp:
```scala
//> using lib "com.softwaremill.sttp.client3::core:3.8.5"
```
{% endtab %}
{% tab 'sbt' %}
In your build.sbt file, you can add the dependency to the sttp library:
```scala
lazy val example = project.in(file("example"))
  .settings(
    scalaVersion := "3.2.1",
    libraryDependencies += "com.softwaremill.sttp.client3" %% "core" % "3.8.5"
  )
```
{% endtab %}
{% tab 'Mill' %}
In your build.sc file, you can add the dependency to the sttp library:
```scala
object example extends ScalaModule {
  def scalaVersion = "3.2.1"
  def ivyDeps =
    Agg(
      ivy"com.softwaremill.sttp.client3::core:3.8.5"
    )
}
```
{% endtab %}
{% endtabs %}
{% endaltDetails %}
