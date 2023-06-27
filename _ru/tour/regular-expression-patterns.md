---
layout: tour
title: Регулярные Выражения
partof: scala-tour
num: 15
language: ru
next-page: extractor-objects
previous-page: singleton-objects
---

Регулярные выражения (Regular expression) - это специальный шаблон для поиска данных, задаваемый в виде текстовой строки. Любая строка может быть преобразована в регулярное выражение методом `.r`.

{% tabs regex-patterns_numberPattern class=tabs-scala-version %}

{% tab 'Scala 2' for=regex-patterns_numberPattern %}

```scala mdoc
import scala.util.matching.Regex

val numberPattern: Regex = "[0-9]".r

numberPattern.findFirstMatchIn("awesomepassword") match {
  case Some(_) => println("Password OK")
  case None => println("Password must contain a number")
}
```

{% endtab %}

{% tab 'Scala 3' for=regex-patterns_numberPattern %}

```scala
import scala.util.matching.Regex

val numberPattern: Regex = "[0-9]".r

numberPattern.findFirstMatchIn("awesomepassword") match
  case Some(_) => println("Password OK")
  case None => println("Password must contain a number")
```

{% endtab %}

{% endtabs %}

В приведенном выше примере `numberPattern` - это `Regex` (регулярное выражение), которое мы используем, чтобы убедиться, что пароль содержит число.

Используя круглые скобки можно объединять сразу несколько групп регулярных выражений.

{% tabs regex-patterns_keyValPattern class=tabs-scala-version %}

{% tab 'Scala 2' for=regex-patterns_keyValPattern %}

```scala mdoc
import scala.util.matching.Regex

val keyValPattern: Regex = "([0-9a-zA-Z- ]+): ([0-9a-zA-Z-#()/. ]+)".r

val input: String =
  """background-color: #A03300;
    |background-image: url(img/header100.png);
    |background-position: top center;
    |background-repeat: repeat-x;
    |background-size: 2160px 108px;
    |margin: 0;
    |height: 108px;
    |width: 100%;""".stripMargin

for (patternMatch <- keyValPattern.findAllMatchIn(input))
  println(s"key: ${patternMatch.group(1)} value: ${patternMatch.group(2)}")
```

{% endtab %}

{% tab 'Scala 3' for=regex-patterns_keyValPattern %}

```scala
import scala.util.matching.Regex

val keyValPattern: Regex = "([0-9a-zA-Z- ]+): ([0-9a-zA-Z-#()/. ]+)".r

val input: String =
  """background-color: #A03300;
    |background-image: url(img/header100.png);
    |background-position: top center;
    |background-repeat: repeat-x;
    |background-size: 2160px 108px;
    |margin: 0;
    |height: 108px;
    |width: 100%;""".stripMargin

for patternMatch <- keyValPattern.findAllMatchIn(input) do
  println(s"key: ${patternMatch.group(1)} value: ${patternMatch.group(2)}")
```

{% endtab %}

{% endtabs %}

Здесь мы обработали сразу и ключи и значения строки. В каждом совпадении есть подгруппа совпадений. Вот как выглядит результат:

```
key: background-color value: #A03300
key: background-image value: url(img
key: background-position value: top center
key: background-repeat value: repeat-x
key: background-size value: 2160px 108px
key: margin value: 0
key: height value: 108px
key: width value: 100
```

Кроме того, регулярные выражения можно использовать в качестве шаблонов (в выражениях `match`)
для удобного извлечения совпавших групп:

{% tabs regex-patterns_saveContactInformation class=tabs-scala-version %}

{% tab 'Scala 2' for=regex-patterns_saveContactInformation %}

```scala mdoc
def saveContactInformation(contact: String): Unit = {
  import scala.util.matching.Regex

  val emailPattern: Regex = """^(\w+)@(\w+(.\w+)+)$""".r
  val phonePattern: Regex = """^(\d{3}-\d{3}-\d{4})$""".r

  contact match {
    case emailPattern(localPart, domainName, _) =>
      println(s"Hi $localPart, we have saved your email address.")
    case phonePattern(phoneNumber) =>
      println(s"Hi, we have saved your phone number $phoneNumber.")
    case _ =>
      println("Invalid contact information, neither an email address nor phone number.")
  }
}

saveContactInformation("123-456-7890")
saveContactInformation("JohnSmith@sample.domain.com")
saveContactInformation("2 Franklin St, Mars, Milky Way")
```

{% endtab %}

{% tab 'Scala 3' for=regex-patterns_saveContactInformation %}

```scala
def saveContactInformation(contact: String): Unit =
  import scala.util.matching.Regex

  val emailPattern: Regex = """^(\w+)@(\w+(.\w+)+)$""".r
  val phonePattern: Regex = """^(\d{3}-\d{3}-\d{4})$""".r

  contact match
    case emailPattern(localPart, domainName, _) =>
      println(s"Hi $localPart, we have saved your email address.")
    case phonePattern(phoneNumber) =>
      println(s"Hi, we have saved your phone number $phoneNumber.")
    case _ =>
      println("Invalid contact information, neither an email address nor phone number.")

saveContactInformation("123-456-7890")
saveContactInformation("JohnSmith@sample.domain.com")
saveContactInformation("2 Franklin St, Mars, Milky Way")
```

{% endtab %}

{% endtabs %}

Вот как выглядит результат:

```
Hi, we have saved your phone number 123-456-7890.
Hi JohnSmith, we have saved your email address.
Invalid contact information, neither an email address nor phone number.
```
