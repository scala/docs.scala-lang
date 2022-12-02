---
layout: multipage-overview
title: Методы в коллекциях
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: На этой странице показаны общие методы классов коллекций Scala 3.
language: ru
num: 38
previous-page: collections-classes
next-page: collections-summary
---



Важным преимуществом коллекций Scala является то, что они поставляются с десятками методов “из коробки”, 
которые доступны как для неизменяемых, так и для изменяемых типов коллекций. 
Больше нет необходимости писать пользовательские циклы `for` каждый раз, когда нужно работать с коллекцией. 
При переходе от одного проекта к другому, можно обнаружить, что используются одни и те же методы.

В коллекциях доступны _десятки_ методов, поэтому здесь показаны не все из них. 
Показаны только некоторые из наиболее часто используемых методов, в том числе:

- `map`
- `filter`
- `foreach`
- `head`
- `tail`
- `take`, `takeWhile`
- `drop`, `dropWhile`
- `reduce`

Следующие методы работают со всеми типами последовательностей, включая `List`, `Vector`, `ArrayBuffer` и т.д.
Примеры рассмотрены на `List`-е, если не указано иное.

> Важно напомнить, что ни один из методов в `List` не изменяет список. 
> Все они работают в функциональном стиле, то есть возвращают новую коллекцию с измененными результатами.

## Примеры распространенных методов

Для общего представления в примерах ниже показаны некоторые из наиболее часто используемых методов коллекций. 
Вот несколько методов, которые не используют лямбда-выражения:

{% tabs common-method-examples %}

{% tab 'Scala 2 и 3' %}
```scala
val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)

a.distinct                            // List(10, 20, 30, 40)
a.drop(2)                             // List(30, 40, 10)
a.dropRight(2)                        // List(10, 20, 30)
a.head                                // 10
a.headOption                          // Some(10)
a.init                                // List(10, 20, 30, 40)
a.intersect(List(19,20,21))           // List(20)
a.last                                // 10
a.lastOption                          // Some(10)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeRight(2)                        // List(40, 10)
```
{% endtab %}

{% endtabs %}


### Функции высшего порядка и лямбда-выражения

Далее будут показаны некоторые часто используемые функции высшего порядка (HOF), 
которые принимают лямбды (анонимные функции). 
Для начала приведем несколько вариантов лямбда-синтаксиса, 
начиная с самой длинной формы, поэтапно переходящей к наиболее сжатой:

{% tabs higher-order-functions-example %}

{% tab 'Scala 2 и 3' %}
```scala
// все эти функции одинаковые и возвращают
// одно и тоже: List(10, 20, 10)

a.filter((i: Int) => i < 25)   // 1. наиболее расширенная форма
a.filter((i) => i < 25)        // 2. `Int` необязателен
a.filter(i => i < 25)          // 3. скобки можно опустить
a.filter(_ < 25)               // 4. `i` необязателен
```
{% endtab %}

{% endtabs %}

В этих примерах:

1. Первый пример показывает самую длинную форму. 
   Такое многословие требуется _редко_, только в самых сложных случаях.
2. Компилятор знает, что `a` содержит `Int`, поэтому нет необходимости повторять это в функции.
3. Если в функции только один параметр, например `i`, то скобки не нужны.
4. В случае одного параметра, если он появляется в анонимной функции только раз, его можно заменить на `_`.

В главе [Анонимные функции][lambdas] представлена более подробная информация 
и примеры правил, связанных с сокращением лямбда-выражений.

Примеры других HOF, использующих краткий лямбда-синтаксис:

{% tabs anonymous-functions-example %}

{% tab 'Scala 2 и 3' %}
```scala
a.dropWhile(_ < 25)   // List(30, 40, 10)
a.filter(_ > 100)     // List()
a.filterNot(_ < 25)   // List(30, 40)
a.find(_ > 20)        // Some(30)
a.takeWhile(_ < 30)   // List(10, 20)
```
{% endtab %}

{% endtabs %}

Важно отметить, что HOF также принимают в качестве параметров методы и функции, а не только лямбда-выражения. 
Вот несколько примеров, в которых используется метод с именем `double`. 
Снова показаны несколько вариантов лямбда-выражений:

{% tabs method-as-parameter-example %}

{% tab 'Scala 2 и 3' %}
```scala
def double(i: Int) = i * 2

// these all return `List(20, 40, 60, 80, 20)`
a.map(i => double(i))
a.map(double(_))
a.map(double)
```
{% endtab %}

{% endtabs %}

В последнем примере, когда анонимная функция состоит из одного вызова функции, принимающей один аргумент, 
нет необходимости указывать имя аргумента, поэтому даже `_` не требуется.

Наконец, HOF можно комбинировать:

{% tabs higher-order-functions-combination-example %}

{% tab 'Scala 2 и 3' %}
```scala
// выдает `List(100, 200)`
a.filter(_ < 40)
 .takeWhile(_ < 30)
 .map(_ * 10)
```
{% endtab %}

{% endtabs %}


## Пример данных

В следующих разделах используются такие списки:

{% tabs sample-data %}

{% tab 'Scala 2 и 3' %}
```scala
val oneToTen = (1 to 10).toList
val names = List("adam", "brandy", "chris", "david")
```
{% endtab %}

{% endtabs %}


## `map`

Метод `map` проходит через каждый элемент в списке, применяя переданную функцию к элементу, по одному за раз; 
затем возвращается новый список с измененными элементами.

Вот пример применения метода `map` к списку `oneToTen`:

{% tabs map-example %}

{% tab 'Scala 2 и 3' %}
```scala
scala> val doubles = oneToTen.map(_ * 2)
doubles: List[Int] = List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)
```
{% endtab %}

{% endtabs %}

Также можно писать анонимные функции, используя более длинную форму, например:

{% tabs map-example-anonymous %}

{% tab 'Scala 2 и 3' %}
```scala
scala> val doubles = oneToTen.map(i => i * 2)
doubles: List[Int] = List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)
```
{% endtab %}

{% endtabs %}

Однако в этом документе будет всегда использоваться первая, более короткая форма.

Вот еще несколько примеров применения метода `map` к `oneToTen` и `names`:

{% tabs few-more-examples %}

{% tab 'Scala 2 и 3' %}
```scala
scala> val capNames = names.map(_.capitalize)
capNames: List[String] = List(Adam, Brandy, Chris, David)

scala> val nameLengthsMap = names.map(s => (s, s.length)).toMap
nameLengthsMap: Map[String, Int] = Map(adam -> 4, brandy -> 6, chris -> 5, david -> 5)

scala> val isLessThanFive = oneToTen.map(_ < 5)
isLessThanFive: List[Boolean] = List(true, true, true, true, false, false, false, false, false, false)
```
{% endtab %}

{% endtabs %}

Как показано в последних двух примерах, совершенно законно (и распространено) использование `map` для возврата коллекции, 
которая имеет тип, отличный от исходного типа.


## `filter`

Метод `filter` создает новый список, содержащий только те элементы, которые удовлетворяют предоставленному предикату. 
Предикат или условие — это функция, которая возвращает `Boolean` (`true` или `false`). 
Вот несколько примеров:

{% tabs filter-example %}

{% tab 'Scala 2 и 3' %}
```scala
scala> val lessThanFive = oneToTen.filter(_ < 5)
lessThanFive: List[Int] = List(1, 2, 3, 4)

scala> val evens = oneToTen.filter(_ % 2 == 0)
evens: List[Int] = List(2, 4, 6, 8, 10)

scala> val shortNames = names.filter(_.length <= 4)
shortNames: List[String] = List(adam)
```
{% endtab %}

{% endtabs %}

Отличительной особенностью функциональных методов коллекций является то, 
что их можно объединять вместе для решения задач. 
Например, в этом примере показано, как связать `filter` и `map`:

{% tabs filter-example-anonymous %}

{% tab 'Scala 2 и 3' %}
```scala
oneToTen.filter(_ < 4).map(_ * 10)
```
{% endtab %}

{% endtabs %}

REPL показывает результат:

{% tabs filter-example-anonymous-repl %}

{% tab 'Scala 2 и 3' %}
```scala
scala> oneToTen.filter(_ < 4).map(_ * 10)
val res1: List[Int] = List(10, 20, 30)
```
{% endtab %}

{% endtabs %}


## `foreach`

Метод `foreach` используется для перебора всех элементов коллекции. 
Стоит обратить внимание, что `foreach` используется для побочных эффектов, таких как печать информации. 
Вот пример с `names`:

{% tabs foreach-example %}

{% tab 'Scala 2 и 3' %}
```scala
scala> names.foreach(println)
adam
brandy
chris
david
```
{% endtab %}

{% endtabs %}



## `head`

Метод `head` взят из Lisp и других более ранних языков функционального программирования. 
Он используется для доступа к первому элементу (головному (_head_) элементу) списка:

{% tabs head-example %}

{% tab 'Scala 2 и 3' %}
```scala
oneToTen.head   // 1
names.head      // adam
```
{% endtab %}

{% endtabs %}

`String` можно рассматривать как последовательность символов, т.е. строка также является коллекцией, 
а значит содержит соответствующие методы. 
Вот как `head` работает со строками:

{% tabs string-head-example %}

{% tab 'Scala 2 и 3' %}
```scala
"foo".head   // 'f'
"bar".head   // 'b'
```
{% endtab %}

{% endtabs %}

`head` — отличный метод для работы, но в качестве предостережения следует помнить, что 
он также может генерировать исключение при вызове для пустой коллекции:

{% tabs head-error-example %}

{% tab 'Scala 2 и 3' %}
```scala
val emptyList = List[Int]()   // emptyList: List[Int] = List()
emptyList.head                // java.util.NoSuchElementException: head of empty list
```
{% endtab %}

{% endtabs %}

Чтобы не натыкаться на исключение вместо `head` желательно использовать `headOption`, 
особенно при разработке в функциональном стиле:

{% tabs head-option-example %}

{% tab 'Scala 2 и 3' %}
```scala
emptyList.headOption          // None
```
{% endtab %}

{% endtabs %}

`headOption` не генерирует исключение, а возвращает тип `Option` со значением `None`. 
Более подробно о функциональном стиле программирования будет рассказано [в соответствующей главе][fp-intro].


## `tail`

Метод `tail` также взят из Lisp и используется для вывода всех элементов в списке после `head`.

{% tabs tail-example %}

{% tab 'Scala 2 и 3' %}
```scala
oneToTen.head   // 1
oneToTen.tail   // List(2, 3, 4, 5, 6, 7, 8, 9, 10)

names.head      // adam
names.tail      // List(brandy, chris, david)
```
{% endtab %}

{% endtabs %}

Так же, как и `head`, `tail` можно использовать со строками:

{% tabs string-tail-example %}

{% tab 'Scala 2 и 3' %}
```scala
"foo".tail   // "oo"
"bar".tail   // "ar"
```
{% endtab %}

{% endtabs %}

`tail` выбрасывает исключение _java.lang.UnsupportedOperationException_, если список пуст, 
поэтому, как и в случае с `head` и `headOption`, существует также метод `tailOption`, 
который предпочтительнее в функциональном программировании.

Список матчится, поэтому можно использовать такие выражения:

{% tabs tail-match-example %}

{% tab 'Scala 2 и 3' %}
```scala
val x :: xs = names
```
{% endtab %}

{% endtabs %}

Помещение этого кода в REPL показывает, что `x` назначается заглавному элементу списка, а `xs` назначается "хвосту":

{% tabs tail-match-example-repl %}

{% tab 'Scala 2 и 3' %}
```scala
scala> val x :: xs = names
val x: String = adam
val xs: List[String] = List(brandy, chris, david)
```
{% endtab %}

{% endtabs %}

Подобное сопоставление с образцом полезно во многих случаях, например, при написании метода `sum` с использованием рекурсии:

{% tabs tail-match-sum-example class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
def sum(list: List[Int]): Int = list match {
  case Nil => 0
  case x :: xs => x + sum(xs)
}
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
def sum(list: List[Int]): Int = list match
  case Nil => 0
  case x :: xs => x + sum(xs)
```
{% endtab %}

{% endtabs %}



## `take`, `takeRight`, `takeWhile`

Методы `take`, `takeRight` и `takeWhile` предоставляют удобный способ “брать” (_taking_) элементы из списка для создания нового. 
Примеры `take` и `takeRight`:

{% tabs take-example %}

{% tab 'Scala 2 и 3' %}
```scala
oneToTen.take(1)        // List(1)
oneToTen.take(2)        // List(1, 2)

oneToTen.takeRight(1)   // List(10)
oneToTen.takeRight(2)   // List(9, 10)
```
{% endtab %}

{% endtabs %}

Обратите внимание, как эти методы работают с «пограничными» случаями, 
когда запрашивается больше элементов, чем есть в последовательности, 
или запрашивается ноль элементов:

{% tabs take-edge-cases-example %}

{% tab 'Scala 2 и 3' %}
```scala
oneToTen.take(Int.MaxValue)        // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
oneToTen.takeRight(Int.MaxValue)   // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
oneToTen.take(0)                   // List()
oneToTen.takeRight(0)              // List()
```
{% endtab %}

{% endtabs %}

А это `takeWhile`, который работает с функцией-предикатом:

{% tabs take-while-example %}

{% tab 'Scala 2 и 3' %}
```scala
oneToTen.takeWhile(_ < 5)       // List(1, 2, 3, 4)
names.takeWhile(_.length < 5)   // List(adam)
```
{% endtab %}

{% endtabs %}


## `drop`, `dropRight`, `dropWhile`

`drop`, `dropRight` и `dropWhile` удаляют элементы из списка 
и, по сути, противоположны своим аналогам “take”. 
Вот некоторые примеры:

{% tabs drop-example %}

{% tab 'Scala 2 и 3' %}
```scala
oneToTen.drop(1)        // List(2, 3, 4, 5, 6, 7, 8, 9, 10)
oneToTen.drop(5)        // List(6, 7, 8, 9, 10)

oneToTen.dropRight(8)   // List(1, 2)
oneToTen.dropRight(7)   // List(1, 2, 3)
```
{% endtab %}

{% endtabs %}

Пограничные случаи:

{% tabs drop-edge-cases-example %}

{% tab 'Scala 2 и 3' %}
```scala
oneToTen.drop(Int.MaxValue)        // List()
oneToTen.dropRight(Int.MaxValue)   // List()
oneToTen.drop(0)                   // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
oneToTen.dropRight(0)              // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
```
{% endtab %}

{% endtabs %}

А это `dropWhile`, который работает с функцией-предикатом:

{% tabs drop-while-example %}

{% tab 'Scala 2 и 3' %}
```scala
oneToTen.dropWhile(_ < 5)       // List(5, 6, 7, 8, 9, 10)
names.dropWhile(_ != "chris")   // List(chris, david)
```
{% endtab %}

{% endtabs %}


## `reduce`

Метод `reduce` позволяет свертывать коллекцию до одного агрегируемого значения. 
Он принимает функцию (или анонимную функцию) и последовательно применяет эту функцию к элементам в списке.

Лучший способ объяснить `reduce` — создать небольшой вспомогательный метод. 
Например, метод `add`, который складывает вместе два целых числа, 
а также предоставляет хороший вывод отладочной информации:

{% tabs reduce-example class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
def add(x: Int, y: Int): Int = {
  val theSum = x + y
  println(s"received $x and $y, their sum is $theSum")
  theSum
}
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
def add(x: Int, y: Int): Int =
  val theSum = x + y
  println(s"received $x and $y, their sum is $theSum")
  theSum
```
{% endtab %}

{% endtabs %}

Рассмотрим список:

{% tabs reduce-example-init %}

{% tab 'Scala 2 и 3' %}
```scala
val a = List(1,2,3,4)
```
{% endtab %}

{% endtabs %}

вот что происходит, когда в `reduce` передается метод `add`:

{% tabs reduce-example-evaluation %}

{% tab 'Scala 2 и 3' %}
```scala
scala> a.reduce(add)
received 1 and 2, their sum is 3
received 3 and 3, their sum is 6
received 6 and 4, their sum is 10
res0: Int = 10
```
{% endtab %}

{% endtabs %}

Как видно из результата, функция `reduce` использует `add` для сокращения списка `a` до единственного значения, 
в данном случае — суммы всех чисел в списке.

`reduce` можно использовать с анонимными функциями:

{% tabs reduce-example-sum %}

{% tab 'Scala 2 и 3' %}
```scala
scala> a.reduce(_ + _)
res0: Int = 10
```
{% endtab %}

{% endtabs %}

Аналогично можно использовать другие функции, например, умножение:

{% tabs reduce-example-multiply %}

{% tab 'Scala 2 и 3' %}
```scala
scala> a.reduce(_ * _)
res1: Int = 24
```
{% endtab %}

{% endtabs %}

> Важная концепция, которую следует знать о `reduce`, заключается в том, что, как следует из ее названия 
> (_reduce_ - сокращать), она используется для сокращения коллекции до одного значения.


## Дальнейшее изучение коллекций

В коллекциях Scala есть десятки дополнительных методов, которые избавляют от необходимости писать еще один цикл `for`. 
Более подробную информацию о коллекциях Scala см. 
в разделе [Изменяемые и неизменяемые коллекции][mut-immut-colls]
и [Архитектура коллекций Scala][architecture].

> В качестве последнего примечания, при использовании Java-кода в проекте Scala, 
> коллекции Java можно преобразовать в коллекции Scala. 
> После этого, их можно использовать в выражениях `for`, 
> а также воспользоваться преимуществами методов функциональных коллекций Scala. 
> Более подробную информацию можно найти в разделе [Взаимодействие с Java][interacting].


[interacting]: {% link _overviews/scala3-book/interacting-with-java.md %}
[lambdas]: {% link _overviews/scala3-book/fun-anonymous-functions.md %}
[fp-intro]: {% link _overviews/scala3-book/fp-intro.md %}
[mut-immut-colls]: {% link _overviews/collections-2.13/overview.md %}
[architecture]: {% link _overviews/core/architecture-of-scala-213-collections.md %}

