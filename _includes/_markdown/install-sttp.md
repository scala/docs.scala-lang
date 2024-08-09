{% altDetails install-info-box 'Getting sttp' %}

{% tabs sttp-install-methods class=tabs-build-tool%}
{% tab 'Scala CLI' %}
You can require the entire toolkit in a single line:
```scala
//> using toolkit latest
```

Alternatively, you can require just a specific version of sttp:
```scala
//> using dep com.softwaremill.sttp.client4::core:4.0.0-M6
```
{% endtab %}
{% tab 'sbt' %}
In your build.sbt file, you can add a dependency on the Toolkit:
```scala
lazy val example = project.in(file("."))
  .settings(
    scalaVersion := "3.3.3",
    libraryDependencies += "org.scala-lang" %% "toolkit" % "0.1.7"
  )
```

Alternatively, you can require just a specific version of sttp:
```scala
libraryDependencies += "com.softwaremill.sttp.client4" %% "core" % "4.0.0-M6"
```
{% endtab %}
{% tab 'Mill' %}
In your build.sc file, you can add a dependency on the Toolkit:
```scala
object example extends ScalaModule {
  def scalaVersion = "3.3.3"
  def ivyDeps =
    Agg(
      ivy"org.scala-lang::toolkit:0.1.7"
    )
}
```
Alternatively, you can require just a specific version of sttp:
```scala
ivy"com.softwaremill.sttp.client4::core:4.0.0-M6"
```
{% endtab %}
{% endtabs %}
{% endaltDetails %}
