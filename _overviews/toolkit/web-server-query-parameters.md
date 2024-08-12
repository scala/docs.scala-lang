---
title: How to handle query parameters?
type: section
description: Handling query parameters with Cask
num: 33
previous-page: web-server-dynamic
next-page: web-server-input
---

{% include markdown.html path="_markdown/install-cask.md" %}

You can read the query parameters by adding to an endpoint method arguments that don't have corresponding path segments
defined in the annotation.

In this example `city` is an optional parameter (note the `Option` type and `None` default value, they're required). 
If not provided, time for the current timezone will be returned.

{% tabs web-server-query-1 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.time.{ZoneId, ZonedDateTime}

object MyApp extends cask.MainRoutes {

  private def getZoneIdForCity(city: String): Option[ZoneId] = {
    import scala.jdk.CollectionConverters._
    ZoneId.getAvailableZoneIds.asScala.find(_.endsWith("/" + city)).map(ZoneId.of)
  }

  @cask.get("/time")
  def dynamicWithParam(city: Option[String] = None) = {
    city match {
      case Some(value) => getZoneIdForCity(value) match {
        case Some(zoneId) => s"Current date is: ${ZonedDateTime.now().withZoneSameInstant(zoneId)}"
        case None => s"Couldn't find time zone for city $value"
      }
      case None => s"Current date is: ${ZonedDateTime.now()}"
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

    @cask.get("/time")
    def dynamicWithParam(city: Option[String] = None) =
      city match
        case Some(value) => getZoneIdForCity(value) match
            case Some(zoneId) => s"Current date is: ${ZonedDateTime.now().withZoneSameInstant(zoneId)}"
            case None => s"Couldn't find time zone for city $value"
        case None => s"Current date is: ${ZonedDateTime.now()}"

  initialize()
```
{% endtab %}
{% endtabs %}

Run the example as before and access the endpoint at [http://localhost:8080/time?city=Paris](http://localhost:8080/time?city=Paris).
You should get a similar result to following.
```
Current date is: 2024-07-22T10:08:18.218736+02:00[Europe/Paris]
```

If you omit the `city` param, you will get time for your current timezone.
```
Current date is: 2024-07-22T10:11:45.004285+02:00[Europe/Warsaw]
```
