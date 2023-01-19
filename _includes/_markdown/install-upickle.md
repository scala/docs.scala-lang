uPickle is the JSON serialization library of the Scala Toolkit, it includes uJson, a Scala representation of the JSON format.

{% altDetails install-info-box 'Installing upickle' %}

## Installing upickle

{% tabs upickle-install-methods %}
{% tab 'Scala CLI' %}
Using Scala CLI, you can install the entire toolkit in a single line:
```scala
//> using toolkit
```

Alternatively, you can install a specific version of upickle:
```scala
//> using lib "com.lihaoyi::upickle:1.6.0"
```
{% endtab %}
{% tab 'sbt' %}
In your build.sbt file, you can add the dependency to the upickle library:
```scala
lazy val example = project.in(file("example"))
  .settings(
    scalaVersion := "3.2.1",
    libraryDependencies += "com.lihaoyi" %% "upickle" % "1.6.0"
  )
```
{% endtab %}
{% tab 'Mill' %}
In your build.sc file, you can add the dependency to the upickle library:
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
