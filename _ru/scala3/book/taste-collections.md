---
layout: multipage-overview
title: Коллекции
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: На этой странице представлен обзор основных коллекций в Scala 3.
language: ru
num: 13
previous-page: taste-objects
next-page: taste-contextual-abstractions
---


Библиотека Scala поставляется с богатым набором классов коллекций, и эти классы содержат множество методов. 
Классы коллекций доступны как в неизменяемой, так и в изменяемой форме.

## Создание списков

Чтобы дать вам представление о том, как они работают, вот несколько примеров, в которых используется класс `List`, 
являющийся неизменяемым классом связанного списка. 
В этих примерах показаны различные способы создания заполненного `List`:

{% tabs collection_1 %}
{% tab 'Scala 2 and 3' for=collection_1 %}

```scala
val a = List(1, 2, 3)           // a: List[Int] = List(1, 2, 3)

// методы Range
val b = (1 to 5).toList         // b: List[Int] = List(1, 2, 3, 4, 5)
val c = (1 to 10 by 2).toList   // c: List[Int] = List(1, 3, 5, 7, 9)
val e = (1 until 5).toList      // e: List[Int] = List(1, 2, 3, 4)
val f = List.range(1, 5)        // f: List[Int] = List(1, 2, 3, 4)
val g = List.range(1, 10, 3)    // g: List[Int] = List(1, 4, 7)
```

{% endtab %}
{% endtabs %}

## Методы `List`

В следующих примерах показаны некоторые методы, которые можно вызывать для заполненного списка. 
Обратите внимание, что все эти методы являются функциональными, 
а это означает, что они не изменяют коллекцию, на которой вызываются, 
а вместо этого возвращают новую коллекцию с обновленными элементами. 
Результат, возвращаемый каждым выражением, отображается в комментарии к каждой строке:

{% tabs collection_2 %}
{% tab 'Scala 2 and 3' for=collection_2 %}

```scala
// a sample list
val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)

a.drop(2)                             // List(30, 40, 10)
a.dropWhile(_ < 25)                   // List(30, 40, 10)
a.filter(_ < 25)                      // List(10, 20, 10)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeWhile(_ < 30)                   // List(10, 20)

// flatten
val a = List(List(1,2), List(3,4))
a.flatten                             // List(1, 2, 3, 4)

// map, flatMap
val nums = List("one", "two")
nums.map(_.toUpperCase)               // List("ONE", "TWO")
nums.flatMap(_.toUpperCase)           // List('O', 'N', 'E', 'T', 'W', 'O')
```

{% endtab %}
{% endtabs %}

Эти примеры показывают, как методы “foldLeft” и “reduceLeft” используются 
для суммирования значений в последовательности целых чисел:

{% tabs collection_3 %}
{% tab 'Scala 2 and 3' for=collection_3 %}

```scala
val firstTen = (1 to 10).toList            // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

firstTen.reduceLeft(_ + _)                 // 55
firstTen.foldLeft(100)(_ + _)              // 155 (100 является “начальным” значением)
```

{% endtab %}
{% endtabs %}

Для классов коллекций Scala доступно гораздо больше методов, 
и они продемонстрированы в главе ["Коллекции"][collections] и в [API документации][api].

## Кортежи

В Scala _кортеж_ (_tuple_) — это тип, позволяющий легко поместить набор различных типов в один и тот же контейнер. 
Например, используя данный case класс `Person`:

{% tabs collection_4 %}
{% tab 'Scala 2 and 3' for=collection_4 %}

```scala
case class Person(name: String)
```

{% endtab %}
{% endtabs %}

Вот как вы создаете кортеж, который содержит `Int`, `String` и пользовательское значение `Person`:

{% tabs collection_5 %}
{% tab 'Scala 2 and 3' for=collection_5 %}

```scala
val t = (11, "eleven", Person("Eleven"))
```

{% endtab %}
{% endtabs %}

Когда у вас есть кортеж, вы можете получить доступ к его значениям, привязав их к переменным, 
или получить к ним доступ по номеру:

{% tabs collection_6 %}
{% tab 'Scala 2 and 3' for=collection_6 %}

```scala
t(0)   // 11
t(1)   // "eleven"
t(2)   // Person("Eleven")
```

{% endtab %}
{% endtabs %}

Вы также можете использовать этот метод _извлечения_, чтобы присвоить поля кортежа именам переменных:

{% tabs collection_7 %}
{% tab 'Scala 2 and 3' for=collection_7 %}

```scala
val (num, str, person) = t

// в результате:
// val num: Int = 11
// val str: String = eleven
// val person: Person = Person(Eleven)
```

{% endtab %}
{% endtabs %}

Кортежи хороши в тех случаях, когда вы хотите поместить коллекцию разнородных типов в небольшую структуру, похожую на коллекцию. 
Дополнительные сведения о кортежах см. ["в справочной документации"][reference].

[collections]: {% link _overviews/scala3-book/collections-intro.md %}
[api]: https://scala-lang.org/api/3.x/
[reference]: {{ site.scala3ref }}/overview.html
