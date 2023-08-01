---
layout: multipage-overview
title: Параметры контекста
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: На этой странице показано, как объявлять параметры контекста и как компилятор выводит их на стороне вызова.
language: ru
num: 61
previous-page: ca-extension-methods
next-page: ca-context-bounds
---

Scala предлагает две важные функции для контекстной абстракции:

- **Параметры контекста** позволяют указать параметры, которые на стороне вызова могут быть опущены программистом
  и должны автоматически предоставляться контекстом.
- **Экземпляры given** (в Scala 3) или **неявные определения** (в Scala 2) — это термины,
  которые компилятор Scala может использовать для заполнения отсутствующих аргументов.

## Параметры контекста

При проектировании системы зачастую необходимо предоставлять контекстную информацию,
такую как конфигурация или настройки, различным компонентам вашей системы.
Одним из распространенных способов добиться этого является передача конфигурации
в качестве дополнительного аргумента методам.

В следующем примере мы определяем кейс класс `Config` для моделирования некоторой конфигурации веб-сайта
и передаем ее в различных методах.

{% tabs example %}
{% tab 'Scala 2 и 3' %}

```scala
case class Config(port: Int, baseUrl: String)

def renderWebsite(path: String, config: Config): String =
  "<html>" + renderWidget(List("cart"), config)  + "</html>"

def renderWidget(items: List[String], config: Config): String = ???

val config = Config(8080, "docs.scala-lang.org")
renderWebsite("/home", config)
```

{% endtab %}
{% endtabs %}

Предположим, что конфигурация не меняется на протяжении большей части нашей кодовой базы.
Передача `config` каждому вызову метода (например `renderWidget`) становится очень утомительной
и делает нашу программу более трудной для чтения, поскольку нам нужно игнорировать аргумент `config`.

### Установка параметров как контекстных

Мы можем пометить некоторые параметры наших методов как _контекстные_.

{% tabs 'contextual-parameters' class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
def renderWebsite(path: String)(implicit config: Config): String =
    "<html>" + renderWidget(List("cart")) + "</html>"
    //                                  ^
    //                   аргумент config больше не требуется

def renderWidget(items: List[String])(implicit config: Config): String = ???
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
def renderWebsite(path: String)(using config: Config): String =
    "<html>" + renderWidget(List("cart")) + "</html>"
    //                                  ^
    //                   аргумент config больше не требуется

def renderWidget(items: List[String])(using config: Config): String = ???
```

{% endtab %}
{% endtabs %}

Начав секцию параметров с ключевого слова `using` в Scala 3 или `implicit` в Scala 2, мы сообщаем компилятору,
что на стороне вызова он должен автоматически найти аргумент с необходимым типом.
Таким образом, компилятор Scala выполняет **вывод термов**.

При вызове `renderWidget(List("cart"))` компилятор Scala увидит, что в области видимости есть терм типа `Config` 
(в нашем случае - `config`) и автоматически предоставит его для `renderWidget`.
Таким образом, программа эквивалентна приведенной выше.

На самом деле, поскольку в реализации `renderWebsite` больше не нужно ссылаться на `config`,
мы можем даже опустить его имя в подписи в Scala 3:

{% tabs 'anonymous' %}
{% tab 'Только в Scala 3' %}

```scala
//                нет необходимости придумывать имя параметра
//                             vvvvvvvvvvvvv
def renderWebsite(path: String)(using Config): String =
    "<html>" + renderWidget(List("cart")) + "</html>"
```

{% endtab %}
{% endtabs %}

В Scala 2 именовать неявные параметры по-прежнему необходимо.

### Явное указание контекстных параметров

Мы увидели, как _абстрагироваться_ от контекстных параметров
и что компилятор Scala может автоматически предоставлять нам аргументы.
Но как мы можем указать, какую конфигурацию использовать для нашего вызова `renderWebsite`?

{% tabs 'explicit' class=tabs-scala-version %}
{% tab 'Scala 2' %}

Мы явно указываем значение аргумента, как если бы это был обычный аргумент:

```scala
renderWebsite("/home")(config)
```

{% endtab %}
{% tab 'Scala 3' %}

Подобно тому, как мы указали наш раздел параметров с помощью `using`,
мы также можем явно указать контекстные параметры с помощью `using`:

```scala
renderWebsite("/home")(using config)
```

{% endtab %}
{% endtabs %}

Явное предоставление контекстных параметров может быть полезно,
когда у нас в области видимости есть несколько разных значений,
подходящих по типу, и мы хотим убедиться в корректности передачи параметра методу.

Для всех остальных случаев, как мы увидим в следующем разделе,
есть еще один способ ввести контекстуальные значения в область видимости.

## Экземпляры given (определения implicit в Scala 2)

Мы видели, что можем явно передавать аргументы в качестве контекстных параметров.
Однако, если для определенного типа существует _единственное каноническое значение_,
есть другой предпочтительный способ сделать его доступным для компилятора Scala:
пометив его как `given` в Scala 3 или `implicit` в Scala 2.

{% tabs 'instances' class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
implicit val config: Config = Config(8080, "docs.scala-lang.org")
//           ^^^^^^
// это значение, которое выведет компилятор Scala
// в качестве аргумента контекстного параметра типа Config
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
val config = Config(8080, "docs.scala-lang.org")

// это тип, который мы хотим предоставить для канонического значения
//    vvvvvv
given Config = config
//             ^^^^^^
// это значение, которое выведет компилятор Scala
// в качестве аргумента контекстного параметра типа Config
```

{% endtab %}
{% endtabs %}

В приведенном выше примере мы указываем, что всякий раз,
когда в текущей области видимости опущен контекстный параметр типа `Config`,
компилятор должен вывести `config` в качестве аргумента.

Определив каноническое значение для типа `Config`,
мы можем вызвать `renderWebsite` следующим образом:

```scala
renderWebsite("/home")
//                   ^
//   снова без аргумента
```

Подробное руководство о том, где Scala ищет канонические значения, можно найти в [FAQ]({% link _overviews/FAQ/index.md %}#where-does-scala-look-for-implicits).

[reference]: {{ site.scala3ref }}/overview.html
[blog-post]: /2020/11/06/explicit-term-inference-in-scala-3.html
