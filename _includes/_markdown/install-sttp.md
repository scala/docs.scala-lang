{% altDetails install-info-box 'Getting sttp' %}

{% tabs sttp-install-methods class=tabs-build-tool%}
{% tab 'Scala CLI' %}
You can require the entire toolkit in a single line:
```scala
//> using toolkit "latest"
```

Alternatively, you can require a specific version of sttp:
```scala
//> using dep "com.softwaremill.sttp.client4::core:4.0.0-M1"
```
{% endtab %}
{% tab 'sbt' %}
In your build.sbt file, you can add the dependency to the sttp library:
```scala
lazy val example = project.in(file("example"))
  .settings(
    scalaVersion := "3.2.2",
    libraryDependencies += "com.softwaremill.sttp.client4" %% "core" % "4.0.0-M1"
  )
```
{% endtab %}
{% tab 'Mill' %}
In your build.sc file, you can add the dependency to the sttp library:
```scala
object example extends ScalaModule {
  def scalaVersion = "3.2.2"
  def ivyDeps =
    Agg(
      ivy"com.softwaremill.sttp.client4::core:4.0.0-M1"
    )
}
```
{% endtab %}
{% endtabs %}
{% endaltDetails %}
