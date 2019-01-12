---
layout: tour
title: Придставление в виде For

discourse: true

partof: scala-tour

num: 17
language: ru
next-page: generic-classes
previous-page: extractor-objects

---

Scala предлагает простую запись для выражения *последовательных преобразований*. Представления вида for имеют форму `for (enumerators) yield e`, где `enumerators` относятся к списку перечислений, разделенных точкой с запятой. Отдельное перечисление (*enumerator*) является либо генератором, который вводит новые переменные, либо фильтром. Представление for вычисляет тело `e` (которое связанно с тем что генерирует *enumerator*) и возвращает последовательность вычислений.

Вот пример:

```tut
case class User(name: String, age: Int)

val userBase = List(User("Travis", 28),
  User("Kelly", 33),
  User("Jennifer", 44),
  User("Dennis", 23))

val twentySomethings = for (user <- userBase if (user.age >=20 && user.age < 30))
  yield user.name  // т. е. добавить результат к списку 

twentySomethings.foreach(name => println(name))  // выводит "Travis Dennis"
```
Цикл `for`, используемый с оператором `yield`, на самом деле создает `List`. Потому что мы указали `yield user.name` (тоесть сообщить имя пользователя), получаем `List[String]`. `user <- userBase` и есть наш генератор, а `if (user.age >=20 && user.age < 30)` - это фильтр который отфильтровывает пользователей, не достигших 20-летнего возраста.

Ниже приведен более сложный пример использования двух генераторов. Он вычисляет все пары чисел между `0` и `n-1`, сумма которых равна заданному значению `v`:

```tut
def foo(n: Int, v: Int) =
   for (i <- 0 until n;
        j <- i until n if i + j == v)
   yield (i, j)

foo(10, 10) foreach {
  case (i, j) =>
    println(s"($i, $j) ")  // выводит (1, 9) (2, 8) (3, 7) (4, 6) (5, 5)
}

```
Here `n == 10` and `v == 10`. On the first iteration, `i == 0` and `j == 0` so `i + j != v` and therefore nothing is yielded. `j` gets incremented 9 more times before `i` gets incremented to `1`. Without the `if` guard, this would simply print the following:
Здесь `n == 10` и `v == 10`. На первой итерации `i == 0` и `j == 0` так `i + j != v` и поэтому ничего не выдается. `j` увеличивается еще в 9 раз, прежде чем `i` увеличивается до `1`. Без фильтра `if` будет просто напечатает следующее:
```

(0, 0) (0, 1) (0, 2) (0, 3) (0, 4) (0, 5) (0, 6) (0, 7) (0, 8) (0, 9) (1, 1) ...
```

Обратите внимание, что for представление не ограничивается только работой со списками. Каждый тип данных, поддерживающий операции `withFilter`, `map`, and `flatMap` (с соответствующими типами), может быть использован в for представлении.

Вы можете обойтись без `yield` в for представлении. В таком случае, результатом будет `Unit`. Такое может быть полезным для выполнения кода основанного на побочных эффектах. Вот программа, эквивалентная предыдущей, но без использования `yield`:

```tut
def foo(n: Int, v: Int) =
   for (i <- 0 until n;
        j <- i until n if i + j == v)
   println(s"($i, $j)")

foo(10, 10)
```
