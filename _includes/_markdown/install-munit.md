{% altDetails install-info-box 'Getting MUnit' %}

{% tabs munit-unit-test-1 class=tabs-build-tool %}
{% tab 'Scala CLI' %}
You can require the entire toolkit in a single line:
```scala
//> using toolkit latest
```
MUnit, being a testing framework, is only available in test files: files in a `test` directory or ones that have the `.test.scala` extension. Refer to the [Scala CLI documentation](https://scala-cli.virtuslab.org/docs/commands/test/) to learn more about the test scope.

Alternatively, you can require just a specific version of MUnit:
```scala
//> using dep org.scalameta::munit:1.0.0-M7
```
{% endtab %}
{% tab 'sbt' %}
In your build.sbt file, you can add the dependency on toolkit-test:
```scala
lazy val example = project.in(file("."))
  .settings(
    scalaVersion := "3.3.3",
    libraryDependencies += "org.scala-lang" %% "toolkit-test" % "0.1.7" % Test
  )
```

Here the `Test` configuration means that the dependency is only used by the source files in `src/test`.

Alternatively, you can require just a specific version of MUnit:
```scala
libraryDependencies += "org.scalameta" %% "munit" % "1.0.0-M7" % Test
```
{% endtab %}
{% tab 'Mill' %}
In your build.sc file, you can add a `test` object extending `Tests` and `TestModule.Munit`:
```scala
object example extends ScalaModule {
  def scalaVersion = "3.3.3"
  object test extends Tests with TestModule.Munit {
    def ivyDeps =
      Agg(
        ivy"org.scala-lang::toolkit-test:0.1.7"
      )
  }
}
```

Alternatively, you can require just a specific version of MUnit:
```scala
ivy"org.scalameta::munit:1.0.0-M7"
```
{% endtab %}
{% endtabs %}
{% endaltDetails %}
