OS-Lib is a library for manipulating files and processes. It is part of the Scala Toolkit.

{% altDetails require-info-box 'Requiring OS-Lib' %}

## Requiring OS-Lib

  {% tabs oslib--1 %}
    {% tab 'Scala CLI' %}
In Scala CLI, we can require the entire toolkit in a single line:
```scala
//> using toolkit
```

Alternatively, we can require a specific version of OS-Lib:
```scala
//> using dep "com.lihaoyi::os-lib:0.9.0"
```
    {% endtab %}
    {% tab 'sbt' %}
In our build.sbt file, we add the dependency on OS-Lib:
```scala
lazy val example = project.in(file("example"))
  .settings(
    scalaVersion := "3.2.2",
    libraryDependencies += "com.lihaoyi" %% "os-lib" % "0.9.0"
  )
```
    {% endtab %}
  {% endtabs %}
{% endaltDetails %}
