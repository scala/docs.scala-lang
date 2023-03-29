sttp is the HTTP client library of the Scala Toolkit.

{% altDetails install-info-box 'Installing sttp' %}

## Installing sttp

  {% tabs sttp-install-methods %}
    {% tab 'Scala CLI' %}
In Scala CLI, we can install the entire toolkit in a single line:
```scala
//> using toolkit
```

Alternatively, we can install a specific version of sttp:
```scala
//> using lib "com.softwaremill.sttp.client3::core:3.8.5"
```
    {% endtab %}
    {% tab 'sbt' %}
In our build.sbt file, we add the dependency to the sttp library:
```scala
lazy val example = project.in(file("example"))
  .settings(
    scalaVersion := "3.2.1",
    libraryDependencies += "com.softwaremill.sttp.client3" %% "core" % "3.8.5"
  )
```
    {% endtab %}
    {% tab 'Mill' %}
In your build.sc file, we add the artifact to `ivyDeps`:
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
