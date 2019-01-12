---
layout: tour
title: Извлекающий Объект

discourse: true

partof: scala-tour

num: 16
language: ru
next-page: for-comprehensions
previous-page: regular-expression-patterns

---

Извлекающий Объект - это объект с методом `unapply`. В то время как метод `apply` обычно действует как конструктор, который принимает аргументы и создает объект, метод `unapply` действует обратным образом, он принимает объект и пытается вернуть аргументы из которых он (возможно) был создан. Чаще всего этот метод используется в функциях проверки по шаблону и в частично определенных функциях.

```tut
import scala.util.Random

object CustomerID {

  def apply(name: String) = s"$name--${Random.nextLong}"

  def unapply(customerID: String): Option[String] = {
    val stringArray: Array[String] = customerID.split("--")
    if (stringArray.tail.nonEmpty) Some(stringArray.head) else None
  }
}

val customer1ID = CustomerID("Sukyoung")  // Sukyoung--23098234908
customer1ID match {
  case CustomerID(name) => println(name)  // выведет Sukyoung
  case _ => println("Could not extract a CustomerID")
}
```
Метод `apply` создает `CustomerID` из строки `name`. `unapply` делает обратное, чтобы вернуть `name` обратно. Когда мы вызываем `CustomerID("Sukyoung")`, это сокращенный синтаксис вызова `CustomerID.apply("Sukyoung")`. Когда мы вызываем `case CustomerID(name) => println(name)`, мы на самом деле вызываем метод `unapply`.

При объявлении нового значения можно использовать шаблон, в котором значение для инициализации переменной получается через извлечение, используя метод `unapply`.

```tut
val customer2ID = CustomerID("Nico")
val CustomerID(name) = customer2ID
println(name)  // выведет Nico
```

Что эквивалентно `val name = CustomerID.unapply(customer2ID).get`.

```tut
val CustomerID(name2) = "--asdfasdfasdf"
```

Если совпадений нет, то бросается `scala.MatchError`:

```tut:fail
val CustomerID(name3) = "-asdfasdfasdf"
```

Возвращаемый тип `unapply` выбирается следующим образом:

* Если это всего лишь тест, возвращается `Boolean`. Например `case even()`.
* Если в результате найдено одно значение типа T, то возвращается `Option[T]`.
* Если вы хотите получить несколько значений `T1,..., Tn`, то ответ необходимо группировать в дополнительный кортеж `Option[(T1,..., Tn)]`.

Иногда количество извлекаемых значений не является фиксированным. Если в зависимости от входа мы хотим вернуть произвольное количество значений, то для этого случая мы можем определить экстрактор методом `unapplySeq`, который возвращает `Option[Seq[T]]`. Характерным примером такого подхода является разложение `List` с помощью `case List(x, y, z) =>`  и разложение `String` с помощью регулярного выражения `Regex`, такого как `case r(name, remainingFields @ _*) =>`. 
