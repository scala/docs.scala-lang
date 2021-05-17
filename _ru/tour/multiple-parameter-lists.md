---
layout: tour
title: Множественные списки параметров (Каррирование)

discourse: true

partof: scala-tour

num: 10
language: ru
next-page: case-classes
previous-page: nested-functions

---

Методы могут объявляться с несколькими списками параметров. При этом когда такой метод вызывается с меньшим количеством списков параметров, это приводит к созданию новой функции, которая ожидает на вход не достающий список параметров. Формально это называется [частичное применение](https://en.wikipedia.org/wiki/Partial_application).

Например,
  
```scala mdoc
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]()) _

val squares = numberFunc((xs, x) => xs :+ x*x)
print(squares) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)

val cubes = numberFunc((xs, x) => xs :+ x*x*x)
print(cubes)  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```

Рассмотрим такие примеры из класса [Traversable](/overviews/collections/trait-traversable.html) коллекции Scala:

```scala mdoc:fail
def foldLeft[B](z: B)(op: (B, A) => B): B
```

`foldLeft` применяет бинарный оператор `op` к начальному значению `z` и ко всем остальным элементам коллекции слева направо. Ниже приведен пример его использования. 

Начиная с начального значения 0, `foldLeft` применяет функцию `(m, n) => m + n` к каждому элементу списка и предыдущему накопленному значению.

```scala mdoc:nest
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m, n) => m + n)
print(res) // 55
```

Множественные списки параметров имеют избыточный синтаксис, поэтому их следует использовать экономно. Можем предложить следующие варианты для использования множественных списков (каррирования):

#### Отдельный функциональный параметр
   Функцию `op` можно выделить в отдельный функциональный параметр у `foldLeft`, благодаря такому выделению становится возможен более элегантный стиль передачи анонимной функции в метод. Без такого выделения код выглядел бы следующим образом:
```scala
numbers.foldLeft(0, {(m: Int, n: Int) => m + n})
```
    
   Обратите внимание, что использование отдельного функционального параметра позволяет нам использовать автоматическое выведение типа для него, что делает код еще более кратким, это было бы невозможно без каррирования.
    
```scala mdoc
numbers.foldLeft(0)(_ + _)
```
   Если в утверждении `numbers.foldLeft(0)(_ + _)` зафиксировать отдельный параметр `z`, мы получим частично определенную функцию, которую можно переиспользовать, как показано ниже:
```scala mdoc:nest
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]())_  // z = Empty.List[Int]

val squares = numberFunc((xs, x) => xs:+ x*x)
print(squares.toString()) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)

val cubes = numberFunc((xs, x) => xs:+ x*x*x)
print(cubes.toString())  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```

   `foldLeft` и `foldRight` может быть использован в любой из следующих вариаций,
```scala mdoc:nest
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

numbers.foldLeft(0)((sum, item) => sum + item) // Общая Форма
numbers.foldRight(0)((sum, item) => sum + item) // Общая Форма

numbers.foldLeft(0)(_+_) // Форма с каррированием
numbers.foldRight(0)(_+_) // Форма с каррированием
```

   
#### Неявные параметры
   Чтоб указать что параметр используется неявно (`implicit`) необходимо задавать несколько списков параметров. Примером может служить следующее:

```scala
def execute(arg: Int)(implicit ec: ExecutionContext) = ???
```
