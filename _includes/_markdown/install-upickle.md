{% altDetails install-info-box 'Getting upickle' %}

{% tabs upickle-install-methods class=tabs-build-tool %}
{% tab 'Scala CLI' %}
Using Scala CLI, you can require the entire toolkit in a single line:
```scala
//> using toolkit latest
```

Alternatively, you can require just a specific version of UPickle:
```scala
//> using dep com.lihaoyi::upickle:3.1.0
```
{% endtab %}
{% tab 'sbt' %}
In your build.sbt file, you can add the dependency on the Toolkit:
```scala
lazy val example = project.in(file("."))
  .settings(
    scalaVersion := "3.3.3",
    libraryDependencies += "org.scala-lang" %% "toolkit" % "0.1.7"
  )
```
Alternatively, you can require just a specific version of UPickle:
```scala
libraryDependencies += "com.lihaoyi" %% "upickle" % "3.1.0"
```
{% endtab %}
{% tab 'Mill' %}
In your build.sc file, you can add the dependency to the upickle library:
```scala
object example extends ScalaModule {
  def scalaVersion = "3.3.3"
  def ivyDeps =
    Agg(
      ivy"org.scala-lang::toolkit:0.1.7"
    )
}
```
Alternatively, you can require just a specific version of UPickle:
```scala
ivy"com.lihaoyi::upickle:3.1.0"
```
{% endtab %}
{% endtabs %}
{% endaltDetails %}
