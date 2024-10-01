{% altDetails require-info-box 'Getting Cask' %}

{% tabs cask-install class=tabs-build-tool %}

{% tab 'Scala CLI' %}
You can declare a dependency on Cask with the following `using` directive:
```scala
//> using dep "com.lihaoyi::cask::0.9.2"
```
{% endtab %}

{% tab 'sbt' %}
In your `build.sbt`, you can add a dependency on Cask:
```scala
lazy val example = project.in(file("example"))
  .settings(
    scalaVersion := "3.4.2",
    libraryDependencies += "com.lihaoyi" %% "cask" % "0.9.2",
    fork := true
  )
```
{% endtab %}

{% tab 'Mill' %}
In your `build.sc`, you can add a dependency on Cask:
```scala
object example extends RootModule with ScalaModule {
  def scalaVersion = "3.3.3"
  def ivyDeps = Agg(
    ivy"com.lihaoyi::cask::0.9.2"
  )
}
```
{% endtab %}

{% endtabs %}
{% endaltDetails %}
