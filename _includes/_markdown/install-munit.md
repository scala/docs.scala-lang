MUnit is the testing library of the Scala Toolkit.

{% altDetails install-info-box 'Installing MUnit' %}

## Installing MUnit

{% tabs munit-unit-test-1 %}
{% tab 'Scala CLI' %}
In Scala CLI, you can install the entire toolkit in a single line:
```scala
//> using toolkit "latest"
```

Alternatively, you can install a specific version of MUnit:
```scala
//> using lib "org.scalameta::munit:1.0.0-M6"
```
{% endtab %}
{% tab 'sbt' %}
In your build.sbt file, you can add the dependency to the MUnit library:
```scala
lazy val example = project.in(file("example"))
  .settings(
    scalaVersion := "3.2.1",
    libraryDependencies += "org.scalameta" %% "munit" % "1.0.0-M6" % Test
  )
```
Here the `Test` configuration means that this dependency is only used by the source files in the `example/src/test` directory.
This is where you can put your test suites.
{% endtab %}
{% tab 'Mill' %}
In your build.sc file, you can add a `test` object extending `Tests` and `TestModule.Munit`:
```scala
object example extends ScalaModule {
  def scalaVersion = "3.2.1"
  object test extends Tests with TestModule.Munit {
    def ivyDeps =
      Agg(
        ivy"org.scalameta::munit::1.0.0-M6"
      )
  }
}
```
{% endtab %}
{% endtabs %}
{% endaltDetails %}
