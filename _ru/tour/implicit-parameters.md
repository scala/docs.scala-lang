---
layout: tour
title: Контекстные параметры, также известные, как неявные параметры
partof: scala-tour
num: 26
language: ru
next-page: implicit-conversions
previous-page: self-types
---

Метод может иметь список _контекстных параметров_ (_contextual parameters_),
также называемых _неявными параметрами_ (_implicit parameters_) или, точнее, _имплицитами_ (_implicits_).
Списки параметров, начинающиеся с ключевого слова `using` (или `implicit` в Scala 2), задают контекстные параметры.
Если сторона вызова явно не предоставляет аргументы для таких параметров,
Scala будет искать неявно доступные `given` (или `implicit` в Scala 2) значения правильного типа.
Если можно найти подходящие значения, то они автоматически передаются.

Лучше всего вначале показать это на небольшом примере.
Мы определяем интерфейс `Comparator[A]`, который может сравнивать элементы типа `A`,
и предоставляем две реализации для `Int`-ов и `String`-ов.
Затем мы определяем метод `max[A](x: A, y: A)`, который возвращает больший из двух аргументов.
Так как `x` и `y` имеют абстрактный тип, в общем случае мы не знаем, как их сравнивать, но можем запросить соответствующий компаратор.
Поскольку обычно для любого заданного типа существует канонический компаратор `A`,
то мы можем объявить их как _заданные_ (_given_) или _неявно_ (_implicitly_) доступные.

{% tabs implicits-comparator class=tabs-scala-version %}

{% tab 'Scala 2' for=implicits-comparator %}

```scala mdoc
trait Comparator[A] {
  def compare(x: A, y: A): Int
}

object Comparator {
  implicit object IntComparator extends Comparator[Int] {
    def compare(x: Int, y: Int): Int = Integer.compare(x, y)
  }

  implicit object StringComparator extends Comparator[String] {
    def compare(x: String, y: String): Int = x.compareTo(y)
  }
}

def max[A](x: A, y: A)(implicit comparator: Comparator[A]): A =
  if (comparator.compare(x, y) >= 0) x
  else y

println(max(10, 6))             // 10
println(max("hello", "world"))  // world
```

```scala mdoc:fail
// не компилируется:
println(max(false, true))
//         ^
//     error: could not find implicit value for parameter comparator: Comparator[Boolean]
```

Параметр `comparator` автоматически заполняется значением `Comparator.IntComparator` для `max(10, 6)`
и `Comparator.StringComparator` для `max("hello", "world")`.
Поскольку нельзя найти неявный `Comparator[Boolean]`, вызов `max(false, true)` не компилируется.

{% endtab %}

{% tab 'Scala 3' for=implicits-comparator %}

```scala
trait Comparator[A]:
def compare(x: A, y: A): Int

object Comparator:
given Comparator[Int] with
def compare(x: Int, y: Int): Int = Integer.compare(x, y)

given Comparator[String] with
def compare(x: String, y: String): Int = x.compareTo(y)
end Comparator

def max[A](x: A, y: A)(using comparator: Comparator[A]): A =
  if comparator.compare(x, y) >= 0 then x
  else y

println(max(10, 6))             // 10
println(max("hello", "world"))  // world
```

```scala
// не компилируется:
println(max(false, true))
-- Error: ----------------------------------------------------------------------
1 |println(max(false, true))
  |                        ^
  |no given instance of type Comparator[Boolean] was found for parameter comparator of method max
```

Параметр `comparator` автоматически заполняется значением `given Comparator[Int]` для `max(10, 6)`
и `given Comparator[String]` для `max("hello", "world")`.
Поскольку нельзя найти `given Comparator[Boolean]`, вызов `max(false, true)` не компилируется.

{% endtab %}

{% endtabs %}

Места, где Scala будет искать эти параметры, делятся на две категории:

- Вначале Scala будет искать `given` параметры, доступ к которым можно получить напрямую (без префикса) в месте вызова `max`.
- Затем он ищет членов, помеченных как given/implicit во всех объектах компаньонах,
  связанных с типом неявного параметра (например: `object Comparator` для типа-кандидата `Comparator[Int]`).

Более подробное руководство, о том где scala ищет неявные значения можно найти в [FAQ](/tutorials/FAQ/finding-implicits.html)
