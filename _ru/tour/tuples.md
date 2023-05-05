---
layout: tour
title: Кортежи
partof: scala-tour
num: 6
language: ru
next-page: mixin-class-composition
previous-page: traits
topics: tuples
---

В Scala, кортеж (Тuple) - это контейнер содержащий упорядоченный набор элементов различного типа.
Кортежи неизменяемы.

Кортежи могут пригодиться, когда нам нужно вернуть сразу несколько значений из функции.

Кортеж может быть создан как:

{% tabs tuple-construction %}

{% tab 'Scala 2 и 3' for=tuple-construction %}

```scala mdoc
val ingredient = ("Sugar", 25)
```

{% endtab %}

{% endtabs %}

Такая запись создает кортеж, содержащий пару элементов `String` и `Int`.

Выводимый тип `ingredient` - это `(String, Int)`.

## Доступ к элементам

{% tabs tuple-indexed-access class=tabs-scala-version %}

{% tab 'Scala 2' for=tuple-indexed-access %}

Один из способов доступа к элементам кортежа — по их позиции.
`tuple._n` дает n-ый элемент (столько, сколько существует элементов).

```scala mdoc
println(ingredient._1) // Sugar
println(ingredient._2) // 25
```

{% endtab %}

{% tab 'Scala 3' for=tuple-indexed-access %}

Один из способов доступа к элементам кортежа — по их позиции.
Доступ к отдельным элементам осуществляется с помощью `tuple(0)`, `tuple(1)` и так далее.

```scala
println(ingredient(0)) // Sugar
println(ingredient(1)) // 25
```

{% endtab %}

{% endtabs %}

## Сопоставление с образцом для кортежей

Кортеж также можно распаковать с помощью сопоставления с образцом:

{% tabs tuple-extraction %}

{% tab 'Scala 2 и 3' for=tuple-extraction %}

```scala mdoc
val (name, quantity) = ingredient
println(name)     // Sugar
println(quantity) // 25
```

{% endtab %}

{% endtabs %}

Здесь выводимый тип `name` - `String` и выводимый тип `quantity` - `Int`.

Вот еще один пример сопоставления с образцом кортежа:

{% tabs tuple-foreach-patmat %}

{% tab 'Scala 2 и 3' for=tuple-foreach-patmat %}

```scala mdoc
val planets =
  List(("Mercury", 57.9), ("Venus", 108.2), ("Earth", 149.6),
       ("Mars", 227.9), ("Jupiter", 778.3))
planets.foreach {
  case ("Earth", distance) =>
    println(s"Our planet is $distance million kilometers from the sun")
  case _ =>
}
```

{% endtab %}

{% endtabs %}

Или, в _for-comprehension_:

{% tabs tuple-for-extraction class=tabs-scala-version %}

{% tab 'Scala 2' for=tuple-for-extraction %}

```scala mdoc
val numPairs = List((2, 5), (3, -7), (20, 56))
for ((a, b) <- numPairs) {
  println(a * b)
}
```

{% endtab %}

{% tab 'Scala 3' for=tuple-for-extraction %}

```scala
val numPairs = List((2, 5), (3, -7), (20, 56))
for (a, b) <- numPairs do
  println(a * b)
```

{% endtab %}

{% endtabs %}

## Кортежи и case-классы

Иногда бывает трудно выбирать между кортежами и классами образцами.
Классы образцы содержат именованные элементы. Имена могут улучшить читаемость некоторых типов кода.
В приведенном выше примере мы могли бы определить планеты, как `case class Planet(name: String, distance: Double)`,
а не использовать кортежи.

## Дополнительные ресурсы

- Дополнительная информация о кортежах - в книге [Scala Book](/ru/scala3/book/taste-collections.html#кортежи)
