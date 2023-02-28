OS-Lib is a library for manipulating files and processes. It is part of the Scala Toolkit.

{% altDetails require-info-box 'Requiring OS-Lib' %}

## Requiring OS-Lib

  {% tabs oslib--1 %}
    {% tab 'Scala CLI' %}
In Scala CLI, we can require the entire toolkit in a single line:
```scala
//> using toolkit
```

Alternatively, we can require just a specific version of OS-Lib:
```scala
//> using dep "com.lihaoyi::os-lib:0.9.0"
```
    {% endtab %}
    {% tab 'sbt' %}
In our `build.sbt` file, we add the dependency on OS-Lib:
```scala
libraryDependencies += "com.lihaoyi" %% "os-lib" % "0.9.0"
```
    {% endtab %}
    {% tab 'Mill' %}
In our `build.sc` file, we add the dependency on OS-Lib:
```scala
def ivyDeps = Agg(
  ivy"com.lihaoyi::os-lib:0.9.0"
)
```
    {% endtab %}
  {% endtabs %}
{% endaltDetails %}
