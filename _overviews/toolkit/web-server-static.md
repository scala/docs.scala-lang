---
title: How to serve a static file?
type: section
description: Serving a static file with Cask
num: 31
previous-page: web-server-intro
next-page: web-server-dynamic
---

{% include markdown.html path="_markdown/install-cask.md" %}

## Writing an endpoint

To create a static file serving endpoint first we need to prepare the project structure.

Create an example HTML file named `hello.html` with following contents.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello World</title>
</head>
<body>
<h1>Hello world</h1>
</body>
</html>
```

Place it in the `resources` directory.

{% tabs web-server-static-1 class=tabs-build-tool %}
{% tab 'Scala CLI' %}
```
example
├── Example.sc
└── resources
     └── hello.html
```
{% endtab %}
{% tab 'sbt' %}

For instance, the following is the file structure of a project `example`:
```
example
└──src
    └── main
        ├── resources
        │   └── hello.html
        └── scala
            └── MyApp.scala
```
{% endtab %}
{% tab 'Mill' %}
For instance, the following is the file structure of an example project:
```
example
├── src
│    └── MyApp.scala
└── resources
     └── hello.html
```
{% endtab %}
{% endtabs %}

The `@cask.staticFiles` annotation tells the server to match the part of path coming after what is specified in the
annotation itself and find a matching file in the directory defined by the endpoint function. 

In this example the directory with static files is `src/main/resources` and the URL path under which files are available is 
`/static`. Thus, the `hello.html` page is available under `/static/hello.html`.

{% tabs web-server-static-2 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
object MyApp extends cask.MainRoutes {
  @cask.staticFiles("/static")
  def staticEndpoint() = "src/main/resources"

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object MyApp extends cask.MainRoutes:
  @cask.staticFiles("/static")
  def staticEndpoint() = "src/main/resources"

  initialize()
```
{% endtab %}
{% endtabs %}

As the file is placed in the resources directory, you can achieve the same effect using `@cask.staticResources`. In
this case the path is set to `"."`, as the `hello.html` file is available directly in the resources directory, as opposed
to being present in a nested directory.

{% tabs web-server-static-3 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
object MyApp extends cask.MainRoutes {
  @cask.staticResources("/static")
  def staticEndpoint() = "."

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object MyApp extends cask.MainRoutes:
  @cask.staticResources("/static")
  def staticEndpoint() = "."

  initialize()
```
{% endtab %}
{% endtabs %}

## Running the example

Run the example with the build tool of your choice.

{% tabs munit-unit-test-4 class=tabs-build-tool %}
{% tab 'Scala CLI' %}
In the terminal, the following command will start the server:
```
scala-cli run Example.sc
```
{% endtab %}
{% tab 'sbt' %}
In the sbt shell, the following command will start the server:
```
sbt:example> example/run
```
{% endtab %}
{% tab 'Mill' %}
In the terminal, the following command will start the server:
```
./mill run
```
{% endtab %}
{% endtabs %}

The example page will be available at [http://localhost:8080/static/hello.html](http://localhost:8080/static/hello.html).