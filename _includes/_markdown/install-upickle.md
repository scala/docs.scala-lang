UPickle is the library for working with JSONs in Scala Toolkit.

{% altDetails install-info-box 'Installing upickle' %}

## Installing upickle

  {% tabs upickle-install-methods %}
    {% tab 'Scala CLI' %}
In Scala CLI, we can install the entire toolkit in a single line:
```scala
//> using toolkit
```

Alternatively, we can install a specific version of upickle:
```scala
//> using lib "com.lihaoyi::upickle:1.6.0"
```
    {% endtab %}
    {% tab 'sbt' %}
In our build.sbt file, we add the dependency to the upickle library:
```scala
lazy val example = project.in(file("example"))
  .settings(
    scalaVersion := "3.2.1",
    libraryDependencies += "com.lihaoyi" %% "upickle" % "1.6.0"
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
      ivy"com.lihaoyi::upickle:1.6.0"
    )
}
```
    {% endtab %}
  {% endtabs %}
{% endaltDetails %}
