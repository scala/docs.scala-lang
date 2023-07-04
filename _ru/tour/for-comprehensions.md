---
layout: tour
title: Сложные for-выражения
partof: scala-tour
num: 17
language: ru
next-page: generic-classes
previous-page: extractor-objects
---

Scala предлагает простую запись для выражения _последовательных преобразований_. Эти преобразования можно упростить используя специальный синтаксис `for выражения` (for comprehension), который записывается как `for (enumerators) yield e`, где `enumerators` относятся к списку перечислителей, разделенных точкой с запятой. Где отдельный такой "перечислитель" (_enumerator_) является либо генератором, который вводит новые переменные, либо фильтром. For-выражение вычисляет тело `e` (которое связанно с тем что генерирует _enumerator_) и возвращает последовательность вычислений.

Вот пример:

{% tabs for-comprehensions-01 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-comprehensions-01 %}

```scala mdoc
case class User(name: String, age: Int)

val userBase = List(
  User("Travis", 28),
  User("Kelly", 33),
  User("Jennifer", 44),
  User("Dennis", 23))

val twentySomethings =
  for (user <- userBase if user.age >=20 && user.age < 30)
  yield user.name  // т. е. добавить результат к списку

twentySomethings.foreach(println)  // выводит "Travis Dennis"
```

{% endtab %}
{% tab 'Scala 3' for=for-comprehensions-01 %}

```scala
case class User(name: String, age: Int)

val userBase = List(
  User("Travis", 28),
  User("Kelly", 33),
  User("Jennifer", 44),
  User("Dennis", 23))

val twentySomethings =
  for user <- userBase if user.age >=20 && user.age < 30
  yield user.name  // т. е. добавить результат к списку

twentySomethings.foreach(println)  // выводит "Travis Dennis"
```

{% endtab %}
{% endtabs %}

`for`-выражение, используется с оператором `yield`, на самом деле создает `List`. Потому что мы указали `yield user.name` (то есть вывести имя пользователя), получаем `List[String]`. `user <- userBase` и есть наш генератор, а `if (user.age >=20 && user.age < 30)` - это фильтр который отфильтровывает пользователей, не достигших 30-летнего возраста.

Ниже приведен более сложный пример использования двух генераторов. Он вычисляет все пары чисел между `0` и `n-1`, сумма которых равна заданному значению `v`:

{% tabs for-comprehensions-02 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-comprehensions-02 %}

```scala mdoc
def foo(n: Int, v: Int) =
   for (i <- 0 until n;
        j <- 0 until n if i + j == v)
   yield (i, j)

foo(10, 10).foreach {
  case (i, j) =>
    println(s"($i, $j) ")  // выводит (1, 9) (2, 8) (3, 7) (4, 6) (5, 5) (6, 4) (7, 3) (8, 2) (9, 1)
}
```

{% endtab %}
{% tab 'Scala 3' for=for-comprehensions-02 %}

```scala
def foo(n: Int, v: Int) =
   for i <- 0 until n
       j <- 0 until n if i + j == v
   yield (i, j)

foo(10, 10).foreach {
  (i, j) => println(s"($i, $j) ")  // выводит (1, 9) (2, 8) (3, 7) (4, 6) (5, 5) (6, 4) (7, 3) (8, 2) (9, 1)
}
```

{% endtab %}
{% endtabs %}

Здесь `n == 10` и `v == 10`. На первой итерации `i == 0` и `j == 0` так `i + j != v` и поэтому ничего не выдается. `j` увеличивается еще в 9 раз, прежде чем `i` увеличивается до `1`. Без фильтра `if` будет просто напечатано следующее:

```scala
(0, 0) (0, 1) (0, 2) (0, 3) (0, 4) (0, 5) (0, 6) (0, 7) (0, 8) (0, 9) (1, 0) ...
```

Обратите внимание, что for-выражение не ограничивается только работой со списками. Каждый тип данных, поддерживающий операции `withFilter`, `map`, and `flatMap` (с соответствующими типами), может быть использован в for-выражении.

Вы можете обойтись без `yield` в for-выражении. В таком случае, результатом будет `Unit`. Это может быть полезным для выполнения кода основанного на побочных эффектах. Вот программа, эквивалентная предыдущей, но без использования `yield`:

{% tabs for-comprehensions-03 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-comprehensions-03 %}

```scala mdoc:nest
def foo(n: Int, v: Int) =
   for (i <- 0 until n;
        j <- 0 until n if i + j == v)
   println(s"($i, $j)")

foo(10, 10)
```

{% endtab %}

{% tab 'Scala 3' for=for-comprehensions-03 %}

```scala
def foo(n: Int, v: Int) =
   for i <- 0 until n
       j <- 0 until n if i + j == v
   do println(s"($i, $j)")

foo(10, 10)
```

{% endtab %}
{% endtabs %}

## Дополнительные ресурсы

- Другие примеры "For comprehension" доступны [в книге Scala](/scala3/book/control-structures.html#for-expressions)
