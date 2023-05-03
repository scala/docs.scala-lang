{% altDetails require-info-box 'Getting OS-Lib' %}

{% tabs oslib-install class=tabs-build-tool %}
{% tab 'Scala CLI' %}
You can require the entire toolkit in a single line:
```scala
//> using toolkit "latest"
```

Alternatively, you can require just a specific version of OS-Lib:
```scala
//> using dep "com.lihaoyi::os-lib:0.9.1"
```
{% endtab %}
{% tab 'sbt' %}
In our `build.sbt` file, we add the dependency on OS-Lib:
```scala
libraryDependencies += "com.lihaoyi" %% "os-lib" % "0.9.1"
```
{% endtab %}
{% tab 'Mill' %}
In our `build.sc` file, we add the dependency on OS-Lib:
```scala
def ivyDeps = Agg(
  ivy"com.lihaoyi::os-lib:0.9.1"
)
```
{% endtab %}
{% endtabs %}
{% endaltDetails %}
