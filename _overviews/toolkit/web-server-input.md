---
title: How to handle user input?
type: section
description: Handling user input with Cask
num: 34
previous-page: web-server-query-parameters
next-page: web-server-websockets
---

{% include markdown.html path="_markdown/install-cask.md" %}

## Handling form-encoded input

To create an endpoint that handles the data provided in an HTML form, use the `@cask.postForm` annotation. Add arguments to the endpoint method
with names corresponding to names of fields in the form and set the form method to `post`.

{% tabs web-server-input-1 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
object Example extends cask.MainRoutes {

  @cask.get("/form")
  def getForm(): cask.Response[String] = {
    val html =
      """<!doctype html>
        |<html>
        |<body>
        |<form action="/form" method="post">
        |  <label for="name">First name:</label><br>
        |  <input type="text" name="name" value=""><br>
        |  <label for="surname">Last name:</label><br>
        |  <input type="text" name="surname" value=""><br><br>
        |  <input type="submit" value="Submit">
        |</form>
        |</body>
        |</html>""".stripMargin

    cask.Response(data = html, headers = Seq("Content-Type" -> "text/html"))
  }

  @cask.postForm("/form")
  def formEndpoint(name: String, surname: String): String =
    "Hello " + name + " " + surname

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object Example extends cask.MainRoutes:
  
  @cask.get("/form")
  def getForm(): cask.Response[String] =
    val html =
      """<!doctype html>
        |<html>
        |<body>
        |<form action="/form" method="post">
        |  <label for="name">First name:</label><br>
        |  <input type="text" name="name" value=""><br>
        |  <label for="surname">Last name:</label><br>
        |  <input type="text" name="surname" value=""><br><br>
        |  <input type="submit" value="Submit">
        |</form>
        |</body>
        |</html>""".stripMargin

    cask.Response(data = html, headers = Seq("Content-Type" -> "text/html"))

  @cask.postForm("/form")
  def formEndpoint(name: String, surname: String): String =
    "Hello " + name + " " + surname

  initialize()
```
{% endtab %}
{% endtabs %}

In this example we create a form asking for name and surname of a user and then redirect the user to a greeting page. Notice the
use of `cask.Response`. The `cask.Response` type allows the user to set the status code, headers and cookies. The default
content type for an endpoint method returning a `String` is `text/plain`. Set it to `text/html` in order for the browser to display the form correctly.

The `formEndpoint` endpoint reads the form data using the `name` and `surname` parameters. The names of parameters must
be identical to the field names of the form.

## Handling JSON-encoded input

JSON fields are handled in the same way as form fields, except that we use the `@cask.PostJson` annotation. The fields
will be read into the endpoint method arguments.

{% tabs web-server-input-2 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
object Example extends cask.MainRoutes {
  
  @cask.postJson("/json")
  def jsonEndpoint(name: String, surname: String): String =
    "Hello " + name + " " + surname

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object Example extends cask.MainRoutes:

  @cask.postJson("/json")
  def jsonEndpoint(name: String, surname: String): String =
    "Hello " + name + " " + surname
  
  initialize()
```
{% endtab %}
{% endtabs %}

Send the POST request using `curl`:

```shell
curl --header "Content-Type: application/json" \
  --data '{"name":"John","surname":"Smith"}' \
  http://localhost:8080/json
```

The response will be:
```
Hello John Smith
```

The endpoint will accept JSONs that have only the fields with names specified as the endpoint method arguments. If there
are more fields than expected, some fields are missing or have an incorrect data type, an error message
will be returned with the response code 400.

To handle the case when the fields of the JSON are not known in advance, you can use an argument with the `ujson.Value` type,
from uPickle library.

{% tabs web-server-input-3 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
object Example extends cask.MainRoutes {

  @cask.postJson("/json")
  def jsonEndpoint(value: ujson.Value): String =
    value.toString

  initialize()
}

```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object Example extends cask.MainRoutes:

  @cask.postJson("/json")
  def jsonEndpoint(value: ujson.Value): String = 
    value.toString

  initialize()

```
{% endtab %}
{% endtabs %}

In this example the JSON is merely converted to `String`. Check the [*uPickle tutorial*](/toolkit/json-intro.html) for more information
on what can be done with the `ujson.Value` type.

Send a POST request.
```shell
curl --header "Content-Type: application/json" \
  --data '{"value":{"name":"John","surname":"Smith"}}' \
  http://localhost:8080/json2
```

The server will respond with:
```
"{\"name\":\"John\",\"surname\":\"Smith\"}"
```

## Handling JSON-encoded output

Cask endpoints can return JSON objects returned by uPickle library functions. Cask will automatically handle the `ujson.Value`
type and set the `Content-Type` header to `application/json`.

In this example, the `TimeData` case class stores the information about the time zone and current time in a chosen
location. To serialize a case class into JSON, use type class derivation or define the serializer in its companion object in the case of Scala 2.

{% tabs web-server-input-4 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.time.{ZoneId, ZonedDateTime}

object Example extends cask.MainRoutes {
  import upickle.default.{ReadWriter, macroRW, writeJs}
  case class TimeData(timezone: Option[String], time: String)
  object TimeData {
    implicit val rw: ReadWriter[TimeData] = macroRW
  }

  private def getZoneIdForCity(city: String): Option[ZoneId] = {
    import scala.jdk.CollectionConverters._
    ZoneId.getAvailableZoneIds.asScala.find(_.endsWith("/" + city)).map(ZoneId.of)
  }

  @cask.get("/time_json/:city")
  def timeJSON(city: String): ujson.Value = {
    val timezone = getZoneIdForCity(city)
    val time = timezone match {
      case Some(zoneId) => s"Current date is: ${ZonedDateTime.now().withZoneSameInstant(zoneId)}"
      case None => s"Couldn't find time zone for city $city"
    }
    writeJs(TimeData(timezone.map(_.toString), time))
  }

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import java.time.{ZoneId, ZonedDateTime}

object Example extends cask.MainRoutes:
  import upickle.default.{ReadWriter, writeJs}
  case class TimeData(timezone: Option[String], time: String) derives ReadWriter

  private def getZoneIdForCity(city: String): Option[ZoneId] =
    import scala.jdk.CollectionConverters.*
    ZoneId.getAvailableZoneIds.asScala.find(_.endsWith("/" + city)).map(ZoneId.of)
  
  @cask.get("/time_json/:city")
  def timeJSON(city: String): ujson.Value =
    val timezone = getZoneIdForCity(city)
    val time = timezone match
      case Some(zoneId)=> s"Current date is: ${ZonedDateTime.now().withZoneSameInstant(zoneId)}"
      case None => s"Couldn't find time zone for city $city"
    writeJs(TimeData(timezone.map(_.toString), time))

  initialize()
```
{% endtab %}
{% endtabs %}