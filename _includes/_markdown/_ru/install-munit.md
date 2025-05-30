{% altDetails install-info-box 'Установка MUnit' %}

{% tabs munit-unit-test-1 class=tabs-build-tool %}
{% tab 'Scala CLI' %}

Вы можете запросить весь набор инструментов одной командой:

```scala
//> using toolkit latest
```

MUnit, будучи тестовым фреймворком, доступен только в тестовых файлах:
файлах в каталоге `test` или тех, которые имеют расширение `.test.scala`.
Подробнее о тестовой области (test scope) см. [в документации Scala CLI](https://scala-cli.virtuslab.org/docs/commands/test/).

В качестве альтернативы вы можете запросить только определенную версию MUnit:

```scala
//> using dep org.scalameta::munit:1.1.0
```

{% endtab %}

{% tab 'sbt' %}

В файле `build.sbt` вы можете добавить зависимость от toolkit-test:

```scala
lazy val example = project.in(file("."))
  .settings(
    scalaVersion := "3.4.2",
    libraryDependencies += "org.scala-lang" %% "toolkit-test" % "0.7.0" % Test
  )
```

Здесь конфигурация `Test` означает, что зависимость используется только исходными файлами в `src/test`.

В качестве альтернативы вы можете запросить только определенную версию MUnit:

```scala
libraryDependencies += "org.scalameta" %% "munit" % "1.1.0" % Test
```
{% endtab %}

{% tab 'Mill' %}

В файле `build.sc` вы можете добавить объект `test`, расширяющий `Tests` и `TestModule.Munit`:

```scala
object example extends ScalaModule {
  def scalaVersion = "3.4.2"
  object test extends Tests with TestModule.Munit {
    def ivyDeps =
      Agg(
        ivy"org.scala-lang::toolkit-test:0.7.0"
      )
  }
}
```

В качестве альтернативы вы можете запросить только определенную версию MUnit:

```scala
ivy"org.scalameta::munit:1.1.0"
```
{% endtab %}
{% endtabs %}
{% endaltDetails %}