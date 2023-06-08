---
layout: tour
title: Множественные списки параметров (Каррирование)
partof: scala-tour
num: 10
language: ru
next-page: case-classes
previous-page: nested-functions
---

Методы могут объявляться с несколькими списками параметров.

### Пример

Вот пример, определенный для трейта `Iterable` из API Scala коллекций:

{% tabs foldLeft_definition class=tabs-scala-version %}

{% tab 'Scala 2' for=foldLeft_definition %}

```scala
trait Iterable[A] {
   ...
   def foldLeft[B](z: B)(op: (B, A) => B): B
           ...
}
```

{% endtab %}

{% tab 'Scala 3' for=foldLeft_definition %}

```scala
trait Iterable[A]:
...
def foldLeft[B](z: B)(op: (B, A) => B): B
        ...
```

{% endtab %}

{% endtabs %}

`foldLeft` применяет бинарный оператор `op` к начальному значению `z` и ко всем остальным элементам коллекции слева направо.
Ниже приведен пример его использования.

Начиная с начального значения `0`, `foldLeft` применяет функцию `(m, n) => m + n` к каждому элементу списка
и предыдущему накопленному значению.

{% tabs foldLeft_use %}

{% tab 'Scala 2 и 3' for=foldLeft_use %}

```scala mdoc
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m, n) => m + n)
println(res) // 55
```

{% endtab %}

{% endtabs %}

### Варианты для использования

Предлагаемые варианты для использования множественных списков параметров включают:

#### Вывод типа

Исторически сложилось, что в Scala вывод типов происходит по одному списку параметров за раз.
Скажем, у вас есть следующий метод:

{% tabs foldLeft1_definition %}

{% tab 'Scala 2 и 3' for=foldLeft1_definition %}

```scala mdoc
def foldLeft1[A, B](as: List[A], b0: B, op: (B, A) => B) = ???
```

{% endtab %}

{% endtabs %}

Затем при желании вызвать его следующим образом, можно обнаружить, что метод не компилируется:

{% tabs foldLeft1_wrong_use %}

{% tab 'Scala 2 и 3' for=foldLeft1_wrong_use %}

```scala mdoc:fail
def notPossible = foldLeft1(numbers, 0, _ + _)
```

{% endtab %}

{% endtabs %}

вам нужно будет вызвать его одним из следующих способов:

{% tabs foldLeft1_good_use %}

{% tab 'Scala 2 и 3' for=foldLeft1_good_use %}

```scala mdoc
def firstWay = foldLeft1[Int, Int](numbers, 0, _ + _)
def secondWay = foldLeft1(numbers, 0, (a: Int, b: Int) => a + b)
```

{% endtab %}

{% endtabs %}

Это связано с тем, что Scala не может вывести тип функции `_ + _`, так как она все еще выводит `A` и `B`.
Путем перемещения параметра `op` в собственный список параметров, `A` и `B` выводятся в первом списке.
Затем эти предполагаемые типы будут доступны для второго списка параметров
и `_ + _` станет соответствовать предполагаемому типу `(Int, Int) => Int`.

{% tabs foldLeft2_definition_and_use %}

{% tab 'Scala 2 и 3' for=foldLeft2_definition_and_use %}

```scala mdoc
def foldLeft2[A, B](as: List[A], b0: B)(op: (B, A) => B) = ???
def possible = foldLeft2(numbers, 0)(_ + _)
```

{% endtab %}

{% endtabs %}

Последнее определение метода не нуждается в подсказках типа и может вывести все типы своих параметров.

#### Неявные параметры

Чтоб указать что параметр используется [_неявно_ (_implicit_)](/ru/tour/implicit-parameters.html)
необходимо задавать несколько списков параметров.
Примером может служить следующее:

{% tabs execute_definition class=tabs-scala-version %}

{% tab 'Scala 2' for=execute_definition %}

```scala mdoc
def execute(arg: Int)(implicit ec: scala.concurrent.ExecutionContext) = ???
```

{% endtab %}

{% tab 'Scala 3' for=execute_definition %}

```scala
def execute(arg: Int)(using ec: scala.concurrent.ExecutionContext) = ???
```

{% endtab %}

{% endtabs %}

#### Частичное применение

Методы могут объявляться с несколькими списками параметров.
При этом когда такой метод вызывается с меньшим количеством списков параметров,
это приводит к созданию новой функции,
которая ожидает на вход недостающий список параметров.
Формально это называется [частичное применение](https://ru.wikipedia.org/wiki/%D0%A7%D0%B0%D1%81%D1%82%D0%B8%D1%87%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5).

Например,

{% tabs foldLeft_partial %}

{% tab 'Scala 2 и 3' for=foldLeft_partial %}

```scala mdoc:nest
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]()) _

val squares = numberFunc((xs, x) => xs :+ x*x)
println(squares) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)

val cubes = numberFunc((xs, x) => xs :+ x*x*x)
println(cubes)  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```

{% endtab %}

{% endtabs %}

### Сравнение с «каррированием»

Иногда можно встретить, что метод с несколькими списками параметров называется «каррированный».

Как говорится [в статье на Википедии о каррировании](https://ru.wikipedia.org/wiki/%D0%9A%D0%B0%D1%80%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5),

> Каррирование — преобразование функции от многих аргументов в набор вложенных функций,
> каждая из которых является функцией от одного аргумента.

Мы не рекомендуем использовать слово «каррирование» в отношении множественных списков параметров Scala по двум причинам:

1. В Scala множественные параметры и множественные списки параметров задаются
   и реализуются непосредственно как часть языка, а не преобразуются из функций с одним параметром.

2. Существует опасность путаницы с методами из стандартной Scala библиотеки
   [`curried`](<https://www.scala-lang.org/api/current/scala/Function2.html#curried:T1=%3E(T2=%3ER)>)
   и [`uncurried`](<https://www.scala-lang.org/api/current/scala/Function$.html#uncurried[T1,T2,R](f:T1=%3E(T2=%3ER)):(T1,T2)=%3ER>),
   которые вообще не включают множественные списки параметров.

Тем не менее, несомненно, есть сходство между множественными списками параметров и каррированием.
Хотя они различаются в месте определения,
в месте вызова могут тем не менее выглядеть одинаково, как в этом примере:

{% tabs about_currying %}

{% tab 'Scala 2 и 3' for=about_currying %}

```scala mdoc
// версия с множественными списками параметров
def addMultiple(n1: Int)(n2: Int) = n1 + n2
// два различных способа получить каррированную версию
def add(n1: Int, n2: Int) = n1 + n2
val addCurried1 = (add _).curried
val addCurried2 = (n1: Int) => (n2: Int) => n1 + n2
// независимо от определения, вызов всех трех идентичен
addMultiple(3)(4)  // 7
addCurried1(3)(4)  // 7
addCurried2(3)(4)  // 7
```

{% endtab %}

{% endtabs %}
