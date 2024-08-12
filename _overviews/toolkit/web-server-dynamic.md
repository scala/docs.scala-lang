---
title: How to serve a dynamic page?
type: section
description: Serving a dynamic page with Cask
num: 32
previous-page: web-server-static
next-page: web-server-query-parameters
---

{% include markdown.html path="_markdown/install-cask.md" %}

## Basic example

To create an endpoint returning dynamically generated content, use `@cask.get` annotation.

For example, create an endpoint that returns the current date and time.

{% tabs web-server-dynamic-1 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.time.ZonedDateTime

object MyApp extends cask.MainRoutes {
  @cask.get("/time")
  def dynamic() = s"Current date is: ${ZonedDateTime.now()}"

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import java.time.ZonedDateTime

object MyApp extends cask.MainRoutes:
  @cask.get("/time")
  def dynamic() = s"Current date is: ${ZonedDateTime.now()}"

  initialize()
```
{% endtab %}
{% endtabs %}


Run the example the same way as before (assuming you use the same project structure).

{% tabs web-server-dynamic-2 class=tabs-build-tool %}
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

Access the endpoint at [http://localhost:8080/time](http://localhost:8080/time). You should see a result similar to the
one below.

```
Current date is: 2024-07-22T09:07:05.752534+02:00[Europe/Warsaw]
```

## Using path segments

You can use path segments to specify the returned data more precisely. Building on the example above, add the `:city`
segment to get the current time in a city of choice.

{% tabs web-server-dynamic-3 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.time.{ZoneId, ZonedDateTime}

object MyApp extends cask.MainRoutes {

  private def getZoneIdForCity(city: String): Option[ZoneId] = {
    import scala.jdk.CollectionConverters._
    ZoneId.getAvailableZoneIds.asScala.find(_.endsWith("/" + city)).map(ZoneId.of)
  }

  @cask.get("/time/:city")
  def dynamicWithCity(city: String) = {
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

object MyApp extends cask.MainRoutes:

  private def getZoneIdForCity(city: String): Option[ZoneId] =
    import scala.jdk.CollectionConverters.*
    ZoneId.getAvailableZoneIds.asScala.find(_.endsWith("/" + city)).map(ZoneId.of)
  
  @cask.get("/time/:city")
  def dynamicWithCity(city: String) =
    getZoneIdForCity(city) match
      case Some(zoneId) => s"Current date is: ${ZonedDateTime.now().withZoneSameInstant(zoneId)}"
      case None => s"Couldn't find time zone for city $city"

  initialize()
```
{% endtab %}
{% endtabs %}

Accessing the endpoint at [http://localhost:8080/time/Paris](http://localhost:8080/time/Paris) will result with:
```
Current date is: 2024-07-22T09:08:33.806259+02:00[Europe/Paris]
```

and at [http://localhost:8080/time/Tokyo](http://localhost:8080/time/Tokyo) you will see:
```
Current date is: 2024-07-22T16:08:41.137563+09:00[Asia/Tokyo]
```

Cask endpoints can handle either fixed or arbitrary number of path segments. Please consult the 
[documentation](https://com-lihaoyi.github.io/cask/index.html#variable-routes) for more details.

## Using HTML templates

You can combine Cask code with a templating library like [Scalatags](https://com-lihaoyi.github.io/scalatags/) to
build an HTML response.

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

Now the example above can be rewritten to use a template. Cask will build a response out of the `doctype` automatically.

{% tabs web-server-dynamic-3 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.time.{ZoneId, ZonedDateTime}
import scalatags.Text.all._

object MyApp extends cask.MainRoutes {

  private def getZoneIdForCity(city: String): Option[ZoneId] = {
    import scala.jdk.CollectionConverters._
    ZoneId.getAvailableZoneIds.asScala.find(_.endsWith("/" + city)).map(ZoneId.of)
  }
  
  @cask.get("/time/:city")
  def dynamicWithCity(city: String) = {
    val text = getZoneIdForCity(city) match {
      case Some(zoneId) => s"Current date is: ${ZonedDateTime.now().withZoneSameInstant(zoneId)}"
      case None => s"Couldn't find time zone for city $city"
    }

    doctype("html")(
      html(
        body(
          h1(text)
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

object MyApp extends cask.MainRoutes:

  private def getZoneIdForCity(city: String): Option[ZoneId] =
    import scala.jdk.CollectionConverters.*
    ZoneId.getAvailableZoneIds.asScala.find(_.endsWith("/" + city)).map(ZoneId.of)

  @cask.get("/time/:city")
  def dynamicWithCity(city: String) =
    val text = getZoneIdForCity(city) match
        case Some(zoneId) => s"Current date is: ${ZonedDateTime.now().withZoneSameInstant(zoneId)}"
        case None => s"Couldn't find time zone for city $city"
    doctype("html")(
      html(
        body(
          h1(text)
        )
      )
    )

  initialize()
```
{% endtab %}
{% endtabs %}