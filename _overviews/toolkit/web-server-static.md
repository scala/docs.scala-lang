---
title: How to serve a static file?
type: section
description: Serving a static file with Cask
num: 31
previous-page: web-server-intro
next-page: web-server-dynamic
---

{% include markdown.html path="_markdown/install-cask.md" %}

## Serving a static file

An endpoint is a specific URL where a particular webpage can be accessed. In Cask, an endpoint is a function returning the
webpage data, together with an annotation describing its URL.

To create an endpoint serving static files, we need two things: an HTML file with the page content and a function that
points to that file.

Create a minimal HTML file named `hello.html` with the following contents.

```html
<!doctype html>
<html>
    <head>
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
├── Example.scala
└── resources
     └── hello.html
```
{% endtab %}
{% tab 'sbt' %}
```
example
└──src
    └── main
        ├── resources
        │   └── hello.html
        └── scala
            └── Example.scala
```
{% endtab %}
{% tab 'Mill' %}
```
example
├── src
│    └── Example.scala
└── resources
     └── hello.html
```
{% endtab %}
{% endtabs %}

The `@cask.staticFiles` annotation specifies at which path the webpage will be available. The endpoint function returns
the location of the file.

{% tabs web-server-static-2 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
object Example extends cask.MainRoutes {
  @cask.staticFiles("/static")
  def staticEndpoint(): String = "src/main/resources" // or "resources" if not using SBT

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object Example extends cask.MainRoutes:
  @cask.staticFiles("/static")
  def staticEndpoint(): String = "src/main/resources" // or "resources" if not using SBT

  initialize()
```
{% endtab %}
{% endtabs %}

In the example above, `@cask.staticFiles` instructs the server to look for files accessed at the `/static` path in the 
`src/main/resources` directory. Cask will match any subpath coming after `/static` and append it to the directory path.
If you access the `/static/hello.html` file, it will serve the file available at `src/main/resources/hello.html`.
The directory path can be any path available to the server, relative or not. If the requested file cannot be found in the
specified location, the server will return a 404 response with an error message.

The `Example` object inherits from the `cask.MainRoutes` class. It provides the main function that starts the server. The `initialize()`
method call initializes the server routes, i.e., the association between URL paths and the code that handles them.

### Using the resources directory

The `@cask.staticResources` annotation works in the same way as the `@cask.staticFiles` used above, with the difference that
the path returned by the endpoint method describes the location of files _inside_ the resources directory. Since the
previous example conveniently used the resources directory, it can be simplified with `@cask.staticResources`.

{% tabs web-server-static-3 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
object Example extends cask.MainRoutes {
  @cask.staticResources("/static")
  def staticEndpoint(): String = "."

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object Example extends cask.MainRoutes:
  @cask.staticResources("/static")
  def staticEndpoint(): String = "."

  initialize()
```
{% endtab %}
{% endtabs %}

In the endpoint method, the location is set to `"."`, telling the server that the files are available directly in the
resources directory. In general, you can use any nested location within the resources directory. For instance, you could opt
for placing your HTML files in the `static` directory inside the resources directory or using different directories to sort out
files used by different endpoints.

## Running the example

Run the example with the build tool of your choice.

{% tabs munit-unit-test-4 class=tabs-build-tool %}
{% tab 'Scala CLI' %}
In the terminal, the following command will start the server:
```
scala run Example.scala
```
{% endtab %}
{% tab 'sbt' %}
In the terminal, the following command will start the server:
```
sbt example/run
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
