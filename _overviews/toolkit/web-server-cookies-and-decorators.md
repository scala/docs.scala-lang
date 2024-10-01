---
title: How to use cookies and decorators?
type: section
description: Using cookies and decorators with Cask
num: 36
previous-page: web-server-websockets
next-page: 
---

{% include markdown.html path="_markdown/install-cask.md" %}

## Using cookies

Cookies are saved by adding them to the `cookies` parameter of the `cask.Response` constructor. 

In this example, we are building a rudimentary authentication service. The `getLogin` method provides a form where
the user can enter their username and password. The `postLogin` method reads the credentials. If they match the expected ones, it generates a session
identifier is generated, saves it in the application state, and sends back a cookie with the identifier.

Cookies can be read either with a method parameter of `cask.Cookie` type or by accessing the `cask.Request` directly.
If using the former method, the names of parameters have to match the names of cookies. If a cookie with a matching name is not
found, an error response will be returned. In the `checkLogin` function, the former method is used, as the cookie is not
present before the user logs in.

To delete a cookie, set its `expires` parameter to an instant in the past, for example `Instant.EPOCH`. 

{% tabs web-server-cookies-1 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

object Example extends cask.MainRoutes {

  val sessionIds = ConcurrentHashMap.newKeySet[String]()

  @cask.get("/login")
  def getLogin(): cask.Response[String] = {
    val html =
      """<!doctype html>
        |<html>
        |<body>
        |<form action="/login" method="post">
        |  <label for="name">Username:</label><br>
        |  <input type="text" name="name" value=""><br>
        |  <label for="password">Password:</label><br>
        |  <input type="text" name="password" value=""><br><br>
        |  <input type="submit" value="Submit">
        |</form>
        |</body>
        |</html>""".stripMargin

    cask.Response(data = html, headers = Seq("Content-Type" -> "text/html"))
  }

  @cask.postForm("/login")
  def postLogin(name: String, password: String): cask.Response[String] = {
    if (name == "user" && password == "password") {
      val sessionId = UUID.randomUUID().toString
      sessionIds.add(sessionId)
      cask.Response(data = "Success!", cookies = Seq(cask.Cookie("sessionId", sessionId)))
    } else {
      cask.Response(data = "Authentication failed", statusCode = 401)
    }
  }

  @cask.get("/check")
  def checkLogin(request: cask.Request): String = {
    val sessionId = request.cookies.get("sessionId")
    if (sessionId.exists(cookie => sessionIds.contains(cookie.value))) {
      "You are logged in"
    } else {
      "You are not logged in"
    }
  }

  @cask.get("/logout")
  def logout(sessionId: cask.Cookie) = {
    sessionIds.remove(sessionId.value)
    cask.Response(data = "Successfully logged out!", cookies = Seq(cask.Cookie("sessionId", "", expires = Instant.EPOCH)))
  }

  initialize()
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

object Example extends cask.MainRoutes:

  val sessionIds = ConcurrentHashMap.newKeySet[String]()

  @cask.get("/login")
  def getLogin(): cask.Response[String] =
    val html =
      """<!doctype html>
        |<html>
        |<body>
        |<form action="/login" method="post">
        |  <label for="name">Username:</label><br>
        |  <input type="text" name="name" value=""><br>
        |  <label for="password">Password:</label><br>
        |  <input type="text" name="password" value=""><br><br>
        |  <input type="submit" value="Submit">
        |</form>
        |</body>
        |</html>""".stripMargin

    cask.Response(data = html, headers = Seq("Content-Type" -> "text/html"))

  @cask.postForm("/login")
  def postLogin(name: String, password: String): cask.Response[String] =
    if name == "user" && password == "password" then
        val sessionId = UUID.randomUUID().toString
        sessionIds.add(sessionId)
        cask.Response(data = "Success!", cookies = Seq(cask.Cookie("sessionId", sessionId)))
    else
      cask.Response(data = "Authentication failed", statusCode = 401)

  @cask.get("/check")
  def checkLogin(request: cask.Request): String =
    val sessionId = request.cookies.get("sessionId")
    if sessionId.exists(cookie => sessionIds.contains(cookie.value)) then
      "You are logged in"
    else
      "You are not logged in"

  @cask.get("/logout")
  def logout(sessionId: cask.Cookie): cask.Response[String] = 
    sessionIds.remove(sessionId.value)
    cask.Response(data = "Successfully logged out!", cookies = Seq(cask.Cookie("sessionId", "", expires = Instant.EPOCH)))

  initialize()
```
{% endtab %}
{% endtabs %}

## Using decorators

Decorators can be used for extending endpoints functionality with validation or new parameters. They are defined by extending
`cask.RawDecorator` class. They are used as annotations.

In this example, the `loggedIn` decorator is used to check if the user is logged in before accessing the `/decorated`
endpoint.

The decorator class can pass additional arguments to the decorated endpoint using a map. The passed arguments are available
through the last argument group. Here we are passing the session identifier to an argument named `sessionId`.

{% tabs web-server-cookies-2 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
class loggedIn extends cask.RawDecorator {
  override def wrapFunction(ctx: cask.Request, delegate: Delegate): Result[Raw] = {
    ctx.cookies.get("sessionId") match {
      case Some(cookie) if sessionIds.contains(cookie.value) => delegate(Map("sessionId" -> cookie.value))
      case _ => cask.router.Result.Success(cask.model.Response("You aren't logged in", 403))
    }
  }
}

@loggedIn()
@cask.get("/decorated")
def decorated()(sessionId: String): String = {
  s"You are logged in with id: $sessionId"
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
class loggedIn extends cask.RawDecorator:
  override def wrapFunction(ctx: cask.Request, delegate: Delegate): Result[Raw] =
    ctx.cookies.get("sessionId") match
      case Some(cookie) if sessionIds.contains(cookie.value) =>
        delegate(Map("sessionId" -> cookie.value))
      case _ =>
        cask.router.Result.Success(cask.model.Response("You aren't logged in", 403))


@loggedIn()
@cask.get("/decorated")
def decorated()(sessionId: String): String = s"You are logged in with id: $sessionId"
```
{% endtab %}
{% endtabs %}