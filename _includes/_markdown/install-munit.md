{% altDetails install-info-box 'Getting MUnit' %}

{% tabs munit-unit-test-1 class=tabs-build-tool %}
{% tab 'Scala CLI' %}
You can require the entire toolkit in a single line:
```scala
//> using toolkit "latest"
```

Alternatively, you can require a specific version of MUnit:
```scala
//> using dep "org.scalameta::munit:1.0.0-M7"
```
{% endtab %}
{% tab 'sbt' %}
In your build.sbt file, you can add the dependency to the MUnit library:
```scala
lazy val example = project.in(file("example"))
  .settings(
    scalaVersion := "3.2.2",
    libraryDependencies += "org.scalameta" %% "munit" % "1.0.0-M7" % Test
  )
```
Here the `Test` configuration means that this dependency is only used by the source files in the `example/src/test` directory.
This is where you can put your test suites.
{% endtab %}
{% tab 'Mill' %}
In your build.sc file, you can add a `test` object extending `Tests` and `TestModule.Munit`:
```scala
object example extends ScalaModule {
  def scalaVersion = "3.2.2"
  object test extends Tests with TestModule.Munit {
    def ivyDeps =
      Agg(
        ivy"org.scalameta::munit::1.0.0-M7"
      )
  }
}
```
{% endtab %}
{% endtabs %}
{% endaltDetails %}