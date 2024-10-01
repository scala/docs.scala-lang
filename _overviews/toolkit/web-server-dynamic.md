---
title: How to serve a dynamic page?
type: section
description: Serving a dynamic page with Cask
num: 32
previous-page: web-server-static
next-page: web-server-query-parameters
---

{% include markdown.html path="_markdown/install-cask.md" %}

## Serving dynamically generated content

You can create an endpoint returning dynamically generated content with the `@cask.get` annotation.

{% tabs web-server-dynamic-1 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.time.ZonedDateTime

object Example extends cask.MainRoutes {
  @cask.get("/time")
  def dynamic(): String = s"Current date is: ${ZonedDateTime.now()}"

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import java.time.ZonedDateTime

object Example extends cask.MainRoutes:
  @cask.get("/time")
  def dynamic(): String = s"Current date is: ${ZonedDateTime.now()}"

  initialize()
```
{% endtab %}
{% endtabs %}

The example above creates an endpoint that returns the current date and time available at `/time`. The exact response will be 
recreated every time you refresh the webpage.

Since the endpoint method has the `String` output type, the result will be sent with the `text/plain` [content type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type).
If you want an HTML output to be interpreted by the browser, you will need to set the `Content-Type` header manually
or [use the Scalatags templating library](/toolkit/web-server-dynamic.html#using-html-templates), supported by Cask.

### Running the example

Run the example the same way as before, assuming you use the same project structure as described in [the static file tutorial](/toolkit/web-server-static.html).

{% tabs web-server-dynamic-2 class=tabs-build-tool %}
{% tab 'Scala CLI' %}
In the terminal, the following command will start the server:
```
scala-cli run Example.scala
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

Access the endpoint at [http://localhost:8080/time](http://localhost:8080/time). You should see a result similar to the one below.

```
Current date is: 2024-07-22T09:07:05.752534+02:00[Europe/Warsaw]
```

## Using path segments

Cask gives you the ability to access segments of the URL path within the endpoint function.
Building on the example above, you can add a segment to specify that the endpoint should return the date and time
in a given city.

{% tabs web-server-dynamic-3 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.time.{ZoneId, ZonedDateTime}

object Example extends cask.MainRoutes {

  private def getZoneIdForCity(city: String): Option[ZoneId] = {
    import scala.jdk.CollectionConverters._
    ZoneId.getAvailableZoneIds.asScala.find(_.endsWith("/" + city)).map(ZoneId.of)
  }

  @cask.get("/time/:city")
  def dynamicWithCity(city: String): String = {
    getZoneIdForCity(city) match {
      case Some(zoneId) => s"Current date is: ${ZonedDateTime.now().withZoneSameInstant(zoneId)}"
      case None => s"Couldn't find time zone for city $city"
    }
  }

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import java.time.{ZoneId, ZonedDateTime}

object Example extends cask.MainRoutes:

  private def getZoneIdForCity(city: String): Option[ZoneId] =
    import scala.jdk.CollectionConverters.*
    ZoneId.getAvailableZoneIds.asScala.find(_.endsWith("/" + city)).map(ZoneId.of)
  
  @cask.get("/time/:city")
  def dynamicWithCity(city: String): String =
    getZoneIdForCity(city) match
      case Some(zoneId) => s"Current date is: ${ZonedDateTime.now().withZoneSameInstant(zoneId)}"
      case None => s"Couldn't find time zone for city $city"

  initialize()
```
{% endtab %}
{% endtabs %}

In the example above, the `:city` segment in `/time/:city` is available through the `city` argument of the endpoint method.
The name of the argument must be identical to the segment name. The `getZoneIdForCity` helper method finds the timezone for
a given city, and then the current date and time are translated to that timezone.

Accessing the endpoint at [http://localhost:8080/time/Paris](http://localhost:8080/time/Paris) will result in:
```
Current date is: 2024-07-22T09:08:33.806259+02:00[Europe/Paris]
```

You can use more than one path segment in an endpoint by adding more arguments to the endpoint method. It's also possible to use paths
with an unspecified number of segments (for example `/path/foo/bar/baz/`) by giving the endpoint method an argument with `cask.RemainingPathSegments` type.
Consult the [documentation](https://com-lihaoyi.github.io/cask/index.html#variable-routes) for more details.

## Using HTML templates

To create an HTML response, you can combine Cask with the [Scalatags](https://com-lihaoyi.github.io/scalatags/) templating library.

Import the Scalatags library:

{% tabs web-server-dynamic-4 class=tabs-build-tool %}
{% tab 'Scala CLI' %}
Add the Scalatags dependency in `Example.sc` file:
```scala
//> using dep "com.lihaoyi::scalatags::0.13.1"
```
{% endtab %}
{% tab 'sbt' %}
Add the Scalatags dependency in `build.sbt` file:
```scala
libraryDependencies += "com.lihaoyi" %% "scalatags" % "0.13.1"
```
{% endtab %}
{% tab 'Mill' %}
Add the Scalatags dependency in `build.cs` file:
```scala
ivy"com.lihaoyi::scalatags::0.13.1"
```
{% endtab %}
{% endtabs %}

Now the example above can be rewritten to use a template. Cask will build a response out of the `doctype` automatically,
setting the `Content-Type` header to `text/html`.

{% tabs web-server-dynamic-5 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.time.{ZoneId, ZonedDateTime}
import scalatags.Text.all._

object Example extends cask.MainRoutes {

  private def getZoneIdForCity(city: String): Option[ZoneId] = {
    import scala.jdk.CollectionConverters._
    ZoneId.getAvailableZoneIds.asScala.find(_.endsWith("/" + city)).map(ZoneId.of)
  }
  
  @cask.get("/time/:city")
  def dynamicWithCity(city: String): doctype = {
    val text = getZoneIdForCity(city) match {
      case Some(zoneId) => s"Current date is: ${ZonedDateTime.now().withZoneSameInstant(zoneId)}"
      case None => s"Couldn't find time zone for city $city"
    }

    doctype("html")(
      html(
        body(
          p(text)
        )
      )
    )
  }

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import java.time.{ZoneId, ZonedDateTime}
import scalatags.Text.all.*

object Example extends cask.MainRoutes:

  private def getZoneIdForCity(city: String): Option[ZoneId] =
    import scala.jdk.CollectionConverters.*
    ZoneId.getAvailableZoneIds.asScala.find(_.endsWith("/" + city)).map(ZoneId.of)

  @cask.get("/time/:city")
  def dynamicWithCity(city: String): doctype =
    val text = getZoneIdForCity(city) match
      case Some(zoneId) => s"Current date is: ${ZonedDateTime.now().withZoneSameInstant(zoneId)}"
      case None => s"Couldn't find time zone for city $city"
    doctype("html")(
      html(
        body(
          p(text)
        )
      )
    )

  initialize()
```
{% endtab %}
{% endtabs %}

Here we get the text of the response and wrap it in a Scalatags template. Notice that the return type changed from `String`
to `doctype`. 