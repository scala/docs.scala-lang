---
layout: multipage-overview
title: Первый взгляд на типы
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: chapter
description: На этой странице представлено краткое введение во встроенные типы данных Scala, включая Int, Double, String, Long, Any, AnyRef, Nothing и Null.
language: ru
num: 17
previous-page: taste-summary
next-page: string-interpolation
---

## Все значения имеют тип

В Scala все значения имеют тип, включая числовые значения и функции.
На приведенной ниже диаграмме показано подмножество иерархии типов.

<a href="{{ site.baseurl }}/resources/images/scala3-book/hierarchy.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/scala3-book/hierarchy.svg" alt="Scala 3 Type Hierarchy"></a>

## Иерархия типов Scala

`Any` - это супертип всех типов, также называемый **верхним типом** (**the top type**).
Он определяет универсальные методы, такие как `equals`, `hashCode` и `toString`.

У верхнего типа `Any` есть подтип [`Matchable`][matchable], который используется для обозначения всех типов,
для которых возможно выполнить pattern matching (сопоставление с образцом).
Важно гарантировать вызов свойства _“параметричность”_, что вкратце означает,
что мы не можем сопоставлять шаблоны для значений типа `Any`, а только для значений, которые являются подтипом `Matchable`.
[Справочная документация][matchable] содержит более подробную информацию о `Matchable`.

`Matchable` содержит два важных подтипа: `AnyVal` и `AnyRef`.

_`AnyVal`_ представляет типы значений.
Существует несколько предопределенных типов значений, и они non-nullable:
`Double`, `Float`, `Long`, `Int`, `Short`, `Byte`, `Char`, `Unit` и `Boolean`.
`Unit` - это тип значения, который не несет никакой значимой информации. Существует ровно один экземпляр `Unit` - `()`.

_`AnyRef`_ представляет ссылочные типы. Все типы, не являющиеся значениями, определяются как ссылочные типы.
Каждый пользовательский тип в Scala является подтипом `AnyRef`.
Если Scala используется в контексте среды выполнения Java, `AnyRef` соответствует `java.lang.Object`.

В языках, основанных на операторах, `void` используется для методов, которые ничего не возвращают.
В Scala для методов, которые не имеют возвращаемого значения,
такие как следующий метод, для той же цели используется `Unit`:

{% tabs unit %}
{% tab 'Scala 2 и 3' for=unit %}

```scala
def printIt(a: Any): Unit = println(a)
```

{% endtab %}
{% endtabs %}

Вот пример, демонстрирующий, что строки, целые числа, символы, логические значения и функции являются экземплярами `Any`
и могут обрабатываться так же, как и любой другой объект:

{% tabs any %}
{% tab 'Scala 2 и 3' for=any %}

```scala
val list: List[Any] = List(
  "a string",
  732,  // число
  'c',  // буква
  '\'', // Экранированный символ
  true, // булево значение
  () => "an anonymous function returning a string"
)

list.foreach(element => println(element))
```

{% endtab %}
{% endtabs %}

Код определяет список значений типа `List[Any]`.
Список инициализируется элементами различных типов, но каждый из них является экземпляром `scala.Any`,
поэтому мы можем добавить их в список.

Вот вывод программы:

```
a string
732
c
'
true
<function>
```

## Типы значений в Scala

Как показано выше, числовые типы Scala расширяют `AnyVal`, и все они являются полноценными объектами.
В этих примерах показано, как объявлять переменные этих числовых типов:

{% tabs anyval %}
{% tab 'Scala 2 и 3' for=anyval %}

```scala
val b: Byte = 1
val i: Int = 1
val l: Long = 1
val s: Short = 1
val d: Double = 2.0
val f: Float = 3.0
```

{% endtab %}
{% endtabs %}

В первых четырех примерах, если явно не указать тип, то тип числа `1` по умолчанию будет равен `Int`,
поэтому, если нужен один из других типов данных — `Byte`, `Long` или `Short` — необходимо явно объявить эти типы.
Числа с десятичной дробью (например, `2.0`) по умолчанию будут иметь тип `Double`,
поэтому, если необходим `Float`, нужно объявить `Float` явно, как показано в последнем примере.

Поскольку `Int` и `Double` являются числовыми типами по умолчанию, их можно создавать без явного объявления типа данных:

{% tabs anynum %}
{% tab 'Scala 2 и 3' for=anynum %}

```scala
val i = 123   // по умолчанию Int
val x = 1.0   // по умолчанию Double
```

{% endtab %}
{% endtabs %}

Также можно добавить символы `L`, `D`, and `F` (или их эквивалент в нижнем регистре)
для того, чтобы задать `Long`, `Double` или `Float` значения:

{% tabs type-post %}
{% tab 'Scala 2 и 3' for=type-post %}

```scala
val x = 1_000L   // val x: Long = 1000
val y = 2.2D     // val y: Double = 2.2
val z = -3.3F    // val z: Float = -3.3
```

Вы также можете использовать шестнадцатеричное представление для форматирования целых чисел
(обычно это `Int`, но также поддерживается суффикс `L` для указания `Long`):

```scala
val a = 0xACE    // val a: Int = 2766
val b = 0xfd_3aL // val b: Long = 64826
```

Scala поддерживает множество различных способов форматирования одного и того же числа с плавающей запятой,
например:

```scala
val q = .25      // val q: Double = 0.25
val r = 2.5e-1   // val r: Double = 0.25
val s = .0025e2F // val s: Float = 0.25
```

{% endtab %}
{% endtabs %}

В Scala также есть типы `String` и `Char`, которые обычно можно объявить в неявной форме:

{% tabs type-string %}
{% tab 'Scala 2 и 3' for=type-string %}

```scala
val s = "Bill"
val c = 'a'
```

{% endtab %}
{% endtabs %}

Как показано, заключайте строки в двойные кавычки или тройные кавычки для многострочных строк,
а одиночный символ заключайте в одинарные кавычки.

Типы данных и их диапазоны:

| Тип данных | Возможные значения                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Boolean    | `true` или `false`                                                                                                             |
| Byte       | 8-битное целое число в дополнении до двух со знаком (от -2^7 до 2^7-1 включительно)<br/>от -128 до 127                         |
| Short      | 16-битное целое число в дополнении до двух со знаком (от -2^15 до 2^15-1 включительно)<br/>от -32 768 до 32 767                |
| Int        | 32-битное целое число с дополнением до двух со знаком (от -2^31 до 2^31-1 включительно)<br/>от -2 147 483 648 до 2 147 483 647 |
| Long       | 64-битное целое число с дополнением до двух со знаком (от -2^63 до 2^63-1 включительно)<br/>(от -2^63 до 2^63-1 включительно)  |
| Float      | 32-разрядный IEEE 754 одинарной точности с плавающей точкой<br/>от 1,40129846432481707e-45 до 3,40282346638528860e+38          |
| Double     | 64-битный IEEE 754 двойной точности с плавающей запятой<br/>от 4,94065645841246544e-324 до 1,79769313486231570e+308            |
| Char       | 16-битный символ Unicode без знака (от 0 до 2^16-1 включительно)<br/>от 0 до 65 535                                            |
| String     | последовательность `Char`                                                                                                      |

## Строки

Строки Scala похожи на строки Java,
хотя в отличие от Java (по крайней мере, до Java 15)
в Scala легко создавать многострочные строки с тройными кавычками:

{% tabs string-mlines1 %}
{% tab 'Scala 2 и 3' for=string-mlines1 %}

```scala
val quote = """The essence of Scala:
               Fusion of functional and object-oriented
               programming in a typed setting."""
```

{% endtab %}
{% endtabs %}

Одним из недостатков этого базового подхода является то,
что строки после первой строки содержат отступ и выглядят следующим образом:

{% tabs string-mlines2 %}
{% tab 'Scala 2 и 3' for=string-mlines2 %}

```scala
"The essence of Scala:
               Fusion of functional and object-oriented
               programming in a typed setting."
```

{% endtab %}
{% endtabs %}

Если важно исключить отступ, можно поставить символ `|` перед всеми строками после первой
и вызвать метод `stripMargin` после строки:

{% tabs string-mlines3 %}
{% tab 'Scala 2 и 3' for=string-mlines3 %}

```scala
val quote = """The essence of Scala:
               |Fusion of functional and object-oriented
               |programming in a typed setting.""".stripMargin
```

{% endtab %}
{% endtabs %}

Теперь все строки выравниваются по левому краю:

{% tabs string-mlines4 %}
{% tab 'Scala 2 и 3' for=string-mlines4 %}

```scala
"The essence of Scala:
Fusion of functional and object-oriented
programming in a typed setting."
```

{% endtab %}
{% endtabs %}

Строки Scala также поддерживают мощные методы интерполяции строк,
о которых мы поговорим [в следующей главе][string-interpolation].

## `BigInt` и `BigDecimal`

Для действительно больших чисел можно использовать типы `BigInt` и `BigDecimal`:

{% tabs type-bigint %}
{% tab 'Scala 2 и 3' for=type-bigint %}

```scala
val a = BigInt(1_234_567_890_987_654_321L)
val b = BigDecimal(123456.789)
```

{% endtab %}
{% endtabs %}

Где `Double` и `Float` являются приблизительными десятичными числами,
а `BigDecimal` используется для точной арифметики, например, при работе с валютой.

`BigInt` и `BigDecimal` поддерживают все привычные числовые операторы:

{% tabs type-bigint2 %}
{% tab 'Scala 2 и 3' for=type-bigint2 %}

```scala
val b = BigInt(1234567890)   // scala.math.BigInt = 1234567890
val c = b + b                // scala.math.BigInt = 2469135780
val d = b * b                // scala.math.BigInt = 1524157875019052100
```

{% endtab %}
{% endtabs %}

## Приведение типов

Типы значений могут быть приведены следующим образом:

<a href="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg" alt="Scala Type Hierarchy"></a>

Например:

{% tabs cast1 %}
{% tab 'Scala 2 и 3' for=cast1 %}

```scala
val b: Byte = 127
val i: Int = b  // 127

val face: Char = '☺'
val number: Int = face  // 9786
```

{% endtab %}
{% endtabs %}

Вы можете привести к типу, только если нет потери информации.
В противном случае вам нужно четко указать приведение типов:

{% tabs cast2 %}
{% tab 'Scala 2 и 3' for=cast2 %}

```scala
val x: Long = 987654321
val y: Float = x.toFloat  // 9.8765434E8 (обратите внимание, что требуется `.toFloat`, потому что приведение приводит к потере точности)
val z: Long = y  // Ошибка
```

{% endtab %}
{% endtabs %}

Вы также можете привести ссылочный тип к подтипу.
Это будет рассмотрено в книге позже.

## `Nothing` и `null`

`Nothing` является подтипом всех типов, также называемым **нижним типом** (**the bottom type**).
Нет значения, которое имело бы тип `Nothing`.
Он обычно сигнализирует о прекращении, таком как thrown exception, выходе из программы или бесконечном цикле -
т.е. это тип выражения, который не вычисляется до определенного значения, или метод, который нормально не возвращается.

`Null` - это подтип всех ссылочных типов (т.е. любой подтип `AnyRef`).
Он имеет единственное значение, определяемое ключевым словом `null`.
В настоящее время применение `null` считается плохой практикой.
Его следует использовать в основном для взаимодействия с другими языками JVM.
Опция компилятора `opt-in` изменяет статус `Null`, делая все ссылочные типы non-nullable.
Этот параметр может [стать значением по умолчанию][safe-null] в будущей версии Scala.

В то же время `null` почти никогда не следует использовать в коде Scala.
Альтернативы `null` обсуждаются в главе о [функциональном программировании][fp] и в [документации API][option-api].

[reference]: {{ site.scala3ref }}/overview.html
[matchable]: {{ site.scala3ref }}/other-new-features/matchable.html
[fp]: {% link _overviews/scala3-book/fp-intro.md %}
[string-interpolation]: {% link _overviews/scala3-book/string-interpolation.md %}
[option-api]: https://scala-lang.org/api/3.x/scala/Option.html
[safe-null]: {{ site.scala3ref }}/experimental/explicit-nulls.html
