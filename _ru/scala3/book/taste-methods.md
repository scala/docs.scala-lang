---
layout: multipage-overview
title: Методы
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе представлено введение в определение и использование методов в Scala 3.
language: ru
num: 10
previous-page: taste-modeling
next-page: taste-functions
---


## Методы в Scala

Классы Scala, case-классы, трейты, перечисления и объекты могут содержать методы. 
Синтаксис простого метода выглядит так:

{% tabs method_1 %}
{% tab 'Scala 2 and 3' for=method_1 %}
```scala
def methodName(param1: Type1, param2: Type2): ReturnType =
  // тело метода
  // находится здесь
```
{% endtab %}
{% endtabs %}

Вот несколько примеров:

{% tabs method_2 %}
{% tab 'Scala 2 and 3' for=method_2 %}
```scala
def sum(a: Int, b: Int): Int = a + b
def concatenate(s1: String, s2: String): String = s1 + s2
```
{% endtab %}
{% endtabs %}

Вам не нужно объявлять возвращаемый тип метода, поэтому можно написать эти методы следующим образом, если хотите:

{% tabs method_3 %}
{% tab 'Scala 2 and 3' for=method_3 %}
```scala
def sum(a: Int, b: Int) = a + b
def concatenate(s1: String, s2: String) = s1 + s2
```
{% endtab %}
{% endtabs %}

Вот как эти методы вызываются:

{% tabs method_4 %}
{% tab 'Scala 2 and 3' for=method_4 %}
```scala
val x = sum(1, 2)
val y = concatenate("foo", "bar")
```
{% endtab %}
{% endtabs %}

Вот пример многострочного метода:

{% tabs method_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_5 %}
```scala
def getStackTraceAsString(t: Throwable): String = {
  val sw = new StringWriter
  t.printStackTrace(new PrintWriter(sw))
  sw.toString
}
```
{% endtab %}

{% tab 'Scala 3' for=method_5 %}
```scala
def getStackTraceAsString(t: Throwable): String =
  val sw = new StringWriter
  t.printStackTrace(new PrintWriter(sw))
  sw.toString
```
{% endtab %}
{% endtabs %}

Параметры метода также могут иметь значения по умолчанию. 
В этом примере параметр `timeout` имеет значение по умолчанию `5000`:

{% tabs method_6 %}
{% tab 'Scala 2 and 3' for=method_6 %}
```scala
def makeConnection(url: String, timeout: Int = 5000): Unit =
  println(s"url=$url, timeout=$timeout")
```
{% endtab %}
{% endtabs %}

Поскольку в объявлении метода указано значение по умолчанию для `timeout`, метод можно вызывать двумя способами:

{% tabs method_7 %}
{% tab 'Scala 2 and 3' for=method_7 %}
```scala
makeConnection("https://localhost")         // url=http://localhost, timeout=5000
makeConnection("https://localhost", 2500)   // url=http://localhost, timeout=2500
```
{% endtab %}
{% endtabs %}

Scala также поддерживает использование _именованных параметров_ при вызове метода, 
поэтому вы можете вызвать этот метод, если хотите, вот так:

{% tabs method_8 %}
{% tab 'Scala 2 and 3' for=method_8 %}
```scala
makeConnection(
  url = "https://localhost",
  timeout = 2500
)
```
{% endtab %}
{% endtabs %}

Именованные параметры особенно полезны, когда несколько параметров метода имеют один и тот же тип. 
Глядя на этот метод можно задаться вопросом, 
какие параметры установлены в `true` или `false`:

{% tabs method_9 %}
{% tab 'Scala 2 and 3' for=method_9 %}

```scala
engage(true, true, true, false)
```

{% endtab %}
{% endtabs %}

Ключевое слово `extension` объявляет о намерении определить один или несколько методов расширения для параметра, 
заключенного в круглые скобки. 
Как показано в этом примере, параметр `s` типа `String` можно затем использовать в теле методов расширения.

В следующем примере показано, как добавить метод `makeInt` в класс `String`. 
Здесь `makeInt` принимает параметр с именем `radix`. 
Код не учитывает возможные ошибки преобразования строки в целое число, 
но, опуская эту деталь, примеры показывают, как работают методы расширения:

{% tabs extension %}
{% tab 'Scala 3 Only' %}

```scala
extension (s: String)
  def makeInt(radix: Int): Int = Integer.parseInt(s, radix)

"1".makeInt(2)      // Int = 1
"10".makeInt(2)     // Int = 2
"100".makeInt(2)    // Int = 4
```

{% endtab %}
{% endtabs %}

## Смотрите также

Методы Scala могут быть гораздо более мощными: они могут принимать параметры типа и параметры контекста.
Методы подробно описаны в разделе ["Моделирование предметной области"][data-1].

[data-1]: {% link _overviews/scala3-book/domain-modeling-tools.md %}
