---
layout: tour
title: Обобщенные Классы
partof: scala-tour
num: 18
language: ru
next-page: variances
previous-page: for-comprehensions
assumed-knowledge: classes unified-types
---

Обобщенные классы (Generic classes) - это классы, обладающие параметрическим полиморфизмом (т. е. классы, которые изменяют свое поведение в зависимости от приписываемого им типа. Этот тип указывается в квадратных скобках `[]` сразу после имени класса). Они особенно полезны для создания коллекций.

## Объявление обобщенного класса

Для объявления обобщенного класса необходимо после имени добавить тип в квадратных скобках `[]` как еще один параметр класса. По соглашению обычно используют заглавные буквы `A`, хотя можно использовать любые имена.

{% tabs generic-classes-1 class=tabs-scala-version %}
{% tab 'Scala 2' for=generic-classes-1 %}

```scala mdoc
class Stack[A] {
  private var elements: List[A] = Nil
  def push(x: A): Unit =
    elements = x :: elements
  def peek: A = elements.head
  def pop(): A = {
    val currentTop = peek
    elements = elements.tail
    currentTop
  }
}
```

{% endtab %}
{% tab 'Scala 3' for=generic-classes-1 %}

```scala
class Stack[A]:
  private var elements: List[A] = Nil
  def push(x: A): Unit =
    elements = x :: elements
  def peek: A = elements.head
  def pop(): A =
    val currentTop = peek
    elements = elements.tail
    currentTop
```

{% endtab %}
{% endtabs %}

Данная реализация класса `Stack` принимает в качестве параметра любой тип `A`. Это означает что список, `var elements: List[A] = Nil`, может хранить только элементы типа `A`. Процедура `def push` принимает только объекты типа `A` (примечание: `elements = x :: elements` переназначает `elements` в новый список, созданный путем добавления `x` к текущим `elements`).

Здесь `Nil` — это пустой `List`, и его не следует путать с `null`.

## Использование

Чтобы использовать обобщенный класс, поместите конкретный тип в квадратные скобки вместо `A`.

{% tabs generic-classes-2 class=tabs-scala-version %}
{% tab 'Scala 2' for=generic-classes-2 %}

```scala mdoc
val stack = new Stack[Int]
stack.push(1)
stack.push(2)
println(stack.pop())  // выведет 2
println(stack.pop())  // выведет 1
```

{% endtab %}
{% tab 'Scala 3' for=generic-classes-2 %}

```scala
val stack = Stack[Int]
stack.push(1)
stack.push(2)
println(stack.pop())  // выведет 2
println(stack.pop())  // выведет 1
```

{% endtab %}
{% endtabs %}

Экземпляр `stack` может принимать элементы типа `Int`. Однако, если тип имеет подтипы, то они также могут быть приняты:

{% tabs generic-classes-3 class=tabs-scala-version %}
{% tab 'Scala 2' for=generic-classes-3 %}

```scala mdoc:nest
class Fruit
class Apple extends Fruit
class Banana extends Fruit

val stack = new Stack[Fruit]
val apple = new Apple
val banana = new Banana

stack.push(apple)
stack.push(banana)
```

{% endtab %}
{% tab 'Scala 3' for=generic-classes-3 %}

```scala
class Fruit
class Apple extends Fruit
class Banana extends Fruit

val stack = Stack[Fruit]
val apple = Apple()
val banana = Banana()

stack.push(apple)
stack.push(banana)
```

{% endtab %}
{% endtabs %}
Классы `Apple` и `Banana` наследуются от `Fruit` так, что мы можем засунуть экземпляры `Apple` и `Banana` в пачку `Fruit`.

_Примечание: подтипы обобщенных типов - *инвариантны*. Это означает, что если у нас есть стэк символов типа `Stack[Char]`, то он не может быть использован как стек интов типа `Stack[Int]`. Это нежелательное поведение, потому как позволило бы нам добавлять в стек символов целые числа. В заключение, `Stack[A]` является подтипом `Stack[B]` тогда и только тогда, когда `B = A`. Поскольку это может быть довольно строгим ограничением, Scala предлагает [механизм вариативного описания параметров типа](variances.html) для контроля за поведением подтипов._
