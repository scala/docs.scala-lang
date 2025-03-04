{% altDetails require-info-box 'Установка Cask' %}

{% tabs cask-install class=tabs-build-tool %}

{% tab 'Scala CLI' %}

Вы можете объявить зависимость от Cask с помощью следующей директивы `using`:

```scala
//> using dep com.lihaoyi::cask::0.10.2
```

{% endtab %}

{% tab 'sbt' %}

В файле `build.sbt` вы можете добавить зависимость от Cask:

```scala
lazy val example = project.in(file("example"))
  .settings(
    scalaVersion := "3.4.2",
    libraryDependencies += "com.lihaoyi" %% "cask" % "0.10.2",
    fork := true
  )
```

{% endtab %}

{% tab 'Mill' %}

В файле `build.sc` вы можете добавить зависимость от Cask:

```scala
object example extends RootModule with ScalaModule {
  def scalaVersion = "3.4.2"
  def ivyDeps = Agg(
    ivy"com.lihaoyi::cask::0.10.2"
  )
}
```
{% endtab %}

{% endtabs %}
{% endaltDetails %}
