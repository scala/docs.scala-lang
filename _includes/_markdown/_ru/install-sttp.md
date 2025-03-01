
{% altDetails install-info-box 'Установка sttp' %}

{% tabs sttp-install-methods class=tabs-build-tool%}

{% tab 'Scala CLI' %}

Вы можете запросить весь набор инструментов одной командой:

```scala
//> using toolkit latest
```

В качестве альтернативы вы можете запросить только определенную версию sttp:

```scala
//> using dep com.softwaremill.sttp.client4::core:4.0.0-RC1
```

{% endtab %}

{% tab 'sbt' %}

В файле `build.sbt` вы можете добавить зависимость от `toolkit`:

```scala
lazy val example = project.in(file("."))
  .settings(
    scalaVersion := "3.4.2",
    libraryDependencies += "org.scala-lang" %% "toolkit" % "0.7.0"
  )
```

В качестве альтернативы вы можете запросить только определенную версию sttp:

```scala
libraryDependencies += "com.softwaremill.sttp.client4" %% "core" % "4.0.0-RC1"
```

{% endtab %}

{% tab 'Mill' %}

В файле `build.sc` вы можете добавить зависимость от `toolkit`:

```scala
object example extends ScalaModule {
  def scalaVersion = "3.4.2"
  def ivyDeps =
    Agg(
      ivy"org.scala-lang::toolkit:0.7.0"
    )
}
```

В качестве альтернативы вы можете запросить только определенную версию sttp:

```scala
ivy"com.softwaremill.sttp.client4::core:4.0.0-RC1"
```

{% endtab %}
{% endtabs %}
{% endaltDetails %}
