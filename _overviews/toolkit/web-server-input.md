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

Similarly to path segments and query parameters, form fields are read by using endpoint method arguments. Use `cask.postForm`
annotation and set the HTML form method to `post`.

In this example we create a form asking for name and surname of a user and then redirect to a greeting page. Notice the
use of `cask.Response`. The default returned content type is `text/plain`, set it to `text/html` in order for browser to display
the form correctly.

The `formMethod` endpoint reads the form data using `name` and `surname` parameters. The names of parameters must
be identical to the field names of the form.

{% tabs web-server-input-1 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
object MyApp extends cask.MainRoutes {

  @cask.get("/form")
  def getForm() = {
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
  def formEndpoint(name: String, surname: String) =
    "Hello " + name + " " + surname

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object MyApp extends cask.MainRoutes:
  
  @cask.get("/form")
  def getForm() =
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
  def formEndpoint(name: String, surname: String) =
    "Hello " + name + " " + surname

  initialize()
```
{% endtab %}
{% endtabs %}

## Handling JSON-encoded input

JSON fields are handled in the same way as form fields, except that `cask.PostJson` annotation is used. The topmost fields
will be read into the endpoint method arguments and if any of them is missing or has an incorrect type, an error message
will be returned with 400 response code.

{% tabs web-server-input-2 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
object MyApp extends cask.MainRoutes {
  
  @cask.postJson("/json")
  def jsonEndpoint(name: String, surname: String) =
    "Hello " + name + " " + surname

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object MyApp extends cask.MainRoutes:

  @cask.postJson("/json")
  def jsonEndpoint(name: String, surname: String) = 
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

Deserialization is handled by uPickle JSON library. To deserialize an object, use `ujson.Value` type.

{% tabs web-server-input-3 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
object MyApp extends cask.MainRoutes {

  @cask.postJson("/json")
  def jsonEndpoint(value: ujson.Value) =
    value.toString

  initialize()
}

```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object MyApp extends cask.MainRoutes:

  @cask.postJson("/json")
  def jsonEndpoint(value: ujson.Value) = 
    value.toString

  initialize()

```
{% endtab %}
{% endtabs %}

Send a POST request.
```shell
curl --header "Content-Type: application/json" \
  --data '{"value":{"name":"John","surname":"Smith"}}' \
  http://localhost:8080/json2
```

Server will respond with:
```
"{\"name\":\"John\",\"surname\":\"Smith\"}"
```

## Handling JSON-encoded output

Cask endpoint can return JSON objects returned by uPickle library functions. Cask will automatically handle the `ujson.Value`
type and set the `Content-Type application/json` header.

In this example we use a simple `TimeData` case class to send information about the time zone and current time in a chosen
location. To serialize a case class into JSON you need to define a serializer in its companion object.

{% tabs web-server-input-3 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
object MyApp extends cask.MainRoutes {
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
  def timeJSON(city: String) = {
    val timezone = getZoneIdForCity(city)
    val time = timezone match {
      case Some(zoneId) => s"Current date is: ${ZonedDateTime.now().withZoneSameInstant(zoneId)}"
      case None => s"Couldn't find time zone for city $city"
    }
    writeJs(TimeData(timezone.map(_.toString), time))
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object MyApp extends cask.MainRoutes {
  import upickle.default.{ReadWriter, macroRW, writeJs}
  case class TimeData(timezone: Option[String], time: String)
  object TimeData:
    given rw: ReadWriter[TimeData]= macroRW

  private def getZoneIdForCity(city: String): Option[ZoneId] =
    import scala.jdk.CollectionConverters.*
    ZoneId.getAvailableZoneIds.asScala.find(_.endsWith("/" + city)).map(ZoneId.of)
  
  @cask.get("/time_json/:city")
  def timeJSON(city: String) = {
    val timezone = getZoneIdForCity(city)
    val time = timezone match
        case Some(zoneId)=> s"Current date is: ${ZonedDateTime.now().withZoneSameInstant(zoneId)}"
        case None => s"Couldn't find time zone for city $city"
    writeJs(TimeData(timezone.map(_.toString), time))
  }
}
```
{% endtab %}
{% endtabs %}