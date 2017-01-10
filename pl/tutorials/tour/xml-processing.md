---
layout: tutorial
title: Przetwarzanie XML

disqus: true

tutorial: scala-tour
num: 13
language: pl
tutorial-next: regular-expression-patterns
tutorial-previous: singleton-objects
---

Scala pozwala na łatwe tworzenie, parsowanie oraz przetwarzanie dokumentów w formacie XML. Dane XML mogą być przedstawiane używając generycznych reprezentacji danych lub też z wykorzystaniem specyficznych powiązań za pomocą narzędzia [scalaxb](http://scalaxb.org/).

Rozważmy następujący dokument XML:

```html
<html>
  <head>
    <title>Hello XHTML world</title>
  </head>
  <body>
    <h1>Hello world</h1>
    <p><a href="http://scala-lang.org/">Scala</a> talks XHTML</p>
  </body>
</html>
```

Ten dokument łatwo można stworzyć pisząc program w Scali:

```tut
object XMLTest1 extends App {
  val page = 
  <html>
    <head>
      <title>Hello XHTML world</title>
    </head>
    <body>
      <h1>Hello world</h1>
      <p><a href="scala-lang.org">Scala</a> talks XHTML</p>
    </body>
  </html>;
  println(page.toString())
}
```

Możliwe jest mieszanie wyrażeń Scali oraz XML:

```tut
object XMLTest2 extends App {
  import scala.xml._
  val df = java.text.DateFormat.getDateInstance()
  val dateString = df.format(new java.util.Date())
  def theDate(name: String) = 
    <dateMsg addressedTo={ name }>
      Hello, { name }! Today is { dateString }
    </dateMsg>;
  println(theDate("John Doe").toString())
}
```

