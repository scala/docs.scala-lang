OS-Lib is a library for manipulating files and processes. It is part of the Scala Toolkit.

{% altDetails install-info-box 'Installing OS-Lib' %}

## Installing OS-Lib

  {% tabs oslib--1 %}
    {% tab 'Scala CLI' %}
In Scala CLI, we can install the entire toolkit in a single line:
```scala
//> using toolkit
```

Alternatively, we can install a specific version of OS-Lib:
```scala
//> using lib "com.lihaoyi::os-lib:0.9.0"
```
    {% endtab %}
    {% tab 'sbt' %}
In our build.sbt file, we add the dependency on the OS-Lib library:
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
