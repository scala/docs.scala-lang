---
layout: multipage-overview
title: Типы коллекций
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: На этой странице представлены общие типы коллекций Scala 3 и некоторые из их методов.
language: ru
num: 37
previous-page: collections-intro
next-page: collections-methods
---


На этой странице показаны общие коллекции Scala 3 и сопутствующие им методы.
Scala поставляется с большим количеством типов коллекций, на изучение которых может уйти время, 
поэтому желательно начать с нескольких из них, а затем использовать остальные по мере необходимости. 
Точно так же у каждого типа коллекции есть десятки методов, облегчающих разработку, 
поэтому лучше начать изучение лишь с небольшого количества.

В этом разделе представлены наиболее распространенные типы и методы коллекций,
которые вам понадобятся для начала работы.

В конце этого раздела представлены дополнительные ссылки, для более глубокого изучения коллекций.

## Три основные категории коллекций

Для коллекций Scala можно выделить три основные категории:

- **Последовательности** (**Sequences**/**Seq**) представляют собой последовательный набор элементов 
  и могут быть _индексированными_ (как массив) или _линейными_ (как связанный список)
- **Карты** (**Maps**) содержат набор пар ключ/значение, например Java `Map`, Python dictionary или Ruby `Hash`
- **Множества** (**Sets**) — это неупорядоченный набор уникальных элементов

Все они являются базовыми типами и имеют подтипы для конкретных целей, 
таких как параллелизм (concurrency), кэширование (caching) и потоковая передача (streaming). 
В дополнение к этим трем основным категориям существуют и другие полезные типы коллекций, 
включая диапазоны (ranges), стеки (stacks) и очереди (queues).


### Иерархия коллекций

В качестве краткого обзора следующие три рисунка показывают иерархию классов и трейтов в коллекциях Scala.

На первом рисунке показаны типы коллекций в пакете _scala.collection_. 
Все это высокоуровневые абстрактные классы или трейты, которые обычно имеют _неизменяемые_ и _изменяемые_ реализации.

![General collection hierarchy][collections1]

На этом рисунке показаны все коллекции в пакете _scala.collection.immutable_:

![Immutable collection hierarchy][collections2]

А на этом рисунке показаны все коллекции в пакете _scala.collection.mutable_:

![Mutable collection hierarchy][collections3]

В следующих разделах представлены некоторые из распространенных типов.

## Общие коллекции

Основные коллекции, используемые чаще всего:

| Тип коллекции  | Неизменяемая | Изменяемая | Описание                                                                                                                                                           |
|----------------|--------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `List`         | &#10003;     |            | Линейная неизменяемая последовательность (связный список)                                                                                                          |
| `Vector`       | &#10003;     |            | Индексированная неизменяемая последовательность                                                                                                                    |
| `LazyList`     | &#10003;     |            | Ленивый неизменяемый связанный список, элементы которого вычисляются только тогда, когда они необходимы; подходит для больших или бесконечных последовательностей. |
| `ArrayBuffer`  |              | &#10003;   | Подходящий тип для изменяемой индексированной последовательности                                                                                                   |
| `ListBuffer`   |              | &#10003;   | Используется, когда вам нужен изменяемый список; обычно преобразуется в `List`                                                                                     |
| `Map`          | &#10003;     | &#10003;   | Итерируемая коллекция, состоящая из пар ключей и значений                                                                                                          |
| `Set`          | &#10003;     | &#10003;   | Итерируемая коллекция без повторяющихся элементов                                                                                                                  |

Как показано, `Map` и `Set` бывают как неизменяемыми, так и изменяемыми.

Основы каждого типа демонстрируются в следующих разделах.

> В Scala _буфер_ (_buffer_), такой как `ArrayBuffer` или `ListBuffer`, представляет собой последовательность, 
> которая может увеличиваться и уменьшаться.

### Примечание о неизменяемых коллекциях

В последующих разделах всякий раз, когда используется слово _immutable_, можно с уверенностью сказать, 
что тип предназначен для использования в стиле _функционального программирования_ (ФП). 
С помощью таких типов коллекция не меняется, 
а при вызове функциональных методов возвращается новый результат - новая коллекция.

## Выбор последовательности

При выборе _последовательности_ (последовательной коллекции элементов) нужно руководствоваться двумя основными вопросами:

- должна ли последовательность индексироваться (как массив), обеспечивая быстрый доступ к любому элементу, 
  или она должна быть реализована как линейный связанный список?
- необходима изменяемая или неизменяемая коллекция?

Рекомендуемые универсальные последовательности:

| Тип\Категория               | Неизменяемая | Изменяемая    |
|-----------------------------|--------------|---------------|
| индексируемая               | `Vector`     | `ArrayBuffer` |
| линейная (связанный список) | `List`       | `ListBuffer`  |

Например, если нужна неизменяемая индексированная коллекция, в общем случае следует использовать `Vector`. 
И наоборот, если нужна изменяемая индексированная коллекция, используйте `ArrayBuffer`.

> `List` и `Vector` часто используются при написании кода в функциональном стиле. 
> `ArrayBuffer` обычно используется при написании кода в императивном стиле. 
> `ListBuffer` используется, когда стили смешиваются, например, при создании списка.

Следующие несколько разделов кратко демонстрируют типы `List`, `Vector` и `ArrayBuffer`.


## `List`

[List](https://www.scala-lang.org/api/current/scala/collection/immutable/List.html) 
представляет собой линейную неизменяемую последовательность. 
Каждый раз, когда в список добавляются или удаляются элементы, по сути создается новый список из существующего.

### Создание списка

`List` можно создать различными способами:

{% tabs list-creation %}

{% tab 'Scala 2 и 3' %}
```scala
val ints = List(1, 2, 3)
val names = List("Joel", "Chris", "Ed")

// другой путь создания списка List
val namesAgain = "Joel" :: "Chris" :: "Ed" :: Nil
```
{% endtab %}

{% endtabs %}

При желании тип списка можно объявить, хотя обычно в этом нет необходимости:

{% tabs list-type %}

{% tab 'Scala 2 и 3' %}
```scala
val ints: List[Int] = List(1, 2, 3)
val names: List[String] = List("Joel", "Chris", "Ed")
```
{% endtab %}

{% endtabs %}

Одно исключение — когда в коллекции смешанные типы; в этом случае тип желательно указывать явно:

{% tabs list-mixed-types class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
val things: List[Any] = List(1, "two", 3.0)
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
val things: List[String | Int | Double] = List(1, "two", 3.0) // с типами объединения
val thingsAny: List[Any] = List(1, "two", 3.0)                // с Any
```
{% endtab %}

{% endtabs %}

### Добавление элементов в список

Поскольку `List` неизменяем, в него нельзя добавлять новые элементы. 
Вместо этого создается новый список с добавленными к существующему списку элементами. 
Например, учитывая этот `List`:

{% tabs adding-elements-init %}

{% tab 'Scala 2 и 3' %}
```scala
val a = List(1, 2, 3)
```
{% endtab %}

{% endtabs %}

Для _добавления_ (_prepend_) одного элемента используется метод `::`, для добавления нескольких — `:::`, как показано здесь:

{% tabs adding-elements-example %}

{% tab 'Scala 2 и 3' %}
```scala
val b = 0 :: a              // List(0, 1, 2, 3)
val c = List(-1, 0) ::: a   // List(-1, 0, 1, 2, 3)
```
{% endtab %}

{% endtabs %}

Также можно _добавить_ (_append_) элементы в конец `List`, но, поскольку `List` является односвязным, 
следует добавлять к нему элементы только в начало; 
добавление элементов в конец списка — относительно медленная операция, 
особенно при работе с большими последовательностями.

> Совет: если необходимо добавлять к неизменяемой последовательности элементы в начало и конец, используйте `Vector`.

Поскольку `List` является связанным списком, 
крайне нежелательно пытаться получить доступ к элементам больших списков по значению их индекса. 
Например, если есть `List` с миллионом элементов, доступ к такому элементу, как `myList(999_999)`, 
займет относительно много времени, потому что этот запрос должен пройти почти через все элементы. 
Если есть большая коллекция и необходимо получать доступ к элементам по их индексу, 
вместо `List` используйте `Vector` или `ArrayBuffer`.

### Как запомнить названия методов

В методах Scala символ `:` представляет сторону, на которой находится последовательность, 
поэтому, когда используется метод `+:`, список нужно указывать справа:

{% tabs list-prepending %}

{% tab 'Scala 2 и 3' %}
```scala
0 +: a
```
{% endtab %}

{% endtabs %}

Аналогично, если используется `:+`, список должен быть слева:

{% tabs list-appending %}

{% tab 'Scala 2 и 3' %}
```scala
a :+ 4
```
{% endtab %}

{% endtabs %}

Кроме того, хорошей особенностью этих символических имен методов является то, что они стандартизированы. 

Те же имена методов используются с другими неизменяемыми последовательностями, такими как `Seq` и `Vector`. 
Также можно использовать несимволические имена методов для добавления элементов в начало (`a.prepended(4)`) 
или конец (`a.appended(4)`).

### Как пройтись по списку

Представим, что есть `List` имён:

{% tabs list-loop-init %}

{% tab 'Scala 2 и 3' %}
```scala
val names = List("Joel", "Chris", "Ed")
```
{% endtab %}

{% endtabs %}

Напечатать каждое имя можно следующим способом:

{% tabs list-loop-example class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
for (name <- names) println(name)
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
for name <- names do println(name)
```
{% endtab %}

{% endtabs %}

Вот как это выглядит в REPL:

{% tabs list-loop-repl class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
scala> for (name <- names) println(name)
Joel
Chris
Ed
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
scala> for name <- names do println(name)
Joel
Chris
Ed
```
{% endtab %}

{% endtabs %}


Преимуществом использования циклов `for` с коллекциями заключается в том, что Scala стандартизирован, 
и один и тот же подход работает со всеми последовательностями, 
включая `Array`, `ArrayBuffer`, `List`, `Seq`, `Vector`, `Map`, `Set` и т.д.

### Немного истории

Список Scala подобен списку из языка программирования [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)), 
который был впервые представлен в 1958 году. 
Действительно, в дополнение к привычному способу создания списка:

{% tabs list-history-init %}

{% tab 'Scala 2 и 3' %}
```scala
val ints = List(1, 2, 3)
```
{% endtab %}

{% endtabs %}

точно такой же список можно создать следующим образом:

{% tabs list-history-init2 %}

{% tab 'Scala 2 и 3' %}
```scala
val list = 1 :: 2 :: 3 :: Nil
```
{% endtab %}

{% endtabs %}

REPL показывает, как это работает:

{% tabs list-history-repl %}

{% tab 'Scala 2 и 3' %}
```scala
scala> val list = 1 :: 2 :: 3 :: Nil
list: List[Int] = List(1, 2, 3)
```
{% endtab %}

{% endtabs %}

Это работает, потому что `List` — односвязный список, оканчивающийся элементом `Nil`, 
а `::` — это метод `List`, работающий как оператор “cons” в Lisp.


### Отступление: LazyList

Коллекции Scala также включают [LazyList](https://www.scala-lang.org/api/current/scala/collection/immutable/LazyList.html), 
который представляет собой _ленивый_ неизменяемый связанный список. 
Он называется «ленивым» — или нестрогим — потому что вычисляет свои элементы только тогда, когда они необходимы.

Вы можете увидеть отложенное вычисление `LazyList` в REPL:

{% tabs lazylist-example %}

{% tab 'Scala 2 и 3' %}
```scala
val x = LazyList.range(1, Int.MaxValue)
x.take(1)      // LazyList(<not computed>)
x.take(5)      // LazyList(<not computed>)
x.map(_ + 1)   // LazyList(<not computed>)
```
{% endtab %}

{% endtabs %}

Во всех этих примерах ничего не происходит. 
Действительно, ничего не произойдет, пока вы не заставите это произойти, например, вызвав метод `foreach`:

{% tabs lazylist-evaluation-example %}

{% tab 'Scala 2 и 3' %}
```scala
scala> x.take(1).foreach(println)
1
```
{% endtab %}

{% endtabs %}

Дополнительные сведения об использовании, преимуществах и недостатках строгих и нестрогих (ленивых) коллекций 
см. в обсуждениях “строгих” и “нестрогих” на странице [Архитектура коллекции в Scala 2.13][strict].

## Vector

[Vector](https://www.scala-lang.org/api/current/scala/collection/immutable/Vector.html) - это индексируемая неизменяемая последовательность. 
“Индексируемая” часть описания означает, что она обеспечивает произвольный доступ 
и обновление за практически постоянное время, 
поэтому можно быстро получить доступ к элементам `Vector` по значению их индекса, 
например, получить доступ к `listOfPeople(123_456_789)`.

В общем, за исключением той разницы, что (а) `Vector` индексируется, а `List` - нет, 
и (б) `List` имеет метод `::`, эти два типа работают одинаково,
поэтому мы быстро пробежимся по следующим примерам.

Вот несколько способов создания `Vector`:

{% tabs vector-creation %}

{% tab 'Scala 2 и 3' %}
```scala
val nums = Vector(1, 2, 3, 4, 5)

val strings = Vector("one", "two")

case class Person(name: String)
val people = Vector(
  Person("Bert"),
  Person("Ernie"),
  Person("Grover")
)
```
{% endtab %}

{% endtabs %}

Поскольку `Vector` неизменяем, в него нельзя добавить новые элементы. 
Вместо этого создается новая последовательность, с добавленными к существующему `Vector` в начало или в конец элементами.

Например, так элементы добавляются в конец:

{% tabs vector-appending %}

{% tab 'Scala 2 и 3' %}
```scala
val a = Vector(1,2,3)         // Vector(1, 2, 3)
val b = a :+ 4                // Vector(1, 2, 3, 4)
val c = a ++ Vector(4, 5)     // Vector(1, 2, 3, 4, 5)
```
{% endtab %}

{% endtabs %}

А так - в начало Vector-а:

{% tabs vector-prepending %}

{% tab 'Scala 2 и 3' %}
```scala
val a = Vector(1,2,3)         // Vector(1, 2, 3)
val b = 0 +: a                // Vector(0, 1, 2, 3)
val c = Vector(-1, 0) ++: a   // Vector(-1, 0, 1, 2, 3)
```
{% endtab %}

{% endtabs %}

В дополнение к быстрому произвольному доступу и обновлениям, `Vector` обеспечивает быстрое добавление в начало и конец.

> Подробную информацию о производительности `Vector` и других коллекций 
> см. [в характеристиках производительности коллекций](https://docs.scala-lang.org/overviews/collections-2.13/performance-characteristics.html).

Наконец, `Vector` в цикле `for` используется точно так же, как `List`, `ArrayBuffer` или любая другая последовательность:

{% tabs vector-loop class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
scala> val names = Vector("Joel", "Chris", "Ed")
val names: Vector[String] = Vector(Joel, Chris, Ed)

scala> for (name <- names) println(name)
Joel
Chris
Ed
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
scala> val names = Vector("Joel", "Chris", "Ed")
val names: Vector[String] = Vector(Joel, Chris, Ed)

scala> for name <- names do println(name)
Joel
Chris
Ed
```
{% endtab %}

{% endtabs %}


## ArrayBuffer

`ArrayBuffer` используется тогда, когда нужна изменяемая индексированная последовательность общего назначения. 
Поскольку `ArrayBuffer` индексирован, произвольный доступ к элементам выполняется быстро.

### Создание ArrayBuffer

Чтобы использовать `ArrayBuffer`, его нужно вначале импортировать:

{% tabs arraybuffer-import %}

{% tab 'Scala 2 и 3' %}
```scala
import scala.collection.mutable.ArrayBuffer
```
{% endtab %}

{% endtabs %}

Если необходимо начать с пустого `ArrayBuffer`, просто укажите его тип:

{% tabs arraybuffer-creation %}

{% tab 'Scala 2 и 3' %}
```scala
var strings = ArrayBuffer[String]()
var ints = ArrayBuffer[Int]()
var people = ArrayBuffer[Person]()
```
{% endtab %}

{% endtabs %}

Если известен примерный размер `ArrayBuffer`, его можно задать:

{% tabs list-creation-with-size %}

{% tab 'Scala 2 и 3' %}
```scala
// готов вместить 100 000 чисел
val buf = new ArrayBuffer[Int](100_000)
```
{% endtab %}

{% endtabs %}

Чтобы создать новый `ArrayBuffer` с начальными элементами, 
достаточно просто указать начальные элементы, как для `List` или `Vector`:

{% tabs arraybuffer-init %}

{% tab 'Scala 2 и 3' %}
```scala
val nums = ArrayBuffer(1, 2, 3)
val people = ArrayBuffer(
  Person("Bert"),
  Person("Ernie"),
  Person("Grover")
)
```
{% endtab %}

{% endtabs %}

### Добавление элементов в ArrayBuffer

Новые элементы добавляются в `ArrayBuffer` с помощью методов `+=` и `++=`. 
Также можно использовать текстовый аналог: `append`, `appendAll`, `insert`, `insertAll`, `prepend` и `prependAll`. 
Вот несколько примеров с `+=` и `++=`:

{% tabs arraybuffer-add %}

{% tab 'Scala 2 и 3' %}
```scala
val nums = ArrayBuffer(1, 2, 3)   // ArrayBuffer(1, 2, 3)
nums += 4                         // ArrayBuffer(1, 2, 3, 4)
nums ++= List(5, 6)               // ArrayBuffer(1, 2, 3, 4, 5, 6)
```
{% endtab %}

{% endtabs %}

### Удаление элементов из ArrayBuffer

`ArrayBuffer` является изменяемым, 
поэтому у него есть такие методы, как `-=`, `--=`, `clear`, `remove` и другие. 
Примеры с `-=` и `--=`:

{% tabs arraybuffer-remove %}

{% tab 'Scala 2 и 3' %}
```scala
val a = ArrayBuffer.range('a', 'h')   // ArrayBuffer(a, b, c, d, e, f, g)
a -= 'a'                              // ArrayBuffer(b, c, d, e, f, g)
a --= Seq('b', 'c')                   // ArrayBuffer(d, e, f, g)
a --= Set('d', 'e')                   // ArrayBuffer(f, g)
```
{% endtab %}

{% endtabs %}

### Обновление элементов в ArrayBuffer

Элементы в `ArrayBuffer` можно обновлять, либо переназначать:

{% tabs arraybuffer-update %}

{% tab 'Scala 2 и 3' %}
```scala
val a = ArrayBuffer.range(1,5)        // ArrayBuffer(1, 2, 3, 4)
a(2) = 50                             // ArrayBuffer(1, 2, 50, 4)
a.update(0, 10)                       // ArrayBuffer(10, 2, 50, 4)
```
{% endtab %}

{% endtabs %}



## Maps

`Map` — это итерируемая коллекция, состоящая из пар ключей и значений. 
В Scala есть как изменяемые, так и неизменяемые типы `Map`. 
В этом разделе показано, как использовать _неизменяемый_ `Map`.

### Создание неизменяемой Map

Неизменяемая `Map` создается следующим образом:

{% tabs map-init %}

{% tab 'Scala 2 и 3' %}
```scala
val states = Map(
  "AK" -> "Alaska",
  "AL" -> "Alabama",
  "AZ" -> "Arizona"
)
```
{% endtab %}

{% endtabs %}

Перемещаться по элементам `Map` в цикле `for` можно следующим образом:

{% tabs map-loop class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
for ((k, v) <- states)  println(s"key: $k, value: $v")
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
for (k, v) <- states do println(s"key: $k, value: $v")
```
{% endtab %}

{% endtabs %}
 
REPL показывает, как это работает:

{% tabs map-repl class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
scala> for ((k, v) <- states)  println(s"key: $k, value: $v")
key: AK, value: Alaska
key: AL, value: Alabama
key: AZ, value: Arizona
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
scala> for (k, v) <- states do println(s"key: $k, value: $v")
key: AK, value: Alaska
key: AL, value: Alabama
key: AZ, value: Arizona
```
{% endtab %}

{% endtabs %}

### Доступ к элементам Map

Доступ к элементам `Map` осуществляется через указание в скобках значения ключа:

{% tabs map-access-element %}

{% tab 'Scala 2 и 3' %}
```scala
val ak = states("AK")   // ak: String = Alaska
val al = states("AL")   // al: String = Alabama
```
{% endtab %}

{% endtabs %}

На практике также используются такие методы, как `keys`, `keySet`, `keysIterator`, `for` выражения
и функции высшего порядка, такие как `map`, для работы с ключами и значениями `Map`.

### Добавление элемента в Map

При добавлении элементов в неизменяемую карту с помощью `+` и `++`, создается новая карта:

{% tabs map-add-element %}

{% tab 'Scala 2 и 3' %}
```scala
val a = Map(1 -> "one")    // a: Map(1 -> one)
val b = a + (2 -> "two")   // b: Map(1 -> one, 2 -> two)
val c = b ++ Seq(
  3 -> "three",
  4 -> "four"
)
// c: Map(1 -> one, 2 -> two, 3 -> three, 4 -> four)
```
{% endtab %}

{% endtabs %}

### Удаление элементов из Map

Элементы удаляются с помощью методов `-` или `--`. 
В случае неизменяемой `Map` создается новый экземпляр, который нужно присвоить новой переменной:

{% tabs map-remove-element %}

{% tab 'Scala 2 и 3' %}
```scala
val a = Map(
  1 -> "one",
  2 -> "two",
  3 -> "three",
  4 -> "four"
)

val b = a - 4       // b: Map(1 -> one, 2 -> two, 3 -> three)
val c = a - 4 - 3   // c: Map(1 -> one, 2 -> two)
```
{% endtab %}

{% endtabs %}

### Обновление элементов в Map

Чтобы обновить элементы на неизменяемой `Map`, используется метод `update` (или оператор `+`):

{% tabs map-update-element %}

{% tab 'Scala 2 и 3' %}
```scala
val a = Map(
  1 -> "one",
  2 -> "two",
  3 -> "three"
)

val b = a.updated(3, "THREE!")   // b: Map(1 -> one, 2 -> two, 3 -> THREE!)
val c = a + (2 -> "TWO...")      // c: Map(1 -> one, 2 -> TWO..., 3 -> three)
```
{% endtab %}

{% endtabs %}

### Перебор элементов в Map

Элементы в `Map` можно перебрать с помощью цикла `for`, как и для остальных коллекций:

{% tabs map-traverse class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
val states = Map(
  "AK" -> "Alaska",
  "AL" -> "Alabama",
  "AZ" -> "Arizona"
)

for ((k, v) <- states) println(s"key: $k, value: $v")
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
val states = Map(
  "AK" -> "Alaska",
  "AL" -> "Alabama",
  "AZ" -> "Arizona"
)

for (k, v) <- states do println(s"key: $k, value: $v")
```
{% endtab %}

{% endtabs %}

Существует _много_ способов работы с ключами и значениями на `Map`. 
Общие методы `Map` включают `foreach`, `map`, `keys` и `values`.

В Scala есть много других специализированных типов `Map`, 
включая `CollisionProofHashMap`, `HashMap`, `LinkedHashMap`, `ListMap`, `SortedMap`, `TreeMap`, `WeakHashMap` и другие.


## Работа с множествами

Множество ([Set]({{site.baseurl}}/overviews/collections-2.13/sets.html)) - итерируемая коллекция без повторяющихся элементов.

В Scala есть как изменяемые, так и неизменяемые типы `Set`. 
В этом разделе демонстрируется _неизменяемое_ множество.

### Создание множества

Создание нового пустого множества:

{% tabs set-creation %}

{% tab 'Scala 2 и 3' %}
```scala
val nums = Set[Int]()
val letters = Set[Char]()
```
{% endtab %}

{% endtabs %}

Создание множества с исходными данными:

{% tabs set-init %}

{% tab 'Scala 2 и 3' %}
```scala
val nums = Set(1, 2, 3, 3, 3)           // Set(1, 2, 3)
val letters = Set('a', 'b', 'c', 'c')   // Set('a', 'b', 'c')
```
{% endtab %}

{% endtabs %}


### Добавление элементов в множество

В неизменяемое множество новые элементы добавляются с помощью `+` и `++`, результат присваивается новой переменной:

{% tabs set-add-element %}

{% tab 'Scala 2 и 3' %}
```scala
val a = Set(1, 2)                // Set(1, 2)
val b = a + 3                    // Set(1, 2, 3)
val c = b ++ Seq(4, 1, 5, 5)     // HashSet(5, 1, 2, 3, 4)
```
{% endtab %}

{% endtabs %}

Стоит отметить, что повторяющиеся элементы не добавляются в множество, 
а также, что порядок элементов произвольный.


### Удаление элементов из множества

Элементы из множества удаляются с помощью методов `-` и `--`, результат также должен присваиваться новой переменной:

{% tabs set-remove-element %}

{% tab 'Scala 2 и 3' %}
```scala
val a = Set(1, 2, 3, 4, 5)   // HashSet(5, 1, 2, 3, 4)
val b = a - 5                // HashSet(1, 2, 3, 4)
val c = b -- Seq(3, 4)       // HashSet(1, 2)
```
{% endtab %}

{% endtabs %}



## Диапазон (Range)

`Range` часто используется для заполнения структур данных и для `for` выражений. 
Эти REPL примеры демонстрируют, как создавать диапазоны:

{% tabs range-init %}

{% tab 'Scala 2 и 3' %}
```scala
1 to 5         // Range(1, 2, 3, 4, 5)
1 until 5      // Range(1, 2, 3, 4)
1 to 10 by 2   // Range(1, 3, 5, 7, 9)
'a' to 'c'     // NumericRange(a, b, c)
```
{% endtab %}

{% endtabs %}

Range можно использовать для заполнения коллекций:

{% tabs range-conversion %}

{% tab 'Scala 2 и 3' %}
```scala
val x = (1 to 5).toList     // List(1, 2, 3, 4, 5)
val x = (1 to 5).toBuffer   // ArrayBuffer(1, 2, 3, 4, 5)
```
{% endtab %}

{% endtabs %}

Они также используются в `for` выражениях:

{% tabs range-iteration class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
scala> for (i <- 1 to 3) println(i)
1
2
3
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
scala> for i <- 1 to 3 do println(i)
1
2
3
```
{% endtab %}

{% endtabs %}

Во многих коллекциях есть метод `range`:

{% tabs range-methods %}

{% tab 'Scala 2 и 3' %}
```scala
Vector.range(1, 5)       // Vector(1, 2, 3, 4)
List.range(1, 10, 2)     // List(1, 3, 5, 7, 9)
Set.range(1, 10)         // HashSet(5, 1, 6, 9, 2, 7, 3, 8, 4)
```
{% endtab %}

{% endtabs %}

Диапазоны также полезны для создания тестовых коллекций:

{% tabs range-tests %}

{% tab 'Scala 2 и 3' %}
```scala
val evens = (0 to 10 by 2).toList     // List(0, 2, 4, 6, 8, 10)
val odds = (1 to 10 by 2).toList      // List(1, 3, 5, 7, 9)
val doubles = (1 to 5).map(_ * 2.0)   // Vector(2.0, 4.0, 6.0, 8.0, 10.0)

// Создание Map
val map = (1 to 3).map(e => (e,s"$e")).toMap
// map: Map[Int, String] = Map(1 -> "1", 2 -> "2", 3 -> "3")
```
{% endtab %}

{% endtabs %}


## Больше деталей

Если вам нужна дополнительная информация о специализированных коллекциях, см. следующие ресурсы:

- [Конкретные неизменяемые классы коллекций](https://docs.scala-lang.org/overviews/collections-2.13/concrete-immutable-collection-classes.html)
- [Конкретные изменяемые классы коллекций](https://docs.scala-lang.org/overviews/collections-2.13/concrete-mutable-collection-classes.html)
- [Как устроены коллекции? Какую из них следует выбрать?](https://docs.scala-lang.org/tutorials/FAQ/collections.html)



[strict]: {% link _overviews/core/architecture-of-scala-213-collections.md %}
[collections1]: /resources/images/tour/collections-diagram-213.svg
[collections2]: /resources/images/tour/collections-immutable-diagram-213.svg
[collections3]: /resources/images/tour/collections-mutable-diagram-213.svg
